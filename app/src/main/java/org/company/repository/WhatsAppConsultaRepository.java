package org.company.repository;

import org.company.entity.WhatsAppConsulta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WhatsAppConsultaRepository extends JpaRepository<WhatsAppConsulta, Long> {

    boolean existsByMessageId(String messageId);
}
