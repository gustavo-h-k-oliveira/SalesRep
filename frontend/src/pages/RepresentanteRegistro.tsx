import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom'
import { isGestor } from '../services/authService'
import { fetchRepresentanteById, fetchRepresentanteClientes } from '../services/representanteService'
import { fetchEstados } from '../services/estadoService'
import { createCliente } from '../services/clienteService'
import { createPedido } from '../services/pedidoService'
import type { RepresentanteResponse, ClienteResponse, EstadoResponse } from '../types/api'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeftIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  MapPinIcon,
  UserIcon,
  ShieldCheckIcon,
  CalendarBlankIcon,
  CurrencyDollarIcon,
  BuildingsIcon,
} from '@phosphor-icons/react'

export default function RepresentanteRegistroPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const repId = id ? parseInt(id, 10) : null
  const gestor = isGestor()

  // Redireciona se não for GESTOR ou se ID for inválido
  if (!gestor) {
    return <Navigate to="/dashboard" replace />
  }

  // Tipo ativo: 'cliente' ou 'pedido'
  const initialType = searchParams.get('tipo') === 'pedido' ? 'pedido' : 'cliente'
  const [activeTab, setActiveTab] = useState<'cliente' | 'pedido'>(initialType)

  // Dados do representante e auxiliares
  const [rep, setRep] = useState<RepresentanteResponse | null>(null)
  const [clientes, setClientes] = useState<ClienteResponse[]>([])
  const [estados, setEstados] = useState<EstadoResponse[]>([])
  const [loading, setLoading] = useState(true)

  // Estados de envio e feedback
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Form Cliente
  const [clienteNome, setClienteNome] = useState('')
  const [clienteEstadoId, setClienteEstadoId] = useState<string>('')
  const [clienteUltimaCompra, setClienteUltimaCompra] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [clienteStatus, setClienteStatus] = useState('ATIVO')

  // Form Pedido
  const [pedidoClienteId, setPedidoClienteId] = useState<string>('')
  const [pedidoDataEmissao, setPedidoDataEmissao] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [pedidoDataFaturamento, setPedidoDataFaturamento] = useState('')
  const [pedidoValorTotal, setPedidoValorTotal] = useState('')
  const [pedidoStatus, setPedidoStatus] = useState('EMITIDO')
  const [pedidoAutorizacao, setPedidoAutorizacao] = useState('AUTORIZADO')

  // Carrega dados iniciais
  useEffect(() => {
    if (!repId) return

    async function loadInitialData() {
      try {
        const [repData, clientesData, estadosData] = await Promise.all([
          fetchRepresentanteById(repId as number),
          fetchRepresentanteClientes(repId as number),
          fetchEstados(),
        ])

        setRep(repData)
        setClientes(clientesData)
        setEstados(estadosData)

        // Pré-seleciona o estado do representante para o novo cliente
        if (repData && repData.estadoId) {
          setClienteEstadoId(String(repData.estadoId))
        } else if (estadosData.length > 0) {
          setClienteEstadoId(String(estadosData[0].id))
        }

        // Se houver clientes, pré-seleciona o primeiro cliente para o pedido
        if (clientesData.length > 0) {
          setPedidoClienteId(String(clientesData[0].id))
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Não foi possível carregar as informações do representante.')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [repId])

  // Validação Form Cliente
  const validateCliente = (): boolean => {
    const errors: Record<string, string> = {}
    if (!clienteNome.trim() || clienteNome.trim().length < 3) {
      errors.nome = 'O nome do cliente deve ter pelo menos 3 caracteres.'
    }

    if (!clienteEstadoId) {
      errors.estadoId = 'Selecione um estado de atuação.'
    }

    if (!clienteUltimaCompra) {
      errors.ultimaCompra = 'Informe a data da última compra.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validação Form Pedido
  const validatePedido = (): boolean => {
    const errors: Record<string, string> = {}
    if (!pedidoClienteId) {
      errors.clienteId = 'Selecione um cliente para vincular ao pedido.'
    }

    if (!pedidoDataEmissao) {
      errors.dataEmissao = 'Informe a data de emissão.'
    }

    const valor = parseFloat(pedidoValorTotal.replace(',', '.'))
    if (isNaN(valor) || valor <= 0) {
      errors.valorTotal = 'Informe um valor total válido maior que zero.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submissão Cliente
  const handleSubmitCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateCliente() || !repId) return

    setSubmitting(true)
    try {
      const selectedEstado = estados.find((est) => String(est.id) === clienteEstadoId)
      await createCliente({
        nome: clienteNome.trim(),
        estadoId: Number(clienteEstadoId),
        regiaoId: selectedEstado?.regiaoId,
        representanteId: repId,
        ultimaCompra: clienteUltimaCompra,
        status: clienteStatus,
      })

      setSuccess('Cliente cadastrado com sucesso!')
      setTimeout(() => {
        navigate(`/representantes/${repId}`)
      }, 1200)
    } catch (err) {
      console.error('Erro ao criar cliente:', err)
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar cliente.')
    } finally {
      setSubmitting(false)
    }
  }

  // Submissão Pedido
  const handleSubmitPedido = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validatePedido() || !repId) return

    setSubmitting(true)
    try {
      const valor = parseFloat(pedidoValorTotal.replace(',', '.'))
      await createPedido({
        clienteId: Number(pedidoClienteId),
        representanteId: repId,
        dataEmissao: pedidoDataEmissao,
        dataFaturamento: pedidoDataFaturamento.trim() || null,
        valorTotal: valor,
        status: pedidoStatus,
        autorizacaoComercial: pedidoAutorizacao,
      })

      setSuccess('Pedido registrado com sucesso!')
      setTimeout(() => {
        navigate(`/representantes/${repId}`)
      }, 1200)
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      setError(err instanceof Error ? err.message : 'Erro ao registrar pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  const estadoSelectItems = useMemo(() => {
    return [
      { value: '', label: 'Selecione um estado...' },
      ...estados.map((e) => ({
        value: String(e.id),
        label: `${e.nome} (${e.uf})${e.regiaoNome ? ` — ${e.regiaoNome}` : ''}`,
      })),
    ]
  }, [estados])

  const clienteSelectItems = useMemo(() => {
    return [
      { value: '', label: 'Selecione um cliente...' },
      ...clientes.map((c) => ({
        value: String(c.id),
        label: `${c.nome} (ID: #${c.id})`,
      })),
    ]
  }, [clientes])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Carregando dados do representante...</p>
        </div>
      </div>
    )
  }

  if (!rep) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center max-w-md mx-auto mt-12 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Representante não encontrado</h2>
        <p className="mt-2 text-sm text-slate-600">O representante solicitado não existe ou foi removido.</p>
        <Link
          to="/representantes"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Voltar para equipe
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Botão Voltar e Cabeçalho */}
      <div className="flex flex-col gap-4">
        <div>
          <Link
            to={`/representantes/${rep.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors p-1 -ml-1 rounded-xl hover:bg-slate-200/60"
          >
            <ArrowLeftIcon className="h-4 w-4" weight="bold" />
            <span>Voltar para {rep.nome}</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cadastrar Novo Registro</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <ShieldCheckIcon className="h-3.5 w-3.5" weight="bold" />
                Acesso Gestor
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Vincule um novo cliente ou emita um pedido comercial para o representante <strong>{rep.nome}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-2xl shrink-0">
            <MapPinIcon className="h-4 w-4 text-emerald-600" />
            <span>{rep.regiaoNome}</span>
          </div>
        </div>
      </div>

      {/* Seletor de Tipo (Tabs Modernas) */}
      <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => {
            setActiveTab('cliente')
            setError(null)
            setFieldErrors({})
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'cliente'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <UserPlusIcon className="h-4 w-4" weight={activeTab === 'cliente' ? 'bold' : 'regular'} />
          <span>Cadastrar Novo Cliente</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('pedido')
            setError(null)
            setFieldErrors({})
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'pedido'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <ShoppingCartIcon className="h-4 w-4" weight={activeTab === 'pedido' ? 'bold' : 'regular'} />
          <span>Cadastrar Novo Pedido</span>
        </button>
      </div>

      {/* Banner de Feedback de Erro */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
          <WarningCircleIcon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="font-semibold text-rose-900">Erro na operação</p>
            <p className="mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Banner de Sucesso */}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 text-sm flex items-start gap-3 shadow-xs animate-in zoom-in-95 duration-200">
          <CheckCircleIcon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="font-semibold text-emerald-950">{success}</p>
            <p className="mt-0.5 text-emerald-700">Redirecionando para o perfil do representante...</p>
          </div>
        </div>
      )}

      {/* Card do Formulário */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* FORMULÁRIO DE CLIENTE */}
        {activeTab === 'cliente' && (
          <form onSubmit={handleSubmitCliente} className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Informações do Cliente</h2>
              <p className="text-xs text-slate-500">
                O cliente será inserido e vinculado diretamente à carteira de <strong>{rep.nome}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nome do Cliente */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Nome do Cliente / Razão Social <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <BuildingsIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Ex: Comercial Alimentos Nova Era Ltda"
                    value={clienteNome}
                    onChange={(e) => {
                      setClienteNome(e.target.value)
                      if (fieldErrors.nome) setFieldErrors((prev) => ({ ...prev, nome: '' }))
                    }}
                    disabled={submitting}
                    className={`pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors ${
                      fieldErrors.nome ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  />
                </div>
                {fieldErrors.nome && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.nome}
                  </p>
                )}
              </div>

              {/* Estado de Atuação */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Estado de Atuação <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={clienteEstadoId}
                  onValueChange={(val) => {
                    setClienteEstadoId(val || '')
                    if (fieldErrors.estadoId) setFieldErrors((prev) => ({ ...prev, estadoId: '' }))
                  }}
                  items={estadoSelectItems}
                  disabled={submitting}
                >
                  <SelectTrigger
                    className={`w-full h-10 rounded-xl bg-slate-50/50 border-slate-200 text-slate-700 font-medium px-3 focus:bg-white transition-colors ${
                      fieldErrors.estadoId ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPinIcon className="h-4 w-4 text-slate-400 shrink-0" />
                      <SelectValue placeholder="Selecione o Estado..." />
                    </div>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl p-1 text-slate-700 z-50">
                      {estados.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>
                          {e.nome} ({e.uf}){e.regiaoNome ? ` — ${e.regiaoNome}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {fieldErrors.estadoId && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.estadoId}
                  </p>
                )}
              </div>

              {/* Representante (Fixo) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Representante Vinculado</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    value={`${rep.nome} (ID: #${rep.id})`}
                    disabled
                    className="pl-9 h-10 rounded-xl border-slate-200 bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status Inicial do Cliente */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Status do Cliente <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={clienteStatus}
                  onValueChange={(val) => setClienteStatus(val || 'ATIVO')}
                  items={[
                    { value: 'ATIVO', label: 'ATIVO (Comprando regularmente)' },
                    { value: 'POTENCIAL', label: 'POTENCIAL (Prospect/Lead)' },
                    { value: 'RECUPERACAO', label: 'RECUPERAÇÃO (Em renegociação)' },
                    { value: 'INATIVO', label: 'INATIVO (Sem compras recentes)' },
                  ]}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50/50 border-slate-200 text-slate-700 font-medium px-3 focus:bg-white transition-colors">
                    <SelectValue placeholder="Selecione o Status..." />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl p-1 text-slate-700 z-50">
                      <SelectItem value="ATIVO">ATIVO (Comprando regularmente)</SelectItem>
                      <SelectItem value="POTENCIAL">POTENCIAL (Prospect/Lead)</SelectItem>
                      <SelectItem value="RECUPERACAO">RECUPERAÇÃO (Em renegociação)</SelectItem>
                      <SelectItem value="INATIVO">INATIVO (Sem compras recentes)</SelectItem>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </div>

              {/* Data da Última Compra */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Data da Última Compra <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <CalendarBlankIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="date"
                    value={clienteUltimaCompra}
                    onChange={(e) => {
                      setClienteUltimaCompra(e.target.value)
                      if (fieldErrors.ultimaCompra) setFieldErrors((prev) => ({ ...prev, ultimaCompra: '' }))
                    }}
                    disabled={submitting}
                    className={`pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors ${
                      fieldErrors.ultimaCompra ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  />
                </div>
                {fieldErrors.ultimaCompra && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.ultimaCompra}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">Usado para cálculo de recência e churn comercial.</p>
              </div>
            </div>

            {/* Botões do Formulário de Cliente */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-slate-100">
              <Link
                to={`/representantes/${rep.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting || Boolean(success)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="h-4 w-4" weight="bold" />
                    <span>Cadastrar Cliente</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* FORMULÁRIO DE PEDIDO */}
        {activeTab === 'pedido' && (
          <form onSubmit={handleSubmitPedido} className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Emissão de Novo Pedido</h2>
              <p className="text-xs text-slate-500">
                Registre uma nova transação comercial para o representante <strong>{rep.nome}</strong>.
              </p>
            </div>

            {/* Alerta se o representante não tem clientes */}
            {clientes.length === 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <WarningCircleIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <p className="font-semibold">Nenhum cliente disponível na carteira</p>
                    <p className="mt-0.5 text-xs text-amber-800">
                      Este representante ainda não possui clientes cadastrados para vincular ao pedido.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('cliente')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors shrink-0 self-start sm:self-auto"
                >
                  <UserPlusIcon className="h-3.5 w-3.5" />
                  <span>Cadastrar Cliente Primeiro</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Cliente */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Cliente da Carteira <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={pedidoClienteId}
                  onValueChange={(val) => {
                    setPedidoClienteId(val || '')
                    if (fieldErrors.clienteId) setFieldErrors((prev) => ({ ...prev, clienteId: '' }))
                  }}
                  items={clienteSelectItems}
                  disabled={submitting || clientes.length === 0}
                >
                  <SelectTrigger
                    className={`w-full h-10 rounded-xl bg-slate-50/50 border-slate-200 text-slate-700 font-medium px-3 focus:bg-white transition-colors ${
                      fieldErrors.clienteId ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BuildingsIcon className="h-4 w-4 text-slate-400 shrink-0" />
                      <SelectValue placeholder="Selecione o Cliente..." />
                    </div>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl p-1 text-slate-700 z-50">
                      {clientes.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.nome} (ID: #{c.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {fieldErrors.clienteId && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.clienteId}
                  </p>
                )}
              </div>

              {/* Valor Total do Pedido */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Valor Total (R$) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <CurrencyDollarIcon className="h-4 w-4 text-emerald-600" />
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={pedidoValorTotal}
                    onChange={(e) => {
                      setPedidoValorTotal(e.target.value)
                      if (fieldErrors.valorTotal) setFieldErrors((prev) => ({ ...prev, valorTotal: '' }))
                    }}
                    disabled={submitting}
                    className={`pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors ${
                      fieldErrors.valorTotal ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  />
                </div>
                {fieldErrors.valorTotal && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.valorTotal}
                  </p>
                )}
              </div>

              {/* Status do Pedido */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Status do Pedido <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={pedidoStatus}
                  onValueChange={(val) => setPedidoStatus(val || 'EMITIDO')}
                  items={[
                    { value: 'EMITIDO', label: 'EMITIDO' },
                    { value: 'FATURADO', label: 'FATURADO' },
                    { value: 'APROVADO', label: 'APROVADO' },
                    { value: 'PENDENTE', label: 'PENDENTE' },
                    { value: 'CANCELADO', label: 'CANCELADO' },
                  ]}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50/50 border-slate-200 text-slate-700 font-medium px-3 focus:bg-white transition-colors">
                    <SelectValue placeholder="Selecione o Status..." />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl p-1 text-slate-700 z-50">
                      <SelectItem value="EMITIDO">EMITIDO</SelectItem>
                      <SelectItem value="FATURADO">FATURADO</SelectItem>
                      <SelectItem value="APROVADO">APROVADO</SelectItem>
                      <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                      <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </div>

              {/* Data de Emissão */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Data de Emissão <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <CalendarBlankIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="date"
                    value={pedidoDataEmissao}
                    onChange={(e) => {
                      setPedidoDataEmissao(e.target.value)
                      if (fieldErrors.dataEmissao) setFieldErrors((prev) => ({ ...prev, dataEmissao: '' }))
                    }}
                    disabled={submitting}
                    className={`pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors ${
                      fieldErrors.dataEmissao ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  />
                </div>
                {fieldErrors.dataEmissao && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.dataEmissao}
                  </p>
                )}
              </div>

              {/* Data de Faturamento */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Data de Faturamento <span className="text-xs font-normal text-slate-400">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <CalendarBlankIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="date"
                    value={pedidoDataFaturamento}
                    onChange={(e) => setPedidoDataFaturamento(e.target.value)}
                    disabled={submitting}
                    className="pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Autorização Comercial */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Autorização Comercial <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={pedidoAutorizacao}
                  onValueChange={(val) => setPedidoAutorizacao(val || 'AUTORIZADO')}
                  items={[
                    { value: 'AUTORIZADO', label: 'AUTORIZADO (Liberado para faturamento)' },
                    { value: 'AVALIANDO', label: 'AVALIANDO (Em análise comercial)' },
                    { value: 'REJEITADO', label: 'REJEITADO (Recusado pela diretoria)' },
                  ]}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50/50 border-slate-200 text-slate-700 font-medium px-3 focus:bg-white transition-colors">
                    <SelectValue placeholder="Selecione a Autorização..." />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl p-1 text-slate-700 z-50">
                      <SelectItem value="AUTORIZADO">AUTORIZADO (Liberado para faturamento)</SelectItem>
                      <SelectItem value="AVALIANDO">AVALIANDO (Em análise comercial)</SelectItem>
                      <SelectItem value="REJEITADO">REJEITADO (Recusado pela diretoria)</SelectItem>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </div>
            </div>

            {/* Botões do Formulário de Pedido */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-slate-100">
              <Link
                to={`/representantes/${rep.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting || Boolean(success) || clientes.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-4 w-4" weight="bold" />
                    <span>Cadastrar Pedido</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
