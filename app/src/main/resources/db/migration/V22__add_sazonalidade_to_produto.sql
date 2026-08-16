-- V22__add_sazonalidade_to_produto.sql
-- Adiciona suporte a sazonalidade em produtos para filtragem dinâmica nas recomendações

ALTER TABLE produto ADD COLUMN IF NOT EXISTS sazonal BOOLEAN DEFAULT FALSE;
ALTER TABLE produto ADD COLUMN IF NOT EXISTS mes_inicio_sazonalidade INTEGER;
ALTER TABLE produto ADD COLUMN IF NOT EXISTS mes_fim_sazonalidade INTEGER;

-- Configura os produtos do grupo OVOS (Páscoa: Fevereiro e Março -> meses 2 e 3)
-- Exceção: SKU 3550 permanece sazonal = FALSE (produto recorrente o ano todo)
UPDATE produto
SET sazonal = TRUE,
    mes_inicio_sazonalidade = 2,
    mes_fim_sazonalidade = 3
WHERE grupo = 'OVOS' AND sku <> '3550';

UPDATE produto
SET sazonal = FALSE,
    mes_inicio_sazonalidade = NULL,
    mes_fim_sazonalidade = NULL
WHERE sku = '3550';
