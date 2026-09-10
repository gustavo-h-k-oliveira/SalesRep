# AGENTS.md — Contexto do Projeto SalesRep (Sagra Radar Comercial)

Este documento foi elaborado para guiar agentes de inteligência artificial (LLMs/assistentes autônomos) no entendimento, desenvolvimento, manutenção e evolução do ecossistema **SalesRep / Sagra Radar Comercial**.

---

## 1. Visão Geral e Propósito do Sistema

O **SalesRep (Sagra Radar Comercial)** é uma plataforma web e mobile-ready corporativa de **inteligência comercial e priorização acionável**, integrada aos dados do ERP WK Radar.

O objetivo do sistema não é apenas expor gráficos de Business Intelligence (BI), mas **transformar dados transacionais e históricos em tomadas de decisão imediatas**:
- Identificação precoce de clientes com risco de churn/abandono.
- Priorização de contatos diários por Score Comercial e Recência.
- Monitoramento de anomalias regionais e quedas de faturamento.
- Identificação de produtos críticos com ruptura no ciclo de recompra.
- Disparo de alertas proativos e canal conversacional via **WhatsApp (Z-API)** para representantes de campo.

---

## 2. Stack Tecnológica

### Backend
- **Linguagem & Runtime:** Java 21 (LTS)
- **Framework:** Spring Boot 3.x
- **Persistência:** Spring Data JPA / Hibernate (batching e connection pool HikariCP otimizados)
- **Banco de Dados:** PostgreSQL (banco padrão: `salesrep_new`)
- **Migrações e Versionamento de Banco:** Flyway (migrações em `app/src/main/resources/db/migration/`)
- **Segurança:** Spring Security 6 (Stateless, JWT, Cookies HttpOnly `AUTH_TOKEN`, suporte a CSRF `XSRF-TOKEN`)
- **Integração Externa:** Z-API (API REST para WhatsApp)
- **Build Tool:** Gradle Wrapper (`./gradlew`)

### Frontend
- **Framework:** React 18 + TypeScript (SPA)
- **Build Tool / Bundler:** Vite
- **Estilização:** TailwindCSS + ShadCN/UI + Lucide React
- **Gráficos e Visualizações:** Recharts
- **Roteamento:** React Router DOM v6
- **Comunicação HTTP:** Fetch API customizada com suporte a credenciais, cookies e CSRF (`frontend/src/services/api.ts`)

### Infraestrutura & Ferramentas
- **Túnel HTTP Local:** `ngrok` (`.\ngrok.exe http 8080`) para recepção de webhooks externos da Z-API.
- **Docker:** `docker-compose.yaml` disponível para subir PostgreSQL.

---

## 3. Arquitetura do Sistema e Estrutura de Diretórios

### Fluxo de Dados
```text
Z-API (WhatsApp Webhook) ──┐
                          ▼
Frontend (React + Vite) ──► Spring Security (Filtros JWT / CORS / CSRF)
                                  │
                                  ▼
                             Controllers REST
                                  │
                                  ▼
                         Services & Auditoria
                                  │
                        ┌─────────┴─────────┐
                        ▼                   ▼
                   Analytics              Rules
             (Score, Quedas, RFM)   (RN001 a RN005)
                        └─────────┬─────────┘
                                  │
                                  ▼
                       Spring Data Repositories
                                  │
                                  ▼
                         PostgreSQL Database
```

### Estrutura do Repositório

```text
SalesRep/
├── AGENTS.md                                # Este guia de contextualização
├── README.md                                # Documentação geral do projeto
├── local-credentials.txt                   # Credenciais de mock para testes locais
├── docker-compose.yaml                      # Subida de container PostgreSQL
├── docs/
│   ├── Modelo_de_negócio.md                 # Especificação conceitual do negócio
│   └── endpoints.md                         # Catálogo de rotas HTTP da API REST
├── app/                                     # Módulo Backend Spring Boot
│   ├── build.gradle
│   └── src/
│       ├── main/
│       │   ├── java/org/company/
│       │   │   ├── analytics/               # Algoritmos de cálculo analítico (Score, Regiões, Produtos)
│       │   │   ├── config/                  # Beans de segurança (SecurityConfig), CORS, WebConfig
│       │   │   ├── controller/              # Endpoints REST (Auth, Clientes, Pedidos, WhatsApp, etc.)
│       │   │   ├── dto/                     # Requests, Responses e projeções de dados
│       │   │   ├── entity/                  # Entidades JPA e Enums de domínio
│       │   │   ├── exception/               # GlobalExceptionHandler e exceções customizadas
│       │   │   ├── mapper/                  # Conversores Entidade <-> DTO
│       │   │   ├── repository/              # Spring Data JPA Repositories
│       │   │   ├── rules/                   # Regras de validação comercial (RN001 a RN005)
│       │   │   ├── security/                # JwtAuthenticationFilter, CsrfCookieFilter, SecurityUtils
│       │   │   ├── service/                 # Serviços de negócio, auditoria e bots
│       │   │   └── util/                    # Utilitários (TelefoneUtils, etc.)
│       │   └── resources/
│       │       ├── application.properties   # Configurações do Spring, Banco, JWT e Z-API
│       │       └── db/migration/            # Scripts versionados Flyway (V1__ até V23__...)
│       └── test/java/org/company/           # Suíte de testes unitários e de integração
└── frontend/                                # Módulo Frontend React Vite
    ├── package.json
    ├── vite.config.ts
    ├── src/
    │   ├── layouts/                         # Layouts com Sidebar e Header autenticado
    │   ├── pages/                           # Páginas da aplicação (Dashboard, Clientes, Pedidos, etc.)
    │   ├── services/                        # Clientes de API (apiFetch, authService, etc.)
    │   ├── types/                           # Interfaces TypeScript espelhando DTOs do backend
    │   └── utils/                           # Formatadores de moeda, datas e helpers visuais
```

---

## 4. Regras de Negócio Fundamentais (Business Rules)

### RN001 — Status do Cliente (Ativo / Inativo / Recuperação)
- **Dias Sem Compra:** `ChronoUnit.DAYS.between(ultimaCompra, LocalDate.now())`
- **Ativo:** `dias_sem_compra < 45` dias.
- **Inativo:** `dias_sem_compra >= 45` dias.
- **Recuperação:** Se o cliente possuir pedidos com status `EMITIDO` ou autorização comercial `AVALIANDO`, seu status transiciona para `RECUPERACAO`.

### RN002 — Região Crítica
- Uma região é classificada como **Crítica** quando o faturamento dos últimos 30 dias apresentar uma **queda superior a 20%** em comparação com o período anterior (de 60 a 31 dias atrás).
- Dispara alertas automáticos de severidade `ALTA`.

### RN003 — Produto com Baixa Recompra
- Analisa itens recorrentes comprados no período entre 90 e 46 dias atrás que **não tiveram compras** nos últimos 45 dias.
- Dispara alertas automáticos de severidade `MEDIA` direcionados ao representante responsável.

### RN004 — Score Comercial e Priorização
- O Score Comercial pondera valor acumulado, frequência e a urgência/risco de perda:
  $$\text{Score} = \min(\text{Ticket Médio}, 10000) \times 0.005 + (\text{Frequência} \times 1.0) + \min(\text{Dias Sem Compra}, 90) \times 0.5$$
- O valor final é normalizado entre `0` e `100`.
- Clientes com score elevado e dias sem compra acentuados são promovidos a **Clientes Prioritários** para contato imediato.

### RN005 — Controle de Acesso e Escopo (RBAC)
- **Papel `GESTOR` (`ROLE_GESTOR`):**
  - Visão global consolidada de faturamento, metas e positividade.
  - Acesso à gestão de representantes (`/representantes`, `/representantes/{id}`).
  - Acesso irrestrito aos Logs de Auditoria (`/auditoria`).
- **Papel `REPRESENTANTE` (`ROLE_REPRESENTANTE`):**
  - Cada representante é vinculado a um registro `Representante` (`representante_id`).
  - **Isolamento obrigatório:** Queries de clientes, pedidos, métricas e alertas filtram estritamente pelo `representanteId` do usuário autenticado (`SecurityUtils.getRepresentanteId()`).
  - Rotas de auditoria e listagem de outros representantes são bloqueadas na API e ocultadas na UI.

---

## 5. Modelo de Dados e Entidades Principais

| Entidade | Tabela | Descrição e Relacionamentos Chave |
| :--- | :--- | :--- |
| `Usuario` | `usuario` | Contas de acesso (login, email, senha com BCrypt, papel `GESTOR` ou `REPRESENTANTE`, vínculo opcional com `Representante`). |
| `Representante` | `representante` | Dados cadastrais do vendedor (nome, telefone, email, CPF/CNPJ, região de atuação `Regiao`). |
| `Cliente` | `cliente` | Dados do cliente, vínculo com `Regiao` e `Representante`, data da última compra e status (`ATIVO`, `INATIVO`, `POTENCIAL`, `RECUPERACAO`). |
| `Pedido` | `pedido` | Registro de venda ligado a `Cliente` e `Representante`, data de emissão, data de faturamento, valor total, status (`EMITIDO`, `FATURADO`, `CANCELADO`) e `autorizacao_comercial`. |
| `PedidoItem` | `pedido_item` | Itens de cada pedido, quantidade, valor unitário, valor total e vínculo com `Produto`. |
| `Produto` | `produto` | Catálogo de produtos, código SKU, descrição, grupo/classe comercial e sazonalidade. |
| `Regiao` | `regiao` | Macrorregiões de vendas (nome, UF, gerente regional e status). |
| `Alerta` | `alerta` | Alertas gerados (tipo `CLIENTE_INATIVO`, `REGIAO_CRITICA`, `PRODUTO_BAIXA_RECOMPRA`), criticidade (`BAIXA`, `MEDIA`, `ALTA`) e status (`PENDENTE`, `RESOLVIDO`). |
| `LogAuditoria` | `log_auditoria` | Rastreabilidade de logins, logouts e eventos críticos (usuário, IP, data/hora, tipo de evento). |
| `WhatsAppConsulta` | `whatsapp_consulta` | Histórico e idempotência de interações recebidas via webhook Z-API (`message_id`, `telefone`, `representante_id`, `comando`, `status`). |

---

## 6. Integração WhatsApp & Z-API

O SalesRep conta com uma via conversacional ativa para representantes consultarem indicadores e receberem alertas via WhatsApp.

### Fluxo do Webhook
1. O representante envia mensagem no WhatsApp para o número conectado na instância Z-API.
2. A Z-API faz um `POST` no endpoint `/whatsapp/webhook` do SalesRep.
3. O `WhatsAppWebhookService`:
   - Valida idempotência via `messageId` na tabela `whatsapp_consulta`.
   - Ignora mensagens enviadas pelo próprio bot (`fromMe: true`) ou de grupos (`isGroup: true`).
   - Normaliza o telefone recebido (`TelefoneUtils.normalizar`) e localiza o `Representante` pelo telefone cadastrado.
   - Envia o comando para o `WhatsAppCommandService`.
   - Responde ao vendedor via API REST da Z-API (`POST /instances/{id}/token/{token}/send-text`).

### Comandos Reconhecidos pelo Bot
| Comando | Descrição da Resposta |
| :--- | :--- |
| `ajuda` / `help` / `menu` | Menu interativo com lista de comandos suportados. |
| `resumo` / `dashboard` | Resumo de faturamento, total de clientes ativos, inativos e alertas pendentes. |
| `clientes inativos` / `inativos` | Lista dos clientes há mais tempo sem comprar com número de dias. |
| `clientes prioritários` / `prioritarios` | Top 5 clientes recomendados para contato imediato. |
| `alertas` / `alertas pendentes` | Lista de até 8 alertas prioritários da carteira. |
| `pedidos recentes` / `pedidos` | Últimos 5 pedidos emitidos com valor e status. |
| `cliente <nome>` | Busca e exibe perfil comercial, ticket médio, dias sem compra e total de pedidos. |

