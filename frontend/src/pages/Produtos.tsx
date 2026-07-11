import { useEffect, useMemo, useState } from 'react'
import { fetchProdutos, fetchProdutosCriticos } from '../services/produtoService'
import type { ProdutoResponse } from '../types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([])
  const [produtosCriticos, setProdutosCriticos] = useState<ProdutoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProdutos() {
      try {
        const [todos, criticos] = await Promise.all([fetchProdutos(), fetchProdutosCriticos()])
        setProdutos(todos)
        setProdutosCriticos(criticos)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
      } finally {
        setLoading(false)
      }
    }

    loadProdutos()
  }, [])

  const totalProdutos = produtos.length
  const totalCriticos = produtosCriticos.length
  const ativosEstimados = Math.max(totalProdutos - totalCriticos, 0)
  const percentualCriticos = totalProdutos > 0 ? Math.round((totalCriticos / totalProdutos) * 100) : 0

  const topDescricao = useMemo(() => {
    return produtosCriticos[0]?.descricao ?? produtos[0]?.descricao ?? 'Sem dados disponíveis'
  }, [produtos, produtosCriticos])

  const formatSku = (sku: string) => sku || '-'
  const formatCurrency = (value: number) =>
    (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Produtos</h1>
            <p className="mt-2 text-sm text-slate-600">
              Visão geral do catálogo, críticos e itens cadastrados na API.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Produtos cadastrados</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalProdutos}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Produtos críticos</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalCriticos}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Produtos fora do alerta</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{ativosEstimados}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Criticidade</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{percentualCriticos}%</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          {loading ? (
            <p className="text-slate-600">Carregando produtos...</p>
          ) : error ? (
            <p className="text-rose-600">{error}</p>
          ) : produtos.length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
                    <TableHead>ID</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Faturamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-semibold text-slate-500">{produto.id}</TableCell>
                      <TableCell>{formatSku(produto.sku)}</TableCell>
                      <TableCell className="font-medium text-slate-900">{produto.descricao}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">
                        {formatCurrency(produto.faturamento)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-slate-600">Nenhum produto encontrado.</p>
          )}

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm text-slate-500">Produto em destaque</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{topDescricao}</p>
              <p className="mt-2 text-sm text-slate-600">
                Baseado no primeiro item crítico disponível na API.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Produtos críticos</h2>
              {loading ? (
                <p className="mt-4 text-slate-600">Carregando críticos...</p>
              ) : error ? (
                <p className="mt-4 text-rose-600">{error}</p>
              ) : produtosCriticos.length ? (
                <div className="mt-4 space-y-3">
                  {produtosCriticos.map((produto) => (
                    <div key={produto.id} className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="font-medium text-slate-900">{produto.descricao}</p>
                      <div className="mt-1 flex items-center justify-between text-sm text-slate-500">
                        <span>SKU: {formatSku(produto.sku)}</span>
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(produto.faturamento)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-slate-600">Nenhum produto crítico encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}