const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

async function apiFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (null as unknown as T)
}

export { apiFetch }
