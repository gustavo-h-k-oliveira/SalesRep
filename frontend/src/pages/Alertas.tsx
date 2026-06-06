import { useEffect, useMemo, useState } from 'react'
import { fetchAlertas } from '../services/alertaService'
import type { AlertaDto } from '../types/api'

const criticidadeLabel: Record<string, string> = {
  ALTA: 'Alta prioridade',
  MEDIA: 'Média prioridade',
  BAIXA: 'Baixa prioridade',
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<AlertaDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAlertas() {
      try {
        const data = await fetchAlertas()
        setAlertas(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar alertas')
      } finally {
        setLoading(false)
      }
    }

    loadAlertas()
  }, [])

  const totalAlertas = alertas.length
  const criticos = alertas.filter((alerta) => alerta.criticidade.toUpperCase() === 'ALTA').length
  const atencao = alertas.filter((alerta) => alerta.criticidade.toUpperCase() === 'MEDIA').length
  const oportunidades = alertas.filter((alerta) => alerta.criticidade.toUpperCase() === 'BAIXA').length

  const alertasRecentes = useMemo(
    () =>
      [...alertas]
        .sort((a, b) => b.dataGeracao.localeCompare(a.dataGeracao))
        .slice(0, 4),
    [alertas]
  )

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Alertas</h1>
            <p className="mt-2 text-sm text-slate-600">
              Acompanhe os alertas comerciais retornados por <span className="font-medium">/alertas</span>.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Alertas críticos</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{criticos}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Atenção necessária</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{atencao}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Oportunidades</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{oportunidades}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Lista de alertas</h2>
                <p className="mt-1 text-sm text-slate-600">Total de alertas carregadas: {totalAlertas}</p>
              </div>
            </div>

            {loading ? (
              <p className="mt-4 text-slate-600">Carregando alertas...</p>
            ) : error ? (
              <p className="mt-4 text-rose-600">{error}</p>
            ) : alertasRecentes.length ? (
              <div className="mt-4 space-y-4">
                {alertasRecentes.map((alerta) => (
                  <article key={`${alerta.clienteId}-${alerta.dataGeracao}-${alerta.tipo}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                          {criticidadeLabel[alerta.criticidade.toUpperCase()] ?? alerta.criticidade}
                        </p>
                        <h3 className="mt-3 text-lg font-semibold text-slate-900">{alerta.tipo}</h3>
                        <p className="mt-2 text-sm text-slate-600">{alerta.descricao}</p>
                      </div>
                      <div className="text-sm text-slate-500 lg:text-right">
                        <p>{alerta.clienteNome}</p>
                        <p>{formatDate(alerta.dataGeracao)}</p>
                        <p className="mt-1 font-medium text-slate-700">{alerta.status}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-600">Nenhum alerta encontrado.</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Resumo dos alertas</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span>Totais carregados</span>
                  <span className="font-semibold text-slate-900">{totalAlertas}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span>Alertas em alta</span>
                  <span className="font-semibold text-slate-900">{criticos}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span>Alertas em média</span>
                  <span className="font-semibold text-slate-900">{atencao}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span>Alertas em baixa</span>
                  <span className="font-semibold text-slate-900">{oportunidades}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Alertas em destaque</h2>
              {loading ? (
                <p className="mt-4 text-slate-600">Carregando...</p>
              ) : error ? (
                <p className="mt-4 text-rose-600">{error}</p>
              ) : alertasRecentes.length ? (
                <ul className="mt-4 space-y-3">
                  {alertasRecentes.map((alerta) => (
                    <li key={`${alerta.clienteId}-${alerta.tipo}`} className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="font-medium text-slate-900">{alerta.clienteNome}</p>
                      <p className="mt-1 text-sm text-slate-600">{alerta.descricao}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-600">Nenhum destaque disponível.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}