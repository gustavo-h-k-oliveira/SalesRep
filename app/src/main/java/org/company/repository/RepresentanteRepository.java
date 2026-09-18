package org.company.repository;

import java.util.List;
import java.util.Optional;

import org.company.entity.Representante;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepresentanteRepository extends JpaRepository<Representante, Long> {
    
    @Override
    @EntityGraph(attributePaths = {"regiao", "estado"})
    List<Representante> findAll();

    @Override
    @EntityGraph(attributePaths = {"regiao", "estado"})
    Optional<Representante> findById(Long id);

    @EntityGraph(attributePaths = {"regiao", "estado"})
    List<Representante> findByRegiaoId(Long regiaoId);

    @EntityGraph(attributePaths = {"regiao", "estado"})
    List<Representante> findByEstadoId(Long estadoId);

    @EntityGraph(attributePaths = {"regiao", "estado"})
    Optional<Representante> findByCpfCnpj(String cpfCnpj);
}
