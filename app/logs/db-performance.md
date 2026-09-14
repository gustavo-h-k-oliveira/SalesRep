# Relatório de Performance de Banco de Dados — SalesRep

- **Última Atualização:** 13/09/2026 22:20:48
- **Total de Queries Mapeadas no Top Total:** 10

> Este arquivo é gerado e atualizado periodicamente pelo `DatabasePerformanceService` utilizando métricas da extensão `pg_stat_statements`.

---

## 1. Top Queries por Tempo Total Acumulado (Consumo de CPU e I/O)

| Tempo Total (ms) | Chamadas | Média (ms) | % Tempo Total | Query SQL |
| :--- | :--- | :--- | :--- | :--- |
| 125.99 ms | 10 | 12.60 ms | 28.24% | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturamento,p1_0.represen...` |
| 111.99 ms | 8 | 14.00 ms | 25.10% | `select pi1_0.produto_id,coalesce(sum(pi1_0.sub_total),$3) from pedido_item pi1_0 join pedido p2_0 on p2_0.id=pi1_0.pedido_id where p2_0.status=$4 and ($1 is null or p2_0.representante_id=$2) group ...` |
| 60.07 ms | 154 | 0.39 ms | 13.46% | `select p1_0.cliente_id,p1_0.id,p1_0.autorizacao_comercial,p1_0.data_emissao,p1_0.data_faturamento,p1_0.representante_id,p1_0.status,p1_0.valor_total from pedido p1_0 where p1_0.cliente_id = any ($1)` |
| 49.09 ms | 18 | 2.73 ms | 11.00% | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 22.04 ms | 14 | 1.57 ms | 4.94% | `select p1_0.id,p1_0.descricao,p1_0.grupo,p1_0.mes_fim_sazonalidade,p1_0.mes_inicio_sazonalidade,p1_0.sazonal,p1_0.sku from produto p1_0 where exists(select pi1_0.id from pedido_item pi1_0 join pedi...` |
| 21.35 ms | 14 | 1.53 ms | 4.79% | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 15.86 ms | 6 | 2.64 ms | 3.55% | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 10.79 ms | 1 | 10.79 ms | 2.42% | `SELECT * FROM (SELECT current_database() AS current_database, n.nspname,c.relname,a.attname,a.atttypid,a.attnotnull OR (t.typtype = $1 AND t.typnotnull) AS attnotnull,a.atttypmod,a.attlen,t.typtypm...` |
| 9.31 ms | 1 | 9.31 ms | 2.09% | `insert into log_auditoria (data_hora,evento,ip,user_agent,username) values ($1,$2,$3,$4,$5) RETURNING *` |
| 2.97 ms | 1 | 2.97 ms | 0.67% | `select * from information_schema.sequences` |

---

## 2. Top Queries mais Lentas por Execução (Tempo Médio)

| Média (ms) | Máximo (ms) | Chamadas | Query SQL |
| :--- | :--- | :--- | :--- |
| 14.00 ms | 19.46 ms | 8 | `select pi1_0.produto_id,coalesce(sum(pi1_0.sub_total),$3) from pedido_item pi1_0 join pedido p2_0 on p2_0.id=pi1_0.pedido_id where p2_0.status=$4 and ($1 is null or p2_0.representante_id=$2) group ...` |
| 12.60 ms | 20.00 ms | 10 | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturamento,p1_0.represen...` |
| 2.73 ms | 5.05 ms | 18 | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 2.64 ms | 4.35 ms | 6 | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 1.57 ms | 2.76 ms | 14 | `select p1_0.id,p1_0.descricao,p1_0.grupo,p1_0.mes_fim_sazonalidade,p1_0.mes_inicio_sazonalidade,p1_0.sazonal,p1_0.sku from produto p1_0 where exists(select pi1_0.id from pedido_item pi1_0 join pedi...` |
| 1.53 ms | 6.98 ms | 14 | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 0.45 ms | 0.66 ms | 4 | `select coalesce(sum(p1_0.valor_total),$1) from pedido p1_0 where p1_0.status=$2` |
| 0.39 ms | 3.74 ms | 154 | `select p1_0.cliente_id,p1_0.id,p1_0.autorizacao_comercial,p1_0.data_emissao,p1_0.data_faturamento,p1_0.representante_id,p1_0.status,p1_0.valor_total from pedido p1_0 where p1_0.cliente_id = any ($1)` |
| 0.29 ms | 0.36 ms | 4 | `select r1_0.id,r1_0.cpf_cnpj,r1_0.email,r1_0.nome,r1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,r2_0.uf,r1_0.telefone from representante r1_0 join regiao r2_0 on r2_0.id=r1_0.r...` |
| 0.24 ms | 0.84 ms | 4 | `SELECT "installed_rank","version","description","type","script","checksum","installed_on","installed_by","execution_time","success" FROM "public"."flyway_schema_history" WHERE "installed_rank" > $1...` |

---

## 3. Queries Mais Frequentes (Alerta de N+1 do Hibernate)

| Chamadas | Média (ms) | Tempo Total (ms) | Query SQL |
| :--- | :--- | :--- | :--- |
| 154 | 0.39 ms | 60.07 ms | `select p1_0.cliente_id,p1_0.id,p1_0.autorizacao_comercial,p1_0.data_emissao,p1_0.data_faturamento,p1_0.representante_id,p1_0.status,p1_0.valor_total from pedido p1_0 where p1_0.cliente_id = any ($1)` |
| 50 | 0.04 ms | 1.93 ms | `BEGIN READ ONLY` |
| 20 | 0.05 ms | 0.91 ms | `select c1_0.regiao_id,sum(p1_0.valor_total) from pedido p1_0 join cliente c1_0 on c1_0.id=p1_0.cliente_id where p1_0.status=$5 and p1_0.data_faturamento>=$1 and p1_0.data_faturamento<=$2 and ($3 is...` |
| 18 | 2.73 ms | 49.09 ms | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 16 | 0.03 ms | 0.46 ms | `select r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf from regiao r1_0` |
| 14 | 0.12 ms | 1.65 ms | `select count(c1_0.id) from cliente c1_0` |
| 14 | 1.57 ms | 22.04 ms | `select p1_0.id,p1_0.descricao,p1_0.grupo,p1_0.mes_fim_sazonalidade,p1_0.mes_inicio_sazonalidade,p1_0.sazonal,p1_0.sku from produto p1_0 where exists(select pi1_0.id from pedido_item pi1_0 join pedi...` |
| 14 | 1.53 ms | 21.35 ms | `select c1_0.id,c1_0.nome,c1_0.regiao_id,r1_0.id,r1_0.gerente_regional,r1_0.nome,r1_0.status,r1_0.uf,c1_0.representante_id,r2_0.id,r2_0.cpf_cnpj,r2_0.email,r2_0.nome,r2_0.regiao_id,r2_0.telefone,c1_...` |
| 13 | 0.00 ms | 0.02 ms | `BEGIN` |
| 10 | 12.60 ms | 125.99 ms | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturamento,p1_0.represen...` |

