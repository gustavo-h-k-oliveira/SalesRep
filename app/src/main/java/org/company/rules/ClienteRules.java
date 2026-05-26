package org.company.rules;

import org.company.entity.Cliente;

public class ClienteRules {
    
    // public boolean isCritico(Cliente cliente) {

    // };

    // public boolean isPrioritario(Cliente cliente, double score) {
    //    return score >= 80;
    // };

    public boolean precisaRecuperacao(Cliente cliente) {
        return cliente.estaInativo() || cliente.getDiasSemCompra() > 45;
    };
}
