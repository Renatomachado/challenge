#!/bin/bash
#Inicia aplicação e instalação dos modulos necessários de cada aplicação

echo -n "Porta da API: (3000)" 
read api_port 
if [ -z "$api_port" ]; 
then 
    api_port=3000
fi

echo -n "Host do database: (localhost)" 
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

echo -n "Senha para " $db_user "(root)"
read -s db_pass 
echo 
if [ -z "$db_pass" ]; 
then 
    db_pass="root"
fi

echo -n "Nome Database: (challenge)" 
read db_name 
if [ -z "$db_name" ]; 
then 
    db_name="challenge"
fi


#Executar Scritp do database
echo -n "Deseja executar script de criação do banco de dados? (Y/N)"
read answer
if [ "$answer" == "Y" ];
then
    mysql -u$db_user -p$db_pass -e "\. challenge.sql"
fi

#instalar modulos api
echo "Instalando modulos para a API"
cd server
npm install
cd ../

#instalar modulos watcher
echo "Instalando modulos para o Watcher"
cd watcher
npm install
cd ../

#instalar modulos do site
echo "Instalando libs do site"
cd site
npm install bower
bower install
cd ../

#executando a api em novo terminal
echo "Iniciando API"
cd server
gnome-terminal -x env APP_PORT=$api_port DB_HOST=$db_host DB_USER=$db_user DB_PASSWORD=$db_pass DB_NANE=$db_name node api
cd ../
sleep 1

#executando o file watcher
echo "Iniciando watcher de arquivos"
cd watcher
gnome-terminal -x env API_PORT=$api_port node file_watcher
cd ../
sleep 1

#Abrindo browser para o site
echo Abrindo browser para o site
xdg-mime default browser.desktop text/html
cd site
cd views
xdg-open index.html
cd ../../

EOF