// Helper utilitário central para mapeamento e filtragem de regiões e macrorregiões no Brasil

export type Macrorregiao = 'Sudeste' | 'Sul' | 'Centro-Oeste' | 'Nordeste' | 'Norte'

export const MACRORREGIOES: Macrorregiao[] = [
  'Sudeste',
  'Sul',
  'Centro-Oeste',
  'Nordeste',
  'Norte',
]

// Mapeamento de UFs brasileiras para a respectiva Macrorregião oficial
export const UF_TO_MACRO: Record<string, Macrorregiao> = {
  SP: 'Sudeste', RJ: 'Sudeste', MG: 'Sudeste', ES: 'Sudeste',
  PR: 'Sul', SC: 'Sul', RS: 'Sul',
  MS: 'Centro-Oeste', MT: 'Centro-Oeste', GO: 'Centro-Oeste', DF: 'Centro-Oeste',
  BA: 'Nordeste', SE: 'Nordeste', AL: 'Nordeste', PE: 'Nordeste', PB: 'Nordeste', RN: 'Nordeste', CE: 'Nordeste', PI: 'Nordeste', MA: 'Nordeste',
  PA: 'Norte', AP: 'Norte', AM: 'Norte', RR: 'Norte', AC: 'Norte', RO: 'Norte', TO: 'Norte',
}

// Mapeamento de nome completo de Estado para a sigla UF em maiúsculo
export const STATE_NAME_TO_UF: Record<string, string> = {
  'SÃO PAULO': 'SP',
  'SAO PAULO': 'SP',
  'RIO DE JANEIRO': 'RJ',
  'MINAS GERAIS': 'MG',
  'ESPÍRITO SANTO': 'ES',
  'ESPIRITO SANTO': 'ES',
  'PARANÁ': 'PR',
  'PARANA': 'PR',
  'SANTA CATARINA': 'SC',
  'RIO GRANDE DO SUL': 'RS',
  'MATO GROSSO DO SUL': 'MS',
  'MATO GROSSO': 'MT',
  'GOIÁS': 'GO',
  'GOIAS': 'GO',
  'DISTRITO FEDERAL': 'DF',
  'BAHIA': 'BA',
  'SERGIPE': 'SE',
  'ALAGOAS': 'AL',
  'PERNAMBUCO': 'PE',
  'PARAÍBA': 'PB',
  'PARAIBA': 'PB',
  'RIO GRANDE DO NORTE': 'RN',
  'CEARÁ': 'CE',
  'CEARA': 'CE',
  'PIAUÍ': 'PI',
  'PIAUI': 'PI',
  'MARANHÃO': 'MA',
  'MARANHAO': 'MA',
  'PARÁ': 'PA',
  'PARA': 'PA',
  'AMAPÁ': 'AP',
  'AMAPA': 'AP',
  'AMAZONAS': 'AM',
  'RORAIMA': 'RR',
  'ACRE': 'AC',
  'RONDÔNIA': 'RO',
  'RONDONIA': 'RO',
  'TOCANTINS': 'TO',
}

/**
 * Normaliza qualquer identificador de região (sigla UF, nome do Estado ou nome da Macrorregião)
 * para a sua Macrorregião oficial ('Sudeste', 'Sul', 'Centro-Oeste', 'Nordeste', 'Norte').
 */
export function getMacrorregiao(input?: string | null): Macrorregiao | null {
  if (!input) return null
  const cleaned = input.trim().toUpperCase()

  // 1. Correspondência com nome da Macrorregião
  for (const macro of MACRORREGIOES) {
    if (macro.toUpperCase() === cleaned) return macro
  }

  // 2. Correspondência direta por UF (ex: 'SP', 'MG')
  if (UF_TO_MACRO[cleaned]) return UF_TO_MACRO[cleaned]

  // 3. Correspondência por nome completo do estado (ex: 'MINAS GERAIS')
  const uf = STATE_NAME_TO_UF[cleaned]
  if (uf && UF_TO_MACRO[uf]) return UF_TO_MACRO[uf]

  return null
}

/**
 * Avalia se um cliente pertence a um determinado filtro regional (Macrorregião ou UF/Estado específico).
 * Usa comparações exatas normalizadas e mapeamentos mapeados em memória sem substrings.
 */
export function matchesRegionFilter(
  clientRegiaoNome?: string | null,
  clientRegiaoId?: number | null,
  filterTarget?: string | null,
  regioesList: { id: number; uf?: string; nome?: string }[] = [],
  clientEstadoNome?: string | null,
  clientEstadoUf?: string | null
): boolean {
  if (!filterTarget || filterTarget === 'ALL') return true

  const targetClean = filterTarget.trim().toUpperCase()
  const targetMacro = getMacrorregiao(filterTarget)

  // 1. Avalia por clientEstadoUf e clientEstadoNome
  if (clientEstadoUf) {
    const ufClean = clientEstadoUf.trim().toUpperCase()
    if (ufClean === targetClean) return true
    if (targetMacro && UF_TO_MACRO[ufClean] === targetMacro) return true
  }

  if (clientEstadoNome) {
    const estClean = clientEstadoNome.trim().toUpperCase()
    if (estClean === targetClean) return true
    const estUf = STATE_NAME_TO_UF[estClean]
    if (estUf && estUf === targetClean) return true
    if (targetMacro && estUf && UF_TO_MACRO[estUf] === targetMacro) return true
  }

  // 2. Avalia pelo regiaoNome do cliente
  if (clientRegiaoNome) {
    const clientMacro = getMacrorregiao(clientRegiaoNome)
    const clientRegClean = clientRegiaoNome.trim().toUpperCase()

    // Se o filtro for uma Macrorregião (ex: 'Sudeste')
    if (targetMacro && targetClean === targetMacro.toUpperCase()) {
      if (clientMacro === targetMacro) return true
    }

    // Se o filtro for um estado ou UF específico
    if (clientRegClean === targetClean) return true
    const clientUf = STATE_NAME_TO_UF[clientRegClean] || (UF_TO_MACRO[clientRegClean] ? clientRegClean : null)
    if (clientUf && clientUf === targetClean) return true
  }

  // 3. Avalia pelo regiaoId do cliente cruzado com a lista de entidades Regiao
  if (clientRegiaoId && regioesList.length > 0) {
    const reg = regioesList.find((r) => r.id === clientRegiaoId)
    if (reg) {
      const regMacro = getMacrorregiao(reg.uf || reg.nome)
      if (targetMacro && regMacro === targetMacro) return true
      if (reg.uf && reg.uf.toUpperCase() === targetClean) return true
      if (reg.nome && reg.nome.trim().toUpperCase() === targetClean) return true
    }
  }

  return false
}
