-- V27__update_gestor_regional_sudeste.sql
-- Atualiza o gestor regional da macrorregião Sudeste para Cristiano Robson Esteves

UPDATE regiao
SET gerente_regional = 'Cristiano Robson Esteves'
WHERE nome = 'Sudeste' OR id = 1;
