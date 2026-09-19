# Relatório de Performance de Banco de Dados — SalesRep

- **Última Atualização:** 18/09/2026 20:46:58
- **Total de Queries Mapeadas no Top Total:** 10

> Este arquivo é gerado e atualizado periodicamente pelo `DatabasePerformanceService` utilizando métricas da extensão `pg_stat_statements`.

---

## 1. Top Queries por Tempo Total Acumulado (Consumo de CPU e I/O)

| Tempo Total (ms) | Chamadas | Média (ms) | % Tempo Total | Query SQL |
| :--- | :--- | :--- | :--- | :--- |
| 33.29 ms | 2 | 16.64 ms | 13.23% | `INSERT INTO public.health_check VALUES ($1, now()) ON CONFLICT (id) DO UPDATE SET updated_at = now() RETURNING $2 AS success` |
| 24.57 ms | 1 | 24.57 ms | 9.77% | `SELECT * FROM (SELECT current_database() AS current_database, n.nspname,c.relname,a.attname,a.atttypid,a.attnotnull OR (t.typtype = $1 AND t.typnotnull) AS attnotnull,a.atttypmod,a.attlen,t.typtypm...` |
| 24.36 ms | 1 | 24.36 ms | 9.69% | `INSERT INTO neon_migration.migration_id VALUES ($1, $2) ON CONFLICT DO NOTHING` |
| 21.01 ms | 158 | 0.13 ms | 8.35% | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 20.50 ms | 1 | 20.50 ms | 8.15% | `DO $$ BEGIN IF ( NOT EXISTS ( SELECT FROM pg_catalog.pg_trigger WHERE tgrelid OPERATOR(pg_catalog.=) 'neon_migration.migration_id'::pg_catalog.regclass::pg_catalog.oid AND tgname::pg_catalog.name O...` |
| 17.84 ms | 158 | 0.11 ms | 7.09% | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 13.00 ms | 158 | 0.08 ms | 5.17% | `select count(*) from pg_stat_activity where backend_type = $1` |
| 8.66 ms | 49 | 0.18 ms | 3.44% | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |
| 8.53 ms | 1 | 8.53 ms | 3.39% | `ALTER EXTENSION neon UPDATE` |
| 7.99 ms | 1 | 7.99 ms | 3.18% | `select * from information_schema.sequences` |

---

## 2. Top Queries mais Lentas por Execução (Tempo Médio)

| Média (ms) | Máximo (ms) | Chamadas | Query SQL |
| :--- | :--- | :--- | :--- |
| 0.80 ms | 0.85 ms | 7 | `SELECT (SELECT setting FROM pg_catalog.pg_settings WHERE name = $1) AS timeline_id, -- Postgres creates temporary snapshot files of the form %X-%X.snap.%d.tmp. -- These temporary snapshot files are...` |
| 0.77 ms | 0.81 ms | 7 | `SELECT setting::float8 * $1 AS bytes FROM pg_catalog.pg_settings WHERE name = $2` |
| 0.77 ms | 0.82 ms | 7 | `SELECT setting::pg_catalog.int4 AS max_cluster_size FROM pg_catalog.pg_settings WHERE name = $1` |
| 0.46 ms | 0.54 ms | 7 | `WITH c AS (SELECT pg_catalog.jsonb_object_agg(metric, value) jb FROM neon.neon_perf_counters) SELECT d.* FROM pg_catalog.jsonb_to_record((SELECT jb FROM c)) AS d( file_cache_read_wait_seconds_count...` |
| 0.30 ms | 1.11 ms | 4 | `SELECT "installed_rank","version","description","type","script","checksum","installed_on","installed_by","execution_time","success" FROM "public"."flyway_schema_history" WHERE "installed_rank" > $1...` |
| 0.30 ms | 0.39 ms | 7 | `SELECT CASE WHEN pg_database.datname IN ($1 /*, ... */) THEN pg_database.datname ELSE $2 END as datname, pg_database.oid as datid, tmp.mode as mode, COALESCE(count, $3) as count FROM ( VALUES ($4),...` |
| 0.27 ms | 0.30 ms | 7 | `SELECT x AS duration, COALESCE(neon.approximate_working_set_size_seconds(extract($1 FROM x::pg_catalog.interval)::pg_catalog.int4), $2) AS size FROM ( VALUES ($3), ($4), ($5), ($6), ($7), ($8), ($9...` |
| 0.19 ms | 0.27 ms | 7 | `SELECT split_part(metric, $1, $2) AS safekeeper, max(CASE WHEN metric LIKE $3 THEN value END) AS bytes_sent_total, max(CASE WHEN metric LIKE $4 THEN value END) AS flush_wait_seconds_total, max(CASE...` |
| 0.18 ms | 0.21 ms | 7 | `SELECT v.type, COALESCE(c.value, $1) AS value FROM (VALUES ($2, $3), ($4, $5), ($6, $7), ($8, $9), ($10, $11), ($12, $13), ($14, $15), ($16, $17), ($18, $19), ($20, $21), ($22, $23), ($24, $25), ($...` |
| 0.18 ms | 0.85 ms | 49 | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |

---

## 3. Queries Mais Frequentes (Alerta de N+1 do Hibernate)

| Chamadas | Média (ms) | Tempo Total (ms) | Query SQL |
| :--- | :--- | :--- | :--- |
| 161 | 0.00 ms | 0.65 ms | `SELECT CASE WHEN pg_catalog.pg_is_in_recovery() THEN pg_catalog.pg_last_wal_replay_lsn() ELSE pg_catalog.pg_current_wal_lsn() END AS lsn, CURRENT_TIMESTAMP` |
| 158 | 0.01 ms | 1.61 ms | `select count(*) from pg_stat_subscription where pid is not null` |
| 158 | 0.13 ms | 21.01 ms | `SELECT state, pg_catalog.to_char(state_change, $1::pg_catalog.text) AS state_change FROM pg_stat_activity WHERE backend_type OPERATOR(pg_catalog.=) $2::pg_catalog.text AND pid OPERATOR(pg_catalog.!...` |
| 158 | 0.11 ms | 17.84 ms | `select count(*) from pg_stat_replication where application_name not in ($1 /*, ... */)` |
| 158 | 0.08 ms | 13.00 ms | `select count(*) from pg_stat_activity where backend_type = $1` |
| 158 | 0.00 ms | 0.66 ms | `SELECT $1` |
| 158 | 0.03 ms | 4.47 ms | `SELECT COALESCE(pg_catalog.sum(active_time), $1)::pg_catalog.float8 AS total_active_time, COALESCE(pg_catalog.sum(sessions), $2)::pg_catalog.int8 AS total_sessions FROM pg_catalog.pg_stat_database ...` |
| 158 | 0.01 ms | 2.07 ms | `select slot_name like $1 as is_temp from pg_replication_slots where slot_name like $2 or (slot_name like $3 and active)` |
| 56 | 0.04 ms | 2.09 ms | `SELECT COALESCE(lfc_value, $1) AS count FROM neon.neon_lfc_stats WHERE lfc_key = $2` |
| 49 | 0.18 ms | 8.66 ms | `SELECT bucket_le, value FROM neon.neon_perf_counters WHERE metric = $1` |

