package org.company.repository;

import java.util.List;
import java.util.Optional;

import org.company.entity.Alerta;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    @Override
    @EntityGraph(attributePaths = {"cliente"})
    List<Alerta> findAll();

    @Override
    @EntityGraph(attributePaths = {"cliente"})
    Optional<Alerta> findById(Long id);
}