### Representantes de Teste (Mockados)
| ID | Nome | Telefone Cadastrado | Usuário Web | Perfil no WhatsApp |
| :--- | :--- | :--- | :--- | :--- |
| `997` | **Vitor Studzieski** | `(14) 99778-****` *(vide V23)* | `vitor` | 3 clientes inativos (55d, 80d, 110d) e 1 ativo. |
| `998` | **Wagner** | `+55 14 99721-****` *(vide V17)* | - | 4 clientes inativos de teste. |
| `999` | **Gustavo Oliveira** | `(14) 98170-****` *(vide V16)* | `gustavo` | Carteira com cliente ativo de teste. |

> *Nota: Os números completos e parâmetros locais ficam restritos aos scripts de migração do banco (`V16`, `V17`, `V23`) e variáveis de ambiente.*

---

## 7. Políticas de Segurança e Autenticação

1. **Token JWT & Sessão:**
   - No login (`POST /auth/login`), a aplicação gera um token JWT e envia de duas formas:
     - No corpo JSON: `{ token: "..." }`
     - Em Cookie HttpOnly: `AUTH_TOKEN` com tempo de expiração padrão de 24 horas.
2. **Proteção CSRF:**
   - Ativada via `CookieCsrfTokenRepository.withHttpOnlyFalse()`.
   - Gera o cookie `XSRF-TOKEN` que o frontend lê e anexa no cabeçalho `X-XSRF-TOKEN` para requisições `POST`, `PUT` e `DELETE`.
   - **Exceções de CSRF:** Rotas públicas de login, recuperação de senha, `/health` e `/whatsapp/**` estão isentas.
3. **Configuração CORS:**
   - Origens liberadas: `http://localhost:5173`, `http://localhost:4173` (preview), `http://localhost:3000`, `http://localhost:8080` e `https://api.z-api.io`.
   - A rota `/whatsapp/**` possui política permissiva dedicada para não bloquear requisições disparadas por robôs e webhooks da Z-API.

---

## 8. Guia Operacional para Agentes de IA

### Como Executar o Projeto Localmente

1. **Banco de Dados (PostgreSQL):**
   - Garanta que o banco `salesrep_new` existe em `localhost:5432` com usuário `postgres` e sua senha local configurada (ex: `root`).
   - O Flyway aplicará automaticamente todas as migrações até a última existente.

2. **Backend (Spring Boot):**
   ```bash
   ./gradlew :app:bootRun
   # ou no Windows PowerShell:
   .\gradlew.bat :app:bootRun
   ```
   API REST disponível em: `http://localhost:8080`.

3. **Frontend (React + Vite):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Aplicação web disponível em: `http://localhost:5173`.

4. **Túnel para Webhook Z-API (Ngrok):**
   ```bash
   .\ngrok.exe http 8080
   ```
   - Obtenha a URL gerada (ex: `https://xxxx.ngrok-free.app`).
   - Configure a URL no painel da Z-API: `https://xxxx.ngrok-free.app/whatsapp/webhook`.
   - Monitore requisições recebidas em tempo real em `http://127.0.0.1:4040`.

---

## 9. Regras e Boas Práticas para Novos Desenvolvimentos

1. **Alterações de Banco de Dados:**
   - **NUNCA** altere scripts Flyway já executados (`V1__` a `V23__`).
   - Crie sempre uma nova migração incremental: `V<N+1>__descricao_clara.sql` no diretório `app/src/main/resources/db/migration/`.
2. **Escopo de Representante:**
   - Em novos endpoints de consulta, sempre verifique se o usuário logado é `ROLE_REPRESENTANTE`. Em caso positivo, filtre obrigatoriamente os dados por `SecurityUtils.getRepresentanteId()`.
3. **Formatação de Telefones:**
   - Use sempre a classe utilitária `TelefoneUtils` para limpar e normalizar dígitos de telefones antes de salvar ou comparar no WhatsApp.
4. **Respostas da Z-API:**
   - Em chamadas de envio de mensagem pela Z-API, assegure que falhas na API externa não quebrem a transação interna do banco; capture exceções e marque o status da consulta como `ERRO` na entidade `WhatsAppConsulta`.
5. **Padrão de Código do Frontend:**
   - Novas chamadas HTTP devem usar o helper `apiFetch` de `frontend/src/services/api.ts` para manter envio automático de JWT e cabeçalho `X-XSRF-TOKEN`.
