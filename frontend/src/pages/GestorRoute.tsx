import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isGestor } from '../services/authService'

interface GestorRouteProps {
  children: ReactNode
}

export default function GestorRoute({ children }: GestorRouteProps) {
  if (!isGestor()) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
