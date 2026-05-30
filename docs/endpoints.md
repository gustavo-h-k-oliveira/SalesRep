# API Endpoints

Este documento lista os endpoints REST disponíveis na aplicação.

## Dashboard

- `GET /`
- `GET /dashboard`
  - Retorna o resumo do dashboard.

## Alertas

- `GET /alertas`
  - Retorna a lista de alertas comerciais.

## Pedidos

- `GET /pedidos`
  - Lista todos os pedidos.
- `GET /pedidos/{id}`
  - Busca pedido por ID.
- `GET /pedidos/cliente/{clienteId}`
  - Lista pedidos de um cliente.
- `GET /pedidos/representante/{representanteId}`
  - Lista pedidos de um representante.
- `GET /pedidos/status/{status}`
  - Lista pedidos por status.
- `GET /pedidos/faturados`
  - Lista pedidos faturados.
- `GET /pedidos/nao-faturados`
  - Lista pedidos não faturados.
- `GET /pedidos/periodo?inicio={date}&fim={date}`
  - Lista pedidos por período de emissão.
- `POST /pedidos`
  - Cria um pedido.
- `PUT /pedidos/{id}`
  - Atualiza um pedido existente.
- `DELETE /pedidos/{id}`
  - Exclui um pedido.

## Produtos

- `GET /produtos`
  - Lista todos os produtos.
- `GET /produtos/{id}`
  - Busca produto por ID.
- `GET /produtos/sku/{sku}`
  - Busca produto por SKU.
- `GET /produtos/criticos`
  - Lista produtos críticos.
- `POST /produtos`
  - Cria um produto.
- `PUT /produtos/{id}`
  - Atualiza um produto.
- `DELETE /produtos/{id}`
  - Exclui um produto.

## Itens de Pedido

- `GET /pedido-itens`
  - Lista todos os itens de pedido.
- `GET /pedido-itens/{id}`
  - Busca item de pedido por ID.
- `GET /pedido-itens/pedido/{pedidoId}`
  - Lista itens de um pedido específico.
- `GET /pedido-itens/produto/{produtoId}`
  - Lista itens associados a um produto.
- `POST /pedido-itens`
  - Cria um item de pedido.
- `PUT /pedido-itens/{id}`
  - Atualiza um item de pedido.
- `DELETE /pedido-itens/{id}`
  - Exclui um item de pedido.

## Clientes

- `GET /clientes`
  - Lista todos os clientes.
- `GET /clientes/{id}`
  - Busca cliente por ID.
- `GET /clientes/regiao/{regiaoId}`
  - Lista clientes por região.
- `GET /clientes/representante/{representanteId}`
  - Lista clientes por representante.
- `GET /clientes/status/{status}`
  - Lista clientes por status.
- `GET /clientes/inativos`
  - Lista clientes inativos.
- `GET /clientes/prioritarios`
  - Lista clientes prioritários.
- `GET /clientes/{id}/perfil`
  - Busca perfil analítico de um cliente.
- `POST /clientes`
  - Cria um cliente.
- `PUT /clientes/{id}`
  - Atualiza um cliente.
- `DELETE /clientes/{id}`
  - Exclui um cliente.

## Regiões

- `GET /regioes`
  - Lista todas as regiões.
- `GET /regioes/{id}`
  - Busca região por ID.
- `GET /regioes/uf/{uf}`
  - Lista regiões por UF.
- `GET /regioes/{id}/clientes`
  - Lista clientes de uma região.
- `GET /regioes/{id}/representantes`
  - Lista representantes de uma região.
- `POST /regioes`
  - Cria uma região.
- `PUT /regioes/{id}`
  - Atualiza uma região.
- `DELETE /regioes/{id}`
  - Exclui uma região.

## Representantes

- `GET /representantes`
  - Lista todos os representantes.
- `GET /representantes/{id}`
  - Busca representante por ID.
- `GET /representantes/regiao/{regiaoId}`
  - Lista representantes por região.
- `GET /representantes/{id}/clientes`
  - Lista clientes de um representante.
- `GET /representantes/{id}/pedidos`
  - Lista pedidos de um representante.
- `POST /representantes`
  - Cria um representante.
- `PUT /representantes/{id}`
  - Atualiza um representante.
- `DELETE /representantes/{id}`
  - Exclui um representante.

## WhatsApp

- `POST /whatsapp/teste`
  - Envia uma mensagem de teste via WhatsApp.
