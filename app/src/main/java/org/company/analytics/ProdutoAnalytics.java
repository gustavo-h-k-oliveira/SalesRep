package org.company.analytics;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
            .map(PedidoItem::getSubTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<String> buscarProdutosComBaixaRecompra() {
        return buscarProdutosComBaixaRecompra(null);
    }

    public List<String> buscarProdutosComBaixaRecompra(Long representanteId) {
        LocalDate hoje = LocalDate.now();
        LocalDate periodoRecente = hoje.minusDays(30);
        LocalDate periodoAnterior = hoje.minusDays(90);

        return produtoRepository.findAll().stream()
            .filter(produto -> {
                List<PedidoItem> itens = pedidoItemRepository.findByProdutoId(produto.getId());
                boolean teveAnterior = itens.stream()
                    .map(PedidoItem::getPedido)
                    .filter(pedido -> pedido.getDataEmissao() != null)
                    .filter(pedido -> representanteId == null || (pedido.getRepresentante() != null && representanteId.equals(pedido.getRepresentante().getId())))
                    .anyMatch(pedido -> !pedido.getDataEmissao().isBefore(periodoAnterior) && !pedido.getDataEmissao().isAfter(hoje));
                boolean teveRecente = itens.stream()
                    .map(PedidoItem::getPedido)
                    .filter(pedido -> pedido.getDataEmissao() != null)
                    .filter(pedido -> representanteId == null || (pedido.getRepresentante() != null && representanteId.equals(pedido.getRepresentante().getId())))
                    .anyMatch(pedido -> !pedido.getDataEmissao().isBefore(periodoRecente) && !pedido.getDataEmissao().isAfter(hoje));
                return teveAnterior && !teveRecente;
            })
            .map(Produto::getDescricao)
            .toList();
    }
}
