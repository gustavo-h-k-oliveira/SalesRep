package org.company.repository;

import java.time.LocalDate;
import java.util.List;

import org.company.entity.Pedido;
import org.company.entity.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteId(Long clienteId);
    
    List<Pedido> findByRepresentanteId(Long representanteId);
    
    List<Pedido> findByRepresentanteIdAndStatus(Long representanteId, StatusPedido status);
    
    List<Pedido> findByStatus(StatusPedido status);

    List<Pedido> findByStatusNot(StatusPedido status);
    
    List<Pedido> findByDataEmissaoBetween(LocalDate inicio, LocalDate fim);
}
