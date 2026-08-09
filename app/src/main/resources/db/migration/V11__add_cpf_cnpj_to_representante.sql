-- V11__add_cpf_cnpj_to_representante.sql
-- Adiciona o campo cpf_cnpj na tabela representante e popula com dados do data_13.07.26.csv e RELATORIO DE RV CADASTRO.csv

-- 1. Adiciona as colunas cpf_cnpj e email na tabela representante e permite telefone nulo
ALTER TABLE representante ADD COLUMN IF NOT EXISTS cpf_cnpj VARCHAR(50);
ALTER TABLE representante ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE representante ALTER COLUMN telefone DROP NOT NULL;

-- Representante ID 16: VIANA REPRESENTACAO LTDA', 1
UPDATE representante SET cpf_cnpj = '42.946.948/0001-84', telefone = '41-996778795', email = 'repre.zania@yahoo.com.br' WHERE id = 16;

-- Representante ID 17: MAURICIO GARCIA MACHADO & CIA LTDA', 2
UPDATE representante SET cpf_cnpj = '05.635.763/0001-22', telefone = '55-999841173', email = 'mauricio@mgmrepresentacoes.com.br' WHERE id = 17;

-- Representante ID 18: FELIX REPRESENTACOES E COMERCIO LTDA', 1
UPDATE representante SET cpf_cnpj = '57.208.204/0001-30', telefone = '31-999385900', email = 'augusto.felix808@gmail.com' WHERE id = 18;

-- Representante ID 19: SAGRA - INDUSTRIA E COMERCIO DE PRODUTOS ALIMENTIC', 1
UPDATE representante SET cpf_cnpj = '08.877.262/0001-40', telefone = '14-3378-1612', email = NULL WHERE id = 19;

-- Representante ID 20: EVOLUI REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '49.455.324/0001-03', telefone = '43-9661-0315', email = 'evolui.representacoes@gmail.com' WHERE id = 20;

-- Representante ID 21: CIDNEI DE FREITAS BAURU LTDA', 1
UPDATE representante SET cpf_cnpj = '04.283.858/0001-61', telefone = NULL, email = NULL WHERE id = 21;

-- Representante ID 22: VATT REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '03.687.037/0001-28', telefone = '12-997755411', email = 'Vatt.representacoes@hotmail.com' WHERE id = 22;

-- Representante ID 23: FABIO ITO SANT ANNA SERVIÇOS', 1
UPDATE representante SET cpf_cnpj = '17.901.814/0001-08', telefone = '14-981263835', email = 'fabioito@hotmail.com' WHERE id = 23;

-- Representante ID 24: CJS REPRESENTAÇÕES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '44.151.714/0001-76', telefone = '17-98145-4297', email = 'cjsilva2025@gmail.com' WHERE id = 24;

-- Representante ID 25: H. A. F. BUENO REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '48.240.016/0001-06', telefone = '14-996350506', email = 'habdalabueno@gmail.com' WHERE id = 25;

-- Representante ID 26: ZAGA REPRESENTACAO COMERCIAL LTDA', 2
UPDATE representante SET cpf_cnpj = '33.146.241/0001-00', telefone = '54-981270410', email = 'alexzancanaro@hotmail.com' WHERE id = 26;

-- Representante ID 27: SERGIO J.L. DAHER E CIA LTDA', 1
UPDATE representante SET cpf_cnpj = '01.105.632/0001-82', telefone = '47-988510063', email = 'sergiojldaher@hotmail.com' WHERE id = 27;

-- Representante ID 28: FERNANDO J PERES REPRESENTACAO COMERCIAL LTDA', 1
UPDATE representante SET cpf_cnpj = '18.151.079/0001-17', telefone = '42-999267374', email = 'fjperes.rep@hotmail.com' WHERE id = 28;

-- Representante ID 29: GERSON JUNIOR E REPRESENTAÇÕES LTDA', 1
UPDATE representante SET cpf_cnpj = '11.212.079/0001-30', telefone = '21-973157007', email = 'adm.gersonjrrepresentacoes2017@gmail.com' WHERE id = 29;

-- Representante ID 30: C R O REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '20.516.047/0001-10', telefone = NULL, email = 'celialencicrorepresentacoes@gmail.com' WHERE id = 30;

