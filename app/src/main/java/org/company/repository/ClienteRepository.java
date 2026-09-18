package org.company.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.company.entity.Cliente;
import org.company.entity.StatusCliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    @Override
    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    List<Cliente> findAll();

    @Override
    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    Page<Cliente> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    Optional<Cliente> findById(Long id);

    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    List<Cliente> findByUltimaCompraBefore(LocalDate date);

    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    List<Cliente> findByRegiaoId(Long regiaoId);

    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    List<Cliente> findByEstadoId(Long estadoId);

    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    List<Cliente> findByRepresentanteId(Long representanteId);

    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    List<Cliente> findByStatus(StatusCliente status);

    long countByStatus(StatusCliente status);

    long countByRepresentanteIdAndStatus(Long representanteId, StatusCliente status);

    @EntityGraph(attributePaths = {"regiao", "representante", "estado"})
    List<Cliente> findTop10ByRepresentanteIdAndStatusOrderByUltimaCompraAsc(Long representanteId, StatusCliente status);
}
