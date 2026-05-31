package org.company.controller;

import jakarta.validation.Valid;

import org.company.dto.LoginRequestDto;
import org.company.dto.LoginResponseDto;
import org.company.service.AuthService;
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

        return ResponseEntity.ok(response);
    }
}
