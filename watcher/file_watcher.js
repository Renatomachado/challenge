var fs = require('fs');
var js2xmlparser = require("js2xmlparser");
var http = require('http');
var _und = require('underscore');
var path = require('path');
var async = require('async');

var dir = process.env.FILE_DIR || '../files/personagens/'; //diretório de arquivos
var objects = []; //array armazenando objetos dos arquivos lidos


//Call para ler diretório inicialmente
read_files(dir);

//watcher para novos arquivos no diretório
fs.watch(dir, function (event, filename) {
    if (event == 'change') {
        if (filename) {
            read_single_file(dir + filename);
        } else {
            console.log('filename not provided');
        }
    }
});


//função para ler todos os arquivos no diretório
function read_files(directory) {

    fs.readdir(directory, function (err, files) {
        if (err) throw err;
        async.forEach(files, function (file) {
            read_single_file(dir + file);
        });
    });
}


function read_single_file(file) {
    fs.readFile(file, 'utf-8', function (err, json) {
        if (err) throw err;

        console.log([file, path.extname(file)]);
        if (path.extname(file) == '.json') { //testa se arquivo é .json

            var obj = JSON.parse(json);
            if (obj instanceof Array) {
                async.eachSeries(obj, function (item, callback) {
                    if (_und.where(objects, {
                            nome: item.nome
                        }).length == 0) { //testa se objeto ja existe no array 
                        objects.push(item);
                        console.log(js2xmlparser("personagem", item));

                        post(js2xmlparser("personagem", item));
                    } else {
                        console.error('Personagem já foi enviado');
                    }
                    callback();
                });
            } else {
                if (_und.where(objects, {
                        nome: obj.nome
                    }).length == 0) { //testa se objeto ja existe no array 
                    objects.push(obj);
                    console.log(js2xmlparser("personagem", obj));

                    post(js2xmlparser("personagem", obj));
                } else {
                    console.error('Personagem já foi enviado');
                }
            }


        }

    });
}

var port = process.env.API_PORT || 3000;

//função de envido do xml de personagens para api
function post(xml) {

    var postRequest = {
        host: "localhost",
        path: "/api/personagens",
        port: port,
        method: "POST",
        headers: {
            'Cookie': "cookie",
            'Content-Type': 'application/xml',
            'Content-Length': Buffer.byteLength(xml)
        }
    };

    var buffer = "";

    var req = http.request(postRequest, function (res) {

        console.log(res.statusCode);
        var buffer = "";
        res.on("data", function (data) {
            buffer = buffer + data;
        });
        res.on("end", function (data) {
            console.log(buffer);
        });

    });

    req.on('error', function (e) {
        console.log('Erro: ' + e.message);
    });

    req.write(xml);
    req.end();
}