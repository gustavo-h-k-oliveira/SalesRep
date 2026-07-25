import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearSession, logout, isRepresentante } from '../services/authService'
import {
  HouseIcon,
  UsersIcon,
  ShoppingCartIcon,
  PackageIcon,
  LightningIcon,
  ShieldWarningIcon,
  UserIcon,
  SignOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react'

export default function AppLayout() {
  const navigate = useNavigate()
  const representative = isRepresentante()
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    { to: '/dashboard', label: 'Dashboard', icon: HouseIcon },
    { to: '/clientes', label: 'Clientes', icon: UsersIcon },
    { to: '/pedidos', label: 'Pedidos', icon: ShoppingCartIcon },
    { to: '/produtos', label: 'Produtos', icon: PackageIcon },
    representative
      ? { to: '/oportunidades', label: 'Oportunidades', icon: LightningIcon }
      : { to: '/alertas', label: 'Alertas', icon: ShieldWarningIcon },
    ...(!representative ? [{ to: '/representantes', label: 'Representantes', icon: UserIcon }] : []),
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      clearSession()
      navigate('/login')
    }
  }

  const theme = representative
    ? {
        accentText: 'text-indigo-600',
        activeLink: 'bg-indigo-600 text-white shadow-sm',
        buttonHover: 'hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700',
      }
    : {
        accentText: 'text-emerald-600',
        activeLink: 'bg-emerald-600 text-white shadow-sm',
        buttonHover: 'hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700',
      }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex select-none">
      {/* Sidebar / Navbar Lateral Retrátil */}
      <aside
        className={`border-b border-slate-200 bg-white text-slate-900 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:border-slate-200 transition-all duration-300 ease-in-out shrink-0 ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        }`}
      >
        <div className="flex flex-col lg:h-full p-4 sm:p-5">
          {/* Topo do Menu + Botão Discreto no Canto Superior Direito / Abaixo da Logo em Modo Retraído */}
          <div className="border-b border-slate-100 pb-4">
            {!collapsed ? (
              <div className="flex items-center justify-between gap-2">
                <div className="animate-in fade-in duration-200">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.25em] ${theme.accentText}`}>
                    Sagra Radar
                  </p>
                  <h1 className="mt-0.5 text-lg font-extrabold text-slate-900 tracking-tight">
                    Painel comercial
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="hidden lg:flex items-center justify-center rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all shrink-0"
                  title="Recolher menu lateral"
                  aria-label="Recolher menu lateral"
                >
                  <CaretLeftIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center gap-3">
                <span className={`text-xs font-black tracking-widest ${theme.accentText}`}>SR</span>
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all"
                  title="Expandir menu lateral"
                  aria-label="Expandir menu lateral"
                >
                  <CaretRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Navegação */}
          <div className="mt-4 flex flex-row flex-wrap lg:flex-col lg:flex-1 gap-2 items-center lg:items-stretch justify-start">
            <nav className="flex flex-row flex-wrap lg:flex-col gap-1.5 flex-1 lg:flex-none">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      'flex items-center rounded-2xl py-3 text-sm font-semibold transition-all',
                      collapsed ? 'justify-center px-2' : 'gap-3 px-4',
                      isActive
                        ? theme.activeLink
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </nav>

            {/* Botão Sair (Sem borda) */}
            <button
              type="button"
              onClick={handleLogout}
              title={collapsed ? 'Sair' : undefined}
              className={`flex items-center justify-center rounded-2xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mt-0 lg:mt-auto ${
                collapsed ? 'px-2' : 'gap-2 px-4'
              }`}
            >
              <SignOutIcon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 xl:p-8">
        <Outlet />
      </main>
    </div>
  )
}