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
  ArrowRightIcon,
  UserIcon,
  XIcon,
  CalendarBlankIcon,
} from '@phosphor-icons/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getMacrorregiao } from '../utils/regionUtils'

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
  const [selectedUfFilter, setSelectedUfFilter] = useState<string | null>(null)
  const [selectedMesFilter, setSelectedMesFilter] = useState<string>('ALL')
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

  // Extrair meses disponíveis dos pedidos
  const mesesDisponiveis = useMemo(() => {
    const mesesSet = new Set<string>()
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

      ; (pedidos || []).forEach((p) => {
        if (p && p.dataEmissao) {
          const d = new Date(p.dataEmissao)
          if (!isNaN(d.getTime())) {
            const ano = d.getFullYear()
            const mesNum = String(d.getMonth() + 1).padStart(2, '0')
            const key = `${ano}-${mesNum}`
            mesesSet.add(key)
          }
        }
      })

    return Array.from(mesesSet)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => {
        const [ano, mes] = key.split('-')
        const idx = parseInt(mes, 10) - 1
        return {
          key,
          label: `${nomesMeses[idx]} / ${ano}`,
        }
      })
  }, [pedidos])

  // 1. Filtragem dinâmica de coleções por Estado (UF)
  const regioesDoUf = useMemo(() => {
    if (!selectedUfFilter) return regioes
    return (regioes || []).filter(
      (r) =>
        r &&
        (r.uf === selectedUfFilter ||
          (r.nome && r.nome.toUpperCase() === selectedUfFilter))
    )
  }, [regioes, selectedUfFilter])

  const regiaoIdsDoUf = useMemo(() => new Set(regioesDoUf.map((r) => r.id)), [regioesDoUf])

  const baseClientes = useMemo(() => {
    return prioritarios && prioritarios.length > 0 ? (prioritarios as any[]) : clientes
  }, [prioritarios, clientes])

  const clientesFiltrados = useMemo(() => {
    if (!selectedUfFilter) return baseClientes
    return (baseClientes || []).filter((c) => {
      if (!c) return false
      if (c.regiaoId && regiaoIdsDoUf.has(c.regiaoId)) return true
      if (c.regiaoNome && c.regiaoNome.toUpperCase() === selectedUfFilter) return true
      return false
    })
  }, [baseClientes, selectedUfFilter, regiaoIdsDoUf])

  const representantesFiltrados = useMemo(() => {
    if (!selectedUfFilter) return representantes
    return (representantes || []).filter((r) => {
      if (!r) return false
      if (r.regiaoId && regiaoIdsDoUf.has(r.regiaoId)) return true
      if (r.regiaoNome && r.regiaoNome.toUpperCase() === selectedUfFilter) return true
      return false
    })
  }, [representantes, selectedUfFilter, regiaoIdsDoUf])

  const pedidosFiltrados = useMemo(() => {
    if (!selectedUfFilter) return pedidos
    return (pedidos || []).filter(
      (p) => p && clientesFiltrados.some((c) => c.id === p.clienteId)
    )
  }, [pedidos, selectedUfFilter, clientesFiltrados])

  const regiaoMacroFilter = useMemo(() => {
    return getMacrorregiao(selectedUfFilter)
  }, [selectedUfFilter])

  const pedidosFiltradosPorMes = useMemo(() => {
    let base = pedidosFiltrados || []
    if (selectedMesFilter !== 'ALL') {
      base = base.filter((p) => p && p.dataEmissao && p.dataEmissao.startsWith(selectedMesFilter))
    }
    return base
  }, [pedidosFiltrados, selectedMesFilter])

  const prioritariosFiltrados = useMemo(() => {
    if (!selectedUfFilter) return prioritarios
    return (prioritarios || []).filter((cp) => {
      if (!cp) return false
      if (cp.regiaoId && regiaoIdsDoUf.has(cp.regiaoId)) return true
      if (cp.regiaoNome && cp.regiaoNome.toUpperCase() === selectedUfFilter) return true
      return false
    })
  }, [prioritarios, selectedUfFilter, regiaoIdsDoUf])

  const faturamentoConsolidado = useMemo(() => {
    return (pedidosFiltradosPorMes || [])
      .filter((p) => p && p.status === 'FATURADO')
      .reduce((sum, p) => sum + (p.valorTotal || 0), 0)
  }, [pedidosFiltradosPorMes])

  const clienteIdsComCompraNoMes = useMemo(() => {
    if (selectedMesFilter === 'ALL') return null
    const ids = new Set<number>()
      ; (pedidos || []).forEach((p) => {
        if (
          p &&
          p.clienteId &&
          p.dataEmissao &&
          p.dataEmissao.startsWith(selectedMesFilter) &&
          p.status === 'FATURADO'
        ) {
          ids.add(p.clienteId)
        }
      })
    return ids
  }, [pedidos, selectedMesFilter])

  const clientesAtivosConsolidado = useMemo(() => {
    const list = clientesFiltrados || []
    if (selectedMesFilter === 'ALL') {
      if (!selectedUfFilter) return data.clientesAtivos
      return list.filter((c) => c && c.status === 'ATIVO').length
    }
    return list.filter((c) => {
      if (!c) return false
      return (
        (clienteIdsComCompraNoMes && clienteIdsComCompraNoMes.has(c.id)) ||
        (c.ultimaCompra && c.ultimaCompra.startsWith(selectedMesFilter))
      )
    }).length
  }, [data.clientesAtivos, selectedUfFilter, clientesFiltrados, selectedMesFilter, clienteIdsComCompraNoMes])

  const clientesInativosConsolidado = useMemo(() => {
    const list = clientesFiltrados || []
    if (selectedMesFilter === 'ALL') {
      if (!selectedUfFilter) return data.clientesInativos
      return list.filter((c) => c && c.status === 'INATIVO').length
    }
    const ativosCount = clientesAtivosConsolidado
    return Math.max(0, list.length - ativosCount)
  }, [data.clientesInativos, selectedUfFilter, clientesFiltrados, selectedMesFilter, clientesAtivosConsolidado])


  // 3. Gráfico de Vendas Consolidado (Últimos 4 meses)
  const vendasUltimosMeses = useMemo(() => {
    const faturados = (pedidosFiltrados || []).filter((p) => p && p.status === 'FATURADO')
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
  }, [pedidosFiltrados])

  // 4. Ranking de Representantes (Calculado com base em faturamento faturado de pedidos)
  const rankingRepresentantes = useMemo(() => {
    const faturados = (pedidosFiltrados || []).filter((p) => p && p.status === 'FATURADO')
    const faturamentoMap: { [key: string]: number } = {}

    faturados.forEach((p) => {
      if (p && p.representanteNome) {
        faturamentoMap[p.representanteNome] = (faturamentoMap[p.representanteNome] || 0) + (p.valorTotal || 0)
      }
    });

    (representantesFiltrados || []).forEach((rep) => {
      if (rep && faturamentoMap[rep.nome] === undefined) {
        faturamentoMap[rep.nome] = 0
      }
    });

    return Object.entries(faturamentoMap)
      .map(([nome, faturamento]) => ({ nome, faturamento }))
      .sort((a, b) => b.faturamento - a.faturamento)
  }, [pedidosFiltrados, representantesFiltrados])

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
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
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

          {/* Seletor de Mês de Referência */}
          {mesesDisponiveis.length > 0 && (
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 backdrop-blur-md border border-white/20">
              <CalendarBlankIcon className="h-5 w-5 text-emerald-200 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">Mês de Referência</span>
                <Select
                  value={selectedMesFilter}
                  onValueChange={(val) => setSelectedMesFilter(val ?? 'ALL')}
                >
                  <SelectTrigger className="h-6 border-none bg-transparent font-bold text-white text-xs shadow-none p-0 hover:bg-transparent focus:ring-0 [&_svg]:text-white">
                    <SelectValue placeholder="Selecione o mês">
                      {selectedMesFilter === 'ALL'
                        ? 'Todos os Meses'
                        : mesesDisponiveis.find((m) => m.key === selectedMesFilter)?.label || 'Todos os Meses'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 min-w-[210px] w-auto">
                      <SelectItem value="ALL">
                        Todos os Meses
                      </SelectItem>
                      {mesesDisponiveis.map((m) => (
                        <SelectItem
                          key={m.key}
                          value={m.key}
                        >
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner de Filtro Ativo por Estado (UF) e/ou Período */}
      {(selectedUfFilter || selectedMesFilter !== 'ALL') && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 shadow-lg border border-slate-700 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {selectedUfFilter && (
                <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-slate-950 shadow-xs">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  {selectedUfFilter}
                </span>
              )}
              {selectedMesFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 px-3 py-1 text-xs font-black text-slate-950 shadow-xs">
                  <CalendarBlankIcon className="h-3.5 w-3.5" />
                  {mesesDisponiveis.find((m) => m.key === selectedMesFilter)?.label || selectedMesFilter}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold">
                {selectedUfFilter && selectedMesFilter !== 'ALL'
                  ? `Filtro Ativo: Estado ${selectedUfFilter} & Mês ${mesesDisponiveis.find((m) => m.key === selectedMesFilter)?.label}`
                  : selectedUfFilter
                  ? `Filtro de Estado Ativo: ${selectedUfFilter}`
                  : `Filtro de Período Ativo: ${mesesDisponiveis.find((m) => m.key === selectedMesFilter)?.label}`}
              </p>
              <p className="text-xs text-slate-300">
                Os KPIs, faturamentos, gráficos e listagens do painel foram filtrados para o período e região selecionados.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedUfFilter(null)
              setSelectedMesFilter('ALL')
            }}
            className="flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-white/20 active:scale-95 transition-all self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <XIcon className="h-4 w-4" />
            Limpar {selectedUfFilter && selectedMesFilter !== 'ALL' ? 'Filtros' : 'Filtro'}
          </button>
        </div>
      )}



      {/* KPIs Consolidados */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">
              {selectedUfFilter ? `Faturamento (${selectedUfFilter})` : 'Faturamento Geral'}
            </span>
            <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate" title={formatCurrency(faturamentoConsolidado)}>
            {formatCurrency(faturamentoConsolidado)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {selectedUfFilter ? `Faturamento em ${selectedUfFilter}` : 'Total faturado consolidado'}
          </p>
        </div>

        <Link
          to={`/clientes?status=ATIVO${regiaoMacroFilter ? `&regiao=${encodeURIComponent(regiaoMacroFilter)}` : ''}`}
          className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300 group cursor-pointer block"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium group-hover:text-emerald-700 transition-colors">Clientes Ativos</span>
            <UsersIcon className="h-5 w-5 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate" title={String(clientesAtivosConsolidado)}>
            {clientesAtivosConsolidado}
          </p>
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
            {selectedUfFilter ? `Clientes ativos em ${selectedUfFilter}` : 'Clientes ativos cadastrados'}
            <ArrowRightIcon className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </Link>

        <Link
          to={`/clientes?status=INATIVO${regiaoMacroFilter ? `&regiao=${encodeURIComponent(regiaoMacroFilter)}` : ''}`}
          className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs hover:shadow-md hover:border-rose-200 transition-all duration-300 group cursor-pointer block"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium group-hover:text-rose-700 transition-colors">Clientes Inativos</span>
            <UsersIcon className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate" title={String(clientesInativosConsolidado)}>
            {clientesInativosConsolidado}
          </p>
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1 group-hover:text-rose-600 transition-colors">
            {selectedUfFilter ? `Clientes inativos em ${selectedUfFilter}` : 'Total inativos na carteira geral'}
            <ArrowRightIcon className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </Link>

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
        clientes={baseClientes as any}
        representantes={representantes}
        pedidos={pedidos}
        clientesPrioritarios={prioritarios}
        regioesCriticas={data.regioesCriticas}
        selectedUfFilter={selectedUfFilter}
        onSelectUf={setSelectedUfFilter}
        selectedMesFilter={selectedMesFilter}
        onSelectMes={setSelectedMesFilter}
        mesesDisponiveis={mesesDisponiveis}
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
              {prioritariosFiltrados.length > 0 ? (
                prioritariosFiltrados.slice(0, 3).map((cliente) => (
                  <Link
                    key={cliente.id}
                    to={`/clientes/${cliente.id}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-emerald-100 hover:bg-slate-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-base ${cliente.score >= 80 ? 'text-rose-500' : 'text-amber-500'}`}>
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
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  Nenhum cliente crítico registrado {selectedUfFilter ? `para a UF ${selectedUfFilter}` : ''}.
                </p>
              )}
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
