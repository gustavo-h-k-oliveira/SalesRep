import { useEffect, useState } from 'react'
import { fetchAlertas } from '../services/alertaService'
import type { AlertaDto } from '../types/api'
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
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
              {oportunidades.map((opt) => {
                // Style configurations based on opportunity type
                const styleConfig = {
                  CLIENTE_INATIVO: {
                    badge: 'Cliente Inativo',
                    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.8 2.8a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    ),
                  },
                  PRODUTO_BAIXA_RECOMPRA: {
                    badge: 'Baixa Recompra',
                    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L10 10.586 13.586 7H12z" clipRule="evenodd" />
                      </svg>
                    ),
                  },
                  REGIAO_CRITICA: {
                    badge: 'Queda de Região',
                    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200/50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ),
                  },
                }[opt.tipo] || {
                  badge: 'Oportunidade',
                  badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200/50',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  ),
                }

                return (
                  <Card
                    key={`${opt.clienteId}-${opt.dataGeracao}-${opt.tipo}`}
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        Iniciar Atendimento
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-slate-200 border-dashed bg-slate-50/50 p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
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
                {/* WhatsApp Logo */}
                <svg className="h-4 w-4 mr-1 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.448L0 24zm6.59-4.846c1.666.988 3.396 1.472 5.351 1.474 5.4 0 9.795-4.39 9.8-9.795.002-2.617-1.01-5.079-2.852-6.924C17.062 2.066 14.6 1.05 11.996 1.05c-5.4 0-9.8 4.4-9.802 9.81-.001 1.848.476 3.654 1.383 5.267l-.999 3.648 3.734-.98-.265.158z" />
                </svg>
                Conversar no WhatsApp
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