-- Representante ID 31: G&H REPRESENTACOES, COMERCIO E DISTRIBUICAO DE ALI', 1
UPDATE representante SET cpf_cnpj = '46.238.899/0001-86', telefone = NULL, email = 'gh.sagraalimentos@gmail.com' WHERE id = 31;

-- Representante ID 32: M. A. ROMANO REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '30.147.303/0001-00', telefone = '12-991398886', email = 'marco.romanno@gmail.com' WHERE id = 32;

-- Representante ID 33: AROLDO MALETICH & CIA. LTDA', 2
UPDATE representante SET cpf_cnpj = '02.677.550/0001-75', telefone = NULL, email = 'aroldomaletich.vendas@gmail.com' WHERE id = 33;

-- Representante ID 34: ATITUDE 10 PROMOCOES E EVENTOS LTDA', 1
UPDATE representante SET cpf_cnpj = '19.978.734/0001-78', telefone = '11-940157009', email = 'ricardo.atitude10@gmail.com' WHERE id = 34;

-- Representante ID 35: H. B. NOGUEIRA REPRESENTAÇÕES LTDA - ME', 1
UPDATE representante SET cpf_cnpj = '10.332.333/0001-71', telefone = '27-996087589', email = 'hbnogueira@yahoo.com.br' WHERE id = 35;

-- Representante ID 36: SCHAAK REPRESENTACOES COMERCIAIS LTDA', 2
UPDATE representante SET cpf_cnpj = '10.927.019/0001-31', telefone = '51-993121263', email = 'schaakrepresentacoes@gmail.com' WHERE id = 36;

-- Representante ID 37: REPRESENTACOES JACARDO LTDA', 2
UPDATE representante SET cpf_cnpj = '93.881.589/0001-65', telefone = '51-98186-0915', email = 'jandirscheid@gmail.com' WHERE id = 37;

-- Representante ID 38: 33.125.192 MARA FERREIRA DOS SANTOS', 1
UPDATE representante SET cpf_cnpj = '33.125.192/0001-11', telefone = '14-981961110', email = 'maraferreira.santos@hotmail.com' WHERE id = 38;

-- Representante ID 39: SANTANA & BEIRO REPRESENTACAO LTDA', 1
UPDATE representante SET cpf_cnpj = '31.973.723/0001-09', telefone = '19-997184043', email = 'luciano@beirorepresentacoes.com.br' WHERE id = 39;

-- Representante ID 40: ELPASSO ASSESSORIA DE VENDAS LTDA', 1
UPDATE representante SET cpf_cnpj = '12.652.549/0001-40', telefone = '11-99105-9513', email = 'vendas.sossai@hotmail.com' WHERE id = 40;

-- Representante ID 41: MULTIPLA REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '04.256.703/0001-36', telefone = '11-945403262', email = 'multipla.sergio@hotmail.com' WHERE id = 41;

-- Representante ID 42: ARAUJO REPRESENTACAO LTDA', 1
UPDATE representante SET cpf_cnpj = '37.287.097/0001-75', telefone = '71-82388266', email = 'gleibearauj@gmail.com' WHERE id = 42;

-- Representante ID 43: TOK & VENDA MARKETING E REPRESENTACOES COMERCIAIS', 1
UPDATE representante SET cpf_cnpj = '82.342.387/0001-29', telefone = '45-99113-1001', email = 'tokvenda@hotmail.com' WHERE id = 43;

-- Representante ID 44: JP REPRESENTACAO COMERCIAL LTDA', 1
UPDATE representante SET cpf_cnpj = '17.336.814/0001-02', telefone = '77-999167172', email = 'jp.representacoes13@gmail.com' WHERE id = 44;

-- Representante ID 45: RENATO CARLOS DE ANDRADE 11269578871', 1
UPDATE representante SET cpf_cnpj = '22.965.477/0001-44', telefone = '11-97728-6524', email = 'royalcenter.distri@gmail.com' WHERE id = 45;

-- Representante ID 46: CRW REPRESENTACAO COMERCIAL LTDA - GV FC', 1
UPDATE representante SET cpf_cnpj = '23.484.491/0001-99', telefone = '11-938019117', email = 'crwrepresentacoes@gmail.com' WHERE id = 46;

-- Representante ID 47: 58.431.458 GABRIEL PEREIRA SANTANA', 1
UPDATE representante SET cpf_cnpj = '58.431.458/0001-85', telefone = NULL, email = 'pereirasant98@gmail.com' WHERE id = 47;

-- Representante ID 48: GELUZ REPRESENTAÇÕES E ADMINISTRADORA DE BENS LTDA', 1
UPDATE representante SET cpf_cnpj = '00.081.746/0001-77', telefone = '47-33227543', email = 'geluzrep@gmail.com' WHERE id = 48;

-- Representante ID 49: ANTONIO RUBENS LUIZ FILHO LTDA', 1
UPDATE representante SET cpf_cnpj = '46.018.237/0001-09', telefone = '41-991861040', email = 'alrubens@terra.com.br' WHERE id = 49;

-- Representante ID 50: A T G REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '06.162.628/0001-70', telefone = '45-999730322', email = 'atgrepresentacoes@outlook.com' WHERE id = 50;

-- Representante ID 51: GOLDEN REPRESENTACOES E COMERCIO DE PRODUTOS ALIME', 1
UPDATE representante SET cpf_cnpj = '26.634.808/0001-14', telefone = '63-999953577', email = 'vpires30@hotmail.com' WHERE id = 51;

-- Representante ID 52: CAVAZZANI ASSESSORIA COMERCIAL LTDA', 1
UPDATE representante SET cpf_cnpj = '41.366.969/0001-68', telefone = '41-988663391', email = NULL WHERE id = 52;

-- Representante ID 53: B4E REPRESENTACAO COMERCIAL LTDA', 1
UPDATE representante SET cpf_cnpj = '42.741.833/0001-53', telefone = '11-947690918', email = 'fra.barboza@gmail.com' WHERE id = 53;

-- Representante ID 54: VIDA NOVA REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '35.039.512/0001-46', telefone = '51-99166-8218', email = 'vidanovarepres@gmail.com' WHERE id = 54;

-- Representante ID 55: EXCELENCIA REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '13.814.320/0001-27', telefone = NULL, email = 'vendas.excelencia.representacoes@gmail.com' WHERE id = 55;

-- Representante ID 56: MARCO ANTONIO LOPES RAMOS REPRESENTACAO E LOGISTIC', 1
UPDATE representante SET cpf_cnpj = '22.259.435/0001-98', telefone = '62-84253568', email = 'suporte_pedidos@hotmail.com' WHERE id = 56;

-- Representante ID 57: MARTINS REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '54.638.924/0001-47', telefone = '71-9110-1480', email = 'mrrepresentacoesltda2025@gmail.com' WHERE id = 57;

-- Representante ID 58: ROCHA REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '08.402.535/0001-09', telefone = NULL, email = 'acesarrl@uol.com.br' WHERE id = 58;

-- Representante ID 59: GSI COMERCIO E REPRESENTACAO LTDA', 1
UPDATE representante SET cpf_cnpj = '32.933.448/0001-54', telefone = '27-99516157', email = 'samela.samela@gmail.com' WHERE id = 59;

-- Representante ID 60: G2 REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '24.335.696/0001-75', telefone = NULL, email = 'g2representacoesltda@hotmail.com' WHERE id = 60;

-- Representante ID 61: 54.659.364 ANA CARLA NOVAES PAUPERIO', 1
UPDATE representante SET cpf_cnpj = '54.659.364/0001-07', telefone = '14-991682403', email = 'acarlapauperio@gmail.com' WHERE id = 61;

-- Representante ID 62: GERALDO LUIZ FALCÃO DA SILVA - GV FC', 1
UPDATE representante SET cpf_cnpj = '41.644.954/0001-14', telefone = '21-984113535', email = 'gefalcaorj@gmail.com' WHERE id = 62;

-- Representante ID 63: J NUNES REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '49.645.737/0001-50', telefone = '87-998034493', email = 'ebjrnunes@hotmail.com' WHERE id = 63;

-- Representante ID 64: W M REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '36.673.392/0001-05', telefone = '31-984113409', email = 'wagner.tortelli@hotmail.com' WHERE id = 64;

