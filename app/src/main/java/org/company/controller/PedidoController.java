package org.company.controller;

import java.util.List;
import java.util.Optional;

import org.company.dto.PedidoRequestDto;
import org.company.dto.PedidoResponseDto;
import org.company.entity.Cliente;
import org.company.entity.Pedido;
import org.company.entity.Representante;
import org.company.entity.StatusPedido;
import org.company.mapper.PedidoDtoMapper;
import org.company.security.SecurityUtils;
import org.company.service.ClienteService;
import org.company.service.PedidoService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;
    private final ClienteService clienteService;
    private final RepresentanteService representanteService;
    private final PedidoDtoMapper pedidoDtoMapper;

    private Long getLoggedRepresentanteId() {
        return SecurityUtils.getRepresentanteId();
    }

    private boolean isRepresentante() {
        return SecurityUtils.isRepresentante();
    }

    @GetMapping
    public List<PedidoResponseDto> listarTodos() {
        if (isRepresentante()) {
            return pedidoService.encontrarPorRepresentante(getLoggedRepresentanteId()).stream()
                .map(pedidoDtoMapper::toPedidoResponseDto)
                .toList();
        }
        return pedidoService.encontrarTodos().stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDto> obterPorId(@PathVariable Long id) {
        return Optional.ofNullable(pedidoService.encontrarPorId(id))
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public List<PedidoResponseDto> listarPorCliente(@PathVariable Long clienteId) {
        return pedidoService.encontrarPorCliente(clienteId).stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @GetMapping("/representante/{representanteId}")
    public List<PedidoResponseDto> listarPorRepresentante(@PathVariable Long representanteId) {
        Long loggedRepresentanteId = getLoggedRepresentanteId();
        if (loggedRepresentanteId != null) {
            representanteId = loggedRepresentanteId;
        }
        return pedidoService.encontrarPorRepresentante(representanteId).stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @GetMapping("/status/{status}")
    public List<PedidoResponseDto> listarPorStatus(@PathVariable StatusPedido status) {
        if (isRepresentante()) {
            return pedidoService.encontrarPorStatusERepresentante(status, getLoggedRepresentanteId()).stream()
                .map(pedidoDtoMapper::toPedidoResponseDto)
                .toList();
        }
        return pedidoService.encontrarPorStatus(status).stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @GetMapping("/faturados")
    public List<PedidoResponseDto> listarFaturados() {
        if (isRepresentante()) {
            return pedidoService.encontrarFaturadosPorRepresentante(getLoggedRepresentanteId()).stream()
                .map(pedidoDtoMapper::toPedidoResponseDto)
                .toList();
        }
        return pedidoService.encontrarFaturados().stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @GetMapping("/nao-faturados")
    public List<PedidoResponseDto> listarNaoFaturados() {
        if (isRepresentante()) {
            return pedidoService.encontrarPedidosNaoFaturadosPorRepresentante(getLoggedRepresentanteId()).stream()
                .map(pedidoDtoMapper::toPedidoResponseDto)
                .toList();
        }
        return pedidoService.encontrarPedidosNaoFaturados().stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @GetMapping("/periodo")
    public List<PedidoResponseDto> listarPorPeriodo(
            @RequestParam java.time.LocalDate inicio,
            @RequestParam java.time.LocalDate fim) {
        if (isRepresentante()) {
            return pedidoService.encontrarPedidosPorPeriodoERepresentante(inicio, fim, getLoggedRepresentanteId()).stream()
                .map(pedidoDtoMapper::toPedidoResponseDto)
                .toList();
        }
        return pedidoService.encontrarPedidosPorPeriodo(inicio, fim).stream()
            .map(pedidoDtoMapper::toPedidoResponseDto)
            .toList();
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDto> criar(@Valid @RequestBody PedidoRequestDto pedidoDto) {
        try {
            Pedido salvo = pedidoService.salvar(construirPedido(pedidoDto));
            return ResponseEntity.ok(pedidoDtoMapper.toPedidoResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody PedidoRequestDto pedidoDto) {
        Pedido existente = pedidoService.encontrarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            atualizarPedido(existente, pedidoDto);
            Pedido salvo = pedidoService.salvar(existente);
            return ResponseEntity.ok(pedidoDtoMapper.toPedidoResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Pedido construirPedido(PedidoRequestDto dto) {
        Pedido pedido = new Pedido();
        pedido.setCliente(buscarCliente(dto.getClienteId()));
        if (SecurityUtils.isRepresentante()) {
            pedido.setRepresentante(buscarRepresentante(SecurityUtils.getRepresentanteId()));
        } else {
            pedido.setRepresentante(buscarRepresentante(dto.getRepresentanteId()));
        }
        pedido.setDataEmissao(dto.getDataEmissao());
        pedido.setDataFaturamento(dto.getDataFaturamento());
        pedido.setValorTotal(dto.getValorTotal());
        pedido.setStatus(dto.getStatus());
        pedido.setAutorizacaoComercial(dto.getAutorizacaoComercial());
        return pedido;
    }

    private void atualizarPedido(Pedido pedido, PedidoRequestDto dto) {
        pedido.setCliente(buscarCliente(dto.getClienteId()));
        if (SecurityUtils.isRepresentante()) {
            pedido.setRepresentante(buscarRepresentante(SecurityUtils.getRepresentanteId()));
        } else {
            pedido.setRepresentante(buscarRepresentante(dto.getRepresentanteId()));
        }
        pedido.setDataEmissao(dto.getDataEmissao());
        pedido.setDataFaturamento(dto.getDataFaturamento());
        pedido.setValorTotal(dto.getValorTotal());
        pedido.setStatus(dto.getStatus());
        pedido.setAutorizacaoComercial(dto.getAutorizacaoComercial());
    }

    private Cliente buscarCliente(Long clienteId) {
        Cliente cliente = clienteService.encontrarPorId(clienteId);
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente não encontrado: " + clienteId);
        }
        return cliente;
    }

    private Representante buscarRepresentante(Long representanteId) {
        Representante representante = representanteService.encontrarPorId(representanteId);
        if (representante == null) {
            throw new IllegalArgumentException("Representante não encontrado: " + representanteId);
        }
        return representante;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pedidoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
