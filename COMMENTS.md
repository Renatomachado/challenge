# Solução do desafio

Usei bastante javascript. 
Node js para o serviço de monitorar e enviar arquivos.

A API que recebe os arquivos foi feita, também em node js, com express.

O site para apresentar os personagens foi feito em angular js.
Tentei de fato deixar a interface bonita igual ao Kenny, mas usei uma imagem do Cartman.

O Banco de dados usado foi o MySQL 5.6.

Desenvolvi no Linux Ubuntu 14.04 lts, mas tentei fazer um script .sh que funciona também no OS X


## O que foi feito

O recuros de monitoramento do diretório ao ser executado e checa o diretório definido e converte os
objetos dentro dos arquivos .json em xml e envia para a api como o desafio pediu.

Fiz o sistema de forma que se o .json conter um array, ele converterá eenviará cada objeto separadamente.

A API em express só contem duas rotas, uma GET e outra POST. No momento em que é recebido um personagem pelo POST
é salvo no banco e seus relacionamentos, sendo que se alguma de suas caracteristicas não estiver registrada, ele criará 
um registro para ela, lembrando que estou usando sistema relacional com chaves.

O get retorna a lista de objetos de personagens no mesmo formato dos arquivos .json, e também recebe parametros para paginação.

Somente criei testes para o site, tendo em vista que tenho pouca esperiencia com sistemas em node js. 
Os testes do site são feitos com jasmine e executados com karma.

Fiz um pequeno server em node js para acessar o site.

Criei também um .sh para ser executado, que pede todas as definições para executar os sitemas, 
incluindo os scripts do banco de dados. Único problema é que ele abre muitas janelas de terminal,



## O que gostaria de fazer

Deixei a API no seu mínimo, o mais certo a se fazer seria uma API REST completa, com todo o CRUD de personagens.
Também queria poder fazer uso de algum sistema ORM para facilitar o acesso ao banco de dados, mas com pouca experiencia
em node js, achei melhor deixar mais simples.

No angular, não encontrei forma de definir a url para coneção da api dinamicamente como fiz com os outros sitemas pelo script  start.sh
Por esse motivo tive que travar o numero das portas de execução da api e do site em 3000 e 8080 respectivamente
