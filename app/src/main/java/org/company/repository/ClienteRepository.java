package org.company.repository;

import java.time.LocalDate;
import java.util.List;

import org.company.entity.Cliente;
import org.company.entity.StatusCliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    List<Cliente> findByUltimaCompraBefore(LocalDate date);

    List<Cliente> findByRegiaoId(Long regiaoId);

    List<Cliente> findByRepresentanteId(Long representanteId);

    List<Cliente> findByStatus(StatusCliente status);

    long countByStatus(StatusCliente status);
}
