-- Atualiza a senha do Marcos para repsenha1
UPDATE usuario
SET senha = '$2b$12$lO6X/bvt9HY95iqVvAbox.kUHw9MtFHfzPlJsjIi/L.KsDyxncrjS'
WHERE nome_usuario = 'marcos';

-- Atualiza a senha da Fernanda para repsenha2
UPDATE usuario
SET senha = '$2b$12$QelwAGFIT0Xq83bV.NvRlOWUnKGnwDYbCzsvP0GgK79gPUrXgnMa6'
WHERE nome_usuario = 'fernanda';
