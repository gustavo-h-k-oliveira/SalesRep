-- V6__create_meta_comercial_table.sql
CREATE TABLE IF NOT EXISTS meta_comercial (
    id BIGSERIAL PRIMARY KEY,
    mes_ano DATE NOT NULL,
    meta_faturamento NUMERIC(19,2) NOT NULL,
    meta_positivacao_clientes INTEGER,
    meta_reativacao_inativos INTEGER,
    representante_id BIGINT REFERENCES representante(id),
    regiao_id BIGINT REFERENCES regiao(id)
);
