package org.company.repository;

import java.math.BigDecimal;
import java.util.List;

import org.company.entity.PedidoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {

    List<PedidoItem> findByPedidoId(Long pedidoId);
    
    List<PedidoItem> findByProdutoId(Long produtoId);

    List<PedidoItem> findByPedido_RepresentanteId(Long representanteId);

    @Query("select coalesce(sum(pi.subTotal), 0) " +
           "from PedidoItem pi " +
           "where pi.produto.id = :produtoId " +
           "and pi.pedido.status = org.company.entity.StatusPedido.FATURADO " +
           "and (:representanteId is null or pi.pedido.representante.id = :representanteId)")
    BigDecimal sumFaturamentoByProdutoIdAndRepresentanteId(
        @Param("produtoId") Long produtoId,
        @Param("representanteId") Long representanteId
    );

    @Query("select pi.produto.id, coalesce(sum(pi.subTotal), 0) " +
           "from PedidoItem pi " +
           "where pi.pedido.status = org.company.entity.StatusPedido.FATURADO " +
           "and (:representanteId is null or pi.pedido.representante.id = :representanteId) " +
           "group by pi.produto.id")
    List<Object[]> findFaturamentoTotalGroupByProduto(@Param("representanteId") Long representanteId);
}

