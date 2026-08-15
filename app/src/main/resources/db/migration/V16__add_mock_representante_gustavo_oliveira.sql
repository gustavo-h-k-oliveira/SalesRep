-- V16__add_mock_representante_gustavo_oliveira.sql
-- Insere representante mockado Gustavo Oliveira com o numero (14) 98170-4947

INSERT INTO representante (id, nome, regiao_id, email, telefone, cpf_cnpj)
VALUES (999, 'Gustavo Oliveira', 1, 'gustavo.oliveira@salesrep.com.br', '(14) 98170-4947', '999.888.777-66')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    cpf_cnpj = EXCLUDED.cpf_cnpj;

INSERT INTO cliente (id, nome, regiao_id, representante_id, ultima_compra, status)
VALUES (999, 'Mercado Teste Gustavo', 1, 999, CURRENT_DATE - INTERVAL '15 days', 'ATIVO')
ON CONFLICT (id) DO UPDATE SET
    representante_id = EXCLUDED.representante_id,
    status = EXCLUDED.status;
