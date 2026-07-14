import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchClientePerfil, fetchRecomendacoesByCliente } from '../services/clienteService'
import { fetchPedidosByCliente } from '../services/pedidoService'
import { fetchProdutos } from '../services/produtoService'
import { fetchPedidoItensByPedido } from '../services/pedidoItemService'
import type { ClientePerfilDto, PedidoResponse, ProdutoRecomendadoDto, PedidoItemResponse, ProdutoResponse } from '../types/api'
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  HeartbeatIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon,
  PackageIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'

export default function ClientePerfilPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const clienteId = id ? parseInt(id, 10) : null

  const [perfil, setPerfil] = useState<ClientePerfilDto | null>(null)
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [produtos, setProdutos] = useState<ProdutoRecomendadoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visitaAgendada, setVisitaAgendada] = useState(false)

  // Estado para os itens do Accordion
  const [produtosList, setProdutosList] = useState<ProdutoResponse[]>([])
  const [itensPorPedido, setItensPorPedido] = useState<Record<number, PedidoItemResponse[]>>({})
  const [itensLoading, setItensLoading] = useState<Record<number, boolean>>({})
  const [expandedPedidoId, setExpandedPedidoId] = useState<string[]>([])

  useEffect(() => {
    if (!clienteId) {
      setError('ID do cliente inválido')
      setLoading(false)
      return
    }

    async function loadClienteData() {
      try {
        const [perfilData, pedidosData, recomendacoesData, produtosData] = await Promise.all([
          fetchClientePerfil(clienteId!),
          fetchPedidosByCliente(clienteId!),
          fetchRecomendacoesByCliente(clienteId!),
          fetchProdutos(),
        ])
        setPerfil(perfilData)
        setPedidos(pedidosData)
        setProdutos(recomendacoesData)
        setProdutosList(produtosData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do cliente')
      } finally {
        setLoading(false)
      }
    }

    loadClienteData()
  }, [clienteId])

  const produtosMap = useMemo(() => {
    const map: Record<number, ProdutoResponse> = {}
    produtosList.forEach((prod) => {
      map[prod.id] = prod
    })
    return map
  }, [produtosList])

  const handleAccordionChange = async (value: string[]) => {
    setExpandedPedidoId(value)
    if (value.length === 0) return

    const selectedValue = value[value.length - 1]
    const pedidoId = parseInt(selectedValue, 10)
    if (isNaN(pedidoId)) return

    if (!itensPorPedido[pedidoId]) {
      setItensLoading((prev) => ({ ...prev, [pedidoId]: true }))
      try {
        const itens = await fetchPedidoItensByPedido(pedidoId)
        setItensPorPedido((prev) => ({ ...prev, [pedidoId]: itens }))
      } catch (err) {
        console.error('Erro ao carregar itens do pedido:', err)
      } finally {
        setItensLoading((prev) => ({ ...prev, [pedidoId]: false }))
      }
    }
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleAgendarVisita = () => {
    setVisitaAgendada(true)
    setTimeout(() => setVisitaAgendada(false), 4000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Carregando perfil do cliente...</p>
        </div>
      </div>
    )
  }

  if (error || !perfil) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ArrowLeftIcon className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Erro ao Carregar Perfil</h2>
          <p className="mt-2 text-sm text-slate-600">{error || 'Cliente não encontrado.'}</p>
          <button
            onClick={() => navigate('/clientes')}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Voltar para Clientes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8">

        {/* Top bar & Back button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate('/clientes')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar para Carteira
          </button>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${perfil.status === 'ATIVO'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : perfil.status === 'INATIVO'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
            >
              {perfil.status === 'ATIVO' && 'Ativo'}
              {perfil.status === 'INATIVO' && 'Inativo'}
              {perfil.status === 'RECUPERACAO' && 'Em Recuperação'}
            </Badge>
          </div>
        </div>

        {/* Header com Detalhes Básicos */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{perfil.nome}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4 text-slate-400" />
                  <span>Região: <span className="font-medium text-slate-700">{perfil.regiao}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Representante: <span className="font-medium text-slate-700">{perfil.representante}</span></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleAgendarVisita}
                className={`relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 ${visitaAgendada
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                  }`}
              >
                {visitaAgendada ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4 animate-bounce" />
                    Visita Agendada!
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-4 w-4" />
                    Agendar Visita
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* KPIs do Cliente */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Faturamento Acumulado</span>
              <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                <CurrencyDollarIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{formatCurrency(perfil.faturamentoTotal)}</p>
            <p className="mt-1 text-xs text-slate-500">Total faturado histórico</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Ticket Médio</span>
              <div className="rounded-2xl bg-teal-50 p-2.5 text-teal-600">
                <TrendUpIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{formatCurrency(perfil.ticketMedio)}</p>
            <p className="mt-1 text-xs text-slate-500">Média por pedido</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Total Pedidos</span>
              <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-600">
                <ShoppingBagIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{perfil.totalPedidos}</p>
            <p className="mt-1 text-xs text-slate-500">Pedidos concluídos</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Dias Sem Comprar</span>
              <div className={`rounded-2xl p-2.5 ${perfil.diasSemCompra >= 45
                  ? 'bg-rose-50 text-rose-600'
                  : perfil.diasSemCompra >= 30
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                <HeartbeatIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{perfil.diasSemCompra} dias</p>
            <p className="mt-1 text-xs text-slate-500">Última em: {formatDate(perfil.ultimaCompra)}</p>
          </div>

        </div>

        {/* Layout Grid Secundário */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* Histórico de Pedidos */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Histórico de Pedidos</h2>
              <p className="text-xs text-slate-500">Todos os pedidos registrados para este cliente</p>
            </div>

            <div>
              {pedidos.length ? (
                <Accordion
                  value={expandedPedidoId}
                  onValueChange={handleAccordionChange}
                  className="space-y-3"
                >
                  {pedidos.map((pedido) => {
                    const items = itensPorPedido[pedido.id] || []
                    const isLoadingItems = itensLoading[pedido.id]

                    return (
                      <AccordionItem
                        key={pedido.id}
                        value={pedido.id.toString()}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-200 hover:border-slate-300"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50/50">
                          <div className="flex flex-1 flex-wrap items-center justify-between gap-4 pr-4">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-900">Pedido #{pedido.id}</span>
                              <Badge
                                variant="outline"
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${pedido.status === 'FATURADO'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                  }`}
                              >
                                {pedido.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <CalendarIcon className="h-4 w-4 text-slate-400" />
                                {formatDate(pedido.dataEmissao)}
                              </span>
                              <span className="font-semibold text-slate-900">
                                {formatCurrency(pedido.valorTotal)}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              <PackageIcon className="h-4 w-4 text-slate-400" />
                              Itens do Pedido
                            </div>
                            
                            {isLoadingItems ? (
                              <div className="flex items-center gap-2 py-4 justify-center text-sm text-slate-500">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                                Carregando itens...
                              </div>
                            ) : items.length ? (
                              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-50/75 hover:bg-slate-50/75 text-[11px] uppercase tracking-wider">
                                      <TableHead className="py-2.5 text-slate-500 font-semibold">Produto</TableHead>
                                      <TableHead className="py-2.5 text-center text-slate-500 font-semibold w-24">Qtd</TableHead>
                                      <TableHead className="py-2.5 text-right text-slate-500 font-semibold w-32">Preço Unit.</TableHead>
                                      <TableHead className="py-2.5 text-right text-slate-500 font-semibold w-32">Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {items.map((item) => {
                                      const prod = produtosMap[item.produtoId]
                                      return (
                                        <TableRow key={item.id} className="hover:bg-slate-50/30 text-xs border-b last:border-0 border-slate-100">
                                          <TableCell className="py-3 font-medium text-slate-900">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                                              <span className="font-semibold text-slate-800">{prod?.descricao || `Produto #${item.produtoId}`}</span>
                                              {prod?.sku && (
                                                <span className="w-fit rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 font-mono font-medium">
                                                  {prod.sku}
                                                </span>
                                              )}
                                            </div>
                                          </TableCell>
                                          <TableCell className="py-3 text-center text-slate-600">{item.quantidade}</TableCell>
                                          <TableCell className="py-3 text-right text-slate-600">{formatCurrency(item.precoUnitario)}</TableCell>
                                          <TableCell className="py-3 text-right font-semibold text-slate-900">{formatCurrency(item.subTotal)}</TableCell>
                                        </TableRow>
                                      )
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-sm text-slate-500">
                                Nenhum item encontrado neste pedido.
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              ) : (
                <div className="py-12 text-center text-sm text-slate-500">
                  Nenhum pedido registrado para este cliente.
                </div>
              )}
            </div>
          </div>

          {/* Produtos Sugeridos */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Mix Sugerido</h2>
              <p className="text-xs text-slate-500">Produtos recomendados para oferta na próxima visita</p>
            </div>

            <div className="space-y-3">
              {produtos.slice(0, 3).map((produto, index) => {
                const colors = [
                  { bg: 'bg-indigo-50 text-indigo-600' },
                  { bg: 'bg-teal-50 text-teal-600' },
                  { bg: 'bg-amber-50 text-amber-600' }
                ]
                const colorConfig = colors[index % colors.length]
                return (
                  <div key={produto.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 animate-fade-in">
                    <div className={`rounded-xl p-2 ${colorConfig.bg}`}>
                      <PackageIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{produto.descricao}</p>
                      <p className="text-xs text-slate-500">{produto.justificativa}</p>
                    </div>
                  </div>
                )
              })}
              {!produtos.length && (
                <div className="text-center py-6 text-xs text-slate-500">
                  Nenhum produto cadastrado no sistema.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center">
              <p className="text-xs text-slate-500">
                A oferta desse mix de produtos pode elevar o faturamento deste cliente em até <span className="font-semibold text-indigo-600">15%</span>.
              </p>
            </div>
          </div>

        </div>

      </div>
  )
}
