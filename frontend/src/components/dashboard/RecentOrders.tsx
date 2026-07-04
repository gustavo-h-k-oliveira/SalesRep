import { ArrowRight } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { pedidoStatusTone } from '../../utils/status'
import type { PedidoResponse } from '../../types/api'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface RecentOrdersProps {
  pedidos: PedidoResponse[]
  onVerTodos?: () => void
}

export default function RecentOrders({ pedidos, onVerTodos }: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Últimos pedidos</h2>

      {pedidos.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhum pedido recente.</p>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-semibold text-blue-600">#{String(pedido.id).padStart(6, '0')}</p>
                <p className="truncate text-sm text-slate-700">{pedido.clienteNome}</p>
              </div>
              <p className="shrink-0 text-sm font-medium text-slate-800">
                {formatCurrency(pedido.valorTotal)}
              </p>
              <StatusBadge label={pedido.status} tone={pedidoStatusTone(pedido.status)} />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onVerTodos}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Ver todos os pedidos
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
