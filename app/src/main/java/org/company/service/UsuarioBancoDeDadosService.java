package org.company.service;

import java.util.Optional;

import org.company.entity.Usuario;
import org.company.repository.UsuarioRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioBancoDeDadosService {

    private final UsuarioRepository usuarioRepository;

    @Cacheable(value = "usuarios", key = "#nomeUsuario")
    public Optional<Usuario> buscarPorNomeUsuario(String nomeUsuario) {
        return usuarioRepository.findByNomeUsuario(nomeUsuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @CacheEvict(value = "usuarios", allEntries = true)
    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}
