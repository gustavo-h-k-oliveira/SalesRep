package org.company.controller;

import java.util.List;
import java.util.Optional;

import org.company.dto.PedidoItemRequestDto;
import org.company.dto.PedidoItemResponseDto;
import org.company.entity.Pedido;
import org.company.entity.PedidoItem;
import org.company.entity.Produto;
import org.company.mapper.PedidoItemDtoMapper;
import org.company.service.PedidoItemService;
import org.company.service.PedidoService;
import org.company.service.ProdutoService;
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
@RequestMapping("/pedido-itens")
@RequiredArgsConstructor
public class PedidoItemController {

    private final PedidoItemService pedidoItemService;
    private final PedidoService pedidoService;
    private final ProdutoService produtoService;
    private final PedidoItemDtoMapper pedidoItemDtoMapper;

    @GetMapping
    public List<PedidoItemResponseDto> listarTodos() {
        return pedidoItemService.encontrarTodos().stream()
            .map(pedidoItemDtoMapper::toPedidoItemResponseDto)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoItemResponseDto> obterPorId(@PathVariable Long id) {
        return Optional.ofNullable(pedidoItemService.encontrarPorId(id))
            .map(pedidoItemDtoMapper::toPedidoItemResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pedido/{pedidoId}")
    public List<PedidoItemResponseDto> listarPorPedido(@PathVariable Long pedidoId) {
        return pedidoItemService.encontrarPorPedido(pedidoId).stream()
            .map(pedidoItemDtoMapper::toPedidoItemResponseDto)
            .toList();
    }

    @GetMapping("/produto/{produtoId}")
    public List<PedidoItemResponseDto> listarPorProduto(@PathVariable Long produtoId) {
        return pedidoItemService.encontrarPorProduto(produtoId).stream()
            .map(pedidoItemDtoMapper::toPedidoItemResponseDto)
            .toList();
    }

    @PostMapping
    public ResponseEntity<PedidoItemResponseDto> criar(@Valid @RequestBody PedidoItemRequestDto dto) {
        try {
            PedidoItem salvo = pedidoItemService.salvar(construirPedidoItem(dto));
            return ResponseEntity.ok(pedidoItemDtoMapper.toPedidoItemResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoItemResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody PedidoItemRequestDto dto) {
        PedidoItem existente = pedidoItemService.encontrarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            atualizarPedidoItem(existente, dto);
            PedidoItem salvo = pedidoItemService.salvar(existente);
            return ResponseEntity.ok(pedidoItemDtoMapper.toPedidoItemResponseDto(salvo));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    private PedidoItem construirPedidoItem(PedidoItemRequestDto dto) {
        PedidoItem item = new PedidoItem();
        item.setPedido(buscarPedido(dto.getPedidoId()));
        item.setProduto(buscarProduto(dto.getProdutoId()));
        item.setQuantidade(dto.getQuantidade());
        item.setPrecoUnitario(dto.getPrecoUnitario());
        item.setSubTotal(dto.getSubTotal());
        return item;
    }

    private void atualizarPedidoItem(PedidoItem item, PedidoItemRequestDto dto) {
        item.setPedido(buscarPedido(dto.getPedidoId()));
        item.setProduto(buscarProduto(dto.getProdutoId()));
        item.setQuantidade(dto.getQuantidade());
        item.setPrecoUnitario(dto.getPrecoUnitario());
        item.setSubTotal(dto.getSubTotal());
    }

    private Pedido buscarPedido(Long pedidoId) {
        Pedido pedido = pedidoService.encontrarPorId(pedidoId);
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido não encontrado: " + pedidoId);
        }
        return pedido;
    }

    private Produto buscarProduto(Long produtoId) {
        Produto produto = produtoService.encontrarPorId(produtoId);
        if (produto == null) {
            throw new IllegalArgumentException("Produto não encontrado: " + produtoId);
        }
        return produto;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pedidoItemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
