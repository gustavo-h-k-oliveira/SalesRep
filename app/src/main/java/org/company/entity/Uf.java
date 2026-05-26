package org.company.entity;

public enum Uf {
    
    SP("São Paulo"),
    RJ("Rio de Janeiro"),
    MG("Minas Gerais"),
    ES("Espírito Santo"),
    PR("Paraná"),
    SC("Santa Catarina"),
    RS("Rio Grande do Sul");

    private final String nome;

    Uf(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}
