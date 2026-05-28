package org.company.repository;

import java.util.List;

import org.company.entity.Representante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepresentanteRepository extends JpaRepository<Representante, Long> {
    List<Representante> findByRegiaoId(Long representanteId);
}
