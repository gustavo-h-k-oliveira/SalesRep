const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null
  }
  return null
}

async function apiFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  const method = init.method?.toUpperCase() || 'GET'
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfToken = getCookie('XSRF-TOKEN')
    if (csrfToken) {
      headers.set('X-XSRF-TOKEN', csrfToken)
    }
  }

  const response = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('representanteId')
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
      return null as unknown as T
    }
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (null as unknown as T)
}

export { apiFetch }
