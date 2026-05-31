import type { LoginRequest, LoginResponse } from '../types/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Falha ao autenticar')
  }

  return response.json()
}

export function saveToken(token: string) {
  localStorage.setItem('salesrep_token', token)
}

export function getToken() {
  return localStorage.getItem('salesrep_token')
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function clearToken() {
  localStorage.removeItem('salesrep_token')
}
