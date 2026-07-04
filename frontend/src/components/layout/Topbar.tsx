import { Search } from 'lucide-react'

interface TopbarProps {
  userName?: string
  regiao?: string
  onSearch?: (term: string) => void
}

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

export default function Topbar({ userName, regiao, onSearch }: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <p className="text-lg font-bold text-slate-900">
          OLÁ, {userName ? userName.toUpperCase() : '...'}
        </p>
        {regiao && (
          <p className="text-sm text-slate-500">
            Região: <span className="font-semibold text-blue-600">{regiao}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cliente, pedido ou produto..."
            onChange={(event) => onSearch?.(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  )
}
