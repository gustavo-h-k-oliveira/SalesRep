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
  ListIcon,
  XIcon,
} from '@phosphor-icons/react'

export default function AppLayout() {
  const navigate = useNavigate()
  const representative = isRepresentante()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      activeLink: 'bg-indigo-600 text-white shadow-xs',
      buttonHover: 'hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700',
    }
    : {
      accentText: 'text-emerald-600',
      activeLink: 'bg-emerald-600 text-white shadow-xs',
      buttonHover: 'hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700',
    }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex select-none">
      {/* HEADER MOBILE (Telas Menores / < lg) COM BOTÃO DE TRÊS LINHAS & DROPDOWN FLUTUANTE */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-xs lg:hidden">
        <div className="flex flex-col items-start gap-0.5">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme.accentText}`}>
            Sagra Radar
          </p>
          <img
            src="/cropped-logo-sagra.png"
            alt="Sagra Logo"
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Botão de Três Linhas (Menu Hamburger) + Dropdown Flutuante */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Abrir menu de navegação"
            title="Opções de navegação"
          >
            {mobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <ListIcon className="h-5 w-5" />
            )}
          </button>

          {/* Dropdown Flutuante de Opções */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop para fechar ao clicar fora */}
              <div
                className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs"
                onClick={() => setMobileMenuOpen(false)}
              />

              <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                        isActive
                          ? theme.activeLink
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                      ].join(' ')
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <SignOutIcon className="h-4 w-4 shrink-0" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* DESKTOP SIDEBAR (Apenas >= lg) - RETRÁTIL */}
      <aside
        className={`hidden lg:block border-r border-slate-200 bg-white text-slate-900 sticky top-0 h-screen transition-all duration-300 ease-in-out shrink-0 ${collapsed ? 'w-20' : 'w-72'
          }`}
      >
        <div className="flex flex-col h-full p-5">
          {/* Topo do Menu + Botão Discreto no Canto Superior Direito / Abaixo da Logo em Modo Retraído */}
          <div className="border-b border-slate-100 pb-4">
            {!collapsed ? (
              <div className="flex items-center justify-between gap-2">
                <div className="animate-in fade-in duration-200 py-0.5 flex flex-col items-start gap-1">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.25em] ${theme.accentText}`}>
                    Sagra Radar
                  </p>
                  <img
                    src="/cropped-logo-sagra.png"
                    alt="Sagra Logo"
                    className="h-8 w-auto max-w-[150px] object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all shrink-0"
                  title="Recolher menu lateral"
                  aria-label="Recolher menu lateral"
                >
                  <CaretLeftIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src="/cropped-logo-sagra.png"
                  alt="Sagra Logo"
                  className="h-6 w-auto max-w-[48px] object-contain"
                />
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

          {/* Navegação Desktop */}
          <div className="mt-4 flex flex-col flex-1 gap-2 items-stretch justify-start">
            <nav className="flex flex-col gap-1.5 flex-none">
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
              className={`flex items-center justify-center rounded-2xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mt-auto ${collapsed ? 'px-2' : 'gap-2 px-4'
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