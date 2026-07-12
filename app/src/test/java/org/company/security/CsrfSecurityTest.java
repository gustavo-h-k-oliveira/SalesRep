package org.company.security;

import org.company.controller.ProdutoController;
import org.company.mapper.ProdutoDtoMapper;
import org.company.service.ProdutoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.company.config.SecurityConfig;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import jakarta.servlet.http.Cookie;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProdutoController.class)
@Import({ SecurityConfig.class, JwtAuthenticationFilter.class })
class CsrfSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProdutoService produtoService;

    @MockitoBean
    private ProdutoDtoMapper produtoDtoMapper;

    @MockitoBean
    private JwtTokenService jwtTokenService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    @DisplayName("Requisição POST autenticada mas SEM token CSRF deve retornar 403 Forbidden")
    void postRequestWithoutCsrfShouldBeForbidden() throws Exception {
        mockMvc.perform(post("/produtos")
                .with(user("admin").roles("ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"TEST-SKU\", \"descricao\":\"Teste\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Requisição POST autenticada e COM token CSRF válido deve retornar 200 OK")
    void postRequestWithValidCsrfShouldBeOk() throws Exception {
        String tokenVal = "csrf-token-valor-de-teste";

        mockMvc.perform(post("/produtos")
                .with(user("admin").roles("ADMIN"))
                .cookie(new Cookie("XSRF-TOKEN", tokenVal))
                .header("X-XSRF-TOKEN", tokenVal)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"TEST-SKU\", \"descricao\":\"Teste\"}"))
                .andExpect(status().isOk());
    }
}
