import { useState, useEffect, useMemo } from 'react'
import {
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowClockwiseIcon,
  FunnelIcon,
  DesktopIcon,
  DeviceMobileIcon,
  GlobeIcon,
  SignInIcon,
  SignOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
  UserCheckIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@phosphor-icons/react'
import { fetchLogsAuditoria } from '../services/auditoriaService'
import { fetchRepresentantes } from '../services/representanteService'
import type { LogAuditoriaResponse, RepresentanteResponse } from '../types/api'

export default function LogsAuditoriaPage() {
  const [logs, setLogs] = useState<LogAuditoriaResponse[]>([])
  const [representantes, setRepresentantes] = useState<RepresentanteResponse[]>([])
  const [selectedRepresentanteId, setSelectedRepresentanteId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState<'ALL' | 'LOGIN' | 'LOGOUT'>('ALL')
  const [maskIp, setMaskIp] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Carregar lista de representantes
  useEffect(() => {
    async function loadRepresentantes() {
      try {
        const data = await fetchRepresentantes()
        setRepresentantes(data)
      } catch (err) {
        console.error('Erro ao carregar representantes:', err)
      }
    }
    loadRepresentantes()
  }, [])

  // Carregar logs de auditoria
  const loadLogs = async (currentPage = 0, isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const data = await fetchLogsAuditoria(
        selectedRepresentanteId ?? undefined,
        undefined,
        currentPage,
        15
      )
      setLogs(data.content || [])
      setTotalPages(data.page?.totalPages ?? data.totalPages ?? 1)
      setTotalElements(data.page?.totalElements ?? data.totalElements ?? (data.content ? data.content.length : 0))
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setPage(0)
    loadLogs(0)
  }, [selectedRepresentanteId])

  useEffect(() => {
    loadLogs(page)
  }, [page])

  // Filtragem local por termo de busca ou tipo de evento
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchQuery.trim() ||
        log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.ip && log.ip.includes(searchQuery)) ||
        (log.userAgent && log.userAgent.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesEvent =
        eventFilter === 'ALL' ||
        (eventFilter === 'LOGIN' && log.evento === 'LOGIN') ||
        (eventFilter === 'LOGOUT' && log.evento === 'LOGOUT')

      return matchesSearch && matchesEvent
    })
  }, [logs, searchQuery, eventFilter])

  // Parser de User Agent simplificado para exibição elegante
  const parseUserAgent = (ua?: string) => {
    if (!ua) return { device: 'Desconhecido', icon: GlobeIcon }
    const isMobile = /mobile|android|iphone|ipad/i.test(ua)
    let browser = 'Navegador Web'

    if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari')) browser = 'Safari'
    else if (ua.includes('Edg')) browser = 'Edge'

    let os = ''
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Macintosh')) os = 'macOS'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
    else if (ua.includes('Linux')) os = 'Linux'

    return {
      device: `${browser} ${os ? `(${os})` : ''}`.trim(),
      icon: isMobile ? DeviceMobileIcon : DesktopIcon,
    }
  }

  // Formatação amigável de data e hora
  const formatDateTime = (isoString: string): { formatted: string; relative: string } => {
    try {
      const date = new Date(isoString)
      if (Number.isNaN(date.getTime())) return { formatted: isoString || '', relative: '' }

      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      let relative = ''
      if (diffMinutes < 1) relative = 'Agora mesmo'
      else if (diffMinutes < 60) relative = `Há ${diffMinutes} min`
      else if (diffMinutes < 1440) relative = `Há ${Math.floor(diffMinutes / 60)}h`
      else relative = `Há ${Math.floor(diffMinutes / 1440)} dias`

      const formatted = date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      return { formatted, relative }
    } catch {
      return { formatted: isoString || '', relative: '' }
    }
  }

  // Mascaramento de IP para privacidade (LGPD)
  const formatIpDisplay = (ip?: string) => {
    if (!ip) return '127.0.0.***'
    if (!maskIp) return ip

    if (ip === '0:0:0:0:0:0:0:1' || ip === '::1') return '0:0:0:0:***'
    if (ip.includes('.')) {
      const parts = ip.split('.')
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.***`
      }
    }
    if (ip.includes(':')) {
      const parts = ip.split(':')
      return `${parts.slice(0, Math.max(1, parts.length - 2)).join(':')}:***`
    }
    return ip
  }

  // Estatísticas calculadas
  const acessosHojeCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return logs.filter((l) => l.dataHora && l.dataHora.startsWith(today)).length
  }, [logs])

  const ultimoAcesso = logs.length > 0 ? logs[0] : null

  return (
    <div className="space-y-6">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Logs de Auditoria de Acesso
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Monitoramento de logins e histórico de acessos dos representantes à plataforma.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadLogs(page, true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <ArrowClockwiseIcon className={`h-4 w-4 text-emerald-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Atualizando...' : 'Atualizar Dados'}</span>
        </button>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Registros</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalElements}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <ClockIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logins Hoje</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{acessosHojeCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shrink-0">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Representantes</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{representantes.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shrink-0">
            <UserCheckIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Último Acesso</p>
            {ultimoAcesso ? (
              <div>
                <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{ultimoAcesso.username}</p>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {formatDateTime(ultimoAcesso.dataHora).relative}
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-400 mt-0.5">Sem registros</p>
            )}
          </div>
        </div>
      </div>

      {/* SELETOR DE REPRESENTANTES */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Filtrar por Representante</h2>
          </div>
          {selectedRepresentanteId !== null && (
            <button
              type="button"
              onClick={() => setSelectedRepresentanteId(null)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Ver Todos
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedRepresentanteId(null)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 border ${
              selectedRepresentanteId === null
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>Todos os Representantes</span>
          </button>

          {representantes.map((rep) => {
            const isSelected = selectedRepresentanteId === rep.id
            const initials = rep.nome
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()

            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => setSelectedRepresentanteId(rep.id)}
                className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {initials}
                </div>
                <span className="font-bold">{rep.nome}</span>
                {rep.regiaoNome && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {rep.regiaoNome}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por usuário, IP ou navegador..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* Botão de Alternância de Mascaramento LGPD */}
          <button
            type="button"
            onClick={() => setMaskIp((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-bold transition-all border shrink-0 ${
              maskIp
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={maskIp ? 'Ocultando o último octeto do IP para privacidade (LGPD)' : 'Exibindo o IP completo'}
          >
            {maskIp ? <EyeSlashIcon className="h-4 w-4 text-amber-600" /> : <EyeIcon className="h-4 w-4 text-slate-500" />}
            <span>{maskIp ? 'IPs Mascarados (LGPD)' : 'IPs Visíveis'}</span>
          </button>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setEventFilter('ALL')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  eventFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setEventFilter('LOGIN')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  eventFilter === 'LOGIN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Logins
              </button>
              <button
                type="button"
                onClick={() => setEventFilter('LOGOUT')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  eventFilter === 'LOGOUT'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Logouts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE AUDITORIA */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <ArrowClockwiseIcon className="h-8 w-8 text-emerald-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Carregando logs de auditoria...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Nenhum log de acesso encontrado</p>
              <p className="text-xs text-slate-500 mt-1">
                Tente alterar o representante selecionado ou ajustar os filtros de busca.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Representante / Usuário</th>
                  <th className="px-5 py-3.5">Evento</th>
                  <th className="px-5 py-3.5">Data & Hora</th>
                  <th className="px-5 py-3.5">Endereço IP</th>
                  <th className="px-5 py-3.5">Dispositivo / Navegador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const dt = formatDateTime(log.dataHora)
                  const ua = parseUserAgent(log.userAgent)
                  const UaIcon = ua.icon

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Usuário / Representante */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black uppercase shrink-0">
                            {log.username.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{log.username}</p>
                            <p className="text-[11px] text-slate-400 font-medium">Acesso Registrado</p>
                          </div>
                        </div>
                      </td>

                      {/* Evento */}
                      <td className="px-5 py-4">
                        {log.evento === 'LOGIN' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/50">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <SignInIcon className="h-3.5 w-3.5 text-emerald-600" />
                            <span>LOGIN</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                            <SignOutIcon className="h-3.5 w-3.5 text-slate-500" />
                            <span>{log.evento}</span>
                          </span>
                        )}
                      </td>

                      {/* Data & Hora */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-900">{dt.formatted}</p>
                          <span className="inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                            {dt.relative}
                          </span>
                        </div>
                      </td>

                      {/* Endereço IP */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-mono font-semibold border transition-all ${
                            maskIp
                              ? 'bg-amber-50/80 text-amber-800 border-amber-200/60'
                              : 'bg-slate-50 text-slate-700 border-slate-200/60'
                          }`}
                        >
                          <GlobeIcon className={`h-3.5 w-3.5 ${maskIp ? 'text-amber-500' : 'text-slate-400'}`} />
                          <span>{formatIpDisplay(log.ip)}</span>
                        </span>
                      </td>

                      {/* Dispositivo / Navegador */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <UaIcon className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-xs font-medium text-slate-700 truncate max-w-[220px]" title={log.userAgent}>
                            {ua.device}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINAÇÃO */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-500">
            Mostrando <span className="text-slate-900">{filteredLogs.length}</span> de{' '}
            <span className="text-slate-900">{totalElements}</span> registros
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <CaretLeftIcon className="h-4 w-4" />
            </button>

            <span className="text-xs font-bold text-slate-700 px-2">
              Página {page + 1} de {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || loading}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <CaretRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
