package org.company.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.company.entity.MetaComercial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetaComercialRepository extends JpaRepository<MetaComercial, Long> {

    Optional<MetaComercial> findByRepresentanteIdAndMesAno(Long representanteId, LocalDate mesAno);

    Optional<MetaComercial> findByRegiaoIdAndMesAno(Long regiaoId, LocalDate mesAno);

    Optional<MetaComercial> findByMesAnoAndRepresentanteIsNullAndRegiaoIsNull(LocalDate mesAno);
}
