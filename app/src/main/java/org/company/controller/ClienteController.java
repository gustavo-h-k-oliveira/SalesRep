package org.company.controller;

import java.util.List;
import java.util.Optional;

import org.company.dto.ClientePerfilDto;
import org.company.dto.ClientePrioritarioDto;
import org.company.dto.ClienteRequestDto;
import org.company.dto.ClienteResponseDto;
import org.company.entity.Cliente;
import org.company.entity.Regiao;
import org.company.entity.Representante;
import org.company.entity.StatusCliente;
import org.company.mapper.ClienteDtoMapper;
import org.company.service.ClienteAnalyticsService;
import org.company.service.ClienteService;
import org.company.service.RegiaoService;
import org.company.service.RepresentanteService;
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
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;
    private final ClienteAnalyticsService clienteAnalyticsService;
    private final RegiaoService regiaoService;
    private final RepresentanteService representanteService;
    private final ClienteDtoMapper clienteDtoMapper;

    @GetMapping
    public List<ClienteResponseDto> listarTodos() {
        return clienteService.encontrarTodos().stream()
            .map(clienteDtoMapper::toClienteResponseDto)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDto> obterPorId(@PathVariable Long id) {
        return Optional.ofNullable(clienteService.encontrarPorId(id))
            .map(clienteDtoMapper::toClienteResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/regiao/{regiaoId}")
    public List<ClienteResponseDto> listarPorRegiao(@PathVariable Long regiaoId) {
        return clienteService.encontrarPorRegiao(regiaoId).stream()
            .map(clienteDtoMapper::toClienteResponseDto)
            .toList();
    }

    @GetMapping("/representante/{representanteId}")
    public List<ClienteResponseDto> listarPorRepresentante(@PathVariable Long representanteId) {
        return clienteService.encontrarPorRepresentante(representanteId).stream()
            .map(clienteDtoMapper::toClienteResponseDto)
            .toList();
    }

    @GetMapping("/status/{status}")
    public List<ClienteResponseDto> listarPorStatus(@PathVariable StatusCliente status) {
        return clienteService.encontrarPorStatus(status).stream()
            .map(clienteDtoMapper::toClienteResponseDto)
            .toList();
    }

    @GetMapping("/inativos")
    public List<ClienteResponseDto> listarInativos() {
        return clienteService.encontrarInativos().stream()
            .map(clienteDtoMapper::toClienteResponseDto)
            .toList();
    }

    @GetMapping("/prioritarios")
    public List<ClientePrioritarioDto> listarPrioritarios() {
        return clienteAnalyticsService.buscarClientesPrioritarios();
    }

    @GetMapping("/{id}/perfil")
    public ResponseEntity<ClientePerfilDto> obterPerfil(@PathVariable Long id) {
        return Optional.ofNullable(clienteAnalyticsService.buscarPerfil(id))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDto> criar(@Valid @RequestBody ClienteRequestDto clienteDto) {
        try {
            Cliente salvo = clienteService.salvar(construirCliente(clienteDto));
            return ResponseEntity.ok(clienteDtoMapper.toClienteResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody ClienteRequestDto clienteDto) {
        Cliente existente = clienteService.encontrarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            atualizarCliente(existente, clienteDto);
            Cliente salvo = clienteService.salvar(existente);
            return ResponseEntity.ok(clienteDtoMapper.toClienteResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Cliente construirCliente(ClienteRequestDto dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setRegiao(buscarRegiao(dto.getRegiaoId()));
        cliente.setRepresentante(buscarRepresentante(dto.getRepresentanteId()));
        cliente.setUltimaCompra(dto.getUltimaCompra());
        cliente.setStatus(dto.getStatus());
        return cliente;
    }

    private void atualizarCliente(Cliente cliente, ClienteRequestDto dto) {
        cliente.setNome(dto.getNome());
        cliente.setRegiao(buscarRegiao(dto.getRegiaoId()));
        cliente.setRepresentante(buscarRepresentante(dto.getRepresentanteId()));
        cliente.setUltimaCompra(dto.getUltimaCompra());
        cliente.setStatus(dto.getStatus());
    }

    private Regiao buscarRegiao(Long id) {
        Regiao regiao = regiaoService.encontrarPorId(id);
        if (regiao == null) {
            throw new IllegalArgumentException("Região não encontrada: " + id);
        }
        return regiao;
    }

    private Representante buscarRepresentante(Long id) {
        Representante representante = representanteService.encontrarPorId(id);
        if (representante == null) {
            throw new IllegalArgumentException("Representante não encontrado: " + id);
        }
        return representante;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
