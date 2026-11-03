import { getUser } from '@netlify/identity'
import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'
import { z } from 'zod'
import { documentSchema, profileSchema } from '../../src/lib/document-schema.js'
import { computeTotals } from '../../src/generators/document.js'
import { sameOrigin, allowWrite, json } from '../lib/security.js'
import type { Config } from '@netlify/functions'
export default async (req: Request) => {
  try {
    const user = await getUser()
    if (!user) return json({ error: 'Please sign in to use your workspace.' }, 401)
    const db = getDatabase()
    if (req.method === 'GET') {
      const id = new URL(req.url).searchParams.get('id')
      if (id) {
        if (!z.uuid().safeParse(id).success) return json({ error: 'Invalid document ID.' }, 400)
        const rows =
          await db.sql`SELECT id,data FROM fbk_documents WHERE id=${id} AND user_id=${user.id}`
        return rows.length ? json(rows[0]) : json({ error: 'Document not found.' }, 404)
      }
      const [documents, profiles] = await Promise.all([
        db.sql`SELECT id,kind,number,customer_name,currency,total,updated_at FROM fbk_documents WHERE user_id=${user.id} ORDER BY updated_at DESC LIMIT 100`,
        db.sql`SELECT data FROM fbk_profiles WHERE user_id=${user.id}`,
      ])
      return json({ documents, profile: profiles[0]?.data ?? null })
    }
    if (!['POST', 'DELETE'].includes(req.method)) return json({ error: 'Method not allowed.' }, 405)
    if (!sameOrigin(req)) return json({ error: 'Request origin rejected.' }, 403)
    if (!(await allowWrite(user.id)))
      return json({ error: 'Please wait a minute before saving again.' }, 429)
    const raw = await req.text()
    if (raw.length > 100000) return json({ error: 'Document is too large.' }, 413)
    const body = JSON.parse(raw)
    if (req.method === 'DELETE') {
      if (body.all === true) {
        await db.sql`DELETE FROM fbk_documents WHERE user_id=${user.id}`
        await db.sql`DELETE FROM fbk_profiles WHERE user_id=${user.id}`
        await getStore('business-logos').delete(user.id)
        return json({ ok: true })
      }
      const id = z.uuid().parse(body.id)
      await db.sql`DELETE FROM fbk_documents WHERE id=${id} AND user_id=${user.id}`
      return json({ ok: true })
    }
    if (body.action === 'profile') {
      const profile = profileSchema.parse(body.data)
      await db.sql`INSERT INTO fbk_profiles(user_id,data) VALUES (${user.id},${JSON.stringify(profile)}::jsonb) ON CONFLICT(user_id) DO UPDATE SET data=EXCLUDED.data,updated_at=now()`
      return json({ ok: true })
    }
    const data = documentSchema.parse(body.data)
    const total = computeTotals(data).total
    if (body.id) {
      const id = z.uuid().parse(body.id)
      const rows =
        await db.sql`UPDATE fbk_documents SET kind=${data.kind},number=${data.number},customer_name=${data.to.name},currency=${data.currency},total=${total},data=${JSON.stringify(data)}::jsonb,updated_at=now() WHERE id=${id} AND user_id=${user.id} RETURNING id`
      return rows.length ? json(rows[0]) : json({ error: 'Document not found.' }, 404)
    }
    // Serialize creation per account so concurrent requests cannot bypass the cap.
    const client = await db.pool.connect()
    try {
      await client.query('BEGIN')
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [user.id])
      const count = await client.query('SELECT count(*) FROM fbk_documents WHERE user_id=$1', [
        user.id,
      ])
      if (Number(count.rows[0].count) >= 100) {
        await client.query('ROLLBACK')
        return json(
          {
            error: 'Your workspace holds 100 documents. Delete an older document to save another.',
          },
          409,
        )
      }
      const result = await client.query(
        'INSERT INTO fbk_documents(user_id,kind,number,customer_name,currency,total,data) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
        [user.id, data.kind, data.number, data.to.name, data.currency, total, JSON.stringify(data)],
      )
      await client.query('COMMIT')
      return json(result.rows[0], 201)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      return json({ error: error.issues[0]?.message ?? 'Check your document fields.' }, 400)
    if (error instanceof SyntaxError) return json({ error: 'Invalid request.' }, 400)
    return json({ error: 'Your workspace is temporarily unavailable. Please try again.' }, 503)
  }
}
export const config: Config = { path: '/api/workspace' }
