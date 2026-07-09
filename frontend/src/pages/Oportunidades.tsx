import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isRepresentante } from '../services/authService'
import { fetchAlertas } from '../services/alertaService'
import type { AlertaDto } from '../types/api'
import {
  LightningIcon,
  UsersIcon,
  ShoppingBagIcon,
  MapPinIcon,
  ClockIcon,
  TrendUpIcon,
  InfoIcon,
  ChatTextIcon,
  CheckCircleIcon,
  CopyIcon,
  WhatsappLogoIcon,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function OportunidadesPage() {
  const representative = isRepresentante()
  if (!representative) {
    return <Navigate to="/alertas" replace />
  }

  const [oportunidades, setOportunidades] = useState<AlertaDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal State
  const [selectedOpt, setSelectedOpt] = useState<AlertaDto | null>(null)
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadOportunidades() {
      try {
        const data = await fetchAlertas()
        setOportunidades(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar oportunidades')
      } finally {
        setLoading(false)
      }
    }

    loadOportunidades()
  }, [])

  // KPI Metrics
  const total = oportunidades.length
  const clientesInativos = oportunidades.filter((o) => o.tipo === 'CLIENTE_INATIVO').length
  const baixaRecompra = oportunidades.filter((o) => o.tipo === 'PRODUTO_BAIXA_RECOMPRA').length
  const regioesCriticas = oportunidades.filter((o) => o.tipo === 'REGIAO_CRITICA').length

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  // Dynamic template generation based on opportunity type
  const getTemplateMessage = (opt: AlertaDto) => {
    if (opt.tipo === 'CLIENTE_INATIVO') {
      return `Olá ${opt.clienteNome || 'parceiro'}, tudo bem? Notamos que faz mais de 45 dias que não conversamos sobre novos pedidos. Temos condições exclusivas para reativação esta semana! Que tal dar uma olhada?`
    }
    if (opt.tipo === 'PRODUTO_BAIXA_RECOMPRA') {
      return `Olá ${opt.clienteNome || 'parceiro'}, gostaríamos de ouvir o seu feedback sobre as últimas compras. Temos promoções especiais para incentivar a recompra desse produto hoje. Vamos aproveitar?`
    }
    return `Olá ${opt.clienteNome || 'parceiro'}, identificamos novas oportunidades comerciais excelentes na sua região. Gostaria de agendar uma rápida conversa esta semana?`
  }

  const handleOpenContactModal = (opt: AlertaDto) => {
    setSelectedOpt(opt)
    setPhone('')
    setMessage(getTemplateMessage(opt))
  }

  const handleSendWhatsApp = () => {
    if (!message.trim()) return
    const cleanPhone = phone.replace(/\D/g, '')
    // Default fallback or wa.me redirect
    const url = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setSelectedOpt(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Painel de Oportunidades</h1>
            <p className="mt-2 text-sm text-slate-500">
              Transforme alertas comerciais em ações de vendas, reativação de clientes e novas receitas.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-sky-50 px-4 py-2 text-sky-700">
            <LightningIcon className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider">{total} Oportunidades Ativas</span>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-slate-500">Reativação de Clientes</CardDescription>
                <span className="rounded-full bg-amber-100 p-2 text-amber-700">
                  <UsersIcon className="h-5 w-5" />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{clientesInativos}</p>
              <p className="mt-1 text-xs text-slate-400">Clientes sem compra há +45 dias</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-slate-500">Estímulo de Recompra</CardDescription>
                <span className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <ShoppingBagIcon className="h-5 w-5" />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{baixaRecompra}</p>
              <p className="mt-1 text-xs text-slate-400">Baixo índice de recompra de SKUs</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-slate-500">Foco Regional</CardDescription>
                <span className="rounded-full bg-sky-100 p-2 text-sky-700">
                  <MapPinIcon className="h-5 w-5" />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{regioesCriticas}</p>
              <p className="mt-1 text-xs text-slate-400">Regiões com queda de faturamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Ações Comerciais Recomendadas</h2>
          <p className="mt-1 text-sm text-slate-500">Priorizadas e prontas para contato direto.</p>

          {loading ? (
            <div className="mt-6 flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-400"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Buscando as melhores oportunidades comerciais...</p>
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-rose-700 text-sm">
              {error}
            </div>
          ) : oportunidades.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {oportunidades.map((opt, index) => {
                // Style configurations based on opportunity type
                const styleConfig = {
                  CLIENTE_INATIVO: {
                    badge: 'Cliente Inativo',
                    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/50',
                    icon: <ClockIcon className="h-4 w-4 text-amber-600" />,
                  },
                  PRODUTO_BAIXA_RECOMPRA: {
                    badge: 'Baixa Recompra',
                    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
                    icon: <TrendUpIcon className="h-4 w-4 text-emerald-600" />,
                  },
                  REGIAO_CRITICA: {
                    badge: 'Queda de Região',
                    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200/50',
                    icon: <MapPinIcon className="h-4 w-4 text-sky-600" />,
                  },
                }[opt.tipo] || {
                  badge: 'Oportunidade',
                  badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200/50',
                  icon: <InfoIcon className="h-4 w-4 text-sky-600" />,
                }

                return (
                  <Card
                    key={`${opt.clienteId || 'null'}-${opt.tipo}-${index}`}
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge Row */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${styleConfig.badgeStyle}`}>
                          {styleConfig.icon}
                          {styleConfig.badge}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatDate(opt.dataGeracao)}
                        </span>
                      </div>

                      {/* Client Info */}
                      <CardTitle className="mt-4 text-lg font-semibold text-slate-900 line-clamp-1">
                        {opt.clienteNome || 'Região Comercial'}
                      </CardTitle>
                      
                      {/* Description */}
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed min-h-[40px]">
                        {opt.descricao}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="text-xs text-slate-400">
                        Status: <span className="font-semibold text-slate-600">{opt.status}</span>
                      </div>
                      
                      <Button
                        type="button"
                        onClick={() => handleOpenContactModal(opt)}
                        size="sm"
                        className="rounded-2xl"
                      >
                        <ChatTextIcon className="h-4 w-4 mr-1" />
                        Iniciar Atendimento
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-slate-200 border-dashed bg-slate-50/50 p-12 text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Tudo limpo por aqui!</h3>
              <p className="mt-1 text-xs text-slate-500">Você não tem oportunidades pendentes no momento. Continue com o bom trabalho!</p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Action Modal (ShadCN Dialog) */}
      <Dialog open={selectedOpt !== null} onOpenChange={(open) => { if (!open) setSelectedOpt(null) }}>
        {selectedOpt && (
          <DialogContent className="max-w-lg rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-slate-900">Contatar Cliente</DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">{selectedOpt.clienteNome || 'Ação Comercial'}</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 my-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tipo de Oportunidade
                </label>
                <div className="mt-2 text-sm text-slate-800 font-medium bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                  {selectedOpt.tipo === 'CLIENTE_INATIVO' && 'Recuperação de Cliente Inativo'}
                  {selectedOpt.tipo === 'PRODUTO_BAIXA_RECOMPRA' && 'Campanha de Estímulo de Recompra'}
                  {selectedOpt.tipo === 'REGIAO_CRITICA' && 'Foco e Prospecção Regional'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Telefone do Cliente
                </label>
                <Input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 5514981704947 (Código do país + DDD + Número)"
                  className="mt-2 rounded-2xl border border-slate-200 bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Caso o telefone não seja preenchido, redirecionaremos para o WhatsApp Web para escolher o contato manualmente.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Mensagem Recomendada
                  </label>
                  <Button
                    variant="link"
                    size="xs"
                    onClick={() => navigator.clipboard.writeText(message)}
                    className="text-sky-600 hover:text-sky-800"
                  >
                    <CopyIcon className="h-3.5 w-3.5 mr-1" />
                    Copiar
                  </Button>
                </div>
                <Textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 rounded-2xl border border-slate-200 bg-white p-4"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedOpt(null)}
                className="rounded-2xl border border-slate-200"
              >
                Cancelar
              </Button>
              
              <Button
                type="button"
                onClick={handleSendWhatsApp}
                className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl"
              >
                <WhatsappLogoIcon className="h-4 w-4 mr-1" />
                Conversar no WhatsApp
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
