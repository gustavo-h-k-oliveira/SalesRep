package org.company.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.company.entity.Pedido;
import org.company.entity.StatusPedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Override
    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findAll();

    @Override
    @EntityGraph(attributePaths = {"cliente", "representante"})
    Optional<Pedido> findById(Long id);

    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findByClienteId(Long clienteId);
    
    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findByRepresentanteId(Long representanteId);
    
    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findByRepresentanteIdAndStatus(Long representanteId, StatusPedido status);
    
    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findByRepresentanteIdAndDataEmissaoBetween(Long representanteId, LocalDate inicio, LocalDate fim);
    
    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findByStatus(StatusPedido status);

    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findByStatusNot(StatusPedido status);
    
    @EntityGraph(attributePaths = {"cliente", "representante"})
    List<Pedido> findByDataEmissaoBetween(LocalDate inicio, LocalDate fim);

    @Query("select coalesce(sum(p.valorTotal), 0) from Pedido p where p.status = org.company.entity.StatusPedido.FATURADO")
    BigDecimal sumFaturamentoTotal();

    @Query("select coalesce(sum(p.valorTotal), 0) from Pedido p where p.representante.id = :representanteId and p.status = org.company.entity.StatusPedido.FATURADO")
    BigDecimal sumFaturamentoTotalByRepresentanteId(@Param("representanteId") Long representanteId);

    @Query("select p.cliente.regiao.id, sum(p.valorTotal) " +
           "from Pedido p " +
           "where p.status = org.company.entity.StatusPedido.FATURADO " +
           "and p.dataFaturamento >= :inicio " +
           "and p.dataFaturamento <= :fim " +
           "and (:representanteId is null or p.representante.id = :representanteId) " +
           "and p.cliente.regiao is not null " +
           "group by p.cliente.regiao.id")
    List<Object[]> findFaturamentoPorRegiao(
        @Param("inicio") LocalDate inicio,
        @Param("fim") LocalDate fim,
        @Param("representanteId") Long representanteId
    );
}
