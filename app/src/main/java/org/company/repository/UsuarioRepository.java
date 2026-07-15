package org.company.repository;

import java.util.Optional;

import org.company.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNomeUsuario(String nomeUsuario);
    Optional<Usuario> findByEmail(String email);
}
