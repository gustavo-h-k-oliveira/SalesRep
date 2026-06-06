package org.company.repository;

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
}

