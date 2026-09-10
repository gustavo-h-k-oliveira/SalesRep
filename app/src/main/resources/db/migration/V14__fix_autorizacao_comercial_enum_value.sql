-- Migration V14: Corrigir valor do enum StatusAutorizacaoComercial de 'APROVADO' para 'AUTORIZADO'

UPDATE pedido 
SET autorizacao_comercial = 'AUTORIZADO' 
WHERE autorizacao_comercial = 'APROVADO' OR autorizacao_comercial NOT IN ('AUTORIZADO', 'REJEITADO', 'AVALIANDO');
