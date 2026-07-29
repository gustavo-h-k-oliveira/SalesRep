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

CREATE TABLE IF NOT EXISTS usuario (
    id BIGSERIAL PRIMARY KEY,
    nome_usuario VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    papel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    representante_id BIGINT UNIQUE REFERENCES representante(id)
);

CREATE TABLE IF NOT EXISTS alerta (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    criticidade VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    data_geracao TIMESTAMP NOT NULL,
    cliente_id BIGINT REFERENCES cliente(id)
);

CREATE TABLE IF NOT EXISTS log_auditoria (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    evento VARCHAR(50) NOT NULL,
    ip VARCHAR(50),
    user_agent VARCHAR(255),
    data_hora TIMESTAMP NOT NULL
);
