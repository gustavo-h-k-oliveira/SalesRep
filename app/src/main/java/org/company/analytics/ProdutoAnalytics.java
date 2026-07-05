package org.company.analytics;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.company.entity.Pedido;
import org.company.entity.PedidoItem;
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
                List<PedidoItem> itens = pedidoItemRepository.findByProdutoId(produtoId);

                return itens.stream()
                                .filter(item -> item.getPedido() != null && item.getPedido().estaFaturado())
                                .map(item -> item.getSubTotal())
                                .filter(subTotal -> subTotal != null)
                                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));
        }

        public List<String> buscarProdutosComBaixaRecompra() {
                return buscarProdutosComBaixaRecompra(null);
        }

        // TODO: Passar regra para consulta JPQL
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

                // Período "anterior": de 90 até 31 dias atrás
                LocalDate inicioPeriodoAnterior = hoje.minusDays(90);
                LocalDate fimPeriodoAnterior = hoje.minusDays(31);

                // Período recente: últimos 30 dias
                LocalDate inicioPeriodoRecente = hoje.minusDays(30);

                return produtoRepository.findAll().stream()
                                .filter(produto -> {
                                        List<PedidoItem> itens = pedidoItemRepository.findByProdutoId(produto.getId());

                                        boolean teveAnterior = false;
                                        boolean teveRecente = false;

                                        for (PedidoItem item : itens) {
                                                Pedido pedido = item.getPedido();

                                                if (pedido == null || pedido.getDataEmissao() == null) {
                                                        continue;
                                                }

                                                if (representanteId != null &&
                                                                (pedido.getRepresentante() == null ||
                                                                                !representanteId.equals(pedido
                                                                                                .getRepresentante()
                                                                                                .getId()))) {
                                                        continue;
                                                }

                                                LocalDate data = pedido.getDataEmissao();

                                                // Entre 90 e 31 dias atrás
                                                if (!data.isBefore(inicioPeriodoAnterior)
                                                                && !data.isAfter(fimPeriodoAnterior)) {
                                                        teveAnterior = true;
                                                }

                                                // Últimos 30 dias
                                                if (!data.isBefore(inicioPeriodoRecente)
                                                                && !data.isAfter(hoje)) {
                                                        teveRecente = true;
                                                }

                                                // Não há motivo para continuar
                                                if (teveAnterior && teveRecente) {
                                                        break;
                                                }
                                        }

                                        return teveAnterior && !teveRecente;
                                })
                                .toList();
        }
}
