package org.company.service;

import java.util.Optional;

import org.company.entity.Usuario;
import org.company.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioBancoDeDadosService {

    private final UsuarioRepository usuarioRepository;

    public Optional<Usuario> buscarPorNomeUsuario(String nomeUsuario) {
        return usuarioRepository.findByNomeUsuario(nomeUsuario);
    }
}
