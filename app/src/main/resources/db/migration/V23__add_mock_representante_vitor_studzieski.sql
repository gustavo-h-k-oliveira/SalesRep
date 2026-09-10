-- V23__add_mock_representante_vitor_studzieski.sql
-- Insere representante mockado Vitor Studzieski com o numero (14) 99778-7717 e 3 clientes inativos para teste

INSERT INTO representante (id, nome, regiao_id, email, telefone, cpf_cnpj)
VALUES (997, 'Vitor Studzieski', 1, 'vitor.studzieski@salesrep.com.br', '(14) 99778-7717', '777.666.555-44')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    cpf_cnpj = EXCLUDED.cpf_cnpj;

INSERT INTO cliente (id, nome, regiao_id, representante_id, ultima_compra, status)
VALUES 
    (9971, 'Supermercado Nova Esperança', 1, 997, CURRENT_DATE - INTERVAL '55 days', 'INATIVO'),
    (9972, 'Empório & Mercearia Central', 1, 997, CURRENT_DATE - INTERVAL '80 days', 'INATIVO'),
    (9973, 'Comercial Alimentos Studzieski', 1, 997, CURRENT_DATE - INTERVAL '110 days', 'INATIVO'),
    (9974, 'Atacado Vanguarda', 1, 997, CURRENT_DATE - INTERVAL '10 days', 'ATIVO')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    representante_id = EXCLUDED.representante_id,
    ultima_compra = EXCLUDED.ultima_compra,
    status = EXCLUDED.status;

INSERT INTO usuario (nome_usuario, senha, papel, status, representante_id, email)
VALUES ('vitor', '$2b$12$jbN/USyEytaAB90Ct41dOuncMHPlW.V49.VxSXxKDrLa8Cc8Fx4qO', 'REPRESENTANTE', 'ATIVO', 997, 'vitor.studzieski@salesrep.com.br')
ON CONFLICT (email) DO UPDATE SET
    nome_usuario = EXCLUDED.nome_usuario,
    senha = EXCLUDED.senha,
    papel = EXCLUDED.papel,
    status = EXCLUDED.status,
    representante_id = EXCLUDED.representante_id;
