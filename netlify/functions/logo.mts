import { getUser } from '@netlify/identity'
import { getStore } from '@netlify/blobs'
import { allowWrite, sameOrigin, json } from '../lib/security.js'
import type { Config } from '@netlify/functions'
export default async (req: Request) => {
  try {
    const user = await getUser()
    if (!user) return json({ error: 'Please sign in first.' }, 401)
    const store = getStore({ name: 'business-logos', consistency: 'strong' })
    if (req.method === 'GET') {
      const result = await store.getWithMetadata(user.id, {
        type: 'arrayBuffer',
      })
      return result
        ? new Response(result.data, {
            headers: {
              'Content-Type': String(result.metadata.contentType),
              'Cache-Control': 'private, no-store',
              'X-Content-Type-Options': 'nosniff',
            },
          })
        : new Response(null, { status: 404 })
    }
    if (!['POST', 'DELETE'].includes(req.method)) return json({ error: 'Method not allowed.' }, 405)
    if (!sameOrigin(req)) return json({ error: 'Request rejected.' }, 403)
    if (!(await allowWrite(user.id)))
      return json({ error: 'Please wait before uploading again.' }, 429)
    if (req.method === 'DELETE') {
      await store.delete(user.id)
      return json({ ok: true })
    }
    const bytes = new Uint8Array(await req.arrayBuffer())
    if (bytes.length > 300 * 1024) return json({ error: 'Logo must be under 300 KB.' }, 413)
    const type = req.headers.get('content-type')
    const png =
      bytes[0] === 137 &&
      bytes[1] === 80 &&
      bytes[2] === 78 &&
      bytes[3] === 71 &&
      bytes[4] === 13 &&
      bytes[5] === 10 &&
      bytes[6] === 26 &&
      bytes[7] === 10
    const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    const webp =
      new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' &&
      new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
    if (!(
      (type === 'image/png' && png) ||
      (type === 'image/jpeg' && jpg) ||
      (type === 'image/webp' && webp)
    ))
      return json({ error: 'Upload a valid PNG, JPG or WebP image.' }, 400)
    await store.set(user.id, bytes.buffer, { metadata: { contentType: type } })
    return json({ ok: true })
  } catch {
    return json({ error: 'Logo storage is temporarily unavailable.' }, 503)
  }
}
export const config: Config = { path: '/api/logo' }
