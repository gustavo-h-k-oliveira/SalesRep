# SalesRep

Sistema inteligente de monitoramento e priorização comercial desenvolvido para transformar dados comerciais dispersos em alertas, análises e recomendações acionáveis.

## Visão Geral

O **Sagra Radar Comercial** é uma aplicação web integrada ao ERP WK Radar que auxilia representantes e gestores comerciais na identificação de oportunidades de venda, recuperação de clientes inativos e tomada de decisão baseada em dados.

O foco da plataforma não é apenas visualizar indicadores, mas transformar dados históricos em ações comerciais claras e priorizadas.

---

## Objetivo do Projeto

Centralizar informações comerciais e gerar inteligência operacional através de:

* Alertas automáticos
* Rankings de clientes prioritários
* Análises regionais
* Identificação de riscos comerciais
* Recomendações de negociação
* Plano de ação diário

---

## Principais Funcionalidades

### Dashboard Executivo

Visualização consolidada de:

* Faturamento
* Entrada de pedidos
* Clientes ativos
* Clientes inativos
* Positivação
* Regiões críticas
* Alertas prioritários

---

### Alertas Comerciais

Detecção automática de:

* Clientes sem compra recente
* Regiões com queda de faturamento
* Produtos com baixa recompra
* Carteiras comerciais em risco

---

### Ranking de Clientes

Priorização automática baseada em:

* Recência de compra
* Frequência
* Ticket médio
* Potencial comercial
* Tendência de consumo

---

### Perfil Comercial do Cliente

Exibição de:

* Histórico de compras
* Produtos recorrentes
* Ticket médio
* Último pedido
* Tendência de compra

---

### Plano de Ação Diário

Sugestões comerciais acionáveis:

* Clientes para contato
* Regiões prioritárias
* Produtos recomendados
* Oportunidades comerciais

---

## Arquitetura do Projeto

```text
Frontend (React + Vite + TypeScript)
    ↓ (HTTP / Cookie Auth JWT)
API REST (Spring Boot Security)
    ↓
Services & Security & Auditoria
    ↓
Analytics + Rules (Score Comercial & Alertas)
    ↓
Repositories (Spring Data JPA)
    ↓
PostgreSQL
```

---

## Stack Tecnológica

### Backend

* Java 21
* Spring Boot 3 / 4
* Spring Data JPA
* Spring Validation
* Spring Security (JWT / Cookie HttpOnly)
* PostgreSQL
* Lombok
* Gradle

---

### Frontend

* React 18
* Vite
* TypeScript
* TailwindCSS
* ShadCN/UI
* Lucide React
* Recharts

---

## Estrutura do Backend

```text
app/src/main/java/org/company
│
├── analytics       # Lógica analítica e cálculos de score/recorrência
├── config          # Configurações de segurança, CORS e beans da aplicação
├── controller      # Controllers REST da API
├── dto             # Objetos de transferência de dados (Request/Response)
├── entity          # Entidades JPA (Cliente, Pedido, Produto, Regiao, etc.)
├── exception       # Trata exceções globais e retornos HTTP
├── mapper          # Mapeadores DTO/Entidade
├── repository      # Interfaces Spring Data JPA
├── rules           # Regras de negócio comerciais (RN001 - RN005)
├── security        # Filtros JWT, UsuarioPrincipal e SecurityUtils
├── service         # Serviços de orquestração, regras e autenticação
└── util            # Utilitários gerais
```

---

## Conceitos Arquiteturais

### Service

Responsável pela orquestração do fluxo da aplicação.

Exemplos:

* Buscar e persistir dados
* Coordenar chamadas de auditoria e segurança
* Montar respostas e orquestrar regras

---

### Analytics

Responsável pelos cálculos analíticos.

Exemplos:

* Score comercial
* Ticket médio
* Tendência de compra
* Ranking de clientes prioritários
* Recomendações de produtos

---

### Rules

Responsável pelas regras de negócio.

Exemplos:

* Definir cliente inativo (dias sem compra > 45)
* Detectar regiões críticas (queda faturamento > 20%)
* Gerar alertas e prioridades
* Classificar riscos e oportunidades

---

### Security & Auditoria

Responsável pela autenticação, controle de acesso e auditoria de ações.

* **Autenticação:** Suporte a Login via JWT com envio de Cookie HttpOnly (`AUTH_TOKEN`) ou Header Bearer.
* **Perfis de Acesso (RBAC):** 
  * `GESTOR`: Acesso completo ao sistema, auditoria de acessos e visão consolidada de todas as regiões.
  * `REPRESENTANTE`: Acesso restrito aos clientes, pedidos, recomendações e alertas de sua própria carteira.
* **Log de Auditoria:** Registro automático de eventos de login, logout e operações sensíveis no sistema.

---

## Regras de Negócio Principais

### Cliente Ativo

```text
Última compra <= 45 dias
```

---

### Cliente Inativo

```text
Última compra > 45 dias
```

---

### Região Crítica

```text
Queda de faturamento > 20%
```

---

### Score Comercial

```text
score =
(ticket_medio * 0.3)
+
(frequencia * 0.3)
+
(dias_sem_compra * 0.4)
```

---

## Estrutura de Dados

### Entidades Principais

#### Cliente

* id
* nome
* região
* representante
* última compra
* status (ATIVO / INATIVO)

---

#### Pedido

* id
* cliente
* representante
* data emissão
* data faturamento
* valor total
* status (EMISSAO, FATURADO, CANCELADO, etc.)
* autorização comercial

---

#### Produto

* id
* sku
* descrição

---

#### Representante

* id
* nome
* região
* carteira

---

#### Usuário

* id
* nomeUsuario
* email
* senha
* role (ROLE_GESTOR, ROLE_REPRESENTANTE)
* representante (opcional, para vínculo)

---

## KPIs Monitorados

* Entrada de pedido
* Pedido faturado
* Clientes ativos
* Clientes inativos
* Faturamento por SKU
* Ticket médio
* Positivação
* Faturamento regional
* Score comercial e clientes prioritários

---

## Como Executar o Projeto

### Pré-requisitos

* Java 21 JDK
* Node.js 18+ e npm
* PostgreSQL ou Docker

---

### 1. Preparar o Banco de Dados (PostgreSQL)

Você pode utilizar o PostgreSQL instalado localmente na sua máquina ou via Docker:

#### Opção A — PostgreSQL Local
Crie um banco de dados relacional com o nome `salesrep_new` (ou configure no `app/src/main/resources/application.properties`):
* **URL:** `jdbc:postgresql://localhost:5432/salesrep_new`
* **Usuário:** `postgres`
* **Senha:** `root` (ou a senha configurada no seu PostgreSQL)

#### Opção B — PostgreSQL via Docker Compose
Se preferir subir um contêiner isolado do PostgreSQL via Docker:
```bash
docker-compose up -d db
```

---

### 2. Executar o Backend (Spring Boot) & Migrações Automáticas

Navegue até a raiz do projeto e execute:

```bash
# No Windows (PowerShell / CMD)
.\gradlew.bat app:bootRun

# No Linux / macOS
./gradlew app:bootRun
```

> [!NOTE]
> **Criação e Povoamento do Banco de Dados (Flyway):**
> Ao iniciar o backend, a ferramenta **Flyway** executa automaticamente todos os scripts SQL contidos em `app/src/main/resources/db/migration/`. Isso criará a estrutura de tabelas no PostgreSQL e inserirá os dados de demonstração (clientes, representantes, regiões, produtos e pedidos) sem necessidade de importação manual.

A API estará disponível em `http://localhost:8080`.

---

### 3. Executar o Frontend (React + Vite)

Em um novo terminal, acesse o diretório frontend:

```bash
cd frontend
npm install
npm run dev
```

A aplicação web estará disponível em `http://localhost:5173`.

---

## Fluxo Analítico

```text
CSV/XLSX ou ERP
    ↓
ETL / Data Pipeline
    ↓
PostgreSQL
    ↓
Métricas & Analytics
    ↓
Regras de Negócio (Rules)
    ↓
Alertas e Recomendações
    ↓
Dashboard Executivo & Representante
```

---

## Objetivo Acadêmico

O projeto busca validar:

* Aplicação prática de Business Intelligence
* Modelagem analítica de carteira comercial
* Engenharia de software e arquitetura REST corporativa
* Segurança baseada em papéis (RBAC) e auditoria
* Desenvolvimento de dashboards comerciais responsivos
* Transformação de dados em inteligência de negócio acionável

---

## Diferencial da Solução

O diferencial do projeto não está apenas na visualização de dados.

O foco principal é:

```text
Dados consolidados
+
Priorização automática (Score)
+
Recomendação comercial acionável
```


