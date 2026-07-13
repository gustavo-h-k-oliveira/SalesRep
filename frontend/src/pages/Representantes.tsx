import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRepresentantes, fetchRepresentanteClientes, fetchRepresentantePedidos } from '../services/representanteService'
import type { RepresentanteResponse } from '../types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  MagnifyingGlassIcon,
  UsersIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
} from '@phosphor-icons/react'

interface RepresentanteComMetricas extends RepresentanteResponse {
  totalClientes: number
  faturamentoTotal: number
}

export default function RepresentantesPage() {
  const [representantes, setRepresentantes] = useState<RepresentanteComMetricas[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRepresentantes() {
      try {
        const data = await fetchRepresentantes()
        
        // Carrega dados adicionais de clientes e pedidos para mostrar métricas resumidas
        const repsComMetricas = await Promise.all(
          data.map(async (rep) => {
            try {
              const [clientes, pedidos] = await Promise.all([
                fetchRepresentanteClientes(rep.id),
                fetchRepresentantePedidos(rep.id),
              ])
              const faturamentoTotal = pedidos
                .filter((p) => p.status === 'FATURADO')
                .reduce((sum, p) => sum + p.valorTotal, 0)
              
              return {
                ...rep,
                totalClientes: clientes.length,
                faturamentoTotal,
              }
            } catch (err) {
              console.error(`Erro ao carregar metricas do rep ${rep.id}:`, err)
              return {
                ...rep,
                totalClientes: 0,
                faturamentoTotal: 0,
              }
            }
          })
        )

        setRepresentantes(repsComMetricas)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar representantes')
      } finally {
        setLoading(false)
      }
    }

    loadRepresentantes()
  }, [])

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const filteredRepresentantes = representantes.filter((rep) =>
    rep.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.regiaoNome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Equipe de Representantes</h1>
          <p className="mt-2 text-sm text-slate-500">
            Gerencie e acompanhe o desempenho individual de vendas e cobertura de clientes dos representantes comerciais.
          </p>
        </div>
        <div className="relative w-full max-w-xs shrink-0">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </span>
          <Input
            type="text"
            placeholder="Buscar por nome ou região..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl border-slate-200 bg-white"
          />
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"></div>
            <p className="mt-4 text-sm text-slate-500 font-medium">Buscando representantes da equipe...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-rose-700 text-sm">
            {error}
          </div>
        ) : filteredRepresentantes.length ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Representante</TableHead>
                  <TableHead>Região de Atuação</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Clientes Carteira</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepresentantes.map((rep) => (
                  <TableRow key={rep.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-500">{rep.id}</TableCell>
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <Link to={`/representantes/${rep.id}`} className="text-slate-900 hover:text-emerald-700 font-semibold hover:underline">
                          {rep.nome}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPinIcon className="h-4 w-4 text-slate-400" />
                        <span>{rep.regiaoNome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{rep.telefone}</TableCell>
                    <TableCell className="text-right font-medium text-slate-700">
                      <div className="flex items-center justify-end gap-1.5">
                        <UsersIcon className="h-4 w-4 text-slate-400" />
                        <span>{rep.totalClientes}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      <div className="flex items-center justify-end gap-1.5">
                        <CurrencyDollarIcon className="h-4 w-4 text-emerald-500" />
                        <span>{formatCurrency(rep.faturamentoTotal)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/representantes/${rep.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
                      >
                        Ver Detalhes
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 border-dashed bg-slate-50/50 p-12 text-center">
            <p className="text-sm font-semibold text-slate-900">Nenhum representante encontrado.</p>
            <p className="mt-1 text-xs text-slate-500">Tente buscar por um termo diferente ou limpe o campo de pesquisa.</p>
          </div>
        )}
      </div>
    </div>
  )
}
