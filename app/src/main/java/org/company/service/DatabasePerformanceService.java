package org.company.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class DatabasePerformanceService {

    private static final Logger logger = LoggerFactory.getLogger(DatabasePerformanceService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private final JdbcTemplate jdbcTemplate;

    @Value("${app.database.performance-logging.enabled:true}")
    private boolean enabled;

    @Value("${app.database.performance-logging.output-file:logs/db-performance.md}")
    private String outputFile;

    public DatabasePerformanceService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Executa periodicamente a coleta de métricas e atualiza o arquivo de relatório.
     * Default: executa 1 minuto após o boot e a cada 1 hora subsequente.
     */
    @Scheduled(
            fixedRateString = "${app.database.performance-logging.rate-ms:3600000}",
            initialDelayString = "${app.database.performance-logging.initial-delay-ms:60000}"
    )
    public void scheduledLogging() {
        if (!enabled) {
            return;
        }
        gerarRelatorio();
    }

    /**
     * Gera o relatório em Markdown com base nas estatísticas atuais do pg_stat_statements.
     */
    public synchronized void gerarRelatorio() {
        try {
            List<Map<String, Object>> topTempoTotal = obterTopTempoTotal();
            List<Map<String, Object>> topTempoMedio = obterTopTempoMedio();
            List<Map<String, Object>> topMaisChamadas = obterTopMaisChamadas();

            escreverRelatorioMarkdown(topTempoTotal, topTempoMedio, topMaisChamadas);
            logger.info("Relatório de performance do banco de dados gerado em: {}", outputFile);

        } catch (DataAccessException e) {
            logger.warn("pg_stat_statements não está disponível no banco ativo ({}). Pulando logging de performance.", e.getMostSpecificCause().getMessage());
        } catch (Exception e) {
            logger.error("Falha ao gerar relatório de performance do banco: {}", e.getMessage(), e);
        }
    }

    /**
     * Zera o acumulador de estatísticas do pg_stat_statements.
     */
    public synchronized void resetarEstatisticas() {
        try {
            jdbcTemplate.execute("SELECT pg_stat_statements_reset();");
            logger.info("Estatísticas do pg_stat_statements foram zeradas com sucesso.");
        } catch (Exception e) {
            logger.warn("Não foi possível resetar o pg_stat_statements: {}", e.getMessage());
        }
    }

    private List<Map<String, Object>> obterTopTempoTotal() {
        String sql = """
            SELECT 
                round(total_exec_time::numeric, 2) AS tempo_total_ms,
                calls AS qtd_chamadas,
                round(mean_exec_time::numeric, 2) AS tempo_medio_ms,
                round((total_exec_time / sum(total_exec_time) OVER () * 100)::numeric, 2) AS pct_tempo_total,
                replace(replace(query, E'\\n', ' '), '|', ' ') AS query_sql
            FROM pg_stat_statements
            WHERE query NOT LIKE '%pg_stat_statements%'
            ORDER BY total_exec_time DESC
            LIMIT 10;
        """;
        return jdbcTemplate.queryForList(sql);
    }

    private List<Map<String, Object>> obterTopTempoMedio() {
        String sql = """
            SELECT 
                round(mean_exec_time::numeric, 2) AS tempo_medio_ms,
                round(max_exec_time::numeric, 2) AS tempo_max_ms,
                calls AS qtd_chamadas,
                replace(replace(query, E'\\n', ' '), '|', ' ') AS query_sql
            FROM pg_stat_statements
            WHERE calls > 2 AND query NOT LIKE '%pg_stat_statements%'
            ORDER BY mean_exec_time DESC
            LIMIT 10;
        """;
        return jdbcTemplate.queryForList(sql);
    }

    private List<Map<String, Object>> obterTopMaisChamadas() {
        String sql = """
            SELECT 
                calls AS qtd_chamadas,
                round(mean_exec_time::numeric, 2) AS tempo_medio_ms,
                round(total_exec_time::numeric, 2) AS tempo_total_ms,
                replace(replace(query, E'\\n', ' '), '|', ' ') AS query_sql
            FROM pg_stat_statements
            WHERE query NOT LIKE '%pg_stat_statements%'
            ORDER BY calls DESC
            LIMIT 10;
        """;
        return jdbcTemplate.queryForList(sql);
    }

    private void escreverRelatorioMarkdown(
            List<Map<String, Object>> topTempoTotal,
            List<Map<String, Object>> topTempoMedio,
            List<Map<String, Object>> topMaisChamadas
    ) throws Exception {

        File targetFile = new File(outputFile);
        File parentDir = targetFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        try (PrintWriter writer = new PrintWriter(new FileWriter(targetFile, StandardCharsets.UTF_8, false))) {
            writer.println("# Relatório de Performance de Banco de Dados — SalesRep");
            writer.println();
            writer.printf("- **Última Atualização:** %s%n", LocalDateTime.now().format(DATE_FORMATTER));
            writer.printf("- **Total de Queries Mapeadas no Top Total:** %d%n", topTempoTotal.size());
            writer.println();
            writer.println("> Este arquivo é gerado e atualizado periodicamente pelo `DatabasePerformanceService` utilizando métricas da extensão `pg_stat_statements`.");
            writer.println();

            writer.println("---");
            writer.println();
            writer.println("## 1. Top Queries por Tempo Total Acumulado (Consumo de CPU e I/O)");
            writer.println();
            if (topTempoTotal.isEmpty()) {
                writer.println("*Nenhuma consulta registrada até o momento.*");
            } else {
                writer.println("| Tempo Total (ms) | Chamadas | Média (ms) | % Tempo Total | Query SQL |");
                writer.println("| :--- | :--- | :--- | :--- | :--- |");
                for (Map<String, Object> row : topTempoTotal) {
                    writer.printf("| %s ms | %s | %s ms | %s%% | `%s` |%n",
                            row.get("tempo_total_ms"),
                            row.get("qtd_chamadas"),
                            row.get("tempo_medio_ms"),
                            row.get("pct_tempo_total"),
                            sanitizarQuery((String) row.get("query_sql")));
                }
            }

            writer.println();
            writer.println("---");
            writer.println();
            writer.println("## 2. Top Queries mais Lentas por Execução (Tempo Médio)");
            writer.println();
            if (topTempoMedio.isEmpty()) {
                writer.println("*Nenhuma consulta com mais de 2 chamadas registrada.*");
            } else {
                writer.println("| Média (ms) | Máximo (ms) | Chamadas | Query SQL |");
                writer.println("| :--- | :--- | :--- | :--- |");
                for (Map<String, Object> row : topTempoMedio) {
                    writer.printf("| %s ms | %s ms | %s | `%s` |%n",
                            row.get("tempo_medio_ms"),
                            row.get("tempo_max_ms"),
                            row.get("qtd_chamadas"),
                            sanitizarQuery((String) row.get("query_sql")));
                }
            }

            writer.println();
            writer.println("---");
            writer.println();
            writer.println("## 3. Queries Mais Frequentes (Alerta de N+1 do Hibernate)");
            writer.println();
            if (topMaisChamadas.isEmpty()) {
                writer.println("*Nenhuma consulta registrada até o momento.*");
            } else {
                writer.println("| Chamadas | Média (ms) | Tempo Total (ms) | Query SQL |");
                writer.println("| :--- | :--- | :--- | :--- |");
                for (Map<String, Object> row : topMaisChamadas) {
                    writer.printf("| %s | %s ms | %s ms | `%s` |%n",
                            row.get("qtd_chamadas"),
                            row.get("tempo_medio_ms"),
                            row.get("tempo_total_ms"),
                            sanitizarQuery((String) row.get("query_sql")));
                }
            }

            writer.println();
        }
    }

    private String sanitizarQuery(String query) {
        if (query == null) {
            return "";
        }
        String limpa = query.trim().replaceAll("\\s+", " ");
        if (limpa.length() > 200) {
            return limpa.substring(0, 197) + "...";
        }
        return limpa;
    }
}
