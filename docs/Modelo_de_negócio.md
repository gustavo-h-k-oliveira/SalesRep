# MODELO DE NEGÓCIO — Sagra Radar Comercial

## 1. Visão Geral

O Sagra Radar Comercial é uma plataforma de inteligência comercial desenvolvida para transformar dados comerciais dispersos em informações acionáveis.

A solução consolida dados oriundos do ERP WK Radar e utiliza regras analíticas para:

* identificar oportunidades comerciais;
* recuperar clientes inativos;
* detectar riscos comerciais;
* priorizar ações de venda;
* apoiar representantes e gestores na tomada de decisão.

O principal diferencial da solução não é apenas a visualização de indicadores, mas a capacidade de interpretar os dados e sugerir ações comerciais concretas.

---

# 2. Problema de Negócio

Atualmente, muitas decisões comerciais dependem:

* de relatórios isolados;
* de conhecimento tácito da equipe;
* de análises manuais;
* de interpretação individual dos dados.

Isso gera:

* baixa velocidade de decisão;
* perda de oportunidades;
* dificuldade de priorização;
* baixa recuperação de clientes inativos;
* pouca previsibilidade comercial.

---

# 3. Proposta de Valor

Transformar dados comerciais em inteligência operacional.

A plataforma permite:

* identificar clientes prioritários;
* detectar riscos comerciais rapidamente;
* aumentar eficiência comercial;
* reduzir esforço analítico manual;
* orientar representantes sobre onde agir primeiro.

---

# 4. Objetivo da Solução

Construir uma plataforma capaz de:

1. consolidar informações comerciais;
2. gerar indicadores estratégicos;
3. detectar oportunidades automaticamente;
4. priorizar clientes e regiões;
5. recomendar ações comerciais;
6. transformar análise em execução.

---

# 5. Público-Alvo

## 5.1 Representantes Comerciais

### Uso principal

* identificar clientes prioritários;
* recuperar clientes inativos;
* preparar negociações;
* organizar rotina comercial.

### Benefícios

* redução do tempo de análise;
* melhor priorização;
* aumento da assertividade comercial.

---

## 5.2 Gestores Comerciais

### Uso principal

* monitorar performance regional;
* acompanhar indicadores;
* identificar regiões críticas;
* redistribuir esforços comerciais.

### Benefícios

* visão consolidada;
* maior controle operacional;
* acompanhamento estratégico.

---

# 6. Pilares da Plataforma

## 6.1 Entrada de Pedido

### Conceito

Representa o volume de pedidos inseridos no sistema.

### Objetivo

Monitorar atividade comercial.

### Regra

Considerar pedidos:

* emitidos;
* aprovados;
* em processamento.

### Não considerar

* pedidos cancelados;
* pedidos rejeitados.

---

## 6.2 Pedido Faturado

### Conceito

Representa pedidos efetivamente faturados.

### Objetivo

Mensurar receita realizada.

### Regra

Considerar apenas pedidos:

* com status faturado;
* ou com data de faturamento preenchida.

---

## 6.3 Clientes Ativos

### Conceito

Clientes com compras recentes.

### Regra

Cliente ativo:

* última compra <= 45 dias.

### Objetivo

Mensurar saúde da carteira comercial.

---

## 6.4 Clientes Inativos

### Conceito

Clientes sem compra acima do período aceitável.

### Regra

Cliente inativo:

* última compra > 45 dias.

### Objetivo

Detectar oportunidades de recuperação.

---

## 6.5 Faturamento por SKU

### Conceito

Receita gerada por produto/SKU.

### Objetivo

Analisar:

* produtos mais vendidos;
* produtos em queda;
* comportamento de recompra;
* oportunidades comerciais.

---

# 7. Definições Analíticas

## 7.1 Ticket Médio

### Fórmula

```text
faturamento_total / quantidade_pedidos
```

### Objetivo

Medir valor médio das vendas.

---

## 7.2 Frequência de Compra

### Conceito

Quantidade de compras realizadas em determinado período.

### Objetivo

Identificar recorrência comercial.

---

## 7.3 Dias Sem Compra

### Fórmula

```text
hoje - data_ultima_compra
```

### Objetivo

Detectar risco de inatividade.

---

## 7.4 Score Comercial

### Conceito

Pontuação utilizada para priorização de clientes.

### Fórmula inicial

```text
score =
(ticket_medio * 0.3)
+
(frequencia_compra * 0.3)
+
(dias_sem_compra * 0.4)
```

### Objetivo

Ordenar clientes por potencial comercial.

---

# 8. Regras de Negócio

## RN001 — Cliente Inativo

```text
SE dias_sem_compra > 45
ENTÃO cliente_inativo = true
```

---

## RN002 — Região Crítica

```text
SE queda_faturamento > 20%
ENTÃO gerar_alerta_regional
```

---

## RN003 — Produto com Baixa Recompra

```text
SE produto recorrente deixar de aparecer
ENTÃO gerar alerta de recompra
```

---

## RN004 — Cliente Prioritário

```text
SE score_comercial >= 80
ENTÃO cliente_prioritario = true
```

---

## RN005 — Plano de Ação Diário

O sistema deve gerar automaticamente:

* clientes prioritários;
* ações sugeridas;
* regiões críticas;
* oportunidades do dia.

---

# 9. Estrutura de Dados

## 9.1 Entidades Principais

### Cliente

* id
* nome
* região
* representante
* última compra
* status

---

### Pedido

* id
* cliente
* representante
* data_emissao
* data_faturamento
* valor_total
* status

---

### Produto

* id
* sku
* descrição

---

### Representante

* id
* nome
* região
* carteira

---

### Alerta

* id
* tipo
* criticidade
* descrição
* data_geracao

### Região

* id
* nome
* uf
* gerente_regional
* status

---

# 10. Fluxo Analítico da Plataforma

```text
CSV/XLSX
↓
Importação (ETL)
↓
PostgreSQL
↓
Métricas derivadas
↓
Regras de negócio
↓
Alertas e recomendações
↓
Dashboard
```

---

# 11. Arquitetura do Sistema

## Backend

* Java 21
* Spring Boot
* Spring Data JPA
* PostgreSQL

---

## Frontend

* React
* Vite
* TypeScript
* TailwindCSS
* ShadCN/UI

---

# 12. Estrutura Arquitetural

```text
Frontend
    ↓
Controllers
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

# 13. Organização do Backend

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

# 14. Jornada do Usuário

## Etapa 1 — Login

Usuário acessa o sistema.

---

## Etapa 2 — Dashboard Executivo

Visualização de:

* faturamento;
* clientes ativos;
* clientes inativos;
* alertas;
* regiões críticas.

---

## Etapa 3 — Alertas Comerciais

Sistema destaca:

* clientes sem compra;
* regiões em queda;
* produtos críticos.

---

## Etapa 4 — Filtros Comerciais

Filtros por:

* região;
* período;
* representante;
* produto;
* carteira.

---

## Etapa 5 — Ranking de Clientes

Lista priorizada baseada em score comercial.

---

## Etapa 6 — Perfil Comercial

Exibição de:

* histórico;
* ticket médio;
* frequência;
* tendência.

---

## Etapa 7 — Recomendação Comercial

Sistema sugere:

* próxima ação;
* produto recomendado;
* justificativa comercial.

---

## Etapa 8 — Plano de Ação Diário

Resumo final com prioridades executáveis.

---

# 15. APIs Iniciais

## Dashboard

```text
GET /dashboard
```

---

## Alertas

```text
GET /alertas
```

---

## Clientes Prioritários

```text
GET /clientes/prioritarios
```

---

## Perfil Cliente

```text
GET /clientes/{id}
```

---

# 16. MVP Inicial

## Escopo do MVP

### Backend

* importação de dados;
* entidades;
* APIs REST;
* KPIs;
* regras de negócio;
* analytics.

---

### Frontend

* dashboard;
* alertas;
* ranking;
* filtros;
* perfil cliente.

---

# 17. Diferencial Competitivo

O diferencial da solução não é apenas exibir dashboards.

O principal diferencial é:

```text
Dados consolidados
+
Priorização automática
+
Recomendação acionável
```

---

# 18. Objetivo Acadêmico

O projeto busca validar:

* modelagem analítica;
* construção de APIs corporativas;
* engenharia de software;
* inteligência comercial;
* transformação de dados em decisão.

---

# 19. Próximas Etapas

## Fase 1 — Modelagem

* definição de KPIs;
* regras de negócio;
* modelagem relacional.

---

## Fase 2 — Dados

* importação CSV/XLSX;
* persistência PostgreSQL;
* normalização.

---

## Fase 3 — Backend

* services;
* analytics;
* rules;
* APIs.

---

## Fase 4 — Frontend

* dashboard;
* gráficos;
* tabelas;
* filtros.

---

## Fase 5 — Inteligência Comercial

* alertas;
* recomendações;
* plano de ação.

---

# 20. Status do Projeto

```text
🚧 Em desenvolvimento
```
