import { Eye } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { clienteStatusTone } from '../../utils/status'
import type { ClienteAtencao } from '../../types/dashboard'

interface AttentionTableProps {
  clientes: ClienteAtencao[]
  onVerCliente?: (id: number) => void
}

export default function AttentionTable({ clientes, onVerCliente }: AttentionTableProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Clientes que exigem atenção</h2>

      {clientes.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhum cliente exigindo atenção no momento.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-3 pr-4 font-medium">Cliente</th>
                <th className="pb-3 pr-4 font-medium">Cidade/UF</th>
                <th className="pb-3 pr-4 font-medium">Dias sem compra</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Prazo gestor</th>
                <th className="pb-3 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="py-3 pr-4 font-medium text-slate-800">{cliente.nome}</td>
                  <td className="py-3 pr-4 text-slate-600">{cliente.cidadeUf ?? '—'}</td>
                  <td className="py-3 pr-4 text-slate-600">{cliente.diasSemCompra} dias</td>
                  <td className="py-3 pr-4">
                    <StatusBadge label={cliente.status} tone={clienteStatusTone(cliente.status)} />
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{cliente.prazoGestor ?? '—'}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => onVerCliente?.(cliente.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                      Ver cliente
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
