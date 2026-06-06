package org.company.controller;

import java.util.List;
import java.util.Optional;

import org.company.dto.ProdutoRequestDto;
import org.company.dto.ProdutoResponseDto;
import org.company.entity.Produto;
import org.company.mapper.ProdutoDtoMapper;
import org.company.security.SecurityUtils;
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
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ProdutoDtoMapper produtoDtoMapper;

    private Long getLoggedRepresentanteId() {
        return SecurityUtils.getRepresentanteId();
    }

    private boolean isRepresentante() {
        return SecurityUtils.isRepresentante();
    }

    @GetMapping
    public List<ProdutoResponseDto> listarTodos() {
        if (isRepresentante()) {
            return produtoService.encontrarPorRepresentante(getLoggedRepresentanteId()).stream()
                .map(produtoDtoMapper::toProdutoResponseDto)
                .toList();
        }
        return produtoService.encontrarTodos().stream()
            .map(produtoDtoMapper::toProdutoResponseDto)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDto> obterPorId(@PathVariable Long id) {
        return Optional.ofNullable(produtoService.encontrarPorId(id))
            .map(produtoDtoMapper::toProdutoResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProdutoResponseDto> obterPorSku(@PathVariable String sku) {
        return Optional.ofNullable(produtoService.encontrarPorSku(sku))
            .map(produtoDtoMapper::toProdutoResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/criticos")
    public List<ProdutoResponseDto> listarProdutosCriticos() {
        if (isRepresentante()) {
            return produtoService.buscarProdutosCriticosProduto(getLoggedRepresentanteId()).stream()
                .map(produtoDtoMapper::toProdutoResponseDto)
                .toList();
        }
        return produtoService.buscarProdutosCriticosProduto().stream()
            .map(produtoDtoMapper::toProdutoResponseDto)
            .toList();
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDto> criar(@Valid @RequestBody ProdutoRequestDto produtoDto) {
        Produto salvo = produtoService.salvar(construirProduto(produtoDto));
        return ResponseEntity.ok(produtoDtoMapper.toProdutoResponseDto(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequestDto produtoDto) {
        Produto existente = produtoService.encontrarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        atualizarProduto(existente, produtoDto);
        Produto salvo = produtoService.salvar(existente);
        return ResponseEntity.ok(produtoDtoMapper.toProdutoResponseDto(salvo));
    }

    private Produto construirProduto(ProdutoRequestDto dto) {
        Produto produto = new Produto();
        produto.setSku(dto.getSku());
        produto.setDescricao(dto.getDescricao());
        return produto;
    }

    private void atualizarProduto(Produto produto, ProdutoRequestDto dto) {
        produto.setSku(dto.getSku());
        produto.setDescricao(dto.getDescricao());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
