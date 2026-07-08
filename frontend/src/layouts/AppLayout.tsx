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

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="border-b border-slate-200 bg-slate-950 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="flex h-full flex-col p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
              Sagra Radar
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Painel comercial</h1>
          </div>

          <nav className="mt-3 flex flex-1 flex-col gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white',
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
            className="mt-6 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 xl:p-8">
        <Outlet />
      </main>
    </div>
  )
}