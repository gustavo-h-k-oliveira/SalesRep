import { useState, useEffect } from 'react'
import type {
  RegiaoResponse,
  ClienteResponse,
  RepresentanteResponse,
  ClientePrioritarioDto,
  PedidoResponse,
} from '../types/api'
import {
  MapPinIcon,
  XIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShieldWarningIcon,
  UserIcon,
  ArrowRightIcon,
  CaretLeftIcon,
} from '@phosphor-icons/react'

import { SVG_PATHS_UF_OFFICIAL } from './officialBrazilSvgPaths'

export interface EstadoData {
  uf: string
  nome: string
  regiaoMacro: 'Sudeste' | 'Sul' | 'Centro-Oeste' | 'Nordeste' | 'Norte'
  faturamento: number
  clientesAtivos: number
  clientesInativos: number
  representantes: RepresentanteResponse[]
  clientesPrioritarios: ClientePrioritarioDto[]
  gerenteRegional?: string
  isCritica: boolean
}

interface MapaBrasilSvgProps {
  regioes?: RegiaoResponse[]
  clientes?: ClienteResponse[]
  representantes?: RepresentanteResponse[]
  pedidos?: PedidoResponse[]
  clientesPrioritarios?: ClientePrioritarioDto[]
  regioesCriticas?: string[]
}

// Mapeamento de UFs brasileiras e suas respectivas Macrorregiões e Nomes
const ESTADOS_INFO: Record<string, { nome: string; regiaoMacro: EstadoData['regiaoMacro'] }> = {
  SP: { nome: 'São Paulo', regiaoMacro: 'Sudeste' },
  RJ: { nome: 'Rio de Janeiro', regiaoMacro: 'Sudeste' },
  MG: { nome: 'Minas Gerais', regiaoMacro: 'Sudeste' },
  ES: { nome: 'Espírito Santo', regiaoMacro: 'Sudeste' },
  PR: { nome: 'Paraná', regiaoMacro: 'Sul' },
  SC: { nome: 'Santa Catarina', regiaoMacro: 'Sul' },
  RS: { nome: 'Rio Grande do Sul', regiaoMacro: 'Sul' },
  MS: { nome: 'Mato Grosso do Sul', regiaoMacro: 'Centro-Oeste' },
  MT: { nome: 'Mato Grosso', regiaoMacro: 'Centro-Oeste' },
  GO: { nome: 'Goiás', regiaoMacro: 'Centro-Oeste' },
  DF: { nome: 'Distrito Federal', regiaoMacro: 'Centro-Oeste' },
  BA: { nome: 'Bahia', regiaoMacro: 'Nordeste' },
  SE: { nome: 'Sergipe', regiaoMacro: 'Nordeste' },
  AL: { nome: 'Alagoas', regiaoMacro: 'Nordeste' },
  PE: { nome: 'Pernambuco', regiaoMacro: 'Nordeste' },
  PB: { nome: 'Paraíba', regiaoMacro: 'Nordeste' },
  RN: { nome: 'Rio Grande do Norte', regiaoMacro: 'Nordeste' },
  CE: { nome: 'Ceará', regiaoMacro: 'Nordeste' },
  PI: { nome: 'Piauí', regiaoMacro: 'Nordeste' },
  MA: { nome: 'Maranhão', regiaoMacro: 'Nordeste' },
  PA: { nome: 'Pará', regiaoMacro: 'Norte' },
  AP: { nome: 'Amapá', regiaoMacro: 'Norte' },
  AM: { nome: 'Amazonas', regiaoMacro: 'Norte' },
  RR: { nome: 'Roraima', regiaoMacro: 'Norte' },
  AC: { nome: 'Acre', regiaoMacro: 'Norte' },
  RO: { nome: 'Rondônia', regiaoMacro: 'Norte' },
  TO: { nome: 'Tocantins', regiaoMacro: 'Norte' },
}

