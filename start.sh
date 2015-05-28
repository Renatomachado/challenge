#!/bin/bash
#Inicia aplicação e instalação dos modulos necessários de cada aplicação


#echo -n "Porta da API: (3000)" #site angular hardcoded porta 3000
#read api_port 
#if [ -z "$api_port" ]; 
#then 
    api_port=3000
#fi

echo -n "Host do database mysql: (localhost)" 
read db_host 
if [ -z "$db_host" ]; 
then 
    db_host="localhost"
fi

echo -n "usuário do database: (root)" 
read db_user 
if [ -z "$db_user" ]; 
then 
    db_user="root"
fi

echo -n "Senha para" $db_user
read -s db_pass 
echo 
if [ -z "$db_pass" ]; 
then 
    db_pass=""
fi

#echo -n "Nome Database: (challenge)" 
#read db_name 
#if [ -z "$db_name" ]; 
#then 
    db_name="challenge"
#fi

echo -n "Diretório dos arquivos .json: ($(pwd)/files/personagens)" 
read file_dir 
if [ -z "$file_dir" ]; 
then 
    db_name="$(pwd)/files/personagens"
fi

#Executar Scritp do database
echo -n "Deseja executar script de criação do banco de dados? (Y/N)"
read answer
if [ "$answer" == "Y" ];
then
    mysql -u$db_user -p$db_pass -e "\. database/challenge.sql"
fi

#instalar modulos node
echo "Instalando modulos para a API"
npm install

#instalar libs do site
echo checando se BOWER está instalado
if ! bower_command="$(type -p "bower")" || [ -z "$bower_command" ];
then
  echo BOWER não está instalado
  echo instalando bower globalmente
  sudo npm install bower -g
else
  echo BOWER já está instalado
fi
echo "Instalando libs do site"
cd site
bower install
cd ../

enviroment="$(uname -s)"

if [ "$enviroment" == "Linux" ]; #Linux ubuntu/debian
then
    echo "Linux"
    #executando a api em novo terminal
    echo "Iniciando API"
    cd server
    gnome-terminal -x env APP_PORT=$api_port DB_HOST=$db_host DB_USER=$db_user DB_PASSWORD=$db_pass DB_NANE=$db_name node api
    cd ../
    sleep 2

    #executando o file watcher
    echo "Iniciando watcher de arquivos"
    cd watcher
    gnome-terminal -x env API_PORT=$api_port FILE_DIR=$file_dir node file_watcher
    cd ../
    sleep 2
    
    #serve para site
    echo Iniciando server para o site
    gnome-terminal -x node site/server.js
    #Abrindo browser para o site
    echo Abrindo browser para o site
    xdg-open http://localhost:8080
    
    echo -n "Deseja executar os testes? (Y/N)"
    read answer1
    if [ "$answer1" == "Y" ];
    then
        echo "Rodando testes do site, usando Karma e jasmine"
        gnome-terminal -x node_modules/karma/bin/karma start
    fi

elif [ "$enviroment" == "Darwin" ]; #OSX
then
    echo "MAC-Darwin"
    pwd="$(pwd)"
    
    #executando a api em novo terminal
    echo "Iniciando API"
    osascript -e "tell application \"Terminal\" to do script \"cd $pwd; cd server; env APP_PORT=$api_port DB_HOST=$db_host DB_USER=$db_user DB_PASSWORD=$db_pass DB_NANE=$db_name node api\"" > /dev/null
    sleep 2
    
    #executando watcher em novo terminal
    echo "Iniciando watcher de arquivos"
    osascript -e "tell application \"Terminal\" to do script \"cd $pwd; cd watcher; env API_PORT=$api_port node file_watcher\"" > /dev/null
    sleep 2
    
    echo Iniciando server para o site
    osascript -e "tell application \"Terminal\" to do script \"cd $pwd; cd site; node server.js\"" > /dev/null


    echo -n "Deseja executar os testes? (Y/N)"
    read answer1
    if [ "$answer1" == "Y" ];
    then
        echo "Rodando testes do site, usando Karma e jasmine"
        osascript -e "tell application \"Terminal\" to do script \"cd $pwd; node_modules/karma/bin/karma start\"" > /dev/null
    fi

    #Abrindo browser para o site
    echo Abrindo browser para o site
    open http://localhost:8080
fi

