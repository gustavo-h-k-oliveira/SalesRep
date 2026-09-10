-- Migration V13: Adicionar dados de teste (clientes, pedidos e itens) para o Representante #1 (Marcos Pereira)

-- 1. Inserção de novos clientes para o Representante #1 (regiao_id = 1, representante_id = 1)
INSERT INTO cliente (id, nome, regiao_id, representante_id, ultima_compra, status) VALUES
(4001, 'SUPERMERCADO PAULISTA DO VALE LTDA', 1, 1, '2026-08-05', 'ATIVO'),
(4002, 'CHOCOLATERIA E ATACADO PÁSCOA REAL LTDA', 1, 1, '2026-08-10', 'ATIVO'),
(4003, 'EMPORIO E CONVENIENCIA SÃO MARCOS LTDA', 1, 1, '2026-05-15', 'INATIVO')
ON CONFLICT (id) DO NOTHING;

-- 2. Inserção de pedidos para os clientes do Representante #1
INSERT INTO pedido (id, cliente_id, representante_id, data_emissao, data_faturamento, valor_total, status, autorizacao_comercial) VALUES
(5001, 4001, 1, '2026-08-05', '2026-08-06', 28500.00, 'FATURADO', 'AUTORIZADO'),
(5002, 4002, 1, '2026-08-10', '2026-08-11', 45200.00, 'FATURADO', 'AUTORIZADO'),
(5003, 4001, 1, '2026-08-11', NULL, 18750.00, 'EMITIDO', 'AVALIANDO')
ON CONFLICT (id) DO UPDATE SET autorizacao_comercial = EXCLUDED.autorizacao_comercial, status = EXCLUDED.status;

-- 3. Inserção de itens dos pedidos
INSERT INTO pedido_item (id, pedido_id, produto_id, quantidade, preco_unitario, sub_total) VALUES
(6001, 5001, 55, 100, 150.00, 15000.00),
(6002, 5001, 1, 300, 45.00, 13500.00),
(6003, 5002, 56, 200, 120.00, 24000.00),
(6004, 5002, 57, 160, 132.50, 21200.00),
(6005, 5003, 15, 250, 75.00, 18750.00)
ON CONFLICT (id) DO NOTHING;
