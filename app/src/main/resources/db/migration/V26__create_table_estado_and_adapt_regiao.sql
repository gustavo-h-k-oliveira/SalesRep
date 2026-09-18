-- V26__create_table_estado_and_adapt_regiao.sql
-- Separação conceitual entre Estado (UF) e Região (Macrorregiões do Brasil)

-- 1. Criação da tabela estado
CREATE TABLE IF NOT EXISTS estado (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    uf VARCHAR(50) NOT NULL UNIQUE,
    regiao_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'NORMAL'
);

-- 2. Inserção dos 27 estados vinculados às 5 macrorregiões comerciais:
-- 1 = Sudeste, 2 = Sul, 3 = Nordeste, 4 = Centro-Oeste, 5 = Norte
INSERT INTO estado (id, nome, uf, regiao_id, status) VALUES
(1, 'São Paulo', 'SP', 1, 'NORMAL'),
(2, 'Rio Grande do Sul', 'RS', 2, 'NORMAL'),
(3, 'Rio de Janeiro', 'RJ', 1, 'NORMAL'),
(4, 'Minas Gerais', 'MG', 1, 'NORMAL'),
(5, 'Espírito Santo', 'ES', 1, 'NORMAL'),
(6, 'Paraná', 'PR', 2, 'NORMAL'),
(7, 'Santa Catarina', 'SC', 2, 'NORMAL'),
(8, 'Bahia', 'BA', 3, 'NORMAL'),
(9, 'Pernambuco', 'PE', 3, 'NORMAL'),
(10, 'Ceará', 'CE', 3, 'NORMAL'),
(11, 'Alagoas', 'AL', 3, 'NORMAL'),
(12, 'Sergipe', 'SE', 3, 'NORMAL'),
(13, 'Paraíba', 'PB', 3, 'NORMAL'),
(14, 'Rio Grande do Norte', 'RN', 3, 'NORMAL'),
(15, 'Piauí', 'PI', 3, 'NORMAL'),
(16, 'Maranhão', 'MA', 3, 'NORMAL'),
(17, 'Goiás', 'GO', 4, 'NORMAL'),
(18, 'Distrito Federal', 'DF', 4, 'NORMAL'),
(19, 'Mato Grosso', 'MT', 4, 'NORMAL'),
(20, 'Mato Grosso do Sul', 'MS', 4, 'NORMAL'),
(21, 'Pará', 'PA', 5, 'NORMAL'),
(22, 'Amazonas', 'AM', 5, 'NORMAL'),
(23, 'Rondônia', 'RO', 5, 'NORMAL'),
(24, 'Acre', 'AC', 5, 'NORMAL'),
(25, 'Roraima', 'RR', 5, 'NORMAL'),
(26, 'Amapá', 'AP', 5, 'NORMAL'),
(27, 'Tocantins', 'TO', 5, 'NORMAL')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    uf = EXCLUDED.uf,
    regiao_id = EXCLUDED.regiao_id,
    status = EXCLUDED.status;

SELECT setval('estado_id_seq', (SELECT COALESCE(MAX(id), 1) FROM estado));

-- 3. Adiciona estado_id em cliente e representante
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS estado_id BIGINT;
ALTER TABLE representante ADD COLUMN IF NOT EXISTS estado_id BIGINT;

-- 4. Migra os estados atuais (que estavam armazenados em regiao_id)
UPDATE cliente SET estado_id = regiao_id WHERE estado_id IS NULL;
UPDATE representante SET estado_id = regiao_id WHERE estado_id IS NULL;

-- 5. Atualiza regiao_id de cliente e representante para a respectiva macrorregião (1 a 5)
UPDATE cliente c
SET regiao_id = e.regiao_id
FROM estado e
WHERE c.estado_id = e.id;

UPDATE representante r
SET regiao_id = e.regiao_id
FROM estado e
WHERE r.estado_id = e.id;

-- 6. Atualiza meta_comercial caso tenha regiao_id apontando para antigos IDs de estados (> 5)
UPDATE meta_comercial m
SET regiao_id = e.regiao_id
FROM estado e
WHERE m.regiao_id = e.id;

-- 7. Remove da tabela regiao os registros excedentes (> 5), pois agora representam estados
DELETE FROM regiao WHERE id > 5;

-- 8. Remove a coluna 'uf' da tabela regiao (uf agora pertence exclusivamente a estado)
ALTER TABLE regiao DROP COLUMN IF EXISTS uf;

-- 9. Atualiza e garante as 5 macrorregiões oficiais e seus respectivos gerentes regionais
INSERT INTO regiao (id, nome, gerente_regional, status) VALUES
(1, 'Sudeste', 'Carlos Silva', 'NORMAL'),
(2, 'Sul', 'Patrícia Oliveira', 'NORMAL'),
(3, 'Nordeste', 'Roberto Mendes', 'NORMAL'),
(4, 'Centro-Oeste', 'Aline Costa', 'NORMAL'),
(5, 'Norte', 'Fernando Ramos', 'NORMAL')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    gerente_regional = EXCLUDED.gerente_regional,
    status = EXCLUDED.status;

SELECT setval('regiao_id_seq', (SELECT COALESCE(MAX(id), 1) FROM regiao));

-- 10. Chaves estrangeiras e índices de performance
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_estado_regiao') THEN
        ALTER TABLE estado ADD CONSTRAINT fk_estado_regiao FOREIGN KEY (regiao_id) REFERENCES regiao(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_cliente_estado') THEN
        ALTER TABLE cliente ADD CONSTRAINT fk_cliente_estado FOREIGN KEY (estado_id) REFERENCES estado(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_representante_estado') THEN
        ALTER TABLE representante ADD CONSTRAINT fk_representante_estado FOREIGN KEY (estado_id) REFERENCES estado(id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_cliente_estado_id ON cliente(estado_id);
CREATE INDEX IF NOT EXISTS idx_representante_estado_id ON representante(estado_id);
CREATE INDEX IF NOT EXISTS idx_estado_regiao_id ON estado(regiao_id);
