package org.company.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.company.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findBySku(String sku);

    @Query("select distinct p from Produto p join p.itens pi join pi.pedido pedido where pedido.representante.id = :representanteId")
    List<Produto> findDistinctByRepresentanteId(@Param("representanteId") Long representanteId);

    @Query("select p from Produto p where " +
           "exists (select pi from PedidoItem pi where pi.produto = p and pi.pedido.status = org.company.entity.StatusPedido.FATURADO and pi.pedido.dataEmissao >= :inicioAnterior and pi.pedido.dataEmissao <= :fimAnterior and (:representanteId is null or pi.pedido.representante.id = :representanteId)) " +
           "and not exists (select pi from PedidoItem pi where pi.produto = p and pi.pedido.status = org.company.entity.StatusPedido.FATURADO and pi.pedido.dataEmissao >= :inicioRecente and pi.pedido.dataEmissao <= :hoje and (:representanteId is null or pi.pedido.representante.id = :representanteId))")
    List<Produto> findProdutosComBaixaRecompra(
        @Param("inicioAnterior") LocalDate inicioAnterior,
        @Param("fimAnterior") LocalDate fimAnterior,
        @Param("inicioRecente") LocalDate inicioRecente,
        @Param("hoje") LocalDate hoje,
        @Param("representanteId") Long representanteId
    );
}

