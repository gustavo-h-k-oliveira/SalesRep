import { type SubmitEvent, useEffect, useMemo, useState } from 'react'
import {
  fetchPedidos,
  fetchPedidosByPeriodo,
  fetchPedidosFaturados,
  fetchPedidosNaoFaturados,
} from '../services/pedidoService'
import type { PedidoResponse } from '../types/api'

type FilterMode = 'TODOS' | 'FATURADOS' | 'NAO_FATURADOS'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('TODOS')

  useEffect(() => {
    loadPedidos()
  }, [])

  async function loadPedidos(mode: FilterMode = 'TODOS', start = inicio, end = fim) {
    setLoading(true)
    setError(null)

    try {
      let data: PedidoResponse[] = []

      if (start && end) {
        data = await fetchPedidosByPeriodo(start, end)
      } else if (mode === 'FATURADOS') {
        data = await fetchPedidosFaturados()
      } else if (mode === 'NAO_FATURADOS') {
        data = await fetchPedidosNaoFaturados()
      } else {
        data = await fetchPedidos()
      }

      if (start && end && mode !== 'TODOS') {
        data = data.filter((pedido) =>
          mode === 'FATURADOS' ? pedido.status === 'FATURADO' : pedido.status !== 'FATURADO'
        )
      }

      setPedidos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const totalPedidos = pedidos.length
  const valorTotal = useMemo(
    () => pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0),
    [pedidos]
  )
  const ticketMedio = totalPedidos > 0 ? valorTotal / totalPedidos : 0
  const faturadosCount = pedidos.filter((pedido) => pedido.status === 'FATURADO').length
  const naoFaturadosCount = totalPedidos - faturadosCount

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    await loadPedidos(filterMode, inicio, fim)
  }

  const handleReset = async () => {
    setInicio('')
    setFim('')
    setFilterMode('TODOS')
    await loadPedidos('TODOS', '', '')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Pedidos</h1>
            <p className="mt-2 text-sm text-slate-600">
              Esta página mostra pedidos disponíveis pela API. Filtros suportados:
              período e faturamento.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <form className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Início</label>
              <input
                type="date"
                value={inicio}
                onChange={(event) => setInicio(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Fim</label>
              <input
                type="date"
                value={fim}
                onChange={(event) => setFim(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Filtrar</label>
              <select
                value={filterMode}
                onChange={(event) => setFilterMode(event.target.value as FilterMode)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
              >
                <option value="TODOS">Todos</option>
                <option value="FATURADOS">Faturados</option>
                <option value="NAO_FATURADOS">Não faturados</option>
              </select>
            </div>

            <div className="flex flex-wrap items-end gap-3 sm:col-span-3">
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Aplicar filtros
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Limpar filtros
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pedidos</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalPedidos}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Valor total</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(valorTotal)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Ticket médio</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(ticketMedio)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Faturados</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{faturadosCount}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Não faturados</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{naoFaturadosCount}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          {loading ? (
            <p className="text-slate-600">Carregando pedidos...</p>
          ) : error ? (
            <p className="text-rose-600">{error}</p>
          ) : pedidos.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-900">
                  <tr>
                    <th className="px-4 py-3 font-medium">Pedido</th>
                    <th className="px-4 py-3 font-medium">Emissão</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Representante</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 font-medium">Autorização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td className="px-4 py-4">{pedido.id}</td>
                      <td className="px-4 py-4">{formatDate(pedido.dataEmissao)}</td>
                      <td className="px-4 py-4">{pedido.clienteNome}</td>
                      <td className="px-4 py-4">{pedido.representanteNome}</td>
                      <td className="px-4 py-4">{pedido.status}</td>
                      <td className="px-4 py-4">{formatCurrency(pedido.valorTotal)}</td>
                      <td className="px-4 py-4">{pedido.autorizacaoComercial || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-600">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
