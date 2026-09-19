# Relatório de Performance de Banco de Dados — SalesRep

- **Última Atualização:** 18/09/2026 21:52:40
- **Total de Queries Mapeadas no Top Total:** 10

> Este arquivo é gerado e atualizado periodicamente pelo `DatabasePerformanceService` utilizando métricas da extensão `pg_stat_statements`.

---

## 1. Top Queries por Tempo Total Acumulado (Consumo de CPU e I/O)

| Tempo Total (ms) | Chamadas | Média (ms) | % Tempo Total | Query SQL |
| :--- | :--- | :--- | :--- | :--- |
| 1712.20 ms | 7899 | 0.22 ms | 16.40% | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 928.96 ms | 7899 | 0.12 ms | 8.90% | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 780.12 ms | 7899 | 0.10 ms | 7.47% | `select count(*) from pg_stat_activity where backend_type = $1` |
| 622.19 ms | 3269 | 0.19 ms | 5.96% | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |
| 618.83 ms | 467 | 1.33 ms | 5.93% | `SELECT setting::float8 * $1 AS bytes FROM pg_catalog.pg_settings WHERE name = $2` |
| 439.25 ms | 467 | 0.94 ms | 4.21% | `SELECT (SELECT setting FROM pg_catalog.pg_settings WHERE name = $1) AS timeline_id, -- Postgres creates temporary snapshot files of the form %X-%X.snap.%d.tmp. -- These temporary snapshot files are...` |
| 407.86 ms | 67 | 6.09 ms | 3.91% | `SELECT name, setting, COALESCE(unit, $1), short_desc, vartype FROM pg_settings WHERE vartype IN ($2 /*, ... */) AND name != $3` |
| 403.77 ms | 467 | 0.86 ms | 3.87% | `SELECT setting::pg_catalog.int4 AS max_cluster_size FROM pg_catalog.pg_settings WHERE name = $1` |
| 374.38 ms | 62 | 6.04 ms | 3.59% | `SELECT pg_catalog.sum(pg_catalog.pg_database_size(datname)) AS total_size FROM pg_catalog.pg_database -- Ignore invalid databases, as we will likely have problems with -- getting their size from th...` |
| 319.51 ms | 110 | 2.90 ms | 3.06% | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |

---

## 2. Top Queries mais Lentas por Execução (Tempo Médio)

| Média (ms) | Máximo (ms) | Chamadas | Query SQL |
| :--- | :--- | :--- | :--- |
| 11.43 ms | 23.34 ms | 16 | `select pi1_0.produto_id,coalesce(sum(pi1_0.sub_total),$3) from pedido_item pi1_0 join pedido p2_0 on p2_0.id=pi1_0.pedido_id where p2_0.status=$4 and ($1 is null or p2_0.representante_id=$2) group ...` |
| 9.38 ms | 24.57 ms | 5 | `SELECT * FROM (SELECT current_database() AS current_database, n.nspname,c.relname,a.attname,a.atttypid,a.attnotnull OR (t.typtype = $1 AND t.typnotnull) AS attnotnull,a.atttypmod,a.attlen,t.typtypm...` |
| 6.15 ms | 11.43 ms | 24 | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.estado_id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturament...` |
| 6.09 ms | 172.00 ms | 67 | `SELECT name, setting, COALESCE(unit, $1), short_desc, vartype FROM pg_settings WHERE vartype IN ($2 /*, ... */) AND name != $3` |
| 6.04 ms | 32.39 ms | 62 | `SELECT pg_catalog.sum(pg_catalog.pg_database_size(datname)) AS total_size FROM pg_catalog.pg_database -- Ignore invalid databases, as we will likely have problems with -- getting their size from th...` |
| 4.62 ms | 153.08 ms | 62 | `SELECT pg_catalog.pg_database_size(datname) AS db_size, deadlocks, tup_inserted AS inserted, tup_updated AS updated, tup_deleted AS deleted, CASE WHEN datname IN ($1 /*, ... */) THEN datname ELSE $...` |
| 2.90 ms | 24.05 ms | 110 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 2.63 ms | 7.22 ms | 54 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 2.25 ms | 3.31 ms | 13 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 2.13 ms | 58.42 ms | 105 | `select p1_0.id,p1_0.descricao,p1_0.grupo,p1_0.mes_fim_sazonalidade,p1_0.mes_inicio_sazonalidade,p1_0.sazonal,p1_0.sku from produto p1_0 where exists(select pi1_0.id from pedido_item pi1_0 join pedi...` |

---

## 3. Queries Mais Frequentes (Alerta de N+1 do Hibernate)

| Chamadas | Média (ms) | Tempo Total (ms) | Query SQL |
| :--- | :--- | :--- | :--- |
| 7992 | 0.01 ms | 42.52 ms | `SELECT CASE WHEN pg_catalog.pg_is_in_recovery() THEN pg_catalog.pg_last_wal_replay_lsn() ELSE pg_catalog.pg_current_wal_lsn() END AS lsn, CURRENT_TIMESTAMP` |
| 7902 | 0.22 ms | 1712.59 ms | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 7902 | 0.01 ms | 104.67 ms | `select slot_name like $1 as is_temp from pg_replication_slots where slot_name like $2 or (slot_name like $3 and active)` |
| 7902 | 0.10 ms | 780.37 ms | `select count(*) from pg_stat_activity where backend_type = $1` |
| 7902 | 0.01 ms | 117.68 ms | `select count(*) from pg_stat_subscription where pid is not null` |
| 7902 | 0.01 ms | 62.04 ms | `SELECT $1` |
| 7902 | 0.12 ms | 929.29 ms | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 7902 | 0.03 ms | 250.21 ms | `SELECT COALESCE(pg_catalog.sum(active_time), $1)::pg_catalog.float8 AS total_active_time, COALESCE(pg_catalog.sum(sessions), $2)::pg_catalog.int8 AS total_sessions FROM pg_catalog.pg_stat_database ...` |
| 3744 | 0.04 ms | 165.28 ms | `SELECT COALESCE(lfc_value, $1) AS count FROM neon.neon_lfc_stats WHERE lfc_key = $2` |
| 3276 | 0.19 ms | 623.31 ms | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |

