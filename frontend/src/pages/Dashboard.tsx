import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCheck, Clock, AlertCircle, TriangleAlert } from 'lucide-react'
import { fetchDashboard } from '../services/dashboardService'
import { fetchClientesPrioritarios } from '../services/clienteService'
import { fetchPedidos } from '../services/pedidoService'
import StatCard from '../components/ui/StatCard'
import PriorityList from '../components/dashboard/PriorityList'
import AttentionTable from '../components/dashboard/AttentionTable'
import RecentOrders from '../components/dashboard/RecentOrders'
import type { DashboardDto, ClientePrioritarioDto, PedidoResponse } from '../types/api'
import type { ClienteAtencao, PriorityItem } from '../types/dashboard'

// Limiares (em dias) usados apenas no front-end para calcular quantos
// clientes estão "quase inativos" / "críticos". Ajuste aqui ou substitua
// pelos valores reais assim que o back-end expuser essas contagens prontas.
const LIMIAR_QUASE_INATIVO_DIAS = 30
const LIMIAR_INATIVO_DIAS = 45

// Heurística temporária de "prazo para o gestor": dias restantes até uma
// escalação hipotética em 60 dias sem compra. Troque por um campo real da
// API (prazoGestor) quando existir.
const LIMIAR_ESCALACAO_GESTOR_DIAS = 60

function calcularPrazoGestor(diasSemCompra: number): string {
  const restante = LIMIAR_ESCALACAO_GESTOR_DIAS - diasSemCompra
  if (restante <= 0) return 'Vencido'
  return `${restante} dias`
}

function contarPorFaixaDeDias(clientes: ClientePrioritarioDto[]) {
  let quaseInativos = 0
  let criticos = 0

  for (const cliente of clientes) {
    if (cliente.diasSemCompra >= LIMIAR_QUASE_INATIVO_DIAS && cliente.diasSemCompra < LIMIAR_INATIVO_DIAS) {
      quaseInativos += 1
    }
    if (cliente.diasSemCompra >= LIMIAR_ESCALACAO_GESTOR_DIAS - 7) {
      criticos += 1
    }
  }

  return { quaseInativos, criticos }
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null)
  const [clientesPrioritarios, setClientesPrioritarios] = useState<ClientePrioritarioDto[]>([])
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAll() {
      try {
        const [dashboardData, clientesData, pedidosData] = await Promise.all([
          fetchDashboard(),
          fetchClientesPrioritarios(),
          fetchPedidos(),
        ])
        setDashboard(dashboardData)
        setClientesPrioritarios(clientesData)
        setPedidos(pedidosData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar a visão geral')
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  const { quaseInativos, criticos } =
