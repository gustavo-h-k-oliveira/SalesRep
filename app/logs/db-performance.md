# Relatório de Performance de Banco de Dados — SalesRep

- **Última Atualização:** 22/09/2026 18:03:36
- **Total de Queries Mapeadas no Top Total:** 10

> Este arquivo é gerado e atualizado periodicamente pelo `DatabasePerformanceService` utilizando métricas da extensão `pg_stat_statements`.

---

## 1. Top Queries por Tempo Total Acumulado (Consumo de CPU e I/O)

| Tempo Total (ms) | Chamadas | Média (ms) | % Tempo Total | Query SQL |
| :--- | :--- | :--- | :--- | :--- |
| 515.83 ms | 3703 | 0.14 ms | 10.99% | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 390.75 ms | 3703 | 0.11 ms | 8.32% | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 315.98 ms | 3703 | 0.09 ms | 6.73% | `select count(*) from pg_stat_activity where backend_type = $1` |
| 314.66 ms | 29 | 10.85 ms | 6.70% | `SELECT pg_catalog.sum(pg_catalog.pg_database_size(datname)) AS total_size FROM pg_catalog.pg_database -- Ignore invalid databases, as we will likely have problems with -- getting their size from th...` |
| 276.48 ms | 1526 | 0.18 ms | 5.89% | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |
| 191.23 ms | 630 | 0.30 ms | 4.07% | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.estado_id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturament...` |
| 187.27 ms | 218 | 0.86 ms | 3.99% | `SELECT (SELECT setting FROM pg_catalog.pg_settings WHERE name = $1) AS timeline_id, -- Postgres creates temporary snapshot files of the form %X-%X.snap.%d.tmp. -- These temporary snapshot files are...` |
| 170.46 ms | 218 | 0.78 ms | 3.63% | `SELECT setting::pg_catalog.int4 AS max_cluster_size FROM pg_catalog.pg_settings WHERE name = $1` |
| 170.10 ms | 218 | 0.78 ms | 3.62% | `SELECT setting::float8 * $1 AS bytes FROM pg_catalog.pg_settings WHERE name = $2` |
| 154.79 ms | 29 | 5.34 ms | 3.30% | `SELECT pg_catalog.pg_database_size(datname) AS db_size, deadlocks, tup_inserted AS inserted, tup_updated AS updated, tup_deleted AS deleted, CASE WHEN datname IN ($1 /*, ... */) THEN datname ELSE $...` |

---

## 2. Top Queries mais Lentas por Execução (Tempo Médio)

| Média (ms) | Máximo (ms) | Chamadas | Query SQL |
| :--- | :--- | :--- | :--- |
| 10.85 ms | 166.52 ms | 29 | `SELECT pg_catalog.sum(pg_catalog.pg_database_size(datname)) AS total_size FROM pg_catalog.pg_database -- Ignore invalid databases, as we will likely have problems with -- getting their size from th...` |
| 8.99 ms | 17.92 ms | 6 | `select pi1_0.produto_id,coalesce(sum(pi1_0.sub_total),$3) from pedido_item pi1_0 join pedido p2_0 on p2_0.id=pi1_0.pedido_id where p2_0.status=$4 and ($1 is null or p2_0.representante_id=$2) group ...` |
| 5.94 ms | 23.66 ms | 5 | `SELECT * FROM (SELECT current_database() AS current_database, n.nspname,c.relname,a.attname,a.atttypid,a.attnotnull OR (t.typtype = $1 AND t.typnotnull) AS attnotnull,a.atttypmod,a.attlen,t.typtypm...` |
| 5.86 ms | 7.56 ms | 15 | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.estado_id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturament...` |
| 5.34 ms | 95.12 ms | 29 | `SELECT pg_catalog.pg_database_size(datname) AS db_size, deadlocks, tup_inserted AS inserted, tup_updated AS updated, tup_deleted AS deleted, CASE WHEN datname IN ($1 /*, ... */) THEN datname ELSE $...` |
| 3.51 ms | 22.79 ms | 41 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 3.29 ms | 4.88 ms | 18 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 3.29 ms | 56.93 ms | 35 | `select p1_0.id,p1_0.descricao,p1_0.grupo,p1_0.mes_fim_sazonalidade,p1_0.mes_inicio_sazonalidade,p1_0.sazonal,p1_0.sku from produto p1_0 where exists(select pi1_0.id from pedido_item pi1_0 join pedi...` |
| 2.89 ms | 4.58 ms | 9 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 2.62 ms | 3.88 ms | 31 | `SELECT name, setting, COALESCE(unit, $1), short_desc, vartype FROM pg_settings WHERE vartype IN ($2 /*, ... */) AND name != $3` |

---

## 3. Queries Mais Frequentes (Alerta de N+1 do Hibernate)

| Chamadas | Média (ms) | Tempo Total (ms) | Query SQL |
| :--- | :--- | :--- | :--- |
| 3747 | 0.00 ms | 15.04 ms | `SELECT CASE WHEN pg_catalog.pg_is_in_recovery() THEN pg_catalog.pg_last_wal_replay_lsn() ELSE pg_catalog.pg_current_wal_lsn() END AS lsn, CURRENT_TIMESTAMP` |
| 3704 | 0.14 ms | 516.05 ms | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 3704 | 0.01 ms | 47.82 ms | `select slot_name like $1 as is_temp from pg_replication_slots where slot_name like $2 or (slot_name like $3 and active)` |
| 3704 | 0.09 ms | 316.07 ms | `select count(*) from pg_stat_activity where backend_type = $1` |
| 3704 | 0.01 ms | 32.61 ms | `select count(*) from pg_stat_subscription where pid is not null` |
| 3704 | 0.00 ms | 15.50 ms | `SELECT $1` |
| 3704 | 0.03 ms | 109.08 ms | `SELECT COALESCE(pg_catalog.sum(active_time), $1)::pg_catalog.float8 AS total_active_time, COALESCE(pg_catalog.sum(sessions), $2)::pg_catalog.int8 AS total_sessions FROM pg_catalog.pg_stat_database ...` |
| 3704 | 0.11 ms | 390.84 ms | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 1744 | 0.04 ms | 64.97 ms | `SELECT COALESCE(lfc_value, $1) AS used FROM neon.neon_lfc_stats WHERE lfc_key = $2` |
| 1526 | 0.18 ms | 276.48 ms | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |

