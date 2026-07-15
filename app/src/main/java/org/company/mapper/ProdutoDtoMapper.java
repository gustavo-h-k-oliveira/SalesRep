package org.company.mapper;

import java.math.BigDecimal;
import org.company.dto.ProdutoResponseDto;
import org.company.entity.Produto;
import org.company.security.SecurityUtils;
import org.company.service.ProdutoService;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProdutoDtoMapper {

    private final ProdutoService produtoService;

    public ProdutoResponseDto toProdutoResponseDto(Produto produto) {
        Long representanteId = SecurityUtils.isRepresentante() ? SecurityUtils.getRepresentanteId() : null;
        BigDecimal faturamento = produtoService.calcularFaturamentoPorSku(produto.getId(), representanteId);
        return toProdutoResponseDto(produto, faturamento);
    }

    public ProdutoResponseDto toProdutoResponseDto(Produto produto, BigDecimal faturamento) {
        return new ProdutoResponseDto(
            produto.getId(),
            produto.getSku(),
            produto.getDescricao(),
            faturamento
        );
    }
}
