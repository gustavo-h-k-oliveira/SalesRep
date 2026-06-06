package org.company.repository;

import java.util.List;

import org.company.entity.PedidoItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {

    List<PedidoItem> findByPedidoId(Long pedidoId);
    
    List<PedidoItem> findByProdutoId(Long produtoId);

    List<PedidoItem> findByPedido_RepresentanteId(Long representanteId);
}

