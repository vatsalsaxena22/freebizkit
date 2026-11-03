import { getDatabase } from '@netlify/database'
export function sameOrigin(req: Request) {
  const origin = req.headers.get('origin')
  return !origin || origin === new URL(req.url).origin
}
export async function allowWrite(userId: string) {
  const db = getDatabase()
  const rows =
    await db.sql`INSERT INTO fbk_action_limits(user_id) VALUES (${userId}) ON CONFLICT(user_id) DO UPDATE SET count = CASE WHEN fbk_action_limits.window_start < now() - interval '1 minute' THEN 1 ELSE fbk_action_limits.count + 1 END, window_start = CASE WHEN fbk_action_limits.window_start < now() - interval '1 minute' THEN now() ELSE fbk_action_limits.window_start END RETURNING count`
  return Number(rows[0].count) <= 30
}
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
