-- ==========================================================
-- Migração V24: Índices Estratégicos de Performance
-- ==========================================================

-- 1. Índices na tabela pedido_item
-- Acelera a RN003 (baixa recompra) e joins/somas de itens por produto
CREATE INDEX IF NOT EXISTS idx_pedido_item_produto_id ON pedido_item(produto_id);
CREATE INDEX IF NOT EXISTS idx_pedido_item_pedido_id ON pedido_item(pedido_id);

-- 2. Índices na tabela pedido
-- Acelera a busca e batch fetching de pedidos por cliente
CREATE INDEX IF NOT EXISTS idx_pedido_cliente_id ON pedido(cliente_id);
-- Acelera listagens e agregações por representante e status
CREATE INDEX IF NOT EXISTS idx_pedido_representante_status ON pedido(representante_id, status);
-- Acelera filtros por status e intervalo de data de emissão (RN002, RN003)
CREATE INDEX IF NOT EXISTS idx_pedido_status_emissao ON pedido(status, data_emissao);
-- Acelera relatórios de faturamento por período
CREATE INDEX IF NOT EXISTS idx_pedido_status_faturamento ON pedido(status, data_faturamento);

-- 3. Índices na tabela cliente
-- Acelera filtros de clientes por representante (escopo de segurança RN005)
CREATE INDEX IF NOT EXISTS idx_cliente_representante_id ON cliente(representante_id);
-- Acelera filtros por região
CREATE INDEX IF NOT EXISTS idx_cliente_regiao_id ON cliente(regiao_id);
-- Acelera verificação de clientes inativos (RN001)
CREATE INDEX IF NOT EXISTS idx_cliente_status_ultima_compra ON cliente(status, ultima_compra);

-- 4. Índices na tabela alerta
-- Acelera consulta de alertas por cliente
CREATE INDEX IF NOT EXISTS idx_alerta_cliente_id ON alerta(cliente_id);
-- Acelera filtros de alertas pendentes por criticidade
CREATE INDEX IF NOT EXISTS idx_alerta_status_criticidade ON alerta(status, criticidade);