-- Representante ID 65: PISSOLATI & ASSUMPCAO REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '01.208.944/0001-11', telefone = '31-8413-6796', email = 'r.pissolati1101@gmail.com' WHERE id = 65;

-- Representante ID 66: M.M SCHERER REPRESENTACAO LTDA', 2
UPDATE representante SET cpf_cnpj = '02.669.101/0001-85', telefone = '51-999854007', email = 'marcosheitor1965@outlook.com' WHERE id = 66;

-- Representante ID 67: M A SA GONCALVES LTDA', 1
UPDATE representante SET cpf_cnpj = '29.944.799/0001-56', telefone = NULL, email = NULL WHERE id = 67;

-- Representante ID 68: ALOIZIO DA SILVA ALVES GUARUJA', 1
UPDATE representante SET cpf_cnpj = '40.988.180/0001-86', telefone = NULL, email = NULL WHERE id = 68;

-- Representante ID 69: RAMIRO RODRIGUES DE FREITAS', 1
UPDATE representante SET cpf_cnpj = '30.840.004/0001-49', telefone = '11-947924877', email = 'ramiro.defreitas@terra.com.br' WHERE id = 69;

-- Representante ID 70: B SUCESSO REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '11.982.926/0001-46', telefone = '73-36343729', email = 'antonioecia@yahoo.com.br' WHERE id = 70;

-- Representante ID 71: S.R.A. PROMOCAO E VENDAS LTDA.', 1
UPDATE representante SET cpf_cnpj = '46.626.871/0001-16', telefone = '47-999241516', email = 'silviopelz.vendas@gmail.com' WHERE id = 71;

-- Representante ID 72: IC & GRC - COMERCIO E REPRESENTACAO LTDA', 1
UPDATE representante SET cpf_cnpj = '47.112.827/0001-50', telefone = '11-999927094', email = 'ivan.ssoares@terras.com.br' WHERE id = 72;

-- Representante ID 73: AFINIDADE REPRESENTACOES E LOGISTICA LTDA', 1
UPDATE representante SET cpf_cnpj = '10.538.276/0001-81', telefone = NULL, email = 'joatanlopes@hotmail.com' WHERE id = 73;

-- Representante ID 74: A DE OLIVEIRA LIMA E LIMA REPRESENTACOES DE ALIMEN', 1
UPDATE representante SET cpf_cnpj = '39.863.074/0001-97', telefone = '91-983494331', email = 'artimesolima@gmail.com' WHERE id = 74;

-- Representante ID 75: DAVID REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '48.390.242/0001-65', telefone = NULL, email = 'davidguanais10@hotmail.com' WHERE id = 75;

-- Representante ID 76: MADEIRA ACI COMERCIAL IMPORTADORA E EXPORTADORA LT', 1
UPDATE representante SET cpf_cnpj = '93.520.757/0001-97', telefone = '51-3472-2660', email = 'emanuela@madeira-aci.com.br' WHERE id = 76;

-- Representante ID 77: MIXX REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '48.328.920/0001-60', telefone = '62-985458795', email = 'mariobento07@hotmail.com' WHERE id = 77;

-- Representante ID 78: VOLPINI REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '07.535.874/0001-92', telefone = '45-999163032', email = 'irmaosvolpini@gmail.com' WHERE id = 78;

-- Representante ID 79: ANTONIO RAFAEL WILLERS CATTELAN LTDA', 2
UPDATE representante SET cpf_cnpj = '41.843.240/0001-35', telefone = NULL, email = 'arcattelan@hotmail.com' WHERE id = 79;

-- Representante ID 80: YCS REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '52.509.640/0001-25', telefone = '44-991759595', email = 'portosegurors@hotmail.com' WHERE id = 80;

-- Representante ID 81: ALMEIDA E SANTOS REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '63.188.650/0001-22', telefone = '77-991972025', email = 'ernaquerepresentante@gmail.com' WHERE id = 81;

-- Representante ID 82: NOGUEIRA COMERCIO E REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '02.814.789/0001-40', telefone = '22-999141909', email = 'nogueira.representacao@gmail.com' WHERE id = 82;

-- Representante ID 83: F A FERREIRA REPRESENTACOES DE CHOCOLATES E CONFEI', 1
UPDATE representante SET cpf_cnpj = '32.609.264/0001-33', telefone = '86-999532888', email = 'francisco.ferreira1972@hotmail.com' WHERE id = 83;

-- Representante ID 84: JOTACE REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '49.148.725/0001-10', telefone = NULL, email = 'josecarlosribeirodasilva60@gmail.com' WHERE id = 84;

-- Representante ID 85: PRADO REPRESENTACAO LTDA', 2
UPDATE representante SET cpf_cnpj = '43.647.545/0001-05', telefone = '51-984687686', email = 'pradorepresentacao2021@gmail.com' WHERE id = 85;

-- Representante ID 86: REPRESENTAÇÕES VALDEMI LTDA', 1
UPDATE representante SET cpf_cnpj = '22.695.308/0001-31', telefone = '33-99122-8809', email = 'valdemi.mario@gmail.com' WHERE id = 86;

-- Representante ID 87: FALCAO COMERCIO E REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '08.489.603/0001-00', telefone = NULL, email = 'falcaocml@uol.com.br' WHERE id = 87;

-- Representante ID 88: L. C. DA SILVA SANTOS COMERCIO E REPRESENTACAO', 1
UPDATE representante SET cpf_cnpj = '40.829.526/0001-01', telefone = NULL, email = 'lcssrepresentacaofinanceiro@gmail.com' WHERE id = 88;

-- Representante ID 89: P G BURATTI REPRESENTAÇÃO ME', 1
UPDATE representante SET cpf_cnpj = '09.269.148/0001-09', telefone = NULL, email = NULL WHERE id = 89;

-- Representante ID 90: MOISES CERQUEIRA REPRESENTACOES CONSULTORIA E PROM', 1
UPDATE representante SET cpf_cnpj = '12.368.591/0001-33', telefone = '71-991944100', email = 'moisescsantana@gmail.com' WHERE id = 90;

-- Representante ID 91: V.P.T.L REPRESENTACAO LTDA', 1
UPDATE representante SET cpf_cnpj = '37.218.758/0001-00', telefone = '34-991322669', email = 'domingos_leite50@hotmail.com' WHERE id = 91;

-- Representante ID 92: CAL REPRESENTACOES LTDA.', 1
UPDATE representante SET cpf_cnpj = '18.840.922/0001-72', telefone = '83-991068356', email = 'lopes.charles@hotmail.com' WHERE id = 92;

-- Representante ID 93: P. S. C. REPRESENTACOES COMERCIAIS LTDA', 1
UPDATE representante SET cpf_cnpj = '15.161.435/0001-95', telefone = NULL, email = 'paulocaobianco@hotmail.com' WHERE id = 93;

-- Representante ID 94: SAMUEL DE LIMA REPRESENTACAO DE PRODUTOS ALIMENTIC', 1
UPDATE representante SET cpf_cnpj = '36.174.041/0001-41', telefone = '41-991299823', email = 'samueldelima1@gmail.com' WHERE id = 94;

-- Representante ID 95: F M FRANCA REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '44.383.968/0001-10', telefone = NULL, email = 'MARTINS.REPRES@HOTMAIL.COM' WHERE id = 95;

-- Representante ID 96: JULIANO - SCHAAK REPRESENTAÇÕES COMERCIAIS LTDA', 2
UPDATE representante SET cpf_cnpj = '10.927.019/0001-31', telefone = '51-993121263', email = 'schaakrepresentacoes@gmail.com' WHERE id = 96;

-- Representante ID 97: AIEB LIFE COMERCIO DISTR. E REPRESENTAÇÃO LTDA', 1
UPDATE representante SET cpf_cnpj = '06.304.129/0001-70', telefone = '43-3326700143', email = 'neyarlindocruz@hotmail.com' WHERE id = 97;

-- Representante ID 98: ROGERIO SANDRINI ALVES EPP', 1
UPDATE representante SET cpf_cnpj = '14.281.202/0001-63', telefone = '11-29463701', email = 'rogerio@waldircomercio.com.br' WHERE id = 98;

-- Representante ID 99: BRASIL FOODS INDUSTRIA E COMERCIO DE ALIMENTOS LTD', 1
UPDATE representante SET cpf_cnpj = '43.179.714/0001-11', telefone = NULL, email = 'jocemir268@outlook.com' WHERE id = 99;

-- Representante ID 100: SAGRA INDUSTRIA E COMERCIO DE PRODUTOS ALIMENTICIO', 1
UPDATE representante SET cpf_cnpj = '08.877.262/0001-40', telefone = '14-3378-1612', email = NULL WHERE id = 100;

-- Representante ID 101: C H R MACHADO REPRESENTACOES LTDA', 1
UPDATE representante SET cpf_cnpj = '03.924.930/0001-20', telefone = '85-99516215', email = 'machado.clayton@hotmail.com' WHERE id = 101;

-- Representante ID 3: REPRESENTAÇÕES PEREIRA & VIANINI LTDA', 3
UPDATE representante SET cpf_cnpj = '03.258.378/0001-88', telefone = '31-999039270', email = 'gilbertoreprespvianini@gmail.com' WHERE id = 3;

-- Representante ID 4: GW COM.DE ALIMENTOS E REPRESENTACAO LTDA-ME', 3
UPDATE representante SET cpf_cnpj = '00.250.790/0001-63', telefone = '11-981748728', email = 'gw_acessoriavendas@yahoo.com.br' WHERE id = 4;

-- Representante ID 5: MAURO DE LIMA OLIVEIRA - REPRESENTAÇAO', 4
UPDATE representante SET cpf_cnpj = '23.792.915/0001-82', telefone = '11-940310483', email = 'maurotbn@hotmail.com' WHERE id = 5;

-- Representante ID 6: REPRESENTAÇÕES COMERCIAIS BARBARA LTDA - GV FC', 4
UPDATE representante SET cpf_cnpj = '05.606.004/0001-31', telefone = '43-999054998', email = 'marco@mbarbara.com.br' WHERE id = 6;

-- Representante ID 7: B.B.C. DISTRIBUIDORA LTDA', 5
UPDATE representante SET cpf_cnpj = '01.064.726/0001-50', telefone = '31-987741239', email = 'bbcdist@bbcdist.com.br' WHERE id = 7;

-- Representante ID 8: GERSON LUIZ RICCETTO REPRESENTACOES COMERCIAIS LTD', 6
UPDATE representante SET cpf_cnpj = '03.118.547/0001-84', telefone = '41-997096805', email = 'gersoriccetto9@gmail.com' WHERE id = 8;

-- Representante ID 9: PORTO SEGURO REPRESENTAÇÕES COMERCIAIS LTDA - GV F', 6
UPDATE representante SET cpf_cnpj = '20.113.227/0001-50', telefone = '44-991759595', email = 'portosegurors@hotmail.com' WHERE id = 9;

-- Representante ID 10: LUAN VINICIUS DOS SANTOS LTDA', 7
UPDATE representante SET cpf_cnpj = '46.764.807/0001-00', telefone = '67-992427040', email = 'luanrh@hotmaoll.com' WHERE id = 10;

-- Representante ID 11: MARCELO DE CASTRO SILVA & CIA. LTDA.', 7
UPDATE representante SET cpf_cnpj = '32.533.157/0001-79', telefone = '43-98850-5413', email = 'marcelocastrosilva1981@gmail.com' WHERE id = 11;

-- Representante ID 12: MAIAU REPRESENTACOES LTDA', 8
UPDATE representante SET cpf_cnpj = '19.312.019/0001-00', telefone = '21-981672290', email = 'jrvalcarcenovo@gmail.com' WHERE id = 12;

-- Representante ID 13: RUBIO COMERCIO E REPRESENTAÇÃO LTDA', 9
UPDATE representante SET cpf_cnpj = '13.899.410/0001-68', telefone = '69-99970-9990', email = 'rubiorepresentacao@gmail.com' WHERE id = 13;

-- Representante ID 14: ZS REPRESENTACOES LTDA', 14
UPDATE representante SET cpf_cnpj = '08.431.601/0001-60', telefone = '48-996884155', email = 'zancanaroa@gmail.com' WHERE id = 14;

-- Representante ID 15: SHARLES WILLIAN S. B. DE OLIVEIRA REPRESENTACOES L
UPDATE representante SET cpf_cnpj = '61.410.291/0001-80', telefone = NULL, email = 'sharlesrepresentacoes@gmail.com' WHERE id = 15;

