import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Home,
  Users,
  Package,
  ClipboardList,
  Settings,
  LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { clearSession, logout } from '../services/authService'
import { fetchDashboard } from '../services/dashboardService'
import Topbar from '../components/layout/Topbar'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const navigation: NavItem[] = [
  { to: '/dashboard', label: 'Visão Geral', icon: Home },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState<string>()
  // TODO: substituir por dado real quando o back-end expuser a região do
  // representante logado (ver comentário no useEffect abaixo).
  const regiao = undefined

  useEffect(() => {
    // A saudação do topo usa o representanteNome que já vem do /dashboard.
    // A região do representante logado ainda não é exposta por nenhum
    // endpoint (regioesCriticas é outra coisa: lista de regiões em alerta).
    // Peça para o back-end incluir "regiaoNome" no DashboardDto (ou criar um
    // /auth/me) e troque o setRegiao abaixo por esse valor.
    fetchDashboard()
      .then((data) => {
        setUserName(data.representanteNome)
      })
      .catch(() => {
        // Falha silenciosa: o topo só deixa de mostrar o nome.
      })
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      clearSession()
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-100 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center px-2 py-2">
              <img
                  src="/sagra-logo.png"
                  alt="Sagra"
                  className="h-12 w-auto max-w-[180px] object-contain"
               />
              </div>

          <nav className="mt-6 flex flex-1 flex-col gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={userName} regiao={regiao} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
