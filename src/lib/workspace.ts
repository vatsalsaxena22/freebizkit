export async function workspaceRequest<T = Record<string, unknown>>(
  method = 'GET',
  body?: unknown,
  id?: string,
): Promise<T> {
  const response = await fetch(`/api/workspace${id ? `?id=${encodeURIComponent(id)}` : ''}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const result = await response.json()
  if (!response.ok)
    throw new Error(result.error ?? 'Your workspace is unavailable. Please try again.')
  return result as T
}
