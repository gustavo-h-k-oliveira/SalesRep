package org.company.repository;

import java.util.Optional;

import org.company.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findBySku(String sku);
}
