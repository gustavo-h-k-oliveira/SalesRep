# Relatório de Performance de Banco de Dados — SalesRep

- **Última Atualização:** 25/09/2026 15:02:03
- **Total de Queries Mapeadas no Top Total:** 10

> Este arquivo é gerado e atualizado periodicamente pelo `DatabasePerformanceService` utilizando métricas da extensão `pg_stat_statements`.

---

## 1. Top Queries por Tempo Total Acumulado (Consumo de CPU e I/O)

| Tempo Total (ms) | Chamadas | Média (ms) | % Tempo Total | Query SQL |
| :--- | :--- | :--- | :--- | :--- |
| 501.51 ms | 1118 | 0.45 ms | 34.16% | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 178.63 ms | 1118 | 0.16 ms | 12.17% | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 91.08 ms | 448 | 0.20 ms | 6.20% | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |
| 87.87 ms | 1118 | 0.08 ms | 5.99% | `select count(*) from pg_stat_activity where backend_type = $1` |
| 68.34 ms | 64 | 1.07 ms | 4.66% | `SELECT setting::float8 * $1 AS bytes FROM pg_catalog.pg_settings WHERE name = $2` |
| 62.66 ms | 64 | 0.98 ms | 4.27% | `SELECT setting::pg_catalog.int4 AS max_cluster_size FROM pg_catalog.pg_settings WHERE name = $1` |
| 54.00 ms | 64 | 0.84 ms | 3.68% | `SELECT (SELECT setting FROM pg_catalog.pg_settings WHERE name = $1) AS timeline_id, -- Postgres creates temporary snapshot files of the form %X-%X.snap.%d.tmp. -- These temporary snapshot files are...` |
| 43.12 ms | 9 | 4.79 ms | 2.94% | `SELECT pg_catalog.sum(pg_catalog.pg_database_size(datname)) AS total_size FROM pg_catalog.pg_database -- Ignore invalid databases, as we will likely have problems with -- getting their size from th...` |
| 34.28 ms | 1118 | 0.03 ms | 2.33% | `SELECT COALESCE(pg_catalog.sum(active_time), $1)::pg_catalog.float8 AS total_active_time, COALESCE(pg_catalog.sum(sessions), $2)::pg_catalog.int8 AS total_sessions FROM pg_catalog.pg_stat_database ...` |
| 28.25 ms | 64 | 0.44 ms | 1.92% | `WITH c AS (SELECT pg_catalog.jsonb_object_agg(metric, value) jb FROM neon.neon_perf_counters) SELECT d.* FROM pg_catalog.jsonb_to_record((SELECT jb FROM c)) AS d( file_cache_read_wait_seconds_count...` |

---

## 2. Top Queries mais Lentas por Execução (Tempo Médio)

| Média (ms) | Máximo (ms) | Chamadas | Query SQL |
| :--- | :--- | :--- | :--- |
| 4.79 ms | 6.97 ms | 9 | `SELECT pg_catalog.sum(pg_catalog.pg_database_size(datname)) AS total_size FROM pg_catalog.pg_database -- Ignore invalid databases, as we will likely have problems with -- getting their size from th...` |
| 1.95 ms | 23.64 ms | 13 | `INSERT INTO public.health_check VALUES ($1, now()) ON CONFLICT (id) DO UPDATE SET updated_at = now() RETURNING $2 AS success` |
| 1.73 ms | 2.52 ms | 9 | `SELECT pg_catalog.pg_database_size(datname) AS db_size, deadlocks, tup_inserted AS inserted, tup_updated AS updated, tup_deleted AS deleted, CASE WHEN datname IN ($1 /*, ... */) THEN datname ELSE $...` |
| 1.34 ms | 1.85 ms | 9 | `SELECT pg_database_size(datname) AS db_size, datid FROM pg_stat_database WHERE datname IN ( SELECT datname FROM pg_database WHERE datconnlimit != $1 AND datname <> $2 AND NOT datistemplate ORDER BY...` |
| 1.07 ms | 19.11 ms | 64 | `SELECT setting::float8 * $1 AS bytes FROM pg_catalog.pg_settings WHERE name = $2` |
| 0.98 ms | 12.98 ms | 64 | `SELECT setting::pg_catalog.int4 AS max_cluster_size FROM pg_catalog.pg_settings WHERE name = $1` |
| 0.84 ms | 1.28 ms | 64 | `SELECT (SELECT setting FROM pg_catalog.pg_settings WHERE name = $1) AS timeline_id, -- Postgres creates temporary snapshot files of the form %X-%X.snap.%d.tmp. -- These temporary snapshot files are...` |
| 0.45 ms | 128.03 ms | 1118 | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 0.44 ms | 0.77 ms | 64 | `WITH c AS (SELECT pg_catalog.jsonb_object_agg(metric, value) jb FROM neon.neon_perf_counters) SELECT d.* FROM pg_catalog.jsonb_to_record((SELECT jb FROM c)) AS d( file_cache_read_wait_seconds_count...` |
| 0.36 ms | 5.95 ms | 64 | `SELECT CASE WHEN pg_database.datname IN ($1 /*, ... */) THEN pg_database.datname ELSE $2 END as datname, pg_database.oid as datid, tmp.mode as mode, COALESCE(count, $3) as count FROM ( VALUES ($4),...` |

---

## 3. Queries Mais Frequentes (Alerta de N+1 do Hibernate)

| Chamadas | Média (ms) | Tempo Total (ms) | Query SQL |
| :--- | :--- | :--- | :--- |
| 1133 | 0.00 ms | 4.83 ms | `SELECT CASE WHEN pg_catalog.pg_is_in_recovery() THEN pg_catalog.pg_last_wal_replay_lsn() ELSE pg_catalog.pg_current_wal_lsn() END AS lsn, CURRENT_TIMESTAMP` |
| 1119 | 0.16 ms | 178.75 ms | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 1119 | 0.08 ms | 88.00 ms | `select count(*) from pg_stat_activity where backend_type = $1` |
| 1119 | 0.01 ms | 13.92 ms | `select count(*) from pg_stat_subscription where pid is not null` |
| 1119 | 0.45 ms | 501.68 ms | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 1119 | 0.00 ms | 4.86 ms | `SELECT $1` |
| 1119 | 0.01 ms | 15.37 ms | `select slot_name like $1 as is_temp from pg_replication_slots where slot_name like $2 or (slot_name like $3 and active)` |
| 1119 | 0.03 ms | 34.31 ms | `SELECT COALESCE(pg_catalog.sum(active_time), $1)::pg_catalog.float8 AS total_active_time, COALESCE(pg_catalog.sum(sessions), $2)::pg_catalog.int8 AS total_sessions FROM pg_catalog.pg_stat_database ...` |
| 512 | 0.04 ms | 20.95 ms | `SELECT COALESCE(lfc_value, $1) AS count FROM neon.neon_lfc_stats WHERE lfc_key = $2` |
| 448 | 0.20 ms | 91.08 ms | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |

