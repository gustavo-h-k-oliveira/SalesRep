import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDashboard } from '../services/dashboardService'
import { fetchClientesPrioritarios } from '../services/clienteService'
import { fetchPedidos } from '../services/pedidoService'
import type { DashboardDto, ClientePrioritarioDto, PedidoResponse } from '../types/api'

const LIMIAR_ATENCAO_DIAS = 30
const LIMIAR_INATIVO_DIAS = 45

interface VendaMensal {
  label: string
  total: number
}

interface AlertaComercial {
  title: string
  description: string
  tone: 'red' | 'amber' | 'blue'
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

function formatMonth(date: Date) {
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
    .format(date)
    .replace('.', '')

  return label.charAt(0).toUpperCase() + label.slice(1)
}

function getPotencial(cliente: ClientePrioritarioDto) {
  if (cliente.score >= 80 || cliente.ticketMedio >= 4000) return 'Alto'
  if (cliente.score >= 50 || cliente.ticketMedio >= 1500) return 'Médio'
  return 'Baixo'
}

function getPotencialClass(potencial: string) {
  if (potencial === 'Alto') return 'bg-emerald-50 text-emerald-700'
  if (potencial === 'Médio') return 'bg-amber-50 text-amber-700'
  return 'bg-slate-100 text-slate-600'
}

function getPrioridadeTone(cliente: ClientePrioritarioDto) {
  if (cliente.diasSemCompra >= LIMIAR_INATIVO_DIAS) return 'red'
  if (cliente.diasSemCompra >= LIMIAR_ATENCAO_DIAS) return 'amber'
  return 'green'
}

function getPrioridadeLabel(cliente: ClientePrioritarioDto) {
  if (cliente.diasSemCompra >= LIMIAR_INATIVO_DIAS) return 'Reativar cliente'
  if (cliente.diasSemCompra >= LIMIAR_ATENCAO_DIAS) return 'Prevenir inatividade'
  return 'Explorar potencial'
}

function getVendasMensais(pedidos: PedidoResponse[]): VendaMensal[] {
  const meses = new Map<string, VendaMensal>()

  for (const pedido of pedidos) {
    const date = new Date(pedido.dataEmissao)
    if (Number.isNaN(date.getTime())) continue

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const current = meses.get(key) ?? { label: formatMonth(date), total: 0 }
    meses.set(key, { ...current, total: current.total + pedido.valorTotal })
  }

  return [...meses.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-4)
    .map(([, value]) => value)
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

  const clientesSemCompra30 = useMemo(
    () => clientesPrioritarios.filter((cliente) => cliente.diasSemCompra >= LIMIAR_ATENCAO_DIAS),
    [clientesPrioritarios]
  )

  const prioridades = useMemo(
    () =>
      [...clientesPrioritarios]
        .sort((a, b) => b.diasSemCompra - a.diasSemCompra || b.score - a.score)
        .slice(0, 5),
    [clientesPrioritarios]
  )

  const rankingClientes = useMemo(
    () =>
      [...clientesPrioritarios]
        .sort((a, b) => b.score - a.score || b.ticketMedio - a.ticketMedio)
        .slice(0, 6),
    [clientesPrioritarios]
  )

  const vendasMensais = useMemo(() => getVendasMensais(pedidos), [pedidos])

  const potencialRecuperacao = useMemo(
    () => clientesSemCompra30.reduce((total, cliente) => total + cliente.ticketMedio, 0),
    [clientesSemCompra30]
  )

  const alertasComerciais = useMemo<AlertaComercial[]>(() => {
    if (!dashboard) return []

    const alertas: AlertaComercial[] = []

    if (dashboard.clientesInativos > 0) {
      alertas.push({
        title: `${dashboard.clientesInativos} clientes inativos`,
        description: 'Clientes passaram de 45 dias sem compra e precisam de contato.',
        tone: 'red',
      })
    }

    if (dashboard.regioesCriticas.length > 0) {
      alertas.push({
        title: 'Regiões críticas',
        description: `${dashboard.regioesCriticas.slice(0, 2).join(', ')} exigem acompanhamento comercial.`,
        tone: 'amber',
      })
    }

    if (dashboard.produtosCriticos.length > 0) {
      alertas.push({
        title: 'Produtos com baixa recompra',
        description: `${dashboard.produtosCriticos.slice(0, 2).join(', ')} aparecem como ponto de atenção.`,
        tone: 'blue',
      })
    }

    if (alertas.length === 0) {
      alertas.push({
        title: 'Carteira sem alertas críticos',
        description: 'Não há mudanças relevantes exigindo ação imediata agora.',
        tone: 'blue',
      })
    }

    return alertas
  }, [dashboard])

  const principalRegiao = dashboard?.regioesCriticas[0] ?? 'sua carteira'
  const principalProduto = dashboard?.produtosCriticos[0] ?? 'produtos recorrentes'

  return (
    <div className="space-y-6">
      <header>
        <h1 className="m-0 text-3xl font-extrabold tracking-normal text-slate-950 sm:text-4xl">
          Visão Geral
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Recomendações para priorizar sua carteira comercial hoje
        </p>
      </header>

      {loading ? (
        <StateCard message="Carregando visão geral..." />
      ) : error ? (
        <StateCard message={error} tone="error" />
      ) : dashboard ? (
        <>
          <section className="rounded-2xl border border-sky-100 bg-sky-50 p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
                  Resumo do dia
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950">
                  Comece pelos clientes com maior risco de perda
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/clientes')}
                className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Ver clientes
              </button>
            </div>

            <ul className="mt-5 grid gap-3 text-sm text-slate-700 lg:grid-cols-2">
              <SummaryItem>
                Há <strong>{clientesSemCompra30.length} clientes</strong> sem compras há mais de 30 dias.
              </SummaryItem>
              <SummaryItem>
                <strong>{principalRegiao}</strong> concentra atenção comercial neste momento.
              </SummaryItem>
              <SummaryItem>
                <strong>{principalProduto}</strong> aparece como oportunidade de recompra.
              </SummaryItem>
              <SummaryItem>
                Recuperar esses clientes representa cerca de <strong>{formatCurrency(potencialRecuperacao)}</strong> em potencial.
              </SummaryItem>
            </ul>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Faturamento do mês"
              value={formatCurrency(dashboard.faturamentoTotal)}
              subtitle="pedidos faturados"
              tone="blue"
            />
            <KpiCard
              title="Clientes ativos"
              value={dashboard.clientesAtivos}
              subtitle="compraram recentemente"
              tone="green"
            />
            <KpiCard
              title="Clientes inativos"
              value={dashboard.clientesInativos}
              subtitle="45+ dias sem compra"
              tone="orange"
            />
            <KpiCard
              title="Oportunidades"
              value={dashboard.alertasPendentes}
              subtitle="ações comerciais abertas"
              tone="purple"
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-600">Prioridades</p>
              <h2 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
                Clientes que precisam de atenção
              </h2>
            </div>

            <div className="space-y-3">
              {prioridades.length ? (
                prioridades.map((cliente) => (
                  <PriorityItem
                    key={cliente.id}
                    cliente={cliente}
                    onClick={() => navigate('/clientes')}
                  />
                ))
              ) : (
                <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                  Nenhuma prioridade encontrada para hoje.
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
            <SalesChart data={vendasMensais} />
            <CommercialAlerts alerts={alertasComerciais} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-normal text-slate-950">
                  Ranking de clientes prioritários
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ordenado por potencial e risco de ficar sem recompra.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/clientes')}
                className="text-sm font-bold text-sky-600 transition hover:text-sky-700"
              >
                Ver todos
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-950">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Última compra</th>
                    <th className="px-4 py-3 font-semibold">Ticket médio</th>
                    <th className="px-4 py-3 font-semibold">Potencial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {rankingClientes.length ? (
                    rankingClientes.map((cliente) => {
                      const potencial = getPotencial(cliente)

                      return (
                        <tr
                          key={cliente.id}
                          className="cursor-pointer transition hover:bg-slate-50"
                          onClick={() => navigate('/clientes')}
                        >
                          <td className="px-4 py-4 font-medium text-slate-900">{cliente.nome}</td>
                          <td className="px-4 py-4">{cliente.diasSemCompra} dias</td>
                          <td className="px-4 py-4">{formatCurrency(cliente.ticketMedio)}</td>
                          <td className="px-4 py-4">
                            <span className={`rounded-md px-3 py-1 text-xs font-bold ${getPotencialClass(potencial)}`}>
                              {potencial}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td className="px-4 py-4 text-slate-500" colSpan={4}>
                        Nenhum cliente prioritário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <StateCard message="Nenhum dado disponível para a visão geral." />
      )}
    </div>
  )
}

function SummaryItem({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-xl border border-sky-100 bg-white px-4 py-3 leading-relaxed">
      {children}
    </li>
  )
}

interface KpiCardProps {
  title: string
  value: number | string
  subtitle: string
  tone: 'blue' | 'green' | 'orange' | 'purple'
}

const kpiStyles = {
  blue: 'border-l-sky-500 text-sky-600',
  green: 'border-l-emerald-500 text-emerald-600',
  orange: 'border-l-orange-500 text-orange-600',
  purple: 'border-l-violet-500 text-violet-600',
}

function KpiCard({ title, value, subtitle, tone }: KpiCardProps) {
  return (
    <article className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm ${kpiStyles[tone].split(' ')[0]}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-2 text-3xl font-extrabold ${kpiStyles[tone].split(' ')[1]}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </article>
  )
}

interface PriorityItemProps {
  cliente: ClientePrioritarioDto
  onClick: () => void
}

const priorityToneClasses = {
  red: 'border-red-100 bg-red-50 text-red-600',
  amber: 'border-amber-100 bg-amber-50 text-amber-600',
  green: 'border-emerald-100 bg-emerald-50 text-emerald-600',
}

function PriorityItem({ cliente, onClick }: PriorityItemProps) {
  const tone = getPrioridadeTone(cliente)

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full gap-3 rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-sky-200 hover:bg-sky-50 sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${tone === 'red' ? 'bg-red-500' : tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        <div>
          <p className="font-bold text-slate-950">{cliente.nome}</p>
          <p className="mt-1 text-sm text-slate-500">
            {cliente.diasSemCompra} dias sem comprar - ticket médio {formatCurrency(cliente.ticketMedio)}
          </p>
        </div>
      </div>
      <span className={`rounded-md border px-3 py-1 text-xs font-bold ${priorityToneClasses[tone]}`}>
        {getPrioridadeLabel(cliente)}
      </span>
    </button>
  )
}

function SalesChart({ data }: { data: VendaMensal[] }) {
  const maxValue = Math.max(...data.map((item) => item.total), 1)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-wide text-sky-600">Desempenho</p>
        <h2 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
          Vendas dos últimos meses
        </h2>
      </div>

      {data.length ? (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.label} className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
              <span className="text-sm font-medium text-slate-500">{item.label}</span>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${Math.max((item.total / maxValue) * 100, 8)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-700">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
          Ainda não há pedidos suficientes para montar o gráfico.
        </p>
      )}
    </section>
  )
}

const alertToneClasses = {
  red: 'border-red-100 bg-red-50 text-red-600',
  amber: 'border-amber-100 bg-amber-50 text-amber-600',
  blue: 'border-sky-100 bg-sky-50 text-sky-600',
}

function CommercialAlerts({ alerts }: { alerts: AlertaComercial[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-wide text-sky-600">Atenção</p>
        <h2 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
          Alertas comerciais
        </h2>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.title} className={`rounded-xl border p-4 ${alertToneClasses[alert.tone]}`}>
            <p className="font-bold">{alert.title}</p>
            <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function StateCard({ message, tone = 'default' }: { message: string; tone?: 'default' | 'error' }) {
  return (
    <div className={`rounded-2xl border bg-white p-6 shadow-sm ${tone === 'error' ? 'border-red-100 text-red-600' : 'border-slate-200 text-slate-500'}`}>
      {message}
    </div>
  )
}
