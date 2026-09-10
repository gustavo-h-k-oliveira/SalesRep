-- V17__add_mock_representante_wagner.sql
-- Insere representante mockado Wagner com o numero +55 14 99721-0485 e varios clientes inativos para gerar alertas

INSERT INTO representante (id, nome, regiao_id, email, telefone, cpf_cnpj)
VALUES (998, 'Wagner', 1, 'wagner@salesrep.com.br', '+55 14 99721-0485', '888.777.666-55')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    cpf_cnpj = EXCLUDED.cpf_cnpj;

INSERT INTO cliente (id, nome, regiao_id, representante_id, ultima_compra, status)
VALUES 
    (9981, 'Supermercado Wagner & Cia', 1, 998, CURRENT_DATE - INTERVAL '60 days', 'INATIVO'),
    (9982, 'Distribuidora Botucatu', 1, 998, CURRENT_DATE - INTERVAL '90 days', 'INATIVO'),
    (9983, 'Atacado Central Paulista', 1, 998, CURRENT_DATE - INTERVAL '120 days', 'INATIVO'),
    (9984, 'Mercado Comercio Regional', 1, 998, CURRENT_DATE - INTERVAL '75 days', 'INATIVO')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    representante_id = EXCLUDED.representante_id,
    ultima_compra = EXCLUDED.ultima_compra,
    status = EXCLUDED.status;

UPDATE cliente SET nome = 'Supermercado Wagner & Cia' WHERE id = 991 AND representante_id = 998;
UPDATE cliente SET nome = 'Distribuidora Botucatu' WHERE id = 992 AND representante_id = 998;
UPDATE cliente SET nome = 'Atacado Central Paulista' WHERE id = 993 AND representante_id = 998;
UPDATE cliente SET nome = 'Mercado Comercio Regional' WHERE id = 994 AND representante_id = 998;
