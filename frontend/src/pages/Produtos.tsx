import { useEffect, useMemo, useState } from 'react'
import { fetchProdutos, fetchProdutosCriticos } from '../services/produtoService'
import { fetchPedidos } from '../services/pedidoService'
import { fetchClientesPrioritarios } from '../services/clienteService'
import { fetchPedidoItensByProduto } from '../services/pedidoItemService'
import type { ProdutoResponse, PedidoResponse, ClientePrioritarioDto, PedidoItemResponse } from '../types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MagnifyingGlassIcon,
  TrendUpIcon,
  UsersIcon,
  UserIcon,
  ClockIcon,
} from '@phosphor-icons/react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([])
  const [produtosCriticos, setProdutosCriticos] = useState<ProdutoResponse[]>([])
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [clientesPrioritarios, setClientesPrioritarios] = useState<ClientePrioritarioDto[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('ALL')

  // Product Detail Modal State
  const [selectedProduto, setSelectedProduto] = useState<ProdutoResponse | null>(null)
  const [selectedProdutoItens, setSelectedProdutoItens] = useState<PedidoItemResponse[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [todos, criticos, todosPedidos, todosClientes] = await Promise.all([
          fetchProdutos(),
          fetchProdutosCriticos(),
          fetchPedidos(),
          fetchClientesPrioritarios(),
        ])
        setProdutos(todos)
        setProdutosCriticos(criticos)
        setPedidos(todosPedidos)
        setClientesPrioritarios(todosClientes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Load details on selected product change
  useEffect(() => {
    if (!selectedProduto) {
      setSelectedProdutoItens([])
      return
    }

    const produtoId = selectedProduto.id

    async function loadDetails() {
      setLoadingDetails(true)
      try {
        const itens = await fetchPedidoItensByProduto(produtoId)
        setSelectedProdutoItens(itens)
      } catch (err) {
        console.error('Erro ao carregar detalhes do produto:', err)
      } finally {
        setLoadingDetails(false)
      }
    }

    loadDetails()
  }, [selectedProduto])

  // KPIs Calculations
  const totalProdutos = produtos.length
  const totalCriticos = produtosCriticos.length
  const ativosEstimados = Math.max(totalProdutos - totalCriticos, 0)

  const totalFaturamento = useMemo(() => {
    return produtos.reduce((sum, p) => sum + p.faturamento, 0)
  }, [produtos])

  const ticketMedio = useMemo(() => {
    return totalProdutos > 0 ? totalFaturamento / totalProdutos : 0
  }, [totalProdutos, totalFaturamento])

  const produtoCampeao = useMemo(() => {
    if (!produtos.length) return null
    return [...produtos].sort((a, b) => b.faturamento - a.faturamento)[0]
  }, [produtos])

  const produtoMaiorRiscoChurn = useMemo(() => {
    if (!produtosCriticos.length) return null
    return [...produtosCriticos].sort((a, b) => b.faturamento - a.faturamento)[0]
  }, [produtosCriticos])

  // Set of critical product IDs for quick check
  const criticosIds = useMemo(() => {
    return new Set(produtosCriticos.map((p) => p.id))
  }, [produtosCriticos])

  // Filters logic
  const filteredProdutos = useMemo(() => {
    let result = [...produtos]

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (p) =>
          p.descricao.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term))
      )
    }

    if (filterType === 'CRITICOS') {
      result = result.filter((p) => criticosIds.has(p.id))
    } else if (filterType === 'TOP_SELLERS') {
      result = [...produtos]
        .sort((a, b) => b.faturamento - a.faturamento)
        .slice(0, 10)
    }

    return result
  }, [produtos, criticosIds, searchTerm, filterType])

  // Donut Chart Data (Top 5 share of revenue)
  const donutData = useMemo(() => {
    if (!produtos.length) return []
    const sorted = [...produtos].sort((a, b) => b.faturamento - a.faturamento)
    const top5 = sorted.slice(0, 5)
    const top5Sum = top5.reduce((sum, p) => sum + p.faturamento, 0)
    const outrosSum = Math.max(0, totalFaturamento - top5Sum)

    const colors = ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899']
    const data = top5.map((p, idx) => ({
      name: p.descricao,
      value: p.faturamento,
      fill: colors[idx] || '#64748b',
    }))

    if (outrosSum > 0) {
      data.push({
        name: 'Outros',
        value: outrosSum,
        fill: '#94a3b8',
      })
    }
    return data
  }, [produtos, totalFaturamento])

  // Bar Chart Data (Criticidade)
  const criticidadeData = useMemo(() => {
    let criticalSum = 0
    let healthySum = 0

    produtos.forEach((p) => {
      if (criticosIds.has(p.id)) {
        criticalSum += p.faturamento
      } else {
        healthySum += p.faturamento
      }
    })

    return [
      { name: 'Saudáveis', faturamento: healthySum, fill: '#10b981' },
      { name: 'Críticos', faturamento: criticalSum, fill: '#f43f5e' },
    ]
  }, [produtos, criticosIds])

  // Dynamic Product details joins
  const historyData = useMemo(() => {
    if (!selectedProduto || !selectedProdutoItens.length || !pedidos.length) return []

    const groups: Record<string, { label: string; total: number }> = {}

    selectedProdutoItens.forEach(item => {
      const order = pedidos.find(p => p.id === item.pedidoId)
      if (order && order.dataEmissao) {
        const yearMonth = order.dataEmissao.substring(0, 7) // YYYY-MM
        const [year, month] = yearMonth.split('-').map(Number)
        const date = new Date(year, month - 1, 1)

        if (!groups[yearMonth]) {
          const monthName = date.toLocaleString('pt-BR', { month: 'short' })
          const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).replace('.', '')
          const label = `${formattedMonth}/${String(year).substring(2)}`
          groups[yearMonth] = { label, total: 0 }
        }
        groups[yearMonth].total += Number(item.subTotal)
      }
    })

    return Object.keys(groups)
      .sort()
      .map(ym => ({
        mes: groups[ym].label,
        valor: groups[ym].total
      }))
  }, [selectedProduto, selectedProdutoItens, pedidos])

  const productClients = useMemo(() => {
    if (!selectedProduto || !selectedProdutoItens.length || !pedidos.length) return []

    const clientLastPurchase: Record<number, { nome: string; data: string; totalGasto: number }> = {}

    selectedProdutoItens.forEach(item => {
      const order = pedidos.find(p => p.id === item.pedidoId)
      if (order && order.clienteId) {
        const current = clientLastPurchase[order.clienteId]
        const orderDate = order.dataEmissao

        if (!current || orderDate > current.data) {
          clientLastPurchase[order.clienteId] = {
            nome: order.clienteNome || `Cliente #${order.clienteId}`,
            data: orderDate,
            totalGasto: (current?.totalGasto || 0) + Number(item.subTotal)
          }
        } else {
          current.totalGasto += Number(item.subTotal)
        }
      }
    })

    const hoje = new Date()

    return Object.entries(clientLastPurchase).map(([id, info]) => {
      const lastDate = new Date(info.data)
      const diffTime = Math.abs(hoje.getTime() - lastDate.getTime())
      const diasSemCompra = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return {
        id: Number(id),
        nome: info.nome,
        diasSemCompra,
        totalGasto: info.totalGasto,
        ultimaCompra: info.data
      }
    }).sort((a, b) => b.diasSemCompra - a.diasSemCompra)
  }, [selectedProduto, selectedProdutoItens, pedidos])

  const productRepresentatives = useMemo(() => {
    if (!selectedProduto || !selectedProdutoItens.length || !pedidos.length) return []

    const repSales: Record<number, { nome: string; totalVendido: number; quantidade: number }> = {}

    selectedProdutoItens.forEach(item => {
      const order = pedidos.find(p => p.id === item.pedidoId)
      if (order && order.representanteId) {
        const current = repSales[order.representanteId]
        if (!current) {
          repSales[order.representanteId] = {
            nome: order.representanteNome || `Representante #${order.representanteId}`,
            totalVendido: Number(item.subTotal),
            quantidade: item.quantidade
          }
        } else {
          current.totalVendido += Number(item.subTotal)
          current.quantidade += item.quantidade
        }
      }
    })

    return Object.entries(repSales).map(([id, info]) => ({
      id: Number(id),
      nome: info.nome,
      totalVendido: info.totalVendido,
      quantidade: info.quantidade
    })).sort((a, b) => b.totalVendido - a.totalVendido)
  }, [selectedProduto, selectedProdutoItens, pedidos])

  const formatSku = (sku: string) => sku || '-'
  const formatCurrency = (value: number) =>
    (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const filterOptions = [
    { value: 'ALL', label: 'Todos os Produtos' },
    { value: 'CRITICOS', label: 'Apenas Críticos' },
    { value: 'TOP_SELLERS', label: 'Mais Vendidos (Top Sellers)' },
  ]

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-8">
      {/* Top Title Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight m-0">Produtos</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Visão geral do catálogo, críticos e métricas de desempenho de vendas.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Total Products */}
        <Card className="border border-slate-200 bg-white p-6 shadow-xs flex items-start justify-between relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-slate-400">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Produtos cadastrados</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{totalProdutos}</p>
            <p className="mt-1 text-xs text-slate-400 font-semibold">
              {totalCriticos} críticos / {ativosEstimados} saudáveis
            </p>
          </div>
        </Card>

        {/* KPI 2: Ticket Médio */}
        <Card className="border border-slate-200 bg-white p-6 shadow-xs flex items-start justify-between relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-sky-500">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Ticket Médio por Produto</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{formatCurrency(ticketMedio)}</p>
            <p className="mt-1 text-xs text-slate-400 font-semibold">Faturamento médio geral</p>
          </div>
        </Card>

        {/* KPI 3: Produto Campeão */}
        <Card className="border border-slate-200 bg-white p-6 shadow-xs flex items-start justify-between relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-emerald-500">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Produto Campeão</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight truncate">
              {produtoCampeao ? formatCurrency(produtoCampeao.faturamento) : formatCurrency(0)}
            </p>
            <p className="mt-1 text-xs text-slate-400 font-semibold line-clamp-2">
              {produtoCampeao ? produtoCampeao.descricao : 'Nenhum item'}
            </p>
          </div>
        </Card>

        {/* KPI 4: Maior Churn Risk */}
        <Card className="border border-slate-200 border-l-4 border-l-rose-500 bg-white p-6 shadow-xs transition-all hover:shadow-md">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Maior Risco de Churn
            </p>

            <p className="mt-2 truncate text-3xl font-bold tracking-tight text-slate-900">
              {produtoMaiorRiscoChurn
                ? formatCurrency(produtoMaiorRiscoChurn.faturamento)
                : formatCurrency(0)}
            </p>

            <p className="mt-1 text-slate-400 line-clamp-2 text-xs font-semibold">
              {produtoMaiorRiscoChurn?.descricao ?? "Sem risco crítico"}
            </p>
          </div>
        </Card>
      </div>

      {/* Visualizações Premium - Performance Graphs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut Chart: Share de Faturamento */}
        <Card className="border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-bold text-slate-900">Share de Faturamento (Top 5)</CardTitle>
            <CardDescription className="text-xs text-slate-500">Participação dos principais produtos no faturamento geral</CardDescription>
          </CardHeader>
          <CardContent className="p-0 grid md:grid-cols-[1fr_1.2fr] gap-6 items-center">
            {produtos.length > 0 ? (
              <>
                <div className="relative mx-auto aspect-square w-full max-h-[170px]">
                  <ChartContainer config={{}} className="h-full w-full">
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={75}
                        strokeWidth={2}
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>

                <div className="flex flex-col justify-center gap-2.5">
                  {donutData.map((item, idx) => {
                    const percentage = totalFaturamento > 0 ? ((item.value / totalFaturamento) * 100).toFixed(1) : '0.0';
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="truncate text-slate-600 max-w-[130px]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-900">{formatCurrency(item.value)}</span>
                          <span className="text-slate-400 w-10 text-right">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <p className="col-span-2 text-sm text-slate-500 text-center py-10">Carregando dados do gráfico...</p>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart: Criticidade */}
        <Card className="border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-bold text-slate-900">Criticidade por Faturamento</CardTitle>
            <CardDescription className="text-xs text-slate-500">Comparação do faturamento dos produtos saudáveis versus críticos</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {produtos.length > 0 ? (
              <ChartContainer config={{}} className="h-[170px] w-full">
                <BarChart data={criticidadeData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-100" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-slate-500 font-bold"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `R$ ${Math.round(val / 1000)}k`}
                    className="text-slate-400 font-semibold"
                  />
                  <ChartTooltip
                    cursor={{ fill: 'transparent' }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="faturamento" radius={[8, 8, 0, 0]}>
                    {criticidadeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-slate-500 text-center py-10">Carregando dados do gráfico...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Catalog View with Filters and Search */}
      <div className="space-y-4">
        {/* Dynamic Search & Filters Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </span>
            <Input
              type="text"
              placeholder="Buscar produto por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl border-slate-200 bg-white"
            />
          </div>

          <Select value={filterType} onValueChange={(val) => setFilterType(val || 'ALL')} items={filterOptions}>
            <SelectTrigger className="w-full sm:w-[220px] rounded-2xl bg-white border-slate-200 text-slate-700 font-bold h-9 px-4">
              <SelectValue placeholder="Todos os Produtos" />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent className="rounded-2xl border border-slate-100 bg-white shadow-lg p-1 text-slate-700 font-semibold">
                {filterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </div>

        {/* Catalog Table */}
        {loading ? (
          <p className="text-slate-600 font-medium py-4">Carregando produtos...</p>
        ) : error ? (
          <p className="text-rose-600 font-medium py-4">{error}</p>
        ) : filteredProdutos.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white animate-in fade-in duration-300">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/75 hover:bg-slate-50/75 font-semibold">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => {
                  const isCritico = criticosIds.has(produto.id)
                  return (
                    <TableRow
                      key={produto.id}
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedProduto(produto)}
                    >
                      <TableCell className="font-semibold text-slate-400">{produto.id}</TableCell>
                      <TableCell className="font-mono text-xs">{formatSku(produto.sku)}</TableCell>
                      <TableCell className="font-medium text-slate-900">{produto.descricao}</TableCell>
                      <TableCell>
                        <Badge
                          variant={isCritico ? 'destructive' : 'secondary'}
                          className={
                            isCritico
                              ? 'bg-rose-50 rounded-full border border-rose-200 font-bold text-rose-700'
                              : 'bg-emerald-50 rounded-full border border-emerald-200 font-bold text-emerald-700'
                          }
                        >
                          {isCritico ? 'Crítico' : 'Saudável'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-950">
                        {formatCurrency(produto.faturamento)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-slate-500 py-6 text-center border border-dashed border-slate-200 rounded-2xl font-medium bg-slate-50">
            Nenhum produto encontrado correspondente ao filtro.
          </p>
        )}
      </div>

      {/* Interactive Detail Dialog */}
      <Dialog open={selectedProduto !== null} onOpenChange={(open) => { if (!open) setSelectedProduto(null) }}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-3xl rounded-3xl p-8 bg-white max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200/80">
            {selectedProduto && (
              <>
                <DialogHeader className="border-b border-slate-100 pb-4">
                  <div className="flex items-start justify-between min-w-0">
                    <div className="min-w-0 flex-1">
                      <DialogTitle className="text-2xl font-bold text-slate-900 truncate">
                        {selectedProduto.descricao}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-slate-500 mt-1 font-semibold">
                        SKU: {formatSku(selectedProduto.sku)} | ID: {selectedProduto.id} | Faturamento Total: {formatCurrency(selectedProduto.faturamento)}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {loadingDetails ? (
                  <div className="py-12 text-center text-slate-500 font-medium">
                    Carregando detalhes do produto...
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    {/* Sales History Chart */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendUpIcon className="h-5 w-5 text-emerald-600" />
                        Histórico de Vendas Mensal
                      </h3>
                      {historyData.length > 0 ? (
                        <div className="h-[180px] w-full">
                          <ChartContainer config={{ valor: { label: 'Faturamento', color: '#0ea5e9' } }} className="h-full w-full">
                            <AreaChart data={historyData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorSalesHist" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200" />
                              <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} className="text-slate-500 font-bold" />
                              <YAxis hide tickLine={false} axisLine={false} />
                              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelFormatter={(val) => `Período: ${val}`} />} />
                              <Area dataKey="valor" type="monotone" fill="url(#colorSalesHist)" stroke="#0ea5e9" strokeWidth={2} />
                            </AreaChart>
                          </ChartContainer>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 py-6 text-center bg-white rounded-xl border border-dashed border-slate-200">
                          Nenhum faturamento registrado para este produto.
                        </p>
                      )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Priority Clients List */}
                      <div className="rounded-2xl border border-slate-100 p-5 bg-white shadow-2xs flex flex-col min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-50 pb-2">
                          <UsersIcon className="h-5 w-5 text-indigo-600" />
                          Clientes Prioritários (Recompra)
                        </h3>
                        {productClients.length > 0 ? (
                          <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1">
                            {productClients.map((c) => {
                              const isGlobalCritico = clientesPrioritarios.some(cp => cp.id === c.id);
                              return (
                                <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50/75 transition-colors">
                                  <div className="min-w-0 flex-1 pr-2">
                                    <p className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                                      {c.nome}
                                      {isGlobalCritico && (
                                        <Badge variant="destructive" className="h-4 text-[9px] px-1 font-bold bg-rose-50 border border-rose-100 text-rose-700">CRÍTICO</Badge>
                                      )}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                      Última compra: {new Date(c.ultimaCompra).toLocaleDateString('pt-BR')}
                                    </p>
                                    <p className="text-xs text-indigo-600 font-bold mt-0.5">
                                      Gasto total no item: {formatCurrency(c.totalGasto)}
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm font-extrabold text-slate-800 flex items-center justify-end gap-1">
                                      <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                                      {c.diasSemCompra}d
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">inativo</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            Nenhum cliente comprou este produto.
                          </p>
                        )}
                      </div>

                      {/* Top Selling Representatives */}
                      <div className="rounded-2xl border border-slate-100 p-5 bg-white shadow-2xs flex flex-col min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-50 pb-2">
                          <UserIcon className="h-5 w-5 text-emerald-600" />
                          Top Representantes
                        </h3>
                        {productRepresentatives.length > 0 ? (
                          <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1">
                            {productRepresentatives.map((r, index) => (
                              <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50/75 transition-colors">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-extrabold text-emerald-600">
                                    #{index + 1}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 text-sm truncate">{r.nome}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                      Vendas: {r.quantidade} u
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-extrabold text-slate-800">{formatCurrency(r.totalVendido)}</p>
                                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">faturado</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            Nenhuma venda registrada por representantes.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="border-t border-slate-100 pt-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedProduto(null)}
                    className="rounded-2xl border border-slate-200 px-6 font-semibold shadow-xs"
                  >
                    Fechar Detalhes
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}