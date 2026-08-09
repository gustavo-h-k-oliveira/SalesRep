-- V12__update_representante_gestor_email_telefone_by_cpf_cnpj.sql
-- Atualiza telefone e e-mail de representantes e gestores a partir do campo cpf_cnpj do arquivo RELATORIO DE RV CADASTRO.csv

-- CNPJ/CPF: 32.926.425/0001-12 (digits: 32926425000112)
UPDATE representante SET email = 'geg.representacoes@hotmail.com', telefone = '17-992541599' WHERE cpf_cnpj = '32.926.425/0001-12' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32926425000112';
UPDATE usuario SET email = 'geg.representacoes@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '32.926.425/0001-12' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32926425000112');

-- CNPJ/CPF: 33.125.192/0001-11 (digits: 33125192000111)
UPDATE representante SET email = 'maraferreira.santos@hotmail.com', telefone = '14-981961110' WHERE cpf_cnpj = '33.125.192/0001-11' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '33125192000111';
UPDATE usuario SET email = 'maraferreira.santos@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '33.125.192/0001-11' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '33125192000111');

-- CNPJ/CPF: 54.659.364/0001-07 (digits: 54659364000107)
UPDATE representante SET email = 'acarlapauperio@gmail.com', telefone = '14-991682403' WHERE cpf_cnpj = '54.659.364/0001-07' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '54659364000107';
UPDATE usuario SET email = 'acarlapauperio@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '54.659.364/0001-07' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '54659364000107');

-- CNPJ/CPF: 58.431.458/0001-85 (digits: 58431458000185)
UPDATE representante SET email = 'pereirasant98@gmail.com' WHERE cpf_cnpj = '58.431.458/0001-85' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '58431458000185';
UPDATE usuario SET email = 'pereirasant98@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '58.431.458/0001-85' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '58431458000185');

-- CNPJ/CPF: 39.863.074/0001-97 (digits: 39863074000197)
UPDATE representante SET email = 'artimesolima@gmail.com', telefone = '91-983494331' WHERE cpf_cnpj = '39.863.074/0001-97' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '39863074000197';
UPDATE usuario SET email = 'artimesolima@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '39.863.074/0001-97' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '39863074000197');

-- CNPJ/CPF: 06.162.628/0001-70 (digits: 06162628000170)
UPDATE representante SET email = 'atgrepresentacoes@outlook.com', telefone = '45-999730322' WHERE cpf_cnpj = '06.162.628/0001-70' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '06162628000170';
UPDATE usuario SET email = 'atgrepresentacoes@outlook.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '06.162.628/0001-70' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '06162628000170');

-- CNPJ/CPF: 10.538.276/0001-81 (digits: 10538276000181)
UPDATE representante SET email = 'joatanlopes@hotmail.com' WHERE cpf_cnpj = '10.538.276/0001-81' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '10538276000181';
UPDATE usuario SET email = 'joatanlopes@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '10.538.276/0001-81' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '10538276000181');

-- CNPJ/CPF: 06.304.129/0001-70 (digits: 06304129000170)
UPDATE representante SET email = 'neyarlindocruz@hotmail.com', telefone = '43-3326700143' WHERE cpf_cnpj = '06.304.129/0001-70' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '06304129000170';
UPDATE usuario SET email = 'neyarlindocruz@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '06.304.129/0001-70' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '06304129000170');

-- CNPJ/CPF: 63.188.650/0001-22 (digits: 63188650000122)
UPDATE representante SET email = 'ernaquerepresentante@gmail.com', telefone = '77-991972025' WHERE cpf_cnpj = '63.188.650/0001-22' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '63188650000122';
UPDATE usuario SET email = 'ernaquerepresentante@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '63.188.650/0001-22' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '63188650000122');

-- CNPJ/CPF: 41.843.240/0001-35 (digits: 41843240000135)
UPDATE representante SET email = 'arcattelan@hotmail.com' WHERE cpf_cnpj = '41.843.240/0001-35' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '41843240000135';
UPDATE usuario SET email = 'arcattelan@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '41.843.240/0001-35' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '41843240000135');

-- CNPJ/CPF: 46.018.237/0001-09 (digits: 46018237000109)
UPDATE representante SET email = 'alrubens@terra.com.br', telefone = '41-991861040' WHERE cpf_cnpj = '46.018.237/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46018237000109';
UPDATE usuario SET email = 'alrubens@terra.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '46.018.237/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46018237000109');

-- CNPJ/CPF: 37.287.097/0001-75 (digits: 37287097000175)
UPDATE representante SET email = 'gleibearauj@gmail.com', telefone = '71-82388266' WHERE cpf_cnpj = '37.287.097/0001-75' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '37287097000175';
UPDATE usuario SET email = 'gleibearauj@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '37.287.097/0001-75' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '37287097000175');

-- CNPJ/CPF: 02.677.550/0001-75 (digits: 02677550000175)
UPDATE representante SET email = 'aroldomaletich.vendas@gmail.com' WHERE cpf_cnpj = '02.677.550/0001-75' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02677550000175';
UPDATE usuario SET email = 'aroldomaletich.vendas@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '02.677.550/0001-75' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02677550000175');

-- CNPJ/CPF: 19.978.734/0001-78 (digits: 19978734000178)
UPDATE representante SET email = 'ricardo.atitude10@gmail.com', telefone = '11-940157009' WHERE cpf_cnpj = '19.978.734/0001-78' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '19978734000178';
UPDATE usuario SET email = 'ricardo.atitude10@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '19.978.734/0001-78' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '19978734000178');

-- CNPJ/CPF: 11.982.926/0001-46 (digits: 11982926000146)
UPDATE representante SET email = 'antonioecia@yahoo.com.br', telefone = '73-36343729' WHERE cpf_cnpj = '11.982.926/0001-46' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11982926000146';
UPDATE usuario SET email = 'antonioecia@yahoo.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '11.982.926/0001-46' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11982926000146');

-- CNPJ/CPF: 01.064.726/0001-50 (digits: 01064726000150)
UPDATE representante SET email = 'bbcdist@bbcdist.com.br', telefone = '31-987741239' WHERE cpf_cnpj = '01.064.726/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01064726000150';
UPDATE usuario SET email = 'bbcdist@bbcdist.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '01.064.726/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01064726000150');

-- CNPJ/CPF: 42.741.833/0001-53 (digits: 42741833000153)
UPDATE representante SET email = 'fra.barboza@gmail.com', telefone = '11-947690918' WHERE cpf_cnpj = '42.741.833/0001-53' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '42741833000153';
UPDATE usuario SET email = 'fra.barboza@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '42.741.833/0001-53' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '42741833000153');

-- CNPJ/CPF: 43.179.714/0001-11 (digits: 43179714000111)
UPDATE representante SET email = 'jocemir268@outlook.com' WHERE cpf_cnpj = '43.179.714/0001-11' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '43179714000111';
UPDATE usuario SET email = 'jocemir268@outlook.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '43.179.714/0001-11' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '43179714000111');

-- CNPJ/CPF: 03.924.930/0001-20 (digits: 03924930000120)
UPDATE representante SET email = 'machado.clayton@hotmail.com', telefone = '85-99516215' WHERE cpf_cnpj = '03.924.930/0001-20' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03924930000120';
UPDATE usuario SET email = 'machado.clayton@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '03.924.930/0001-20' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03924930000120');

-- CNPJ/CPF: 20.516.047/0001-10 (digits: 20516047000110)
UPDATE representante SET email = 'celialencicrorepresentacoes@gmail.com' WHERE cpf_cnpj = '20.516.047/0001-10' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '20516047000110';
UPDATE usuario SET email = 'celialencicrorepresentacoes@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '20.516.047/0001-10' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '20516047000110');

-- CNPJ/CPF: 18.840.922/0001-72 (digits: 18840922000172)
UPDATE representante SET email = 'lopes.charles@hotmail.com', telefone = '83-991068356' WHERE cpf_cnpj = '18.840.922/0001-72' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '18840922000172';
UPDATE usuario SET email = 'lopes.charles@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '18.840.922/0001-72' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '18840922000172');

-- CNPJ/CPF: 01.860.250/0001-64 (digits: 01860250000164)
UPDATE representante SET email = 'castrorepresentacoes@uol.com.br', telefone = '11-947474666' WHERE cpf_cnpj = '01.860.250/0001-64' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01860250000164';
UPDATE usuario SET email = 'castrorepresentacoes@uol.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '01.860.250/0001-64' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01860250000164');

-- CNPJ/CPF: 41.366.969/0001-68 (digits: 41366969000168)
UPDATE representante SET telefone = '41-988663391' WHERE cpf_cnpj = '41.366.969/0001-68' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '41366969000168';

-- CNPJ/CPF: 22.792.726/0001-47 (digits: 22792726000147)
UPDATE representante SET email = 'celiovendas35@hotmail.com', telefone = '34-991620431' WHERE cpf_cnpj = '22.792.726/0001-47' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22792726000147';
UPDATE usuario SET email = 'celiovendas35@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '22.792.726/0001-47' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22792726000147');

-- CNPJ/CPF: 44.151.714/0001-76 (digits: 44151714000176)
UPDATE representante SET email = 'cjsilva2025@gmail.com', telefone = '17-98145-4297' WHERE cpf_cnpj = '44.151.714/0001-76' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '44151714000176';
UPDATE usuario SET email = 'cjsilva2025@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '44.151.714/0001-76' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '44151714000176');

-- CNPJ/CPF: 29.161.625/0001-17 (digits: 29161625000117)
UPDATE representante SET email = 'cristianoesteves0610@gmail.com', telefone = '15-981091313' WHERE cpf_cnpj = '29.161.625/0001-17' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '29161625000117';
UPDATE usuario SET email = 'cristianoesteves0610@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '29.161.625/0001-17' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '29161625000117');

-- CNPJ/CPF: 23.484.491/0001-99 (digits: 23484491000199)
UPDATE representante SET email = 'crwrepresentacoes@gmail.com', telefone = '11-938019117' WHERE cpf_cnpj = '23.484.491/0001-99' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '23484491000199';
UPDATE usuario SET email = 'crwrepresentacoes@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '23.484.491/0001-99' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '23484491000199');

-- CNPJ/CPF: 48.390.242/0001-65 (digits: 48390242000165)
UPDATE representante SET email = 'davidguanais10@hotmail.com' WHERE cpf_cnpj = '48.390.242/0001-65' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '48390242000165';
UPDATE usuario SET email = 'davidguanais10@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '48.390.242/0001-65' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '48390242000165');

-- CNPJ/CPF: 12.652.549/0001-40 (digits: 12652549000140)
UPDATE representante SET email = 'vendas.sossai@hotmail.com', telefone = '11-99105-9513' WHERE cpf_cnpj = '12.652.549/0001-40' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '12652549000140';
UPDATE usuario SET email = 'vendas.sossai@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '12.652.549/0001-40' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '12652549000140');

-- CNPJ/CPF: 49.455.324/0001-03 (digits: 49455324000103)
UPDATE representante SET email = 'evolui.representacoes@gmail.com', telefone = '43-9661-0315' WHERE cpf_cnpj = '49.455.324/0001-03' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '49455324000103';
UPDATE usuario SET email = 'evolui.representacoes@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '49.455.324/0001-03' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '49455324000103');

-- CNPJ/CPF: 13.814.320/0001-27 (digits: 13814320000127)
UPDATE representante SET email = 'vendas.excelencia.representacoes@gmail.com' WHERE cpf_cnpj = '13.814.320/0001-27' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '13814320000127';
UPDATE usuario SET email = 'vendas.excelencia.representacoes@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '13.814.320/0001-27' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '13814320000127');

-- CNPJ/CPF: 32.609.264/0001-33 (digits: 32609264000133)
UPDATE representante SET email = 'francisco.ferreira1972@hotmail.com', telefone = '86-999532888' WHERE cpf_cnpj = '32.609.264/0001-33' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32609264000133';
UPDATE usuario SET email = 'francisco.ferreira1972@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '32.609.264/0001-33' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32609264000133');

-- CNPJ/CPF: 44.383.968/0001-10 (digits: 44383968000110)
UPDATE representante SET email = 'MARTINS.REPRES@HOTMAIL.COM' WHERE cpf_cnpj = '44.383.968/0001-10' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '44383968000110';
UPDATE usuario SET email = 'MARTINS.REPRES@HOTMAIL.COM' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '44.383.968/0001-10' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '44383968000110');

-- CNPJ/CPF: 17.901.814/0001-08 (digits: 17901814000108)
UPDATE representante SET email = 'fabioito@hotmail.com', telefone = '14-981263835' WHERE cpf_cnpj = '17.901.814/0001-08' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '17901814000108';
UPDATE usuario SET email = 'fabioito@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '17.901.814/0001-08' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '17901814000108');

-- CNPJ/CPF: 08.489.603/0001-00 (digits: 08489603000100)
UPDATE representante SET email = 'falcaocml@uol.com.br' WHERE cpf_cnpj = '08.489.603/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '08489603000100';
UPDATE usuario SET email = 'falcaocml@uol.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '08.489.603/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '08489603000100');

-- CNPJ/CPF: 57.208.204/0001-30 (digits: 57208204000130)
UPDATE representante SET email = 'augusto.felix808@gmail.com', telefone = '31-999385900' WHERE cpf_cnpj = '57.208.204/0001-30' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '57208204000130';
UPDATE usuario SET email = 'augusto.felix808@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '57.208.204/0001-30' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '57208204000130');

-- CNPJ/CPF: 18.151.079/0001-17 (digits: 18151079000117)
UPDATE representante SET email = 'fjperes.rep@hotmail.com', telefone = '42-999267374' WHERE cpf_cnpj = '18.151.079/0001-17' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '18151079000117';
UPDATE usuario SET email = 'fjperes.rep@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '18.151.079/0001-17' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '18151079000117');

-- CNPJ/CPF: 46.238.899/0001-86 (digits: 46238899000186)
UPDATE representante SET email = 'gh.sagraalimentos@gmail.com' WHERE cpf_cnpj = '46.238.899/0001-86' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46238899000186';
UPDATE usuario SET email = 'gh.sagraalimentos@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '46.238.899/0001-86' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46238899000186');

-- CNPJ/CPF: 24.335.696/0001-75 (digits: 24335696000175)
UPDATE representante SET email = 'g2representacoesltda@hotmail.com' WHERE cpf_cnpj = '24.335.696/0001-75' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '24335696000175';
UPDATE usuario SET email = 'g2representacoesltda@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '24.335.696/0001-75' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '24335696000175');

-- CNPJ/CPF: 00.081.746/0001-77 (digits: 00081746000177)
UPDATE representante SET email = 'geluzrep@gmail.com', telefone = '47-33227543' WHERE cpf_cnpj = '00.081.746/0001-77' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '00081746000177';
UPDATE usuario SET email = 'geluzrep@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '00.081.746/0001-77' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '00081746000177');

-- CNPJ/CPF: 41.644.954/0001-14 (digits: 41644954000114)
UPDATE representante SET email = 'gefalcaorj@gmail.com', telefone = '21-984113535' WHERE cpf_cnpj = '41.644.954/0001-14' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '41644954000114';
UPDATE usuario SET email = 'gefalcaorj@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '41.644.954/0001-14' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '41644954000114');

-- CNPJ/CPF: 11.212.079/0001-30 (digits: 11212079000130)
UPDATE representante SET email = 'adm.gersonjrrepresentacoes2017@gmail.com', telefone = '21-973157007' WHERE cpf_cnpj = '11.212.079/0001-30' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11212079000130';
UPDATE usuario SET email = 'adm.gersonjrrepresentacoes2017@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '11.212.079/0001-30' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11212079000130');

-- CNPJ/CPF: 03.118.547/0001-84 (digits: 03118547000184)
UPDATE representante SET email = 'gersoriccetto9@gmail.com', telefone = '41-997096805' WHERE cpf_cnpj = '03.118.547/0001-84' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03118547000184';
UPDATE usuario SET email = 'gersoriccetto9@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '03.118.547/0001-84' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03118547000184');

-- CNPJ/CPF: 26.634.808/0001-14 (digits: 26634808000114)
UPDATE representante SET email = 'vpires30@hotmail.com', telefone = '63-999953577' WHERE cpf_cnpj = '26.634.808/0001-14' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '26634808000114';
UPDATE usuario SET email = 'vpires30@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '26.634.808/0001-14' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '26634808000114');

-- CNPJ/CPF: 32.933.448/0001-54 (digits: 32933448000154)
UPDATE representante SET email = 'samela.samela@gmail.com', telefone = '27-99516157' WHERE cpf_cnpj = '32.933.448/0001-54' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32933448000154';
UPDATE usuario SET email = 'samela.samela@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '32.933.448/0001-54' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32933448000154');

-- CNPJ/CPF: 00.250.790/0001-63 (digits: 00250790000163)
UPDATE representante SET email = 'gw_acessoriavendas@yahoo.com.br', telefone = '11-981748728' WHERE cpf_cnpj = '00.250.790/0001-63' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '00250790000163';
UPDATE usuario SET email = 'gw_acessoriavendas@yahoo.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '00.250.790/0001-63' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '00250790000163');

-- CNPJ/CPF: 48.240.016/0001-06 (digits: 48240016000106)
UPDATE representante SET email = 'habdalabueno@gmail.com', telefone = '14-996350506' WHERE cpf_cnpj = '48.240.016/0001-06' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '48240016000106';
UPDATE usuario SET email = 'habdalabueno@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '48.240.016/0001-06' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '48240016000106');

-- CNPJ/CPF: 10.332.333/0001-71 (digits: 10332333000171)
UPDATE representante SET email = 'hbnogueira@yahoo.com.br', telefone = '27-996087589' WHERE cpf_cnpj = '10.332.333/0001-71' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '10332333000171';
UPDATE usuario SET email = 'hbnogueira@yahoo.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '10.332.333/0001-71' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '10332333000171');

-- CNPJ/CPF: 47.112.827/0001-50 (digits: 47112827000150)
UPDATE representante SET email = 'ivan.ssoares@terras.com.br', telefone = '11-999927094' WHERE cpf_cnpj = '47.112.827/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '47112827000150';
UPDATE usuario SET email = 'ivan.ssoares@terras.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '47.112.827/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '47112827000150');

-- CNPJ/CPF: 49.645.737/0001-50 (digits: 49645737000150)
UPDATE representante SET email = 'ebjrnunes@hotmail.com', telefone = '87-998034493' WHERE cpf_cnpj = '49.645.737/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '49645737000150';
UPDATE usuario SET email = 'ebjrnunes@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '49.645.737/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '49645737000150');

-- CNPJ/CPF: 49.148.725/0001-10 (digits: 49148725000110)
UPDATE representante SET email = 'josecarlosribeirodasilva60@gmail.com' WHERE cpf_cnpj = '49.148.725/0001-10' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '49148725000110';
UPDATE usuario SET email = 'josecarlosribeirodasilva60@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '49.148.725/0001-10' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '49148725000110');

-- CNPJ/CPF: 17.336.814/0001-02 (digits: 17336814000102)
UPDATE representante SET email = 'jp.representacoes13@gmail.com', telefone = '77-999167172' WHERE cpf_cnpj = '17.336.814/0001-02' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '17336814000102';
UPDATE usuario SET email = 'jp.representacoes13@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '17.336.814/0001-02' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '17336814000102');

-- CNPJ/CPF: 40.829.526/0001-01 (digits: 40829526000101)
UPDATE representante SET email = 'lcssrepresentacaofinanceiro@gmail.com' WHERE cpf_cnpj = '40.829.526/0001-01' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '40829526000101';
UPDATE usuario SET email = 'lcssrepresentacaofinanceiro@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '40.829.526/0001-01' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '40829526000101');

-- CNPJ/CPF: 05.658.077/0001-77 (digits: 05658077000177)
UPDATE representante SET email = 'claudiosferre@hotmail.com' WHERE cpf_cnpj = '05.658.077/0001-77' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '05658077000177';
UPDATE usuario SET email = 'claudiosferre@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '05.658.077/0001-77' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '05658077000177');

-- CNPJ/CPF: 45.592.731/0001-01 (digits: 45592731000101)
UPDATE representante SET email = 'henriqc@msn.com', telefone = '67-992169282' WHERE cpf_cnpj = '45.592.731/0001-01' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '45592731000101';
UPDATE usuario SET email = 'henriqc@msn.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '45.592.731/0001-01' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '45592731000101');

-- CNPJ/CPF: 46.764.807/0001-00 (digits: 46764807000100)
UPDATE representante SET email = 'luanrh@hotmaoll.com', telefone = '67-992427040' WHERE cpf_cnpj = '46.764.807/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46764807000100';
UPDATE usuario SET email = 'luanrh@hotmaoll.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '46.764.807/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46764807000100');

-- CNPJ/CPF: 30.147.303/0001-00 (digits: 30147303000100)
UPDATE representante SET email = 'marco.romanno@gmail.com', telefone = '12-991398886' WHERE cpf_cnpj = '30.147.303/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '30147303000100';
UPDATE usuario SET email = 'marco.romanno@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '30.147.303/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '30147303000100');

-- CNPJ/CPF: 02.669.101/0001-85 (digits: 02669101000185)
UPDATE representante SET email = 'marcosheitor1965@outlook.com', telefone = '51-999854007' WHERE cpf_cnpj = '02.669.101/0001-85' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02669101000185';
UPDATE usuario SET email = 'marcosheitor1965@outlook.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '02.669.101/0001-85' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02669101000185');

-- CNPJ/CPF: 93.520.757/0001-97 (digits: 93520757000197)
UPDATE representante SET email = 'emanuela@madeira-aci.com.br', telefone = '51-3472-2660' WHERE cpf_cnpj = '93.520.757/0001-97' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '93520757000197';
UPDATE usuario SET email = 'emanuela@madeira-aci.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '93.520.757/0001-97' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '93520757000197');

-- CNPJ/CPF: 19.312.019/0001-00 (digits: 19312019000100)
UPDATE representante SET email = 'jrvalcarcenovo@gmail.com', telefone = '21-981672290' WHERE cpf_cnpj = '19.312.019/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '19312019000100';
UPDATE usuario SET email = 'jrvalcarcenovo@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '19.312.019/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '19312019000100');

-- CNPJ/CPF: 37.145.902/0001-26 (digits: 37145902000126)
UPDATE representante SET email = 'marcelomanfre15@gmail.com', telefone = '43-9912-1246' WHERE cpf_cnpj = '37.145.902/0001-26' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '37145902000126';
UPDATE usuario SET email = 'marcelomanfre15@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '37.145.902/0001-26' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '37145902000126');

-- CNPJ/CPF: 61.418.838/0001-94 (digits: 61418838000194)
UPDATE representante SET email = 'manoel-neko@hotmail.com', telefone = '14-981263835' WHERE cpf_cnpj = '61.418.838/0001-94' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '61418838000194';
UPDATE usuario SET email = 'manoel-neko@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '61.418.838/0001-94' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '61418838000194');

-- CNPJ/CPF: 32.533.157/0001-79 (digits: 32533157000179)
UPDATE representante SET email = 'marcelocastrosilva1981@gmail.com', telefone = '43-98850-5413' WHERE cpf_cnpj = '32.533.157/0001-79' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32533157000179';
UPDATE usuario SET email = 'marcelocastrosilva1981@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '32.533.157/0001-79' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '32533157000179');

-- CNPJ/CPF: 22.259.435/0001-98 (digits: 22259435000198)
UPDATE representante SET email = 'suporte_pedidos@hotmail.com', telefone = '62-84253568' WHERE cpf_cnpj = '22.259.435/0001-98' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22259435000198';
UPDATE usuario SET email = 'suporte_pedidos@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '22.259.435/0001-98' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22259435000198');

-- CNPJ/CPF: 45.242.058/0001-80 (digits: 45242058000180)
UPDATE representante SET email = 'marcogerminiano@hotmail.com', telefone = '18-997159400' WHERE cpf_cnpj = '45.242.058/0001-80' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '45242058000180';
UPDATE usuario SET email = 'marcogerminiano@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '45.242.058/0001-80' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '45242058000180');

-- CNPJ/CPF: 54.638.924/0001-47 (digits: 54638924000147)
UPDATE representante SET email = 'mrrepresentacoesltda2025@gmail.com', telefone = '71-9110-1480' WHERE cpf_cnpj = '54.638.924/0001-47' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '54638924000147';
UPDATE usuario SET email = 'mrrepresentacoesltda2025@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '54.638.924/0001-47' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '54638924000147');

-- CNPJ/CPF: 01.499.234/0001-98 (digits: 01499234000198)
UPDATE representante SET email = 'mauarepresentacoes@terra.com.br', telefone = '38-32152432' WHERE cpf_cnpj = '01.499.234/0001-98' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01499234000198';
UPDATE usuario SET email = 'mauarepresentacoes@terra.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '01.499.234/0001-98' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01499234000198');

-- CNPJ/CPF: 05.635.763/0001-22 (digits: 05635763000122)
UPDATE representante SET email = 'mauricio@mgmrepresentacoes.com.br', telefone = '55-999841173' WHERE cpf_cnpj = '05.635.763/0001-22' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '05635763000122';
UPDATE usuario SET email = 'mauricio@mgmrepresentacoes.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '05.635.763/0001-22' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '05635763000122');

-- CNPJ/CPF: 23.792.915/0001-82 (digits: 23792915000182)
UPDATE representante SET email = 'maurotbn@hotmail.com', telefone = '11-940310483' WHERE cpf_cnpj = '23.792.915/0001-82' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '23792915000182';
UPDATE usuario SET email = 'maurotbn@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '23.792.915/0001-82' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '23792915000182');

-- CNPJ/CPF: 48.328.920/0001-60 (digits: 48328920000160)
UPDATE representante SET email = 'mariobento07@hotmail.com', telefone = '62-985458795' WHERE cpf_cnpj = '48.328.920/0001-60' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '48328920000160';
UPDATE usuario SET email = 'mariobento07@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '48.328.920/0001-60' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '48328920000160');

-- CNPJ/CPF: 12.368.591/0001-33 (digits: 12368591000133)
UPDATE representante SET email = 'moisescsantana@gmail.com', telefone = '71-991944100' WHERE cpf_cnpj = '12.368.591/0001-33' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '12368591000133';
UPDATE usuario SET email = 'moisescsantana@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '12.368.591/0001-33' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '12368591000133');

-- CNPJ/CPF: 04.256.703/0001-36 (digits: 04256703000136)
UPDATE representante SET email = 'multipla.sergio@hotmail.com', telefone = '11-945403262' WHERE cpf_cnpj = '04.256.703/0001-36' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '04256703000136';
UPDATE usuario SET email = 'multipla.sergio@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '04.256.703/0001-36' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '04256703000136');

-- CNPJ/CPF: 02.814.789/0001-40 (digits: 02814789000140)
UPDATE representante SET email = 'nogueira.representacao@gmail.com', telefone = '22-999141909' WHERE cpf_cnpj = '02.814.789/0001-40' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02814789000140';
UPDATE usuario SET email = 'nogueira.representacao@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '02.814.789/0001-40' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02814789000140');

-- CNPJ/CPF: 15.161.435/0001-95 (digits: 15161435000195)
UPDATE representante SET email = 'paulocaobianco@hotmail.com' WHERE cpf_cnpj = '15.161.435/0001-95' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '15161435000195';
UPDATE usuario SET email = 'paulocaobianco@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '15.161.435/0001-95' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '15161435000195');

-- CNPJ/CPF: 11.523.349/0001-24 (digits: 11523349000124)
UPDATE representante SET email = 'PAULINOCOMERCIALDEALIMENTOS@GMAIL.COM', telefone = '12-98889-791' WHERE cpf_cnpj = '11.523.349/0001-24' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11523349000124';
UPDATE usuario SET email = 'PAULINOCOMERCIALDEALIMENTOS@GMAIL.COM' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '11.523.349/0001-24' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11523349000124');

-- CNPJ/CPF: 01.208.944/0001-11 (digits: 01208944000111)
UPDATE representante SET email = 'r.pissolati1101@gmail.com', telefone = '31-8413-6796' WHERE cpf_cnpj = '01.208.944/0001-11' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01208944000111';
UPDATE usuario SET email = 'r.pissolati1101@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '01.208.944/0001-11' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01208944000111');

-- CNPJ/CPF: 20.113.227/0001-50 (digits: 20113227000150)
UPDATE representante SET email = 'portosegurors@hotmail.com', telefone = '44-991759595' WHERE cpf_cnpj = '20.113.227/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '20113227000150';
UPDATE usuario SET email = 'portosegurors@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '20.113.227/0001-50' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '20113227000150');

-- CNPJ/CPF: 43.647.545/0001-05 (digits: 43647545000105)
UPDATE representante SET email = 'pradorepresentacao2021@gmail.com', telefone = '51-984687686' WHERE cpf_cnpj = '43.647.545/0001-05' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '43647545000105';
UPDATE usuario SET email = 'pradorepresentacao2021@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '43.647.545/0001-05' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '43647545000105');

-- CNPJ/CPF: 30.840.004/0001-49 (digits: 30840004000149)
UPDATE representante SET email = 'ramiro.defreitas@terra.com.br', telefone = '11-947924877' WHERE cpf_cnpj = '30.840.004/0001-49' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '30840004000149';
UPDATE usuario SET email = 'ramiro.defreitas@terra.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '30.840.004/0001-49' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '30840004000149');

-- CNPJ/CPF: 22.965.477/0001-44 (digits: 22965477000144)
UPDATE representante SET email = 'royalcenter.distri@gmail.com', telefone = '11-97728-6524' WHERE cpf_cnpj = '22.965.477/0001-44' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22965477000144';
UPDATE usuario SET email = 'royalcenter.distri@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '22.965.477/0001-44' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22965477000144');

-- CNPJ/CPF: 05.606.004/0001-31 (digits: 05606004000131)
UPDATE representante SET email = 'marco@mbarbara.com.br', telefone = '43-999054998' WHERE cpf_cnpj = '05.606.004/0001-31' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '05606004000131';
UPDATE usuario SET email = 'marco@mbarbara.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '05.606.004/0001-31' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '05606004000131');

-- CNPJ/CPF: 39.597.508/0001-54 (digits: 39597508000154)
UPDATE representante SET email = 'gerson.juniormaia@yahoo.com.br', telefone = '21-979530556' WHERE cpf_cnpj = '39.597.508/0001-54' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '39597508000154';
UPDATE usuario SET email = 'gerson.juniormaia@yahoo.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '39.597.508/0001-54' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '39597508000154');

-- CNPJ/CPF: 93.881.589/0001-65 (digits: 93881589000165)
UPDATE representante SET email = 'jandirscheid@gmail.com', telefone = '51-98186-0915' WHERE cpf_cnpj = '93.881.589/0001-65' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '93881589000165';
UPDATE usuario SET email = 'jandirscheid@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '93.881.589/0001-65' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '93881589000165');

-- CNPJ/CPF: 03.258.378/0001-88 (digits: 03258378000188)
UPDATE representante SET email = 'gilbertoreprespvianini@gmail.com', telefone = '31-999039270' WHERE cpf_cnpj = '03.258.378/0001-88' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03258378000188';
UPDATE usuario SET email = 'gilbertoreprespvianini@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '03.258.378/0001-88' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03258378000188');

-- CNPJ/CPF: 22.695.308/0001-31 (digits: 22695308000131)
UPDATE representante SET email = 'valdemi.mario@gmail.com', telefone = '33-99122-8809' WHERE cpf_cnpj = '22.695.308/0001-31' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22695308000131';
UPDATE usuario SET email = 'valdemi.mario@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '22.695.308/0001-31' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '22695308000131');

-- CNPJ/CPF: 08.402.535/0001-09 (digits: 08402535000109)
UPDATE representante SET email = 'acesarrl@uol.com.br' WHERE cpf_cnpj = '08.402.535/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '08402535000109';
UPDATE usuario SET email = 'acesarrl@uol.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '08.402.535/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '08402535000109');

-- CNPJ/CPF: 45.568.719/0001-61 (digits: 45568719000161)
UPDATE representante SET email = 'rodriguesrobsonbauru3@gmail.com', telefone = '14-991425325' WHERE cpf_cnpj = '45.568.719/0001-61' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '45568719000161';
UPDATE usuario SET email = 'rodriguesrobsonbauru3@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '45.568.719/0001-61' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '45568719000161');

-- CNPJ/CPF: 14.281.202/0001-63 (digits: 14281202000163)
UPDATE representante SET email = 'rogerio@waldircomercio.com.br', telefone = '11-29463701' WHERE cpf_cnpj = '14.281.202/0001-63' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '14281202000163';
UPDATE usuario SET email = 'rogerio@waldircomercio.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '14.281.202/0001-63' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '14281202000163');

-- CNPJ/CPF: 13.899.410/0001-68 (digits: 13899410000168)
UPDATE representante SET email = 'rubiorepresentacao@gmail.com', telefone = '69-99970-9990' WHERE cpf_cnpj = '13.899.410/0001-68' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '13899410000168';
UPDATE usuario SET email = 'rubiorepresentacao@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '13.899.410/0001-68' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '13899410000168');

-- CNPJ/CPF: 46.626.871/0001-16 (digits: 46626871000116)
UPDATE representante SET email = 'silviopelz.vendas@gmail.com', telefone = '47-999241516' WHERE cpf_cnpj = '46.626.871/0001-16' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46626871000116';
UPDATE usuario SET email = 'silviopelz.vendas@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '46.626.871/0001-16' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '46626871000116');

-- CNPJ/CPF: 08.877.262/0001-40 (digits: 08877262000140)
UPDATE representante SET telefone = '14-3378-1612' WHERE cpf_cnpj = '08.877.262/0001-40' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '08877262000140';

-- CNPJ/CPF: 36.174.041/0001-41 (digits: 36174041000141)
UPDATE representante SET email = 'samueldelima1@gmail.com', telefone = '41-991299823' WHERE cpf_cnpj = '36.174.041/0001-41' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '36174041000141';
UPDATE usuario SET email = 'samueldelima1@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '36.174.041/0001-41' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '36174041000141');

-- CNPJ/CPF: 31.973.723/0001-09 (digits: 31973723000109)
UPDATE representante SET email = 'luciano@beirorepresentacoes.com.br', telefone = '19-997184043' WHERE cpf_cnpj = '31.973.723/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '31973723000109';
UPDATE usuario SET email = 'luciano@beirorepresentacoes.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '31.973.723/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '31973723000109');

-- CNPJ/CPF: 10.927.019/0001-31 (digits: 10927019000131)
UPDATE representante SET email = 'schaakrepresentacoes@gmail.com', telefone = '51-993121263' WHERE cpf_cnpj = '10.927.019/0001-31' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '10927019000131';
UPDATE usuario SET email = 'schaakrepresentacoes@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '10.927.019/0001-31' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '10927019000131');

-- CNPJ/CPF: 01.105.632/0001-82 (digits: 01105632000182)
UPDATE representante SET email = 'sergiojldaher@hotmail.com', telefone = '47-988510063' WHERE cpf_cnpj = '01.105.632/0001-82' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01105632000182';
UPDATE usuario SET email = 'sergiojldaher@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '01.105.632/0001-82' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '01105632000182');

-- CNPJ/CPF: 61.410.291/0001-80 (digits: 61410291000180)
UPDATE representante SET email = 'sharlesrepresentacoes@gmail.com' WHERE cpf_cnpj = '61.410.291/0001-80' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '61410291000180';
UPDATE usuario SET email = 'sharlesrepresentacoes@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '61.410.291/0001-80' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '61410291000180');

-- CNPJ/CPF: 11.875.987/0001-04 (digits: 11875987000104)
UPDATE representante SET email = 'nfe@molicenter.com.br', telefone = '43-31728900' WHERE cpf_cnpj = '11.875.987/0001-04' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11875987000104';
UPDATE usuario SET email = 'nfe@molicenter.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '11.875.987/0001-04' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '11875987000104');

