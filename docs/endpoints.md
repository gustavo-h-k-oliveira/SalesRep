# API Endpoints — SalesRep

Este documento lista e descreve todos os endpoints REST disponíveis na aplicação **SalesRep / Sagra Radar Comercial**.

---

## Autenticação (`/auth`)

Endpoints responsáveis pela autenticação de usuários, renovação de acesso, logout e recuperação de senha.

- `POST /auth/login`
  - Realiza a autenticação do usuário com e-mail e senha. Retorna o token JWT e grava um Cookie HttpOnly (`AUTH_TOKEN`). Registra evento no Log de Auditoria.
- `POST /auth/logout`
  - Invalida a sessão/cookie de autenticação do usuário. Registra evento no Log de Auditoria.
- `POST /auth/recuperar-senha`
  - Solicita o envio de e-mail com instruções/token para recuperação de senha.
- `POST /auth/redefinir-senha`
  - Redefine a senha utilizando o token de recuperação fornecido.

---

## Health & Status

Endpoints de verificação de disponibilidade da API.

- `GET /`
  - Endpoint raiz de boas-vindas da API.
- `GET /health`
  - Retorna o status de saúde da aplicação (`OK`).

---

## Log de Auditoria (`/auditoria`)

Acesso restrito ao papel `GESTOR`.

- `GET /auditoria`
  - Retorna uma lista paginada dos logs de auditoria contendo registro de acessos, logins, logouts e eventos sensíveis.

---

## Dashboard (`/dashboard`)

- `GET /dashboard`
  - Retorna o resumo consolidado de métricas e KPIs (faturamento, clientes ativos, clientes inativos, positivados, regiões críticas e alertas). Adapta o escopo de dados dependendo do perfil autenticado (Gestor ou Representante).

---

## Alertas (`/alertas`)

- `GET /alertas`
  - Retorna a lista de alertas comerciais gerados pelas regras de negócio (clientes inativos, regiões críticas, produtos com queda de recompra).

---

## Clientes (`/clientes`)

- `GET /clientes`
  - Lista todos os clientes cadastrados (com suporte a paginação).
- `GET /clientes/{id}`
  - Busca detalhes de um cliente específico por ID.
- `GET /clientes/regiao/{regiaoId}`
  - Lista clientes vinculados a uma determinada região.
- `GET /clientes/representante/{representanteId}`
  - Lista clientes vinculados a um determinado representante comercial.
- `GET /clientes/status/{status}`
  - Lista clientes filtrados pelo status (`ATIVO`, `INATIVO`).
- `GET /clientes/inativos`
  - Lista clientes inativos (sem compras nos últimos 45 dias).
- `GET /clientes/prioritarios`
  - Lista clientes priorizados ordenados pelo **Score Comercial**.
- `GET /clientes/{id}/perfil`
  - Retorna a análise de perfil detalhada do cliente (histórico, ticket médio, tendência e métricas).
- `GET /clientes/{id}/recomendacoes`
  - Retorna produtos recomendados para oferta/recompra para o cliente especificado.
- `POST /clientes`
  - Cadastra um novo cliente.
- `PUT /clientes/{id}`
  - Atualiza os dados de um cliente existente.
- `DELETE /clientes/{id}`
  - Remove um cliente por ID.

---

## Pedidos (`/pedidos`)

- `GET /pedidos`
  - Lista os pedidos (filtra automaticamente por carteira caso o usuário seja Representante).
- `GET /pedidos/{id}`
  - Busca detalhes de um pedido por ID.
- `GET /pedidos/cliente/{clienteId}`
  - Lista o histórico de pedidos de um determinado cliente.
- `GET /pedidos/representante/{representanteId}`
  - Lista pedidos associados a um representante específico.
- `GET /pedidos/status/{status}`
  - Lista pedidos pelo status (`EMISSAO`, `FATURADO`, `CANCELADO`, etc.).
- `GET /pedidos/faturados`
  - Lista apenas pedidos com status faturado.
- `GET /pedidos/nao-faturados`
  - Lista pedidos pendentes de faturamento.
- `GET /pedidos/periodo?inicio={YYYY-MM-DD}&fim={YYYY-MM-DD}`
  - Lista pedidos emitidos dentro do intervalo de datas informado.
- `POST /pedidos`
  - Cria um novo pedido.
- `PUT /pedidos/{id}`
  - Atualiza um pedido existente.
- `DELETE /pedidos/{id}`
  - Exclui um pedido por ID.

---

## Produtos (`/produtos`)

- `GET /produtos`
  - Lista todos os produtos cadastrados com seus respectivos valores faturados acumulados.
- `GET /produtos/{id}`
  - Busca detalhes de um produto por ID.
- `GET /produtos/sku/{sku}`
  - Busca um produto pelo seu código SKU.
- `GET /produtos/criticos`
  - Lista produtos com indicador crítico de baixa recompra ou queda nas vendas.
- `POST /produtos`
  - Cadastra um novo produto.
- `PUT /produtos/{id}`
  - Atualiza os dados de um produto existente.
- `DELETE /produtos/{id}`
  - Exclui um produto por ID.

---

## Itens de Pedido (`/pedido-itens`)

- `GET /pedido-itens`
  - Lista todos os itens de pedidos cadastrados.
- `GET /pedido-itens/{id}`
  - Busca item de pedido por ID.
- `GET /pedido-itens/pedido/{pedidoId}`
  - Lista os itens pertencentes a um pedido específico.
- `GET /pedido-itens/produto/{produtoId}`
  - Lista os itens de pedido associados a um determinado produto.
- `POST /pedido-itens`
  - Adiciona um novo item a um pedido.
- `PUT /pedido-itens/{id}`
  - Atualiza um item de pedido existente.
- `DELETE /pedido-itens/{id}`
  - Remove um item de pedido por ID.

---

## Regiões (`/regioes`)

- `GET /regioes`
  - Lista todas as regiões de atendimento comercial.
- `GET /regioes/{id}`
  - Busca detalhes de uma região por ID.
- `GET /regioes/uf/{uf}`
  - Lista regiões pertencentes a uma Unidade Federativa (UF).
- `GET /regioes/{id}/clientes`
  - Lista os clientes localizados na região especificada.
- `GET /regioes/{id}/representantes`
  - Lista os representantes associados à região especificada.
- `POST /regioes`
  - Cadastra uma nova região.
- `PUT /regioes/{id}`
  - Atualiza uma região existente.
- `DELETE /regioes/{id}`
  - Exclui uma região por ID.

---

## Representantes (`/representantes`)

- `GET /representantes`
  - Lista todos os representantes comerciais.
- `GET /representantes/{id}`
  - Busca detalhes de um representante por ID.
- `GET /representantes/regiao/{regiaoId}`
  - Lista representantes atuantes em determinada região.
- `GET /representantes/{id}/clientes`
  - Lista a carteira de clientes de um determinado representante.
- `GET /representantes/{id}/pedidos`
  - Lista o histórico de pedidos efetuados por um determinado representante.
- `POST /representantes`
  - Cadastra um novo representante.
- `PUT /representantes/{id}`
  - Atualiza os dados de um representante.
- `DELETE /representantes/{id}`
  - Exclui um representante por ID.

