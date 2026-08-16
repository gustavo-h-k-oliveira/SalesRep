package org.company.repository;

import java.util.List;
import org.company.entity.LogAuditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {

    Page<LogAuditoria> findAllByOrderByDataHoraDesc(Pageable pageable);

    Page<LogAuditoria> findByUsernameIgnoreCaseOrderByDataHoraDesc(String username, Pageable pageable);

    @Query("SELECT l FROM LogAuditoria l WHERE LOWER(l.username) IN :usernames ORDER BY l.dataHora DESC")
    Page<LogAuditoria> findByUsernamesInOrderByDataHoraDesc(@Param("usernames") List<String> usernames, Pageable pageable);
}

