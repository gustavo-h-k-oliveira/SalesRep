package org.company.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.company.entity.Usuario;
import org.company.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UsuarioBancoDeDadosServiceTest {
    
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioBancoDeDadosService usuarioService;

    @Test
    @DisplayName("Teste de retorno de usuário a partir de um id no repositório de usuários")
    void deveRetornarUsuarioQuandoEncontrado() {

        Usuario usuario = new Usuario();
        usuario.setNomeUsuario("Leon S. Kennedy");

        when(usuarioRepository.findByNomeUsuario("Leon S. Kennedy"))
            .thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.buscarPorNomeUsuario("Leon S. Kennedy");

        assertTrue(resultado.isPresent());
    }

    @Test
    void deveRetornarOptionalVazioQuandoUsuarioNaoExiste() {

        when(usuarioRepository.findByNomeUsuario("gustavo"))
                .thenReturn(Optional.empty());

        Optional<Usuario> resultado =
                usuarioService.buscarPorNomeUsuario("gustavo");

        assertTrue(resultado.isEmpty());
    }
    
    @Test
    void deveConsultarRepositorio() {

        when(usuarioRepository.findByNomeUsuario("gustavo"))
                .thenReturn(Optional.empty());

        usuarioService.buscarPorNomeUsuario("gustavo");

        verify(usuarioRepository)
                .findByNomeUsuario("gustavo");
    }
}
