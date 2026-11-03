// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '../functions/workspace.mts'
import { sampleDocument } from '../../src/data/fixtures'

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  sql: vi.fn(),
  allow: vi.fn(),
  delete: vi.fn(),
}))
vi.mock('@netlify/identity', () => ({ getUser: mocks.user }))
vi.mock('@netlify/database', () => ({
  getDatabase: () => ({ sql: mocks.sql }),
}))
vi.mock('@netlify/blobs', () => ({
  getStore: () => ({ delete: mocks.delete }),
}))
vi.mock('./security.js', async () => {
  const actual = await vi.importActual<typeof import('./security')>('./security')
  return { ...actual, allowWrite: mocks.allow }
})
const id = '1b0db518-1e21-42a1-b74f-8dbe67cc1234'
const request = (body: unknown, method = 'POST', origin = 'https://freebizkit.netlify.app') =>
  new Request('https://freebizkit.netlify.app/api/workspace', {
    method,
    headers: { Origin: origin },
    body: JSON.stringify(body),
  })
beforeEach(() => {
  vi.resetAllMocks()
  mocks.user.mockResolvedValue({ id: 'owner-a' })
  mocks.allow.mockResolvedValue(true)
  mocks.sql.mockResolvedValue([])
})
describe('workspace access and validation', () => {
  it('rejects anonymous access without querying the database', async () => {
    mocks.user.mockResolvedValue(null)
    expect(
      (await handler(new Request('https://freebizkit.netlify.app/api/workspace'))).status,
    ).toBe(401)
    expect(mocks.sql).not.toHaveBeenCalled()
  })
  it('scopes reads to the authenticated owner and hides missing records', async () => {
    const response = await handler(
      new Request(`https://freebizkit.netlify.app/api/workspace?id=${id}`),
    )
    expect(response.status).toBe(404)
    expect(mocks.sql.mock.calls[0].slice(1)).toEqual([id, 'owner-a'])
  })
  it('cannot update a different owner’s document', async () => {
    const response = await handler(request({ id, data: sampleDocument('invoice') }))
    expect(response.status).toBe(404)
    expect(mocks.sql.mock.calls[0].slice(-2)).toEqual([id, 'owner-a'])
  })
  it('rejects invalid amounts before writing', async () => {
    const data = sampleDocument('invoice')
    data.taxRate = '-5'
    expect((await handler(request({ data }))).status).toBe(400)
    expect(mocks.sql).not.toHaveBeenCalled()
  })
  it('rejects cross-origin mutations', async () => {
    expect((await handler(request({ id }, 'DELETE', 'https://unrelated.example'))).status).toBe(403)
    expect(mocks.sql).not.toHaveBeenCalled()
  })
  it('enforces the persistent write rate limit', async () => {
    mocks.allow.mockResolvedValue(false)
    expect((await handler(request({ data: sampleDocument('invoice') }))).status).toBe(429)
    expect(mocks.sql).not.toHaveBeenCalled()
  })
})
