-- Seed basic regions and representatives to allow V2 migration to pass constraints
INSERT INTO regiao (id, nome, uf, gerente_regional, status) VALUES
(1, 'Sudeste', 'SP', 'Carlos Silva', 'NORMAL'),
(2, 'Sul', 'RS', 'Patrícia Oliveira', 'NORMAL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO representante (id, nome, regiao_id, telefone) VALUES
(1, 'Marcos Pereira', 1, '11988887777'),
(2, 'Fernanda Souza', 2, '51333445566')
ON CONFLICT (id) DO NOTHING;
