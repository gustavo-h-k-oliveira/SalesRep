package org.company.mapper;

import org.company.dto.ProdutoResponseDto;
import org.company.entity.Produto;
import org.springframework.stereotype.Component;

@Component
public class ProdutoDtoMapper {

    public ProdutoResponseDto toProdutoResponseDto(Produto produto) {
        return new ProdutoResponseDto(
            produto.getId(),
            produto.getSku(),
            produto.getDescricao()
        );
    }
}
