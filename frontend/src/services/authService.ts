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
  try {
    await apiFetch('/auth/logout', {
      method: 'POST',
    })
  } catch (err) {
    console.warn('Erro ao chamar endpoint de logout:', err)
  }
}

export async function recuperarSenha(email: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/recuperar-senha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    let message = "Falha ao enviar solicitação de recuperação"
    try {
      const error = await response.json()
      message = error.message ?? message
    } catch {
      try {
        const text = await response.text()
        message = text || message
      } catch {
        // ignorar se falhar ao ler texto
      }
    }
    throw new Error(message)
  }
}

export async function redefinirSenha(token: string, novaSenha: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/redefinir-senha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, novaSenha }),
  })

  if (!response.ok) {
    let message = "Falha ao redefinir senha"
    try {
      const error = await response.json()
      message = error.message ?? message
    } catch {
      try {
        const text = await response.text()
        message = text || message
      } catch {
        // ignorar se falhar ao ler texto
      }
    }
    throw new Error(message)
  }
}

export function saveSession(representanteId?: number, remember = false) {
  if (remember) {
    localStorage.setItem('loggedIn', 'true')
    sessionStorage.removeItem('loggedIn')
    if (representanteId !== undefined && representanteId !== null) {
      localStorage.setItem('representanteId', String(representanteId))
      sessionStorage.removeItem('representanteId')
    }
  } else {
    sessionStorage.setItem('loggedIn', 'true')
    localStorage.removeItem('loggedIn')
    if (representanteId !== undefined && representanteId !== null) {
      sessionStorage.setItem('representanteId', String(representanteId))
      localStorage.removeItem('representanteId')
    }
  }
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('loggedIn') || sessionStorage.getItem('loggedIn'))
}

export function clearSession() {
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('representanteId')
  sessionStorage.removeItem('loggedIn')
  sessionStorage.removeItem('representanteId')
}

export function getRepresentanteId(): number | null {
  const raw = localStorage.getItem('representanteId') || sessionStorage.getItem('representanteId')
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isNaN(parsed) ? null : parsed
}

export function isRepresentante(): boolean {
  return getRepresentanteId() !== null
}
