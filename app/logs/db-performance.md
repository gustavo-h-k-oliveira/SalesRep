# Relatório de Performance de Banco de Dados — SalesRep

- **Última Atualização:** 18/09/2026 17:09:54
- **Total de Queries Mapeadas no Top Total:** 10

> Este arquivo é gerado e atualizado periodicamente pelo `DatabasePerformanceService` utilizando métricas da extensão `pg_stat_statements`.

---

## 1. Top Queries por Tempo Total Acumulado (Consumo de CPU e I/O)

| Tempo Total (ms) | Chamadas | Média (ms) | % Tempo Total | Query SQL |
| :--- | :--- | :--- | :--- | :--- |
| 765.98 ms | 1176 | 0.65 ms | 28.20% | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 320.26 ms | 1176 | 0.27 ms | 11.79% | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 250.59 ms | 110 | 2.28 ms | 9.23% | `select p1_0.cliente_id,p1_0.id,p1_0.autorizacao_comercial,p1_0.data_emissao,p1_0.data_faturamento,p1_0.representante_id,p1_0.status,p1_0.valor_total from pedido p1_0 where p1_0.cliente_id = any ($1)` |
| 214.97 ms | 8 | 26.87 ms | 7.92% | `select p1_0.id,p1_0.descricao,p1_0.grupo,p1_0.mes_fim_sazonalidade,p1_0.mes_inicio_sazonalidade,p1_0.sazonal,p1_0.sku from produto p1_0 where exists(select pi1_0.id from pedido_item pi1_0 join pedi...` |
| 112.58 ms | 14 | 8.04 ms | 4.15% | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 99.56 ms | 469 | 0.21 ms | 3.67% | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |
| 98.26 ms | 1176 | 0.08 ms | 3.62% | `select count(*) from pg_stat_activity where backend_type = $1` |
| 75.02 ms | 6 | 12.50 ms | 2.76% | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.estado_id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturament...` |
| 68.71 ms | 67 | 1.03 ms | 2.53% | `SELECT (SELECT setting FROM pg_catalog.pg_settings WHERE name = $1) AS timeline_id, -- Postgres creates temporary snapshot files of the form %X-%X.snap.%d.tmp. -- These temporary snapshot files are...` |
| 60.86 ms | 67 | 0.91 ms | 2.24% | `SELECT setting::pg_catalog.int4 AS max_cluster_size FROM pg_catalog.pg_settings WHERE name = $1` |

---

## 2. Top Queries mais Lentas por Execução (Tempo Médio)

| Média (ms) | Máximo (ms) | Chamadas | Query SQL |
| :--- | :--- | :--- | :--- |
| 26.87 ms | 191.61 ms | 8 | `select p1_0.id,p1_0.descricao,p1_0.grupo,p1_0.mes_fim_sazonalidade,p1_0.mes_inicio_sazonalidade,p1_0.sazonal,p1_0.sku from produto p1_0 where exists(select pi1_0.id from pedido_item pi1_0 join pedi...` |
| 12.50 ms | 45.22 ms | 6 | `select p1_0.id,p1_0.autorizacao_comercial,p1_0.cliente_id,c1_0.id,c1_0.estado_id,c1_0.nome,c1_0.regiao_id,c1_0.representante_id,c1_0.status,c1_0.ultima_compra,p1_0.data_emissao,p1_0.data_faturament...` |
| 8.04 ms | 64.97 ms | 14 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 4.92 ms | 5.82 ms | 9 | `SELECT pg_catalog.sum(pg_catalog.pg_database_size(datname)) AS total_size FROM pg_catalog.pg_database -- Ignore invalid databases, as we will likely have problems with -- getting their size from th...` |
| 3.82 ms | 6.14 ms | 4 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 2.85 ms | 3.72 ms | 10 | `SELECT name, setting, COALESCE(unit, $1), short_desc, vartype FROM pg_settings WHERE vartype IN ($2 /*, ... */) AND name != $3` |
| 2.28 ms | 168.15 ms | 110 | `select p1_0.cliente_id,p1_0.id,p1_0.autorizacao_comercial,p1_0.data_emissao,p1_0.data_faturamento,p1_0.representante_id,p1_0.status,p1_0.valor_total from pedido p1_0 where p1_0.cliente_id = any ($1)` |
| 2.23 ms | 5.20 ms | 6 | `select c1_0.id,e1_0.id,e1_0.nome,e1_0.regiao_id,e1_0.status,e1_0.uf,c1_0.nome,c1_0.regiao_id,r2_0.id,r2_0.gerente_regional,r2_0.nome,r2_0.status,c1_0.representante_id,r3_0.id,r3_0.cpf_cnpj,r3_0.ema...` |
| 1.76 ms | 22.96 ms | 14 | `INSERT INTO public.health_check VALUES ($1, now()) ON CONFLICT (id) DO UPDATE SET updated_at = now() RETURNING $2 AS success` |
| 1.46 ms | 1.78 ms | 9 | `SELECT pg_catalog.pg_database_size(datname) AS db_size, deadlocks, tup_inserted AS inserted, tup_updated AS updated, tup_deleted AS deleted, CASE WHEN datname IN ($1 /*, ... */) THEN datname ELSE $...` |

---

## 3. Queries Mais Frequentes (Alerta de N+1 do Hibernate)

| Chamadas | Média (ms) | Tempo Total (ms) | Query SQL |
| :--- | :--- | :--- | :--- |
| 1192 | 0.01 ms | 8.06 ms | `SELECT CASE WHEN pg_catalog.pg_is_in_recovery() THEN pg_catalog.pg_last_wal_replay_lsn() ELSE pg_catalog.pg_current_wal_lsn() END AS lsn, CURRENT_TIMESTAMP` |
| 1177 | 0.65 ms | 766.10 ms | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 1177 | 0.01 ms | 15.38 ms | `select slot_name like $1 as is_temp from pg_replication_slots where slot_name like $2 or (slot_name like $3 and active)` |
| 1177 | 0.27 ms | 320.35 ms | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 1177 | 0.01 ms | 10.65 ms | `select count(*) from pg_stat_subscription where pid is not null` |
| 1177 | 0.00 ms | 4.93 ms | `SELECT $1` |
| 1177 | 0.08 ms | 98.34 ms | `select count(*) from pg_stat_activity where backend_type = $1` |
| 1177 | 0.03 ms | 35.49 ms | `SELECT COALESCE(pg_catalog.sum(active_time), $1)::pg_catalog.float8 AS total_active_time, COALESCE(pg_catalog.sum(sessions), $2)::pg_catalog.int8 AS total_sessions FROM pg_catalog.pg_stat_database ...` |
| 536 | 0.04 ms | 23.46 ms | `SELECT COALESCE(lfc_value, $1) AS count FROM neon.neon_lfc_stats WHERE lfc_key = $2` |
| 469 | 0.21 ms | 99.56 ms | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |

