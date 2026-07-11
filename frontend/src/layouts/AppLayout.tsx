import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearSession, logout, isRepresentante } from '../services/authService'

export default function AppLayout() {
  const navigate = useNavigate()
  const representative = isRepresentante()

  const navigation = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/clientes', label: 'Clientes' },
    { to: '/pedidos', label: 'Pedidos' },
    { to: '/produtos', label: 'Produtos' },
    representative
      ? { to: '/oportunidades', label: 'Oportunidades' }
      : { to: '/alertas', label: 'Alertas' },
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
        activeLink: 'bg-indigo-600 text-white',
        buttonHover: 'hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700',
      }
    : {
        accentText: 'text-emerald-600',
        activeLink: 'bg-emerald-600 text-white',
        buttonHover: 'hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700',
      }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="border-b border-slate-200 bg-white text-slate-900 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-slate-200">
        <div className="flex flex-col lg:h-full lg:flex-col p-6">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>
              Sagra Radar
            </p>
            <h1 className="mt-1 lg:mt-3 text-xl lg:text-2xl font-bold text-slate-900">Painel comercial</h1>
          </div>

          <div className="mt-4 lg:mt-8 flex flex-row flex-wrap lg:flex-col lg:flex-1 gap-2 items-center lg:items-stretch justify-start">
            <nav className="flex flex-row flex-wrap lg:flex-col gap-2 flex-1 lg:flex-none">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                      isActive
                        ? theme.activeLink
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className={`rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-colors mt-0 lg:mt-auto ${theme.buttonHover}`}
            >
              Sair
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 xl:p-8">
        <Outlet />
      </main>
    </div>
  )
}