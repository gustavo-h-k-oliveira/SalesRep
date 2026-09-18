import { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { isGestor } from '../services/authService'
import { createRepresentante } from '../services/representanteService'
import { fetchEstados } from '../services/estadoService'
import type { EstadoResponse } from '../types/api'
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
  UserIcon,
  MapPinIcon,
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  IdentificationCardIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'

export default function RepresentanteCadastroPage() {
  const navigate = useNavigate()
  const gestor = isGestor()

  // Redireciona imediatamente se não for GESTOR
  if (!gestor) {
    return <Navigate to="/dashboard" replace />
  }

  // Estados dos formulários
  const [nome, setNome] = useState('')
  const [estadoId, setEstadoId] = useState<string>('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [cpfCnpj, setCpfCnpj] = useState('')

  // Estados de apoio e controle
  const [estados, setEstados] = useState<EstadoResponse[]>([])
  const [loadingEstados, setLoadingEstados] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  // Carrega lista de estados disponíveis
  useEffect(() => {
    async function loadEstados() {
      try {
        const data = await fetchEstados()
        setEstados(data)
      } catch (err) {
        console.error('Erro ao carregar estados:', err)
        setError('Não foi possível carregar os estados de atuação. Tente atualizar a página.')
      } finally {
        setLoadingEstados(false)
      }
    }

    loadEstados()
  }, [])

  // Máscara para Telefone / WhatsApp
  const handleTelefoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    let formatted = digits
    if (digits.length <= 2) {
      formatted = digits.length ? `(${digits}` : ''
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    } else if (digits.length <= 10) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    } else {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
    }
    setTelefone(formatted)
    if (fieldErrors.telefone) {
      setFieldErrors((prev) => ({ ...prev, telefone: '' }))
    }
  }

  // Máscara para CPF ou CNPJ
  const handleCpfCnpjChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14)
    let formatted = digits
    if (digits.length <= 11) {
      // Formato CPF: 000.000.000-00
      if (digits.length <= 3) formatted = digits
      else if (digits.length <= 6) formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`
      else if (digits.length <= 9) formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
      else formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    } else {
      // Formato CNPJ: 00.000.000/0001-00
      if (digits.length <= 12) {
        formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
      } else {
        formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
      }
    }
    setCpfCnpj(formatted)
    if (fieldErrors.cpfCnpj) {
      setFieldErrors((prev) => ({ ...prev, cpfCnpj: '' }))
    }
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!nome.trim()) {
      errors.nome = 'O nome do representante é obrigatório.'
    } else if (nome.trim().length < 3) {
      errors.nome = 'O nome deve ter pelo menos 3 caracteres.'
    }

    if (!estadoId) {
      errors.estadoId = 'Selecione um estado de atuação.'
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Informe um endereço de e-mail válido.'
      }
    }

    if (telefone.trim()) {
      const rawTel = telefone.replace(/\D/g, '')
      if (rawTel.length < 10) {
        errors.telefone = 'Informe um telefone com DDD válido (10 ou 11 dígitos).'
      }
    }

    if (cpfCnpj.trim()) {
      const rawDoc = cpfCnpj.replace(/\D/g, '')
      if (rawDoc.length !== 11 && rawDoc.length !== 14) {
        errors.cpfCnpj = 'Documento incompleto (deve ter 11 dígitos para CPF ou 14 para CNPJ).'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validate()) {
      return
    }

    setSubmitting(true)

    try {
      const selectedEstado = estados.find((est) => String(est.id) === estadoId)
      const payload = {
        nome: nome.trim(),
        estadoId: Number(estadoId),
        regiaoId: selectedEstado?.regiaoId,
        telefone: telefone.trim(),
        email: email.trim() || undefined,
        cpfCnpj: cpfCnpj.trim() || undefined,
      }

      await createRepresentante(payload)
      setSuccess(true)

      // Redireciona de volta após breve confirmação
      setTimeout(() => {
        navigate('/representantes')
      }, 1200)
    } catch (err) {
      console.error('Erro ao cadastrar representante:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao cadastrar o representante. Verifique os dados e tente novamente.'
      )
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Botão Voltar e Cabeçalho */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/representantes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors p-1 -ml-1 rounded-xl hover:bg-slate-200/60"
          >
            <ArrowLeftIcon className="h-4 w-4" weight="bold" />
            <span>Voltar para Representantes</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cadastrar Representante</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <ShieldCheckIcon className="h-3.5 w-3.5" weight="bold" />
                Acesso Gestor
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Registre um novo representante comercial e vincule ao respectivo estado de atuação.
            </p>
          </div>
        </div>
      </div>

      {/* Banner de Feedback de Erro Geral */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
          <WarningCircleIcon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="font-semibold text-rose-900">Não foi possível concluir o cadastro</p>
            <p className="mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Banner de Sucesso */}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 text-sm flex items-start gap-3 shadow-xs animate-in zoom-in-95 duration-200">
          <CheckCircleIcon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="font-semibold text-emerald-950">Representante cadastrado com sucesso!</p>
            <p className="mt-0.5 text-emerald-700">Redirecionando para a lista de representantes...</p>
          </div>
        </div>
      )}

      {/* Card do Formulário */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Dados Principais */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Dados Principais</h2>
              <p className="text-xs text-slate-500">Informações cadastrais e de identificação comercial.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nome */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Nome Completo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
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
                {loadingEstados ? (
                  <div className="h-10 rounded-xl border border-slate-200 bg-slate-50 animate-pulse flex items-center px-3 text-xs text-slate-400">
                    Carregando estados...
                  </div>
                ) : (
                  <Select
                    value={estadoId}
                    onValueChange={(val) => {
                      setEstadoId(val || '')
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
                )}
                {fieldErrors.estadoId && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.estadoId}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">Estado comercial pelo qual o representante responderá.</p>
              </div>

              {/* CPF / CNPJ */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  CPF ou CNPJ <span className="text-xs font-normal text-slate-400">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <IdentificationCardIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    value={cpfCnpj}
                    onChange={(e) => handleCpfCnpjChange(e.target.value)}
                    disabled={submitting}
                    className={`pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors ${
                      fieldErrors.cpfCnpj ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  />
                </div>
                {fieldErrors.cpfCnpj && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.cpfCnpj}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Contato e Comunicação */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Contato e Comunicação</h2>
              <p className="text-xs text-slate-500">
                Canais para notificações e integração conversacional com o WhatsApp (Z-API).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Telefone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Telefone / WhatsApp <span className="text-xs font-normal text-slate-400">(recomendado)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <PhoneCallIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="tel"
                    placeholder="(14) 99778-7717"
                    value={telefone}
                    onChange={(e) => handleTelefoneChange(e.target.value)}
                    disabled={submitting}
                    className={`pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors ${
                      fieldErrors.telefone ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  />
                </div>
                {fieldErrors.telefone && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.telefone}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">
                  Necessário para receber alertas e realizar consultas comerciais via bot do WhatsApp.
                </p>
              </div>

              {/* E-mail Comercial */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  E-mail Comercial <span className="text-xs font-normal text-slate-400">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                    <EnvelopeSimpleIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="email"
                    placeholder="representante@salesrep.com.br"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
                    }}
                    disabled={submitting}
                    className={`pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors ${
                      fieldErrors.email ? 'border-rose-300 focus-visible:ring-rose-200' : ''
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <WarningCircleIcon className="h-3.5 w-3.5" weight="bold" />
                    {fieldErrors.email}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">Para envio de relatórios e notificações formais.</p>
              </div>
            </div>
          </div>

          {/* Botões de Ação do Formulário */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-slate-100">
            <Link
              to="/representantes"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all text-center"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting || success}
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
                  <span>Cadastrar Representante</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
