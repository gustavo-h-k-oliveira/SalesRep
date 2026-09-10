import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  fetchRepresentanteById,
  fetchRepresentanteClientes,
  fetchRepresentantePedidos,
  fetchRepresentanteAlertas,
  enviarAlertasWhatsApp,
} from '../services/representanteService'
import { isGestor } from '../services/authService'
import type { RepresentanteResponse, ClienteResponse, PedidoResponse, AlertaDto } from '../types/api'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeftIcon,
  UserIcon,
  MapPinIcon,
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShieldWarningIcon,
  TrendUpIcon,
  WhatsappLogoIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  XIcon,
} from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
  valor: {
    label: 'Faturamento',
    color: '#10b981',
  },
}

export default function RepresentanteDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const repId = id ? parseInt(id, 10) : null
  const gestor = isGestor()

  const [rep, setRep] = useState<RepresentanteResponse | null>(null)
  const [clientes, setClientes] = useState<ClienteResponse[]>([])
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [alertas, setAlertas] = useState<AlertaDto[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'clientes' | 'pedidos' | 'alertas'>('clientes')

  const [enviandoAlertas, setEnviandoAlertas] = useState(false)
  const [modalConfirmacaoOpen, setModalConfirmacaoOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro' | 'info'; mensagem: string } | null>(null)

  const handleEnviarAlertas = async () => {
    if (!rep) return
    setEnviandoAlertas(true)
    setFeedback(null)
    setModalConfirmacaoOpen(false)

    try {
      const res = await enviarAlertasWhatsApp(rep.id)
      if (res.status === 'sucesso') {
        setFeedback({
          tipo: (res.totalAlertas ?? alertas.length) > 0 ? 'sucesso' : 'info',
          mensagem: res.mensagem,
        })
      } else {
        setFeedback({
          tipo: 'erro',
          mensagem: 'Erro no disparo da mensagem. Por favor, contatar o suporte.',
        })
      }
    } catch (err) {
      console.error('Erro no disparo de alertas por WhatsApp:', err)
      setFeedback({
        tipo: 'erro',
        mensagem: 'Erro no disparo da mensagem. Por favor, contatar o suporte.',
      })
    } finally {
      setEnviandoAlertas(false)
    }
  }

  useEffect(() => {
    if (repId === null) return

    const targetRepId = repId

    async function loadData() {
      try {
        const [repData, clientesData, pedidosData, alertasData] = await Promise.all([
          fetchRepresentanteById(targetRepId),
          fetchRepresentanteClientes(targetRepId),
          fetchRepresentantePedidos(targetRepId),
          fetchRepresentanteAlertas(targetRepId),
        ])

        setRep(repData)
        setClientes(clientesData)
        setPedidos(pedidosData)
        setAlertas(alertasData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar informações do representante')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [repId])

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // KPIs
  const kpis = useMemo(() => {
    const faturados = pedidos.filter((p) => p.status === 'FATURADO')
    const faturamentoTotal = faturados.reduce((sum, p) => sum + p.valorTotal, 0)

    const pendentes = pedidos.filter((p) => p.status === 'PENDENTE')
    const faturamentoPendente = pendentes.reduce((sum, p) => sum + p.valorTotal, 0)

    const ticketMedio = faturados.length > 0 ? faturamentoTotal / faturados.length : 0

    const clientesAtivos = clientes.filter((c) => c.status === 'ATIVO').length
    const clientesInativos = clientes.filter((c) => c.status === 'INATIVO').length

    return {
      faturamentoTotal,
      faturamentoPendente,
      ticketMedio,
      clientesAtivos,
      clientesInativos,
    }
  }, [pedidos, clientes])

  // Gráfico de vendas
  const vendasUltimosMeses = useMemo(() => {
    const faturados = pedidos.filter((p) => p.status === 'FATURADO')
    const mesesMap: { [key: string]: number } = {}
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    faturados.forEach((p) => {
      const date = new Date(p.dataEmissao)
      const nomeMes = nomesMeses[date.getMonth()]
      mesesMap[nomeMes] = (mesesMap[nomeMes] || 0) + p.valorTotal
    })

    const hoje = new Date()
    const ultimos6Meses: string[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      ultimos6Meses.push(nomesMeses[d.getMonth()])
    }

    return ultimos6Meses.map((mes) => ({
      mes,
      valor: mesesMap[mes] || 0,
    }))
  }, [pedidos])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Carregando perfil do representante...</p>
        </div>
      </div>
    )
  }

  if (error || !rep) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm max-w-md">
          <h2 className="text-lg font-semibold text-slate-900">Erro ao Carregar</h2>
          <p className="mt-2 text-sm text-slate-600">{error || 'Representante não encontrado.'}</p>
          <button
            onClick={() => navigate('/representantes')}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Voltar */}
      <button
        onClick={() => navigate('/representantes')}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-semibold transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Voltar para equipe</span>
      </button>

      {/* Banner de Feedback */}
      {feedback && (
        <div
          className={`flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-2 ${feedback.tipo === 'sucesso'
            ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800'
            : feedback.tipo === 'erro'
              ? 'border-rose-200 bg-rose-50/90 text-rose-800'
              : 'border-amber-200 bg-amber-50/90 text-amber-800'
            }`}
        >
          <div className="flex items-center gap-3">
            {feedback.tipo === 'sucesso' && <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-600" weight="fill" />}
            {feedback.tipo === 'erro' && <WarningCircleIcon className="h-5 w-5 shrink-0 text-rose-600" weight="fill" />}
            {feedback.tipo === 'info' && <WarningCircleIcon className="h-5 w-5 shrink-0 text-amber-600" weight="fill" />}
            <p className="text-sm font-medium">{feedback.mensagem}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-black/5 transition-colors"
            title="Fechar mensagem"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho do Representante */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 ">{rep.nome}</h2>
              <p className="text-sm text-slate-500">ID Representante: #{rep.id}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-slate-600 sm:justify-end">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-2">
              <MapPinIcon className="h-4.5 w-4.5 text-slate-400" />
              <span>Região: <strong>{rep.regiaoNome}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-2">
              <PhoneCallIcon className="h-4.5 w-4.5 text-slate-400" />
              <span>{rep.telefone || 'Sem telefone'}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-2">
              <EnvelopeSimpleIcon className="h-4.5 w-4.5 text-slate-400" />
              <span>{rep.email || 'Sem e-mail'}</span>
            </div>

            {/* BOTÃO EXCLUSIVO PARA GESTOR: Acionar alertas no WhatsApp */}
            {gestor && (
              <button
                type="button"
                onClick={() => setModalConfirmacaoOpen(true)}
                disabled={enviandoAlertas}
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 text-sm font-semibold shadow-xs hover:shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                title="Disparar alertas pendentes via WhatsApp para este representante"
              >
                <WhatsappLogoIcon className="h-4.5 w-4.5" weight="fill" />
                <span>{enviandoAlertas ? 'Enviando alertas...' : 'Acionar Alertas WhatsApp'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Faturamento Realizado</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CurrencyDollarIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(kpis.faturamentoTotal)}</h3>
            <p className="mt-1 text-xs text-slate-500">Pedidos faturados acumulados</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Faturamento Pendente</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CurrencyDollarIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(kpis.faturamentoPendente)}</h3>
            <p className="mt-1 text-xs text-slate-500">Pedidos com faturamento pendente</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Ticket Médio</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <TrendUpIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(kpis.ticketMedio)}</h3>
            <p className="mt-1 text-xs text-slate-500">Valor médio por pedido faturado</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Clientes Carteira</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <UsersIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{clientes.length}</h3>
            <p className="mt-1 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">{kpis.clientesAtivos} ativos</span>{' '}
              e <span className="font-semibold text-slate-400">{kpis.clientesInativos} inativos</span>
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Desempenho */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Histórico de Faturamento</h2>
          <p className="text-xs text-slate-500">Faturamento faturado mensal nos últimos 6 meses</p>
        </div>
        <div className="h-[250px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              accessibilityLayer
              data={vendasUltimosMeses}
              margin={{ left: 12, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValorRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-slate-400 font-semibold"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$ ${Math.round(value / 1000)}k`}
                className="text-slate-400 font-semibold text-xs"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" labelFormatter={(value) => `Mês: ${value}`} />}
              />
              <Area
                dataKey="valor"
                type="monotone"
                fill="url(#colorValorRep)"
                stroke="#10b981"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Abas Detalhadas */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header das Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('clientes')}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'clientes'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            Clientes ({clientes.length})
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'pedidos'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            Pedidos ({pedidos.length})
          </button>
          <button
            onClick={() => setActiveTab('alertas')}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'alertas'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            Alertas Ativos ({alertas.length})
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="mt-8">
          {activeTab === 'clientes' && (
            <div>
              {clientes.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Última Compra</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientes.map((c) => (
                        <TableRow key={c.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-semibold text-slate-500">{c.id}</TableCell>
                          <TableCell className="font-semibold text-slate-900">{c.nome}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`px-2.5 py-0.5 rounded-full ${c.status === 'ATIVO'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                : c.status === 'INATIVO'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200/50'
                                  : 'bg-amber-50 text-amber-700 border-amber-200/50'
                                }`}
                            >
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {c.ultimaCompra ? new Date(c.ultimaCompra).toLocaleDateString('pt-BR') : 'Nenhuma compra'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              to={`/clientes/${c.id}`}
                              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Ver Perfil
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Este representante não possui clientes cadastrados.</p>
              )}
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div>
              {pedidos.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data Emissão</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidos.map((p) => (
                        <TableRow key={p.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-semibold text-slate-500">{p.id}</TableCell>
                          <TableCell className="font-medium text-slate-900">{p.clienteNome}</TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(p.dataEmissao).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="font-semibold text-slate-950">
                            {formatCurrency(p.valorTotal)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`px-2.5 py-0.5 rounded-full ${p.status === 'FATURADO'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                : p.status === 'PENDENTE'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                                  : 'bg-slate-50 text-slate-600'
                                }`}
                            >
                              {p.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Nenhum pedido registrado para este representante.</p>
              )}
            </div>
          )}

          {activeTab === 'alertas' && (
            <div className="space-y-4">
              {gestor && alertas.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Disparo Imediato de Notificações
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Envie a lista consolidada de {alertas.length} alerta(s) pendente(s) direto para o WhatsApp do vendedor.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalConfirmacaoOpen(true)}
                    disabled={enviandoAlertas}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2 text-xs font-semibold shadow-xs active:scale-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                  >
                    <WhatsappLogoIcon className="h-4 w-4" weight="fill" />
                    <span>{enviandoAlertas ? 'Enviando...' : `Disparar Alertas (${alertas.length}) no WhatsApp`}</span>
                  </button>
                </div>
              )}

              {alertas.length > 0 ? (
                alertas.map((a, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-xs transition-shadow"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <ShieldWarningIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{a.tipo}</span>
                        <Badge
                          variant="outline"
                          className={`px-2 py-0.2 text-[10px] rounded-full font-bold ${a.criticidade === 'ALTA'
                            ? 'bg-rose-50 text-rose-700 border-rose-200/50'
                            : a.criticidade === 'MEDIA'
                              ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                              : 'bg-slate-50 text-slate-600'
                            }`}
                        >
                          {a.criticidade}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{a.descricao}</p>
                      <p className="text-xs text-slate-400">
                        Cliente: <Link to={`/clientes/${a.clienteId}`} className="font-semibold underline hover:text-emerald-700">{a.clienteNome}</Link> • {new Date(a.dataGeracao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">Nenhum alerta pendente para a carteira deste representante.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação para Envio de Alertas WhatsApp */}
      <Dialog open={modalConfirmacaoOpen} onOpenChange={setModalConfirmacaoOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#25D366]">
                <WhatsappLogoIcon className="h-6 w-6" weight="fill" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Enviar Alertas no WhatsApp
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Disparo de notificações ativas para o vendedor
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="my-4 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Representante:</span>
              <span className="font-semibold text-slate-900">{rep.nome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Telefone:</span>
              <span className="font-semibold text-slate-900">{rep.telefone || 'Sem telefone'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Alertas pendentes:</span>
              <span className="font-bold text-amber-600">{alertas.length} alerta(s)</span>
            </div>

            {(!rep.telefone || rep.telefone.trim() === '') ? (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                ⚠️ Este representante não possui telefone cadastrado. O envio não poderá ser concluído.
              </p>
            ) : alertas.length === 0 ? (
              <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                ℹ️ Não há alertas pendentes para a carteira de {rep.nome} no momento.
              </p>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                Uma mensagem consolidada com o resumo dos <strong>{alertas.length} alertas</strong> será enviada imediatamente para o número cadastrado via Z-API.
              </p>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setModalConfirmacaoOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEnviarAlertas}
              disabled={enviandoAlertas || !rep.telefone || rep.telefone.trim() === ''}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-4 py-2 text-sm font-semibold text-white shadow-xs active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <WhatsappLogoIcon className="h-4 w-4" weight="fill" />
              <span>{enviandoAlertas ? 'Enviando...' : 'Confirmar e Enviar'}</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
