package org.company.controller;

import java.time.Duration;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.company.dto.LoginRequestDto;
import org.company.dto.LoginResponseDto;
import org.company.service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        String token = authService.authenticate(loginRequest);
        LoginResponseDto response = new LoginResponseDto();
        response.setToken(token);

        var usuario = authService.getUsuarioPorNome(loginRequest.getNomeUsuario());
        if (usuario != null && usuario.getRepresentante() != null) {
            response.setRepresentanteId(usuario.getRepresentante().getId());
        }

        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", token)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofHours(8))
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse servletResponse) {
        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }
}
