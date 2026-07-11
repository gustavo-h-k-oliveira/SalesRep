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
    private final EmailService emailService;

    public String authenticate(LoginRequestDto loginRequest) {

        var usuario = usuarioBancoDeDadosService
                .buscarPorEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    return new BadCredentialsException("E-mail ou senha inválidos.");
                });

        boolean senhaValida = passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha());

        if (!senhaValida || usuario.getStatus() != StatusUsuario.ATIVO) {
            throw new BadCredentialsException("E-mail ou senha inválidos.");
        }

        Long representanteId = usuario.getRepresentante() != null
                ? usuario.getRepresentante().getId()
                : null;

        return jwtTokenService.generateToken(
                usuario.getNomeUsuario(),
                usuario.getPapel().name(),
                representanteId);
    }

    public Usuario getUsuarioPorEmail(String email) {
        return usuarioBancoDeDadosService.buscarPorEmail(email).orElse(null);
    }

    public Usuario getUsuarioPorNome(String nomeUsuario) {
        return usuarioBancoDeDadosService.buscarPorNomeUsuario(nomeUsuario).orElse(null);
    }

    public void recuperarSenha(String email) {
        Usuario usuario = usuarioBancoDeDadosService.buscarPorEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("E-mail não cadastrado no sistema."));

        String token = jwtTokenService.generatePasswordResetToken(usuario.getEmail());
        emailService.enviarEmailRecuperacao(usuario.getEmail(), token);
    }

    public void redefinirSenha(String token, String novaSenha) {
        String email = jwtTokenService.getEmailFromResetToken(token);
        
        Usuario usuario = usuarioBancoDeDadosService.buscarPorEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário associado ao token não encontrado."));

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioBancoDeDadosService.salvar(usuario);
    }
}
