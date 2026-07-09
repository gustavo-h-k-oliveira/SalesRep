import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchClientesPrioritarios } from '../services/clienteService'
import type { ClientePrioritarioDto } from '../types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClientePrioritarioDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClientes() {
      try {
        const data = await fetchClientesPrioritarios()
        setClientes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar clientes')
      } finally {
        setLoading(false)
      }
    }

    loadClientes()
  }, [])

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Carteira de Clientes</h1>
            <p className="mt-2 text-sm text-slate-500">
              Lista completa de clientes ordenada por pontuação de prioridade (Score), combinando histórico de compras e necessidade de atenção.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-400"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Buscando carteira de clientes...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-rose-700 text-sm">
              {error}
            </div>
          ) : clientes.length ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade (Score)</TableHead>
                    <TableHead>Dias sem compra</TableHead>
                    <TableHead>Ticket médio</TableHead>
                    <TableHead>Total de pedidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-semibold text-slate-500">{cliente.id}</TableCell>
                      <TableCell className="font-medium text-slate-900">
                        <Link to={`/clientes/${cliente.id}`} className="text-indigo-600 hover:text-indigo-900 hover:underline">
                          {cliente.nome}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                            cliente.status === 'ATIVO'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                              : cliente.status === 'INATIVO'
                              ? 'bg-rose-50 text-rose-700 border-rose-200/50'
                              : 'bg-amber-50 text-amber-700 border-amber-200/50'
                          }`}
                        >
                          {cliente.status === 'ATIVO' && 'Ativo'}
                          {cliente.status === 'INATIVO' && 'Inativo'}
                          {cliente.status === 'RECUPERACAO' && 'Em Recuperação'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{cliente.score.toFixed(1)}</span>
                          <Badge
                            variant="outline"
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                              cliente.score >= 80
                                ? 'bg-rose-50 text-rose-700 border-rose-200/50'
                                : cliente.score >= 50
                                ? 'bg-sky-50 text-sky-700 border-sky-200/50'
                                : 'bg-slate-50 text-slate-500 border-slate-200/50'
                            }`}
                          >
                            {cliente.score >= 80 ? 'Alta' : cliente.score >= 50 ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{cliente.diasSemCompra} dias</TableCell>
                      <TableCell className="text-slate-600 font-medium">{formatCurrency(cliente.ticketMedio)}</TableCell>
                      <TableCell className="text-slate-600">{cliente.totalPedidos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-slate-600">Nenhum cliente cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
