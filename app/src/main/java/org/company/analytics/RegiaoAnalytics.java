package org.company.analytics;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.company.repository.PedidoRepository;
import org.company.repository.RegiaoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegiaoAnalytics {

        private final RegiaoRepository regiaoRepository;
        private final PedidoRepository pedidoRepository;

        public List<String> buscarRegioesCriticas() {
                return buscarRegioesCriticas(null);
        }

        public List<String> buscarRegioesCriticas(Long representanteId) {
                LocalDate hoje = LocalDate.now();
                LocalDate atualInicio = hoje.minusDays(30);
                LocalDate anteriorInicio = hoje.minusDays(60);
                LocalDate anteriorFim = hoje.minusDays(31);

                Map<Long, BigDecimal> faturamentoAtual = faturamentoPorRegiao(atualInicio, hoje, representanteId);
                Map<Long, BigDecimal> faturamentoAnterior = faturamentoPorRegiao(anteriorInicio, anteriorFim,
                                representanteId);

                return regiaoRepository.findAll().stream()
                                .filter(regiao -> {
                                        BigDecimal atual = faturamentoAtual.getOrDefault(regiao.getId(),
                                                        BigDecimal.ZERO);
                                        BigDecimal anterior = faturamentoAnterior.getOrDefault(regiao.getId(),
                                                        BigDecimal.ZERO);
                                        return anterior.compareTo(BigDecimal.ZERO) > 0
                                                        && percentualQueda(anterior, atual)
                                                                        .compareTo(BigDecimal.valueOf(20)) > 0;
                                })
                                .map(regiao -> regiao.getNome())
                                .distinct()
                                .collect(Collectors.toList());
        }

        private Map<Long, BigDecimal> faturamentoPorRegiao(LocalDate inicio, LocalDate fim, Long representanteId) {
                List<Object[]> results = pedidoRepository.findFaturamentoPorRegiao(inicio, fim, representanteId);
                return results.stream().collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> (BigDecimal) row[1]
                ));
        }

        private BigDecimal percentualQueda(BigDecimal anterior, BigDecimal atual) {
                return anterior.subtract(atual)
                                .multiply(BigDecimal.valueOf(100))
                                .divide(anterior, 2, RoundingMode.HALF_UP);
        }
}
