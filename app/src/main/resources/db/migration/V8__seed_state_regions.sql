-- V8__seed_state_regions.sql
-- Seed region entities for all Brazilian states (UFs) without adding fake client data

INSERT INTO regiao (id, nome, uf, gerente_regional, status) VALUES
(3, 'Rio de Janeiro', 'RJ', 'Não atribuído', 'NORMAL'),
(4, 'Minas Gerais', 'MG', 'Não atribuído', 'NORMAL'),
(5, 'Espírito Santo', 'ES', 'Não atribuído', 'NORMAL'),
(6, 'Paraná', 'PR', 'Não atribuído', 'NORMAL'),
(7, 'Santa Catarina', 'SC', 'Não atribuído', 'NORMAL'),
(8, 'Bahia', 'BA', 'Não atribuído', 'NORMAL'),
(9, 'Pernambuco', 'PE', 'Não atribuído', 'NORMAL'),
(10, 'Ceará', 'CE', 'Não atribuído', 'NORMAL'),
(11, 'Alagoas', 'AL', 'Não atribuído', 'NORMAL'),
(12, 'Sergipe', 'SE', 'Não atribuído', 'NORMAL'),
(13, 'Paraíba', 'PB', 'Não atribuído', 'NORMAL'),
(14, 'Rio Grande do Norte', 'RN', 'Não atribuído', 'NORMAL'),
(15, 'Piauí', 'PI', 'Não atribuído', 'NORMAL'),
(16, 'Maranhão', 'MA', 'Não atribuído', 'NORMAL'),
(17, 'Goiás', 'GO', 'Não atribuído', 'NORMAL'),
(18, 'Distrito Federal', 'DF', 'Não atribuído', 'NORMAL'),
(19, 'Mato Grosso', 'MT', 'Não atribuído', 'NORMAL'),
(20, 'Mato Grosso do Sul', 'MS', 'Não atribuído', 'NORMAL'),
(21, 'Pará', 'PA', 'Não atribuído', 'NORMAL'),
(22, 'Amazonas', 'AM', 'Não atribuído', 'NORMAL'),
(23, 'Rondônia', 'RO', 'Não atribuído', 'NORMAL'),
(24, 'Acre', 'AC', 'Não atribuído', 'NORMAL'),
(25, 'Roraima', 'RR', 'Não atribuído', 'NORMAL'),
(26, 'Amapá', 'AP', 'Não atribuído', 'NORMAL'),
(27, 'Tocantins', 'TO', 'Não atribuído', 'NORMAL')
ON CONFLICT (id) DO NOTHING;

SELECT setval('regiao_id_seq', (SELECT COALESCE(MAX(id), 1) FROM regiao));
