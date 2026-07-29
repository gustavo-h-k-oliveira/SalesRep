-- 1. Adiciona a coluna email aceitando nulo temporariamente
ALTER TABLE usuario ADD COLUMN email VARCHAR(255);

-- 2. Preenche e-mails fictícios para registros existentes no banco
UPDATE usuario SET email = LOWER(TRIM(nome_usuario)) || '@company.com' WHERE email IS NULL;

-- 3. Define a coluna como NOT NULL e adiciona restrição UNIQUE
ALTER TABLE usuario ALTER COLUMN email SET NOT NULL;
ALTER TABLE usuario ADD CONSTRAINT uk_usuario_email UNIQUE (email);

-- 4. Insere usuários padrões de seed apenas se a tabela estiver totalmente vazia
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM usuario) THEN
        INSERT INTO usuario (nome_usuario, senha, papel, status, representante_id, email) VALUES
        ('admin', '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/zBsqquWb4QG5e783t75o4s/7K.', 'GESTOR', 'ATIVO', NULL, 'admin@company.com'),
        ('marcos', '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/zBsqquWb4QG5e783t75o4s/7K.', 'REPRESENTANTE', 'ATIVO', 1, 'marcos@company.com'),
        ('fernanda', '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/zBsqquWb4QG5e783t75o4s/7K.', 'REPRESENTANTE', 'ATIVO', 2, 'fernanda@company.com');
    END IF;
END $$;
