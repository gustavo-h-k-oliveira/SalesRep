-- V10__update_representante_email_telefone_from_csv.sql
-- Atualiza e-mail e telefone dos representantes/gestores cadastrados a partir do arquivo RELATORIO DE RV CADASTRO.csv

-- Garantir a existencia da coluna email na tabela representante e permitir telefone nulo
ALTER TABLE representante ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE representante ALTER COLUMN telefone DROP NOT NULL;

-- Representante ID 38: 33.125.192 MARA FERREIRA DOS SANTOS', 1 (CNPJ: 33.125.192/0001-11)
UPDATE representante SET telefone = '14-981961110', email = 'maraferreira.santos@hotmail.com' WHERE id = 38;

-- Representante ID 61: 54.659.364 ANA CARLA NOVAES PAUPERIO', 1 (CNPJ: 54.659.364/0001-07)
UPDATE representante SET telefone = '14-991682403', email = 'acarlapauperio@gmail.com' WHERE id = 61;

-- Representante ID 47: 58.431.458 GABRIEL PEREIRA SANTANA', 1 (CNPJ: 58.431.458/0001-85)
UPDATE representante SET telefone = NULL, email = 'pereirasant98@gmail.com' WHERE id = 47;

