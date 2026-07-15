package org.company.analytics;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.company.entity.Produto;
import org.company.repository.PedidoItemRepository;
import org.company.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoAnalytics {

        private final PedidoItemRepository pedidoItemRepository;
        private final ProdutoRepository produtoRepository;

        public BigDecimal calcularFaturamentoPorSku(Long produtoId) {
                return calcularFaturamentoPorSku(produtoId, null);
        }

        public BigDecimal calcularFaturamentoPorSku(Long produtoId, Long representanteId) {
                return pedidoItemRepository.sumFaturamentoByProdutoIdAndRepresentanteId(produtoId, representanteId);
        }

        public java.util.Map<Long, BigDecimal> obterFaturamentosDosProdutos(Long representanteId) {
                List<Object[]> results = pedidoItemRepository.findFaturamentoTotalGroupByProduto(representanteId);
                return results.stream().collect(java.util.stream.Collectors.toMap(
                                row -> (Long) row[0],
                                row -> (BigDecimal) row[1]));
        }

        public List<String> buscarProdutosComBaixaRecompra() {
                return buscarProdutosComBaixaRecompra(null);
        }

        public List<String> buscarProdutosComBaixaRecompra(Long representanteId) {
                return obterProdutosComBaixaRecompra(representanteId).stream()
                                .map(produto -> produto.getDescricao())
                                .toList();
        }

        public List<Produto> buscarProdutosComBaixaRecompraProduto() {
                return buscarProdutosComBaixaRecompraProduto(null);
        }

        public List<Produto> buscarProdutosComBaixaRecompraProduto(Long representanteId) {
                return obterProdutosComBaixaRecompra(representanteId);
        }

        private List<Produto> obterProdutosComBaixaRecompra(Long representanteId) {
                LocalDate hoje = LocalDate.now();

                // Período "anterior": de 90 até 46 dias atrás
                LocalDate inicioPeriodoAnterior = hoje.minusDays(90);
                LocalDate fimPeriodoAnterior = hoje.minusDays(46);

                // Período recente: últimos 45 dias
                LocalDate inicioPeriodoRecente = hoje.minusDays(45);

                return produtoRepository.findProdutosComBaixaRecompra(
                                inicioPeriodoAnterior,
                                fimPeriodoAnterior,
                                inicioPeriodoRecente,
                                hoje,
                                representanteId);
        }
}
