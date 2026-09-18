package org.company.controller;

import java.util.List;
import java.util.Optional;

import org.company.dto.EstadoRequestDto;
import org.company.dto.EstadoResponseDto;
import org.company.entity.Estado;
import org.company.entity.Regiao;
import org.company.entity.Uf;
import org.company.mapper.EstadoDtoMapper;
import org.company.service.EstadoService;
import org.company.service.RegiaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/estados")
@RequiredArgsConstructor
public class EstadoController {

    private final EstadoService estadoService;
    private final RegiaoService regiaoService;
    private final EstadoDtoMapper estadoDtoMapper;

    @GetMapping
    public List<EstadoResponseDto> listarTodos() {
        return estadoService.encontrarTodos().stream()
                .map(estadoDtoMapper::toEstadoResponseDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoResponseDto> obterPorId(@PathVariable Long id) {
        return Optional.ofNullable(estadoService.encontrarPorId(id))
                .map(estadoDtoMapper::toEstadoResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/uf/{uf}")
    public ResponseEntity<EstadoResponseDto> obterPorUf(@PathVariable Uf uf) {
        return estadoService.encontrarPorUf(uf)
                .map(estadoDtoMapper::toEstadoResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/regiao/{regiaoId}")
    public List<EstadoResponseDto> listarPorRegiao(@PathVariable Long regiaoId) {
        return estadoService.encontrarPorRegiao(regiaoId).stream()
                .map(estadoDtoMapper::toEstadoResponseDto)
                .toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<EstadoResponseDto> criar(@Valid @RequestBody EstadoRequestDto dto) {
        Regiao regiao = regiaoService.encontrarPorId(dto.getRegiaoId());
        if (regiao == null) {
            return ResponseEntity.badRequest().build();
        }

        Estado estado = new Estado();
        estado.setNome(dto.getNome());
        estado.setUf(dto.getUf());
        estado.setRegiao(regiao);
        estado.setStatus(dto.getStatus());

        Estado salvo = estadoService.salvar(estado);
        return ResponseEntity.ok(estadoDtoMapper.toEstadoResponseDto(salvo));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<EstadoResponseDto> atualizar(@PathVariable Long id,
            @Valid @RequestBody EstadoRequestDto dto) {
        Estado existente = estadoService.encontrarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        Regiao regiao = regiaoService.encontrarPorId(dto.getRegiaoId());
        if (regiao == null) {
            return ResponseEntity.badRequest().build();
        }

        existente.setNome(dto.getNome());
        existente.setUf(dto.getUf());
        existente.setRegiao(regiao);
        existente.setStatus(dto.getStatus());

        Estado salvo = estadoService.salvar(existente);
        return ResponseEntity.ok(estadoDtoMapper.toEstadoResponseDto(salvo));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        estadoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
