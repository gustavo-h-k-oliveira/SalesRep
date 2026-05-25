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
Frontend
    ↓
API REST
    ↓
Services
    ↓
Analytics + Rules
    ↓
Repositories
    ↓
PostgreSQL
```

---

## Stack Tecnológica

### Backend

* Java 21
* Spring Boot 4
* Spring Data JPA
* Spring Validation
* Spring Security
* PostgreSQL
* Lombok
* Gradle

---

### Frontend

* React
* Vite
* TypeScript
* TailwindCSS
* ShadCN/UI
* Recharts

---

## Estrutura do Backend

```text
src/main/java/com/sagra/radar
│
├── controller
├── service
├── analytics
├── rules
├── repository
├── entity
├── dto
├── config
├── exception
└── util
```

---

## Conceitos Arquiteturais

### Service

Responsável pela orquestração do fluxo da aplicação.

Exemplos:

* Buscar dados
* Coordenar chamadas
* Montar respostas

---

### Analytics

Responsável pelos cálculos analíticos.

Exemplos:

* Score comercial
* Ticket médio
* Tendência de compra
* Ranking de clientes

---

### Rules

Responsável pelas regras de negócio.

Exemplos:

* Definir cliente inativo
* Gerar alertas
* Classificar prioridades
* Detectar riscos

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
* última compra
* status

---

#### Pedido

* id
* cliente
* representante
* data emissão
* data faturamento
* valor
* status

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

## KPIs Monitorados

* Entrada de pedido
* Pedido faturado
* Clientes ativos
* Clientes inativos
* Faturamento por SKU
* Ticket médio
* Positivação
* Faturamento regional

---

## Fluxo Analítico

```text
CSV/XLSX
    ↓
ETL
    ↓
PostgreSQL
    ↓
Métricas
    ↓
Regras de negócio
    ↓
Alertas e recomendações
    ↓
Dashboard
```

---

## Objetivo Acadêmico

O projeto busca validar:

* Aplicação prática de Business Intelligence
* Modelagem analítica
* Engenharia de software
* Construção de APIs REST
* Desenvolvimento de dashboards comerciais
* Transformação de dados em inteligência de negócio

---

## Diferencial da Solução

O diferencial do projeto não está apenas na visualização de dados.

O foco principal é:

```text
Dados consolidados
+
Priorização automática
+
Recomendação comercial acionável
```

---

## Status do Projeto

```text
🚧 Em desenvolvimento
```

---

## Próximas Etapas

* [ ] Modelagem do banco de dados
* [ ] Importação do dataset comercial
* [ ] Construção da API REST
* [ ] Implementação das regras analíticas
* [ ] Desenvolvimento do dashboard
* [ ] Sistema de alertas
* [ ] Plano de ação automático

---

## Autor

Projeto acadêmico desenvolvido para estudo e prototipação de inteligência comercial orientada por dados.