export default function MapaBrasilSvg({
  regioes = [],
  clientes = [],
  representantes = [],
  pedidos = [],
  clientesPrioritarios = [],
  regioesCriticas = [],
}: MapaBrasilSvgProps) {
  const [selectedUf, setSelectedUf] = useState<string | null>(null)
  const [hoveredUf, setHoveredUf] = useState<string | null>(null)
  const [activeData, setActiveData] = useState<EstadoData | null>(null)

  // Formatação de moeda
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // Agregação de estatísticas por UF
  const getEstadoData = (uf: string): EstadoData => {
    const info = ESTADOS_INFO[uf] || { nome: uf, regiaoMacro: 'Sudeste' }
    const safeRegioes = regioes || []
    const safeClientes = clientes || []
    const safeRepresentantes = representantes || []
    const safePedidos = pedidos || []
    const safePrioritarios = clientesPrioritarios || []
    const safeRegioesCriticas = regioesCriticas || []

    // Procura todas as entidades Regiao que correspondam ao UF ou Nome do Estado/Região
    const regioesUf = safeRegioes.filter(
      (r) =>
        r &&
        (r.uf === uf ||
          (r.nome &&
            (r.nome.toUpperCase().includes(uf) ||
              r.nome.toLowerCase().includes(info.nome.toLowerCase()))))
    )
    const regiaoIdsUf = new Set(regioesUf.map((r) => r.id))

    // Filtra clientes dessa região/UF
    const clientesUf = safeClientes.filter((c) => {
      if (!c) return false
      if (c.regiaoId && regiaoIdsUf.has(c.regiaoId)) return true
      if (c.regiaoNome) {
        const rUpper = c.regiaoNome.toUpperCase()
        const rLower = c.regiaoNome.toLowerCase()
        if (
          rUpper === uf ||
          rUpper.includes(uf) ||
          rLower.includes(info.nome.toLowerCase())
        ) {
          return true
        }
        if (regioesUf.length === 0 && rLower.includes(info.regiaoMacro.toLowerCase())) {
          return true
        }
      }
      return false
    })

    const clientesAtivosCount = clientesUf.filter((c) => c.status === 'ATIVO').length
    const clientesInativosCount = clientesUf.length - clientesAtivosCount

    // Representantes associados à região
    const repUf = safeRepresentantes.filter(
      (r) =>
        r &&
        ((r.regiaoId && regiaoIdsUf.has(r.regiaoId)) ||
          r.regiaoNome === info.nome ||
          r.regiaoNome === info.regiaoMacro ||
          (r.regiaoNome && r.regiaoNome.toUpperCase().includes(uf)))
    )

    // Pedidos faturados dessa região
    const pedidosUf = safePedidos.filter(
      (p) =>
        p &&
        p.status === 'FATURADO' &&
        (clientesUf.some((c) => c.id === p.clienteId) || repUf.some((r) => r.id === p.representanteId))
    )

    const faturamentoTotal = pedidosUf.reduce((sum, p) => sum + (p.valorTotal || 0), 0)

    const faturamentoFinal = faturamentoTotal

    // Clientes em Risco / Prioritários
    const prioritariosUf = safePrioritarios.filter(
      (cp) =>
        cp &&
        (cp.regiaoNome === info.nome ||
          cp.regiaoNome === info.regiaoMacro ||
          (cp.regiaoId && regiaoIdsUf.has(cp.regiaoId)))
    )

    const isCritica = safeRegioesCriticas.some(
      (rc) =>
        rc &&
        (rc.toUpperCase().includes(uf) ||
          rc.toLowerCase().includes(info.nome.toLowerCase()) ||
          rc.toLowerCase().includes(info.regiaoMacro.toLowerCase()))
    )

    return {
      uf,
      nome: info.nome,
      regiaoMacro: info.regiaoMacro,
      faturamento: faturamentoFinal,
      clientesAtivos: clientesAtivosCount,
      clientesInativos: clientesInativosCount,
      representantes: repUf,
      clientesPrioritarios: prioritariosUf,
      gerenteRegional: regioesUf[0]?.gerenteRegional || 'Não atribuído',
      isCritica,
    }
  }

  // Atualiza activeData para manter conteúdo estável durante animações de retração
  useEffect(() => {
    if (selectedUf) {
      setActiveData(getEstadoData(selectedUf))
    }
  }, [selectedUf])

  // Alternar seleção ao clicar em um estado no mapa
  const handleStateClick = (uf: string) => {
    setSelectedUf((prev) => (prev === uf ? null : uf))
  }

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedUf(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentData = selectedUf ? getEstadoData(selectedUf) : activeData

  // Função para calcular a cor de preenchimento do estado no mapa com base no desempenho/faturamento
  const getStateFillColor = (uf: string) => {
    const data = getEstadoData(uf)
    const isSelected = selectedUf === uf
    const isHovered = hoveredUf === uf

    if (isSelected) return '#059669' // emerald-600 destacado
    if (isHovered) return '#10b981' // emerald-500 hover

    if (data.isCritica) return '#f43f5e' // rose-500 se crítica

    // Gradação baseada no faturamento real
    if (data.faturamento >= 3000000) return '#047857' // emerald-700
    if (data.faturamento >= 1500000) return '#10b981' // emerald-500
    if (data.faturamento >= 800000) return '#34d399' // emerald-400
    if (data.faturamento > 0) return '#a7f3d0' // emerald-200
    return '#cbd5e1' // slate-300 (sem faturamento / sem dados)
  }

  const isOpen = Boolean(selectedUf && currentData)

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-5 shadow-sm select-none transition-all duration-300">
      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Mapa de Desempenho Regional & Faturamento (UFs)
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Clique em qualquer estado no mapa para expandir os detalhes regionais no lado esquerdo.
          </p>
        </div>

        {/* Legenda de Cores */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-700 shadow-xs" />
            <span>Alto Volume (&gt; R$ 3M)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span>Médio Volume</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-200 shadow-xs" />
            <span>Base Inicial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-xs animate-pulse" />
            <span>Região Crítica / Atenção</span>
          </div>
        </div>
      </div>

      {/* Grid Principal do Mapa + Painel Retrátil no Lado Esquerdo com Transições Suaves de Expansão e Retração */}
      <div className="mt-3 flex flex-col lg:flex-row items-start gap-4">
        {/* LADO ESQUERDO (OPOSTO AO PAINEL GERAL): PAINEL RETRÁTIL DE DETALHES COM ANIMAÇÃO CONTINUA */}
        <div
          className={`transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden ${isOpen
            ? 'w-full lg:w-[420px] max-h-[800px] opacity-100 scale-100 translate-x-0 shrink-0 border border-slate-200 bg-white p-4 sm:p-5 shadow-lg space-y-4 rounded-3xl pointer-events-auto'
            : 'w-0 lg:w-0 max-h-0 opacity-0 scale-95 -translate-x-8 shrink-0 border-0 p-0 m-0 shadow-none pointer-events-none'
            }`}
        >
          {currentData && (
            <div className="space-y-4 transition-opacity duration-300">
              {/* Header do Painel Retrátil */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-black text-white shadow-xs">
                      {currentData.uf}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{currentData.nome}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Macrorregião: <strong className="text-slate-700">{currentData.regiaoMacro}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUf(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  title="Recolher painel"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Banner de Status / Região Crítica */}
              {currentData.isCritica && (
                <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800 font-medium animate-pulse">
                  <ShieldWarningIcon className="h-5 w-5 text-rose-600 shrink-0" />
                  <span>Região sinalizada como crítica por inatividade de vendas.</span>
                </div>
              )}

              {/* Indicadores Principais */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                    <CurrencyDollarIcon className="h-4 w-4 text-emerald-600" />
                    Faturamento
                  </div>
                  <p className="mt-1 text-base font-bold text-emerald-700 truncate">
                    {formatCurrency(currentData.faturamento)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                    <UsersIcon className="h-4 w-4 text-teal-600" />
                    Clientes
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    <span className="text-emerald-600">{currentData.clientesAtivos} Ativos</span>
                    <span className="mx-1 text-slate-300">|</span>
                    <span className="text-rose-500">{currentData.clientesInativos} Inat.</span>
                  </p>
                </div>
              </div>

              {/* Gerente Regional e Equipe de Representantes */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-medium border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <UserIcon className="h-4 w-4 text-emerald-600" />
                    Gerente Regional:
                  </span>
                  <span className="font-bold text-slate-900">{currentData.gerenteRegional}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Representantes Alocados ({currentData.representantes.length})
                  </p>
                  {currentData.representantes.length > 0 ? (
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                      {currentData.representantes.map((rep) => (
                        <div
                          key={rep.id}
                          className="flex items-center justify-between rounded-lg bg-slate-150/40 px-2.5 py-1.5 text-xs text-slate-800 font-medium transition-colors hover:bg-slate-200/50"
                        >
                          <span>{rep.nome}</span>
                          <span className="text-[10px] text-slate-500">{rep.telefone}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">
                      Nenhum representante específico cadastrado para esta UF.
                    </p>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setSelectedUf(null)}
                  className="flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                >
                  <CaretLeftIcon className="h-4 w-4" />
                  <span>Recolher</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Filtrando visão do gestor comercial para o estado de ${currentData.nome} (${currentData.uf}).`)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all"
                >
                  <span>Filtrar por {currentData.uf}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CENTRO: ÁREA CENTRAL DO MAPA CARTOGRÁFICO OFICIAL DO BRASIL (VIEWBOX 0 0 613 639) */}
        <div className="flex-1 w-full min-w-0 flex justify-center items-center relative py-1 transition-all duration-500 ease-in-out">
          <svg
            viewBox="0 0 613 639"
            className="w-full max-w-[480px] h-auto drop-shadow-md transition-all duration-500 ease-in-out"
          >
            <g className="map-states">
              {Object.entries(SVG_PATHS_UF_OFFICIAL).map(([uf, pathD]) => {
                const fill = getStateFillColor(uf)
                const isSelected = selectedUf === uf

                return (
                  <g key={uf} className="group cursor-pointer">
                    <path
                      d={pathD}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '2' : '0.8'}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="transition-all duration-300 ease-out hover:opacity-90 hover:stroke-emerald-950"
                      onClick={() => handleStateClick(uf)}
                      onMouseEnter={() => setHoveredUf(uf)}
                      onMouseLeave={() => setHoveredUf(null)}
                    >
                      <title>{`${ESTADOS_INFO[uf]?.nome || uf} (${uf})`}</title>
                    </path>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* LADO DIREITO: PAINEL GERAL DE MACRORREGIÕES E DICA COMERCIAL (MANTIDO FIXO O TEMPO TODO) */}
        <div className="w-full lg:w-[310px] shrink-0 space-y-3 transition-all duration-500 ease-in-out">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Macrorregiões Comerciais
            </h3>
            <div className="space-y-1.5 text-xs">
              {(['Sudeste', 'Sul', 'Centro-Oeste', 'Nordeste', 'Norte'] as const).map((macro) => {
                const ufsDoMacro = Object.entries(ESTADOS_INFO)
                  .filter(([, info]) => info.regiaoMacro === macro)
                  .map(([uf]) => uf)

                const isSelectedMacro = currentData?.regiaoMacro === macro && isOpen

                return (
                  <div
                    key={macro}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all duration-300 cursor-pointer ${isSelectedMacro
                      ? 'bg-emerald-600 text-white font-bold shadow-sm scale-[1.01]'
                      : 'bg-white border border-slate-150 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    onClick={() => {
                      // Seleciona a primeira UF representativa da macrorregião no mapa
                      const firstUf = ufsDoMacro[0]
                      if (firstUf) {
                        setSelectedUf(firstUf)
                      }
                    }}
                  >
                    <span className="font-semibold transition-colors">{macro}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${isSelectedMacro
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {ufsDoMacro.length} UFs
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
