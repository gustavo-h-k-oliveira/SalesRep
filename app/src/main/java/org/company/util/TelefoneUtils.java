package org.company.util;

public class TelefoneUtils {

    public static String normalizar(String telefone) {
        if (telefone == null) {
            return "";
        }
        return telefone.replaceAll("[^0-9]", "");
    }
}
