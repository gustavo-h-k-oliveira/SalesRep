import type { LoginRequest, LoginResponse } from '../types/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
let token: string | null = null

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

export function saveToken(newToken: string) {
  token = newToken
}

export function getToken() {
  return token
}

export function isLoggedIn() {
  return Boolean(token)
}

export function clearToken() {
  token = null
}
