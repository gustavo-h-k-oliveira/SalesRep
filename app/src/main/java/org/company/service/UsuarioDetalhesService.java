package org.company.service;

import java.util.Optional;

import org.company.entity.StatusUsuario;
import org.company.entity.Usuario;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioDetalhesService implements UserDetailsService {

    private final UsuarioBancoDeDadosService usuarioBancoDeDadosService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Usuario> usuarioOptional = usuarioBancoDeDadosService.buscarPorNomeUsuario(username);

        Usuario usuario = usuarioOptional.orElseThrow(() ->
                new UsernameNotFoundException("Usuário não encontrado: " + username));

        return User.withUsername(usuario.getNomeUsuario())
                .password(usuario.getSenha())
                .roles(usuario.getPapel().name())
                .disabled(usuario.getStatus() != StatusUsuario.ATIVO)
                .build();
    }
}
