-- V25__standardize_regiao_nomes_to_states.sql
-- Padroniza os nomes das regiões 1 e 2 para os respectivos nomes de estados (São Paulo e Rio Grande do Sul)

UPDATE regiao 
SET nome = 'São Paulo' 
WHERE id = 1 AND uf = 'SP';

UPDATE regiao 
SET nome = 'Rio Grande do Sul' 
WHERE id = 2 AND uf = 'RS';
