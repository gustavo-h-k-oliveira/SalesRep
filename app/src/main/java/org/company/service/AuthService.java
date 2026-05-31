package org.company.service;

import org.company.dto.LoginRequestDto;
import org.company.entity.StatusUsuario;
import org.company.entity.Usuario;
import org.company.security.JwtTokenService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioBancoDeDadosService usuarioBancoDeDadosService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public String authenticate(LoginRequestDto loginRequest) {
        var usuario = usuarioBancoDeDadosService.buscarPorNomeUsuario(loginRequest.getNomeUsuario())
                .orElseThrow(() -> new BadCredentialsException("Nome de usuário ou senha inválidos."));

        if (usuario.getStatus() != StatusUsuario.ATIVO) {
            throw new BadCredentialsException("Usuário inativo.");
        }

        if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            throw new BadCredentialsException("Nome de usuário ou senha inválidos.");
        }

        Long representanteId = usuario.getRepresentante() != null ? usuario.getRepresentante().getId() : null;
        return jwtTokenService.generateToken(usuario.getNomeUsuario(), usuario.getPapel().name(), representanteId);
    }

    public Usuario getUsuarioPorNome(String nomeUsuario) {
        return usuarioBancoDeDadosService.buscarPorNomeUsuario(nomeUsuario).orElse(null);
    }
}
