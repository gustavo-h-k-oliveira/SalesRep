package org.company.repository;

import java.util.List;

import org.company.entity.Regiao;
import org.company.entity.Uf;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegiaoRepository extends JpaRepository<Regiao, Long> {
    List<Regiao> findByUf(Uf uf);
}
