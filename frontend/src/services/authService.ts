import type { LoginRequest, LoginResponse } from '../types/api'
import { apiFetch } from './api'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  })

  if (!response.ok) {
    let message = "Falha ao autenticar";

    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  return response.json()
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', {
    method: 'POST',
  })
}

export function saveSession(representanteId?: number) {
  localStorage.setItem('loggedIn', 'true')
  if (representanteId !== undefined && representanteId !== null) {
    localStorage.setItem('representanteId', String(representanteId))
  }
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('loggedIn'))
}

export function clearSession() {
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('representanteId')
}

export function getRepresentanteId(): number | null {
  const id = localStorage.getItem('representanteId')
  return id ? parseInt(id, 10) : null
}

export function isRepresentante(): boolean {
  return getRepresentanteId() !== null
}
