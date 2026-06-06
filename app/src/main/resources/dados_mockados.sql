CREATE TABLE IF NOT EXISTS regiao (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    uf VARCHAR(50) NOT NULL,
    gerente_regional VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS representante (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    regiao_id BIGINT NOT NULL REFERENCES regiao(id),
    telefone VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cliente (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    regiao_id BIGINT NOT NULL REFERENCES regiao(id),
    representante_id BIGINT NOT NULL REFERENCES representante(id),
    ultima_compra DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS produto (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES cliente(id),
    representante_id BIGINT NOT NULL REFERENCES representante(id),
    data_emissao DATE NOT NULL,
    data_faturamento DATE,
    valor_total NUMERIC(19,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    autorizacao_comercial VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido_item (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedido(id),
    produto_id BIGINT NOT NULL REFERENCES produto(id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(19,2) NOT NULL,
    sub_total NUMERIC(19,2) NOT NULL
);

INSERT INTO regiao (id, nome, uf, gerente_regional, status) VALUES
(1, 'Sudeste', 'SP', 'Carlos Silva', 'NORMAL'),
(2, 'Sul', 'RS', 'Patrícia Oliveira', 'NORMAL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO representante (id, nome, regiao_id, telefone) VALUES
(1, 'Marcos Pereira', 1, '11988887777'),
(2, 'Fernanda Souza', 2, '51333445566')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cliente (id, nome, regiao_id, representante_id, ultima_compra, status) VALUES
(1, 'Empresa Alpha', 1, 1, '2026-05-20', 'ATIVO'),
(2, 'Loja Beta', 2, 2, '2026-04-01', 'RECUPERACAO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO produto (id, sku, descricao) VALUES
(1, 'SKU-1001', 'Smartphone X'),
(2, 'SKU-2002', 'Notebook Z'),
(3, 'SKU-3003', 'Impressora Laser')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pedido (id, cliente_id, representante_id, data_emissao, data_faturamento, valor_total, status, autorizacao_comercial) VALUES
(1, 1, 1, '2026-05-25', '2026-05-26', 2499.90, 'FATURADO', 'APROVADO'),
(2, 2, 2, '2026-05-10', NULL, 999.00, 'EMITIDO', 'AVALIANDO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pedido_item (id, pedido_id, produto_id, quantidade, preco_unitario, sub_total) VALUES
(1, 1, 1, 1, 2499.90, 2499.90),
(2, 2, 3, 1, 999.00, 999.00)
ON CONFLICT (id) DO NOTHING;