-- CNPJ/CPF: 82.342.387/0001-29 (digits: 82342387000129)
UPDATE representante SET email = 'tokvenda@hotmail.com', telefone = '45-99113-1001' WHERE cpf_cnpj = '82.342.387/0001-29' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '82342387000129';
UPDATE usuario SET email = 'tokvenda@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '82.342.387/0001-29' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '82342387000129');

-- CNPJ/CPF: 37.218.758/0001-00 (digits: 37218758000100)
UPDATE representante SET email = 'domingos_leite50@hotmail.com', telefone = '34-991322669' WHERE cpf_cnpj = '37.218.758/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '37218758000100';
UPDATE usuario SET email = 'domingos_leite50@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '37.218.758/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '37218758000100');

-- CNPJ/CPF: 02.714.945/0001-09 (digits: 02714945000109)
UPDATE representante SET email = 'valmorspengler@yahoo.com.br', telefone = '47-32462349' WHERE cpf_cnpj = '02.714.945/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02714945000109';
UPDATE usuario SET email = 'valmorspengler@yahoo.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '02.714.945/0001-09' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '02714945000109');

-- CNPJ/CPF: 03.687.037/0001-28 (digits: 03687037000128)
UPDATE representante SET email = 'Vatt.representacoes@hotmail.com', telefone = '12-997755411' WHERE cpf_cnpj = '03.687.037/0001-28' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03687037000128';
UPDATE usuario SET email = 'Vatt.representacoes@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '03.687.037/0001-28' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '03687037000128');

-- CNPJ/CPF: 55.211.301/0001-56 (digits: 55211301000156)
UPDATE representante SET email = 'aleresendelopes@gmail.com', telefone = '11-992220147' WHERE cpf_cnpj = '55.211.301/0001-56' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '55211301000156';
UPDATE usuario SET email = 'aleresendelopes@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '55.211.301/0001-56' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '55211301000156');

-- CNPJ/CPF: 42.946.948/0001-84 (digits: 42946948000184)
UPDATE representante SET email = 'repre.zania@yahoo.com.br', telefone = '41-996778795' WHERE cpf_cnpj = '42.946.948/0001-84' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '42946948000184';
UPDATE usuario SET email = 'repre.zania@yahoo.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '42.946.948/0001-84' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '42946948000184');

-- CNPJ/CPF: 82.430.026/0001-34 (digits: 82430026000134)
UPDATE representante SET email = 'vechiatorepre@uol.com.br', telefone = '43-999220506' WHERE cpf_cnpj = '82.430.026/0001-34' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '82430026000134';
UPDATE usuario SET email = 'vechiatorepre@uol.com.br' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '82.430.026/0001-34' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '82430026000134');

-- CNPJ/CPF: 35.039.512/0001-46 (digits: 35039512000146)
UPDATE representante SET email = 'vidanovarepres@gmail.com', telefone = '51-99166-8218' WHERE cpf_cnpj = '35.039.512/0001-46' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '35039512000146';
UPDATE usuario SET email = 'vidanovarepres@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '35.039.512/0001-46' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '35039512000146');

-- CNPJ/CPF: 07.535.874/0001-92 (digits: 07535874000192)
UPDATE representante SET email = 'irmaosvolpini@gmail.com', telefone = '45-999163032' WHERE cpf_cnpj = '07.535.874/0001-92' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '07535874000192';
UPDATE usuario SET email = 'irmaosvolpini@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '07.535.874/0001-92' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '07535874000192');

-- CNPJ/CPF: 36.673.392/0001-05 (digits: 36673392000105)
UPDATE representante SET email = 'wagner.tortelli@hotmail.com', telefone = '31-984113409' WHERE cpf_cnpj = '36.673.392/0001-05' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '36673392000105';
UPDATE usuario SET email = 'wagner.tortelli@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '36.673.392/0001-05' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '36673392000105');

-- CNPJ/CPF: 52.509.640/0001-25 (digits: 52509640000125)
UPDATE representante SET email = 'portosegurors@hotmail.com', telefone = '44-991759595' WHERE cpf_cnpj = '52.509.640/0001-25' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '52509640000125';
UPDATE usuario SET email = 'portosegurors@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '52.509.640/0001-25' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '52509640000125');

-- CNPJ/CPF: 33.146.241/0001-00 (digits: 33146241000100)
UPDATE representante SET email = 'alexzancanaro@hotmail.com', telefone = '54-981270410' WHERE cpf_cnpj = '33.146.241/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '33146241000100';
UPDATE usuario SET email = 'alexzancanaro@hotmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '33.146.241/0001-00' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '33146241000100');

-- CNPJ/CPF: 08.431.601/0001-60 (digits: 08431601000160)
UPDATE representante SET email = 'zancanaroa@gmail.com', telefone = '48-996884155' WHERE cpf_cnpj = '08.431.601/0001-60' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '08431601000160';
UPDATE usuario SET email = 'zancanaroa@gmail.com' WHERE representante_id IN (SELECT id FROM representante WHERE cpf_cnpj = '08.431.601/0001-60' OR REGEXP_REPLACE(cpf_cnpj, '\D', '', 'g') = '08431601000160');
