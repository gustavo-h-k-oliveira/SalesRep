Claro. Substitua **todo** o conteúdo de `frontend/src/pages/Dashboard.tsx` por este:

```tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowUp,
  BarChart3,
  Bell,
  Clock,
  Eye,
  UserCheck,
} from 'lucide-react'
import { fetchDashboard } from '../services/dashboardService'
import { fetchClientesPrioritarios } from '../services/clienteService'
import { fetchPedidos } from '../services/pedidoService'
import type { DashboardDto, ClientePrioritarioDto, PedidoResponse } from '../types/api'

const LIMIAR_QUASE_INATIVO_DIAS = 30
const LIMIAR_INATIVO_DIAS = 45
const LIMIAR_GESTOR_DIAS = 60

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function prazoGestor(diasSemCompra: number) {
  const diasRestantes = LIMIAR_GESTOR_DIAS - diasSemCompra
  return diasRestantes <= 0 ? 'Vencido' : `${diasRestantes} dias`
}

function statusCliente(cliente: ClientePrioritarioDto) {
  if (cliente.diasSemCompra >= LIMIAR_GESTOR_DIAS - 7) return 'Crítico'
  if (cliente.diasSemCompra >= LIMIAR_INATIVO_DIAS) return 'Inativo'
  if (cliente.diasSemCompra >= LIMIAR_QUASE_INATIVO_DIAS) return 'Quase inativo'
  return cliente.status
}

function statusClienteClasses(status: string) {
  if (status === 'Crítico') return 'bg-red-50 text-red-600'
  if (status === 'Inativo') return 'bg-orange-50 text-orange-600'
  if (status === 'Quase inativo') return 'bg-amber-50 text-amber-600'
  return 'bg-emerald-50 text-emerald-600'
}

function statusPedidoClasses(status: string) {
  if (status === 'FATURADO') return 'bg-emerald-50 text-emerald-600'
  if (status === 'ENVIADO') return 'bg-green-50 text-green-600'
  if (status === 'EM_ANALISE' || status === 'EM ANÁLISE') return 'bg-amber-50 text-amber-600'
  return 'bg-slate-100 text-slate-600'
}

function statusPedidoLabel(status: string) {
  if (status === 'FATURADO') return 'Faturado'
  if (status === 'ENVIADO') return 'Enviado'
  if (status === 'EM_ANALISE') return 'Em análise'
  return status
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null)
  const [clientesPrioritarios, setClientesPrioritarios] = useState<ClientePrioritarioDto[]>([])
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAll() {
      try {
        const [dashboardData, clientesData, pedidosData] = await Promise.all([
          fetchDashboard(),
          fetchClientesPrioritarios(),
          fetchPedidos(),
        ])

        setDashboard(dashboardData)
        setClientesPrioritarios(clientesData)
        setPedidos(pedidosData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar a visão geral')
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  const clientesQuaseInativos = useMemo(
    () =>
      clientesPrioritarios.filter(
        (cliente) =>
          cliente.diasSemCompra >= LIMIAR_QUASE_INATIVO_DIAS &&
          cliente.diasSemCompra < LIMIAR_INATIVO_DIAS
      ).length,
    [clientesPrioritarios]
  )

  const clientesCriticos = useMemo(
    () =>
      clientesPrioritarios.filter(
        (cliente) => cliente.diasSemCompra >= LIMIAR_GESTOR_DIAS - 7
      ).length,
    [clientesPrioritarios]
  )

  const clientesAtencao = useMemo(
    () =>
      clientesPrioritarios
        .filter((cliente) => cliente.diasSemCompra >= LIMIAR_QUASE_INATIVO_DIAS)
        .sort((a, b) => b.diasSemCompra - a.diasSemCompra)
        .slice(0, 3),
    [clientesPrioritarios]
  )

  const pedidosRecentes = useMemo(() => pedidos.slice(0, 3), [pedidos])

  return (
    <div className="space-y-6">
      <section className="rounded-sm bg-slate-50 px-2 py-1">
        <div className="mb-6">
          <h1 className="m-0 text-4xl font-extrabold tracking-normal text-slate-950">
            Visão Geral
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Prioridades da sua carteira comercial hoje
          </p>
        </div>

        {loading ? (
          <div className="rounded-lg border border-slate-100 bg-white p-6 text-slate-500 shadow-sm">
            Carregando visão geral...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-100 bg-white p-6 text-red-600 shadow-sm">
            {error}
          </div>
        ) : dashboard ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Clientes ativos"
              value={dashboard.clientesAtivos}
              subtitle="compraram recentemente"
              icon={UserCheck}
              color="green"
            />
            <MetricCard
              title="Quase inativos"
              value={clientesQuaseInativos}
              subtitle="próximos de 45 dias"
              icon={Clock}
              color="amber"
            />
            <MetricCard
              title="Inativos"
              value={dashboard.clientesInativos}
              subtitle="45+ dias sem compra"
              icon={AlertTriangle}
              color="orange"
            />
            <MetricCard
              title="Críticos"
              value={clientesCriticos}
              subtitle="próximos do gestor"
              icon={AlertTriangle}
              color="red"
            />
          </div>
        ) : null}
      </section>

      {!loading && !error && dashboard && (
        <>
          <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold tracking-normal text-slate-950">
              Prioridades de hoje
            </h2>

            <div className="space-y-2">
              <PriorityRow
                icon={ArrowUp}
                level="Alta"
                description={`${clientesCriticos} clientes faltam menos de 7 dias para ir ao gestor`}
                actionLabel="Ver agora"
                color="red"
                onClick={() => navigate('/clientes')}
              />
              <PriorityRow
                icon={BarChart3}
                level="Média"
                description={`${dashboard.clientesInativos} clientes estão inativos há mais de 45 dias`}
                actionLabel="Ver inativos"
                color="orange"
                onClick={() => navigate('/clientes')}
              />
              <PriorityRow
                icon={Bell}
                level="Atenção"
                description={`${clientesQuaseInativos} clientes estão próximos de virar inativos`}
                actionLabel="Ver clientes"
                color="amber"
                onClick={() => navigate('/clientes')}
              />
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,1fr)]">
            <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold tracking-normal text-slate-950">
                Clientes que exigem atenção
              </h2>

              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-950">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Cliente</th>
                      <th className="px-4 py-3 font-semibold">Cidade/UF</th>
                      <th className="px-4 py-3 font-semibold">Dias sem compra</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Prazo gestor</th>
                      <th className="px-4 py-3 font-semibold">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {clientesAtencao.length ? (
                      clientesAtencao.map((cliente) => {
                        const status = statusCliente(cliente)

                        return (
                          <tr key={cliente.id}>
                            <td className="px-4 py-4 font-medium text-slate-800">
                              {cliente.nome}
                            </td>
                            <td className="px-4 py-4">-</td>
                            <td className="px-4 py-4">{cliente.diasSemCompra} dias</td>
                            <td className="px-4 py-4">
                              <span
                                className={`rounded-md px-3 py-1 text-xs font-bold ${statusClienteClasses(status)}`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-bold text-orange-500">
                              {prazoGestor(cliente.diasSemCompra)}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => navigate('/clientes')}
                                className="inline-flex items-center gap-2 rounded-md border border-blue-200 px-3 py-1.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                                Ver cliente
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td className="px-4 py-4 text-slate-500" colSpan={6}>
                          Nenhum cliente exigindo atenção no momento.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold tracking-normal text-slate-950">
                Últimos pedidos
              </h2>

              <div className="overflow-hidden rounded-lg border border-slate-100">
                {pedidosRecentes.length ? (
                  pedidosRecentes.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="grid grid-cols-[90px_1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0"
                    >
                      <span className="font-bold text-blue-600">
                        #{String(pedido.id).padStart(6, '0')}
                      </span>
                      <span className="truncate text-slate-700">{pedido.clienteNome}</span>
                      <span className="font-medium text-slate-800">
                        {formatCurrency(pedido.valorTotal)}
                      </span>
                      <span
                        className={`rounded-md px-3 py-1 text-xs font-bold ${statusPedidoClasses(pedido.status)}`}
                      >
                        {statusPedidoLabel(pedido.status)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-4 text-sm text-slate-500">Nenhum pedido recente.</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate('/pedidos')}
                className="mt-4 text-sm font-bold text-blue-600 transition hover:text-blue-700"
              >
                Ver todos os pedidos →
              </button>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  subtitle: string
  icon: typeof UserCheck
  color: 'green' | 'amber' | 'orange' | 'red'
}

const metricStyles = {
  green: {
    border: 'border-l-green-500',
    iconBg: 'bg-green-50',
    iconText: 'text-green-500',
    value: 'text-green-500',
  },
  amber: {
    border: 'border-l-amber-400',
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-500',
    value: 'text-amber-500',
  },
  orange: {
    border: 'border-l-orange-500',
    iconBg: 'bg-orange-50',
    iconText: 'text-orange-500',
    value: 'text-orange-500',
  },
  red: {
    border: 'border-l-red-500',
    iconBg: 'bg-red-50',
    iconText: 'text-red-500',
    value: 'text-red-500',
  },
}

function MetricCard({ title, value, subtitle, icon: Icon, color }: MetricCardProps) {
  const styles = metricStyles[color]

  return (
    <article
      className={`flex min-h-[150px] items-center gap-7 rounded-lg border border-slate-100 border-l-4 bg-white p-6 shadow-sm ${styles.border}`}
    >
      <div
        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
      >
        <Icon className={`h-12 w-12 ${styles.iconText}`} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-slate-950">{title}</h3>
        <p className={`mt-3 text-3xl font-extrabold ${styles.value}`}>{value}</p>
        <p className="mt-2 text-base text-slate-500">{subtitle}</p>
      </div>
    </article>
  )
}

interface PriorityRowProps {
  icon: typeof ArrowUp
  level: string
  description: string
  actionLabel: string
  color: 'red' | 'orange' | 'amber'
  onClick: () => void
}

const priorityStyles = {
  red: {
    iconBg: 'bg-red-50',
    iconText: 'text-red-500',
    level: 'text-red-500',
    button: 'bg-red-500 hover:bg-red-600',
  },
  orange: {
    iconBg: 'bg-orange-50',
    iconText: 'text-orange-500',
    level: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-500',
    level: 'text-amber-500',
    button: 'bg-amber-400 hover:bg-amber-500',
  },
}

function PriorityRow({
  icon: Icon,
  level,
  description,
  actionLabel,
  color,
  onClick,
}: PriorityRowProps) {
  const styles = priorityStyles[color]

  return (
    <div className="grid gap-4 rounded-lg border border-slate-100 px-4 py-3 sm:grid-cols-[64px_140px_1fr_auto] sm:items-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-md ${styles.iconBg}`}
      >
        <Icon className={`h-6 w-6 ${styles.iconText}`} />
      </div>
      <p className={`text-lg font-extrabold ${styles.level}`}>{level}</p>
      <p className="text-sm text-slate-600">{description}</p>
      <button
        type="button"
        onClick={onClick}
        className={`rounded-md px-7 py-2.5 text-sm font-bold text-white transition ${styles.button}`}
      >
        {actionLabel}
      </button>
    </div>
  )
}
```
