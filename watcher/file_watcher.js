var fs = require('fs');
var js2xmlparser = require("js2xmlparser");
var http = require('http');
var chokidar = require('chokidar');
var _und = require('underscore');

var dir = '../files/personagens/'; //diretório de arquivos
var data = []; //array com arquivos lidos

/**
*
* Call para ler diretório inicialmente
*
*/
read_files(dir);


/**
*
* watcher para novos arquivos no diretório
*
*/
fs.watch(dir, function (event, filename) {
    if(event == 'change'){
        if (filename) {   
            read_single_file(dir + filename);
        } else {
            console.log('filename not provided');
        }
    }
});


//função para ler todos os arquivos no diretório
function read_files(directory){
    
    fs.readdir(directory,function(err,files){
        if (err) throw err;
        files.forEach(function(file){
            read_single_file(dir + file);
        });
    });
}


function read_single_file(file){
    fs.readFile(file,'utf-8',function(err, json){
        if (err) throw err;
        var obj = JSON.parse(json);
        if(_und.where(data, {nome : obj.nome}).length == 0){ //testa se objeto ja existe no array 
            data.push(obj);
            console.log(obj.nome);
            console.log(js2xmlparser("personagem", obj));
            
            post(js2xmlparser("personagem", obj));
            
            
        }
            
    }); 
}

//função de envido do xml de personagens para api
function post(xml){
    
    var postRequest = {
        host: "localhost",
        path: "/api/personagens",
        port: 3000,
        method: "POST",
        headers: {
            'Cookie': "cookie",
            'Content-Type': 'application/xml',
            'Content-Length': Buffer.byteLength(xml)
        }
    };

    var buffer = "";

    var req = http.request( postRequest, function( res )    {

       console.log( res.statusCode );
       var buffer = "";
       res.on( "data", function( data ) { buffer = buffer + data; } );
       res.on( "end", function( data ) { console.log(buffer); } );

    });

    req.on('error', function(e) {
        console.log('Erro: ' + e.message);
    });

    req.write(xml);
    req.end();
}

