package org.company.controller;

import java.util.List;
import java.util.Optional;

import org.company.dto.RegiaoRequestDto;
import org.company.dto.RegiaoResponseDto;
import org.company.entity.Cliente;
import org.company.entity.Regiao;
import org.company.entity.Representante;
import org.company.entity.Uf;
import org.company.mapper.RegiaoDtoMapper;
import org.company.service.RegiaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/regioes")
@RequiredArgsConstructor
public class RegiaoController {

    private final RegiaoService regiaoService;
    private final RegiaoDtoMapper regiaoDtoMapper;

    @GetMapping
    public List<RegiaoResponseDto> listarTodos() {
        return regiaoService.encontrarTodos().stream()
            .map(regiaoDtoMapper::toRegiaoResponseDto)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegiaoResponseDto> obterPorId(@PathVariable Long id) {
        return Optional.ofNullable(regiaoService.encontrarPorId(id))
            .map(regiaoDtoMapper::toRegiaoResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/uf/{uf}")
    public List<RegiaoResponseDto> listarPorUf(@PathVariable Uf uf) {
        return regiaoService.encontrarPorUf(uf).stream()
            .map(regiaoDtoMapper::toRegiaoResponseDto)
            .toList();
    }

    @GetMapping("/{id}/clientes")
    public List<Cliente> listarClientes(@PathVariable Long id) {
        return regiaoService.encontrarClientesPorRegiao(id);
    }

    @GetMapping("/{id}/representantes")
    public List<Representante> listarRepresentantes(@PathVariable Long id) {
        return regiaoService.encontrarRepresentantesPorRegiao(id);
    }

    @PostMapping
    public ResponseEntity<RegiaoResponseDto> criar(@Valid @RequestBody RegiaoRequestDto regiaoDto) {
        Regiao salvo = regiaoService.salvar(construirRegiao(regiaoDto));
        return ResponseEntity.ok(regiaoDtoMapper.toRegiaoResponseDto(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegiaoResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody RegiaoRequestDto regiaoDto) {
        Regiao existente = regiaoService.encontrarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        atualizarRegiao(existente, regiaoDto);
        Regiao salvo = regiaoService.salvar(existente);
        return ResponseEntity.ok(regiaoDtoMapper.toRegiaoResponseDto(salvo));
    }

    private Regiao construirRegiao(RegiaoRequestDto dto) {
        Regiao regiao = new Regiao();
        regiao.setNome(dto.getNome());
        regiao.setUf(dto.getUf());
        regiao.setGerenteRegional(dto.getGerenteRegional());
        regiao.setStatus(dto.getStatus());
        return regiao;
    }

    private void atualizarRegiao(Regiao regiao, RegiaoRequestDto dto) {
        regiao.setNome(dto.getNome());
        regiao.setUf(dto.getUf());
        regiao.setGerenteRegional(dto.getGerenteRegional());
        regiao.setStatus(dto.getStatus());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        regiaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
