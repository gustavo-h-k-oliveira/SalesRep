import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchClientePerfil } from '../services/clienteService'
import { fetchPedidosByCliente } from '../services/pedidoService'
import { fetchProdutos } from '../services/produtoService'
import type { ClientePerfilDto, PedidoResponse, ProdutoResponse } from '../types/api'
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
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visitaAgendada, setVisitaAgendada] = useState(false)

  useEffect(() => {
    if (!clienteId) {
      setError('ID do cliente inválido')
      setLoading(false)
      return
    }

    async function loadClienteData() {
      try {
        const [perfilData, pedidosData, produtosData] = await Promise.all([
          fetchClientePerfil(clienteId!),
          fetchPedidosByCliente(clienteId!),
          fetchProdutos(),
        ])
        setPerfil(perfilData)
        setPedidos(pedidosData)
        setProdutos(produtosData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do cliente')
      } finally {
        setLoading(false)
      }
    }

    loadClienteData()
  }, [clienteId])

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
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">Histórico de Pedidos</h2>
              <p className="text-xs text-slate-500">Todos os pedidos registrados para este cliente</p>
            </div>

            <div className="mt-6">
              {pedidos.length ? (
                <div className="overflow-hidden rounded-2xl border border-slate-250 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
                        <TableHead>Pedido</TableHead>
                        <TableHead>Emissão</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidos.map((pedido) => (
                        <TableRow key={pedido.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-semibold text-slate-500">#{pedido.id}</TableCell>
                          <TableCell>{formatDate(pedido.dataEmissao)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${pedido.status === 'FATURADO'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-100'
                                }`}
                            >
                              {pedido.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900">
                            {formatCurrency(pedido.valorTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                  { bg: 'bg-indigo-50 text-indigo-600', desc: 'Queda de recompra na região' },
                  { bg: 'bg-teal-50 text-teal-600', desc: 'Item crítico no estoque do cliente' },
                  { bg: 'bg-amber-50 text-amber-600', desc: 'Sugerido para completar ticket médio' }
                ]
                const colorConfig = colors[index % colors.length]
                return (
                  <div key={produto.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 animate-fade-in">
                    <div className={`rounded-xl p-2 ${colorConfig.bg}`}>
                      <PackageIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{produto.descricao}</p>
                      <p className="text-xs text-slate-500">{colorConfig.desc}</p>
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
