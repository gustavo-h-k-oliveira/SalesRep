package org.company.repository;

import java.util.List;
import java.util.Optional;

import org.company.entity.Estado;
import org.company.entity.Uf;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadoRepository extends JpaRepository<Estado, Long> {
    
    @Override
    @EntityGraph(attributePaths = {"regiao"})
    Optional<Estado> findById(Long id);

    @EntityGraph(attributePaths = {"regiao"})
    Optional<Estado> findByUf(Uf uf);

    @EntityGraph(attributePaths = {"regiao"})
    List<Estado> findByRegiaoId(Long regiaoId);

    @EntityGraph(attributePaths = {"regiao"})
    List<Estado> findAllByOrderByNomeAsc();
}
