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
    @EntityGraph(attributePaths = {"regiao", "representante"})
    List<Cliente> findAll();

    @Override
    @EntityGraph(attributePaths = {"regiao", "representante"})
    Page<Cliente> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"regiao", "representante"})
    Optional<Cliente> findById(Long id);

    @EntityGraph(attributePaths = {"regiao", "representante"})
    List<Cliente> findByUltimaCompraBefore(LocalDate date);

    @EntityGraph(attributePaths = {"regiao", "representante"})
    List<Cliente> findByRegiaoId(Long regiaoId);

    @EntityGraph(attributePaths = {"regiao", "representante"})
    List<Cliente> findByRepresentanteId(Long representanteId);

    @EntityGraph(attributePaths = {"regiao", "representante"})
    List<Cliente> findByStatus(StatusCliente status);

    long countByStatus(StatusCliente status);

    long countByRepresentanteIdAndStatus(Long representanteId, StatusCliente status);
}
