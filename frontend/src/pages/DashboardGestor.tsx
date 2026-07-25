import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { DashboardDto, ClientePrioritarioDto, PedidoResponse, RepresentanteResponse, RegiaoResponse, ClienteResponse } from '../types/api'
import { fetchClientesPrioritarios, fetchClientes } from '../services/clienteService'
import { fetchPedidos } from '../services/pedidoService'
import { fetchRepresentantes } from '../services/representanteService'
import { fetchRegioes } from '../services/regiaoService'
import MapaBrasilSvg from '../components/MapaBrasilSvg'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  UsersIcon,
  ShieldWarningIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TrendUpIcon,
  ArrowRightIcon,
  UserIcon,
  TargetIcon,
} from '@phosphor-icons/react'

const chartConfig = {
  valor: {
    label: 'Faturamento',
    color: '#10b981',
  },
} satisfies ChartConfig

interface DashboardGestorProps {
  data: DashboardDto
}

export default function DashboardGestor({ data }: DashboardGestorProps) {
  const [prioritarios, setPrioritarios] = useState<ClientePrioritarioDto[]>([])
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [representantes, setRepresentantes] = useState<RepresentanteResponse[]>([])
  const [regioes, setRegioes] = useState<RegiaoResponse[]>([])
  const [clientes, setClientes] = useState<ClienteResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGestorDashboardData() {
      try {
        const [prioritariosRes, pedidosRes, representantesRes, regioesRes, clientesRes] = await Promise.allSettled([
          fetchClientesPrioritarios(),
          fetchPedidos(),
          fetchRepresentantes(),
          fetchRegioes(),
          fetchClientes(),
        ])

        if (prioritariosRes.status === 'fulfilled' && Array.isArray(prioritariosRes.value)) setPrioritarios(prioritariosRes.value)
        if (pedidosRes.status === 'fulfilled' && Array.isArray(pedidosRes.value)) setPedidos(pedidosRes.value)
        if (representantesRes.status === 'fulfilled' && Array.isArray(representantesRes.value)) setRepresentantes(representantesRes.value)
        if (regioesRes.status === 'fulfilled' && Array.isArray(regioesRes.value)) setRegioes(regioesRes.value)
        if (clientesRes.status === 'fulfilled') {
          const val = clientesRes.value as any
          if (Array.isArray(val)) {
            setClientes(val)
          } else if (val && typeof val === 'object' && 'content' in val && Array.isArray(val.content)) {
            setClientes(val.content)
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard do gestor:', err)
      } finally {
        setLoading(false)
      }
    }
    loadGestorDashboardData()
  }, [])

  const formatCurrency = (value: number) =>
    (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // 1. Resumo Executivo (Cálculos dinâmicos em nível de Gestor)
  const resumoExecutivo = useMemo(() => {
    const semCompra30Dias = (prioritarios || []).filter((c) => c && c.diasSemCompra > 30).length

    // Potencial estimado de recuperação geral
    const potencialRecuperacao = (prioritarios || [])
      .filter((c) => c && c.diasSemCompra > 30)
      .reduce((sum, c) => sum + (c.ticketMedio || 0), 0)

    // Região crítica principal
    const regiaoCritica = (data?.regioesCriticas || [])[0] || 'Nacional'

    // Produto com mais problemas de recompra global
    const produtoCritico = (data?.produtosCriticos || [])[0] || 'Farinha Especial'

    return {
      semCompra30Dias,
      potencialRecuperacao,
      regiaoCritica,
      produtoCritico,
    }
  }, [prioritarios, data])

  // 2. Gráfico de Vendas Consolidado (Últimos 4 meses)
  const vendasUltimosMeses = useMemo(() => {
    const faturados = (pedidos || []).filter((p) => p && p.status === 'FATURADO')
    const mesesMap: { [key: string]: number } = {}

    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    faturados.forEach((p) => {
      if (p && p.dataEmissao) {
        const date = new Date(p.dataEmissao)
        const nomeMes = nomesMeses[date.getMonth()]
        mesesMap[nomeMes] = (mesesMap[nomeMes] || 0) + (p.valorTotal || 0)
      }
    })

    const hoje = new Date()
    const ultimosMeses: string[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      ultimosMeses.push(nomesMeses[d.getMonth()])
    }

    return ultimosMeses.map((mes) => {
      const valor = mesesMap[mes] || 0
      return {
        mes,
        valor,
      }
    })
  }, [pedidos])

  // 3. Ranking de Representantes (Calculado com base em faturamento faturado de pedidos)
  const rankingRepresentantes = useMemo(() => {
    const faturados = (pedidos || []).filter((p) => p && p.status === 'FATURADO')
    const faturamentoMap: { [key: string]: number } = {}

    faturados.forEach((p) => {
      if (p && p.representanteNome) {
        faturamentoMap[p.representanteNome] = (faturamentoMap[p.representanteNome] || 0) + (p.valorTotal || 0)
      }
    });

    (representantes || []).forEach((rep) => {
      if (rep && faturamentoMap[rep.nome] === undefined) {
        faturamentoMap[rep.nome] = 0
      }
    });

    return Object.entries(faturamentoMap)
      .map(([nome, faturamento]) => ({ nome, faturamento }))
      .sort((a, b) => b.faturamento - a.faturamento)
  }, [pedidos, representantes, data])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Carregando painel do gestor comercial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8">

      {/* Banner do Gestor */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 animate-fade-in">
          <span className="inline-flex items-center rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-100 backdrop-blur-md">
            Painel do Gestor Comercial
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Consolidado de Vendas & Operações
          </h1>
          <p className="mt-2 max-w-xl text-emerald-100/90 text-sm">
            Visão agregada da performance comercial da equipe de vendas e saúde da carteira nacional.
          </p>
        </div>
      </div>

      {/* Resumo Executivo (Diferencial) */}
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-xs animate-fade-in">
        <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
          <TrendUpIcon className="h-5 w-5 text-emerald-600" />
          Resumo Operacional da Empresa
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-emerald-900/95 font-medium">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>Há <strong className="text-emerald-950 font-bold">{resumoExecutivo.semCompra30Dias} clientes críticos</strong> sem compras há mais de 30 dias na empresa.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>A região de <strong className="text-emerald-950 font-bold">{resumoExecutivo.regiaoCritica}</strong> concentra os maiores índices de inatividade de vendas.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>O produto <strong className="text-emerald-950 font-bold">{resumoExecutivo.produtoCritico}</strong> é o principal item com queda de recompra geral.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>A recuperação da carteira representa uma receita potencial estimada de <strong className="text-emerald-700 font-bold">{formatCurrency(resumoExecutivo.potencialRecuperacao)}</strong>.</span>
          </li>
        </ul>
      </div>

      {/* Painel de Acompanhamento de Metas Comerciais */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TargetIcon className="h-5 w-5 text-emerald-600" />
              Acompanhamento de Metas Comerciais do Mês
            </h2>
            <p className="text-xs text-slate-500">Progresso acumulado de vendas e cobertura da carteira nacional</p>
          </div>
          {data.metaFaturamento && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              Meta Faturamento: {formatCurrency(data.metaFaturamento)}
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Progress Card 1: Faturamento Mês vs Meta */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700">Faturamento Mês vs Meta</span>
              <span className="text-emerald-600 font-bold">{(data.atingimentoMetaPercentual || 0).toFixed(1)}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(data.atingimentoMetaPercentual || 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Realizado: {formatCurrency(data.faturamentoMesAtual || 0)}</span>
              <span>Meta: {formatCurrency(data.metaFaturamento || 0)}</span>
            </div>
          </div>

          {/* Progress Card 2: Positivação de Clientes */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700">Positivação da Carteira</span>
              <span className="text-teal-600 font-bold">
                {Math.min(100, Math.round((data.clientesAtivos / (data.metaPositivacaoClientes || 1)) * 100))}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((data.clientesAtivos / (data.metaPositivacaoClientes || 1)) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Ativos: {data.clientesAtivos} clientes</span>
              <span>Meta: {data.metaPositivacaoClientes || 0} clientes</span>
            </div>
          </div>

          {/* Progress Card 3: Reativação de Inativos */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700">Meta Reativação de Inativos</span>
              <span className="text-amber-600 font-bold">
                {data.clientesInativos > 0 ? '50%' : '100%'}
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: '50%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Inativos Atuais: {data.clientesInativos}</span>
              <span>Meta Recuperação: {data.metaReativacaoInativos || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Consolidados */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Faturamento Geral</span>
            <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate" title={formatCurrency(data.faturamentoTotal)}>
            {formatCurrency(data.faturamentoTotal)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Total faturado consolidado</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Clientes Ativos</span>
            <UsersIcon className="h-5 w-5 text-teal-600" />
          </div>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate" title={String(data.clientesAtivos)}>
            {data.clientesAtivos}
          </p>
          <p className="mt-1 text-xs text-slate-500">Clientes ativos cadastrados</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Clientes Inativos</span>
            <UsersIcon className="h-5 w-5 text-amber-600" />
          </div>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate" title={String(data.clientesInativos)}>
            {data.clientesInativos}
          </p>
          <p className="mt-1 text-xs text-slate-500">Total inativos na carteira geral</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Alertas Ativos</span>
            <ShieldWarningIcon className="h-5 w-5 text-rose-600" />
          </div>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate" title={String(data.alertasPendentes)}>
            {data.alertasPendentes}
          </p>
          <p className="mt-1 text-xs text-slate-500">Total de pendências comerciais</p>
        </div>

      </div>

      {/* Mapa Vetorial do Brasil Interativo por UFs */}
      <MapaBrasilSvg
        regioes={regioes}
        clientes={clientes}
        representantes={representantes}
        pedidos={pedidos}
        clientesPrioritarios={prioritarios}
        regioesCriticas={data.regioesCriticas}
      />

      {/* Layout Grid Secundário */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">

        {/* Lado Esquerdo */}
        <div className="space-y-8">

          {/* Lista de Clientes Críticos (Prioridades Gerais) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Lista de clientes críticos</h2>
              <p className="text-xs text-slate-500">Clientes com pontuação de inatividade severa no sistema</p>
            </div>

            <div className="mt-6 space-y-4">
              {prioritarios.slice(0, 3).map((cliente) => (
                <Link
                  key={cliente.id}
                  to={`/clientes/${cliente.id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-emerald-100 hover:bg-slate-50 group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-base ${cliente.score >= 80 ? 'text-rose-500' : 'text-amber-500'
                      }`}>
                      ●
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{cliente.nome}</p>
                      <p className="text-xs text-slate-500">{cliente.diasSemCompra} dias sem comprar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    Ver Detalhes
                    <ArrowRightIcon className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Gráfico de Vendas Consolidado */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Gráfico de vendas consolidado</h2>
              <p className="text-xs text-slate-500">Faturamento geral faturado mensal</p>
            </div>

            <div className="h-[220px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                  accessibilityLayer
                  data={vendasUltimosMeses}
                  margin={{
                    left: 12,
                    right: 10,
                    top: 10,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorValorGestor" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(value) => `R$ ${(value / 1000000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} Mi`}
                    className="text-slate-400 font-semibold"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" labelFormatter={(value) => `Mês: ${value}`} />}
                  />
                  <Area
                    dataKey="valor"
                    type="monotone"
                    fill="url(#colorValorGestor)"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  {data.metaFaturamento && data.metaFaturamento > 0 && (
                    <ReferenceLine
                      y={data.metaFaturamento}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      label={{
                        value: `Meta: R$ ${(data.metaFaturamento / 1000000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Mi`,
                        position: 'top',
                        fill: '#047857',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

        </div>

        {/* Lado Direito */}
        <div className="space-y-8">

          {/* Regiões Críticas */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-start gap-2 border-b border-slate-100 pb-4">
              <MapPinIcon className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Regiões Críticas</h2>
                <p className="text-xs text-slate-500">Regiões com taxas elevadas de queda de recompra</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {(data?.regioesCriticas || []).map((regiao, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-800">{regiao}</span>
                </div>
              ))}
              {!data?.regioesCriticas?.length && (
                <p className="text-xs text-slate-500 text-center py-6">Sem regiões críticas registradas.</p>
              )}
            </div>
          </div>

          {/* Ranking de Representantes */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-start gap-2 border-b border-slate-100 pb-4">
              <UserIcon className="h-5 w-5 text-teal-600 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Ranking de Representantes</h2>
                <p className="text-xs text-slate-500">Total de faturamento consolidado faturado</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-150 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-150 text-slate-500 font-semibold">
                    <th className="p-3">Representante</th>
                    <th className="p-3 text-right">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingRepresentantes.slice(0, 4).map((rep, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-800">
                        {idx + 1}. {rep.nome}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-700">
                        {formatCurrency(rep.faturamento)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
