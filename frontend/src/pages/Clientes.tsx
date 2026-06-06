import { useEffect, useState } from 'react'
import { fetchClientesPrioritarios } from '../services/clienteService'
import type { ClientePrioritarioDto } from '../types/api'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClientePrioritarioDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClientes() {
      try {
        const data = await fetchClientesPrioritarios()
        setClientes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar clientes prioritários')
      } finally {
        setLoading(false)
      }
    }

    loadClientes()
  }, [])

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Clientes Prioritários</h1>
            <p className="mt-2 text-sm text-slate-600">Mostrando os clientes priorizados pela API.</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          {loading ? (
            <p className="text-slate-600">Carregando clientes prioritários...</p>
          ) : error ? (
            <p className="text-rose-600">{error}</p>
          ) : clientes.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-900">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Dias sem compra</th>
                    <th className="px-4 py-3 font-medium">Ticket médio</th>
                    <th className="px-4 py-3 font-medium">Total de pedidos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-4 py-4">{cliente.id}</td>
                      <td className="px-4 py-4">{cliente.nome}</td>
                      <td className="px-4 py-4">{cliente.status}</td>
                      <td className="px-4 py-4">{cliente.score}</td>
                      <td className="px-4 py-4">{cliente.diasSemCompra}</td>
                      <td className="px-4 py-4">{formatCurrency(cliente.ticketMedio)}</td>
                      <td className="px-4 py-4">{cliente.totalPedidos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-600">Nenhum cliente prioritário encontrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
