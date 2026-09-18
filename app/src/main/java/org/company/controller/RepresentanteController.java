package org.company.controller;

import java.util.List;
import java.util.Optional;

import org.company.dto.RepresentanteRequestDto;
import org.company.dto.RepresentanteResponseDto;
import org.company.dto.ClienteResponseDto;
import org.company.dto.PedidoResponseDto;
import org.company.entity.Representante;
import org.company.entity.Regiao;
import org.company.mapper.RepresentanteDtoMapper;
import org.company.mapper.ClienteDtoMapper;
import org.company.mapper.PedidoDtoMapper;
import org.company.service.RegiaoService;
import org.company.service.RepresentanteService;
import org.company.service.AlertaService;
import org.company.dto.AlertaDto;
import jakarta.validation.Valid;
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

import lombok.RequiredArgsConstructor;

import org.company.entity.Estado;
import org.company.service.EstadoService;

@RestController
@RequestMapping("/representantes")
@RequiredArgsConstructor
public class RepresentanteController {

    private final RepresentanteService representanteService;
    private final RegiaoService regiaoService;
    private final EstadoService estadoService;
    private final AlertaService alertaService;
    private final RepresentanteDtoMapper representanteDtoMapper;
    private final ClienteDtoMapper clienteDtoMapper;
    private final PedidoDtoMapper pedidoDtoMapper;

    @GetMapping
    public List<RepresentanteResponseDto> listarTodos() {
        return representanteService.encontrarTodos().stream()
            .map(representanteDtoMapper::toRepresentanteResponseDto)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepresentanteResponseDto> obterPorId(@PathVariable Long id) {
        return Optional.ofNullable(representanteService.encontrarPorId(id))
            .map(representanteDtoMapper::toRepresentanteResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/regiao/{regiaoId}")
    public List<RepresentanteResponseDto> listarPorRegiao(@PathVariable Long regiaoId) {
        return representanteService.encontrarPorRegiao(regiaoId).stream()
            .map(representanteDtoMapper::toRepresentanteResponseDto)
            .toList();
    }

    @GetMapping("/estado/{estadoId}")
    public List<RepresentanteResponseDto> listarPorEstado(@PathVariable Long estadoId) {
        return representanteService.encontrarPorEstado(estadoId).stream()
            .map(representanteDtoMapper::toRepresentanteResponseDto)
            .toList();
    }

    @GetMapping("/{id}/clientes")
    public List<ClienteResponseDto> listarClientes(@PathVariable Long id) {
        return representanteService.encontrarClientesDoRepresentante(id).stream()
            .map(clienteDtoMapper::toClienteResponseDto)
            .toList();
    }

    @GetMapping("/{id}/pedidos")
    public List<PedidoResponseDto> listarPedidos(@PathVariable Long id) {
        return representanteService.encontrarPedidosDoRepresentante(id).stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @GetMapping("/{id}/alertas")
    public List<AlertaDto> listarAlertas(@PathVariable Long id) {
        return alertaService.buscarAlertas(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<RepresentanteResponseDto> criar(@Valid @RequestBody RepresentanteRequestDto dto) {
        try {
            Representante salvo = representanteService.salvar(construirRepresentante(dto));
            return ResponseEntity.ok(representanteDtoMapper.toRepresentanteResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<RepresentanteResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody RepresentanteRequestDto dto) {
        Representante existente = representanteService.encontrarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            atualizarRepresentante(existente, dto);
            Representante salvo = representanteService.salvar(existente);
            return ResponseEntity.ok(representanteDtoMapper.toRepresentanteResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Representante construirRepresentante(RepresentanteRequestDto dto) {
        Representante representante = new Representante();
        representante.setNome(dto.getNome());
        representante.setCpfCnpj(dto.getCpfCnpj());
        representante.setEmail(dto.getEmail());
        vincularEstadoERegiao(representante, dto);
        representante.setTelefone(dto.getTelefone());
        return representante;
    }

    private void atualizarRepresentante(Representante representante, RepresentanteRequestDto dto) {
        representante.setNome(dto.getNome());
        representante.setCpfCnpj(dto.getCpfCnpj());
        representante.setEmail(dto.getEmail());
        vincularEstadoERegiao(representante, dto);
        representante.setTelefone(dto.getTelefone());
    }

    private void vincularEstadoERegiao(Representante representante, RepresentanteRequestDto dto) {
        if (dto.getEstadoId() != null) {
            Estado estado = estadoService.encontrarPorId(dto.getEstadoId());
            if (estado == null) {
                throw new IllegalArgumentException("Estado não encontrado: " + dto.getEstadoId());
            }
            representante.setEstado(estado);
            representante.setRegiao(estado.getRegiao());
        } else if (dto.getRegiaoId() != null) {
            representante.setRegiao(buscarRegiao(dto.getRegiaoId()));
        } else {
            throw new IllegalArgumentException("Estado ou Região deve ser informado.");
        }
    }

    private Regiao buscarRegiao(Long regiaoId) {
        Regiao regiao = regiaoService.encontrarPorId(regiaoId);
        if (regiao == null) {
            throw new IllegalArgumentException("Região não encontrada: " + regiaoId);
        }
        return regiao;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        representanteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
