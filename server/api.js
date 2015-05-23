'use strict';

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var createMySQLWrap = require('mysql-wrap');
var xmlparser = require('express-xml-bodyparser');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'challenge'
});

var sql = createMySQLWrap(connection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

//rotas
var router = express.Router();
router.use(xmlparser());

//list personagens
router.get('/personagens', function(req, res) {

    var page, perPage;
    if(req.query.page)
        page = req.query.page;
    else
        page = 1;
        
    if(req.query.perPage)
        perPage = req.query.perPage;
    else
        perPage = 30
        
    console.log([page, perPage]);
    
    sql.select({
        table : 'personagens',
        fields : ['*'],
        paginate : {
            page : page,
            resultsPerPage : perPage
        }
    }).then(function(rows){
        res.send(rows);  
    });
 
});

//show personagens
router.get('/personagens/:nome', function(req, res) {

    sql.selectOne({
        table : 'personagens',
        fields : ['*'],
    },{ 
        nome: req.params.nome
    }).then(function(rows){
        res.send(rows);  
    });
 
});

//criar personagens

router.post('/personagens', function(req, res) {
 
    var personagem = req.body.personagem;
    
    insert_into('personagens', {
        nome : personagem.nome[0],
        sexo : personagem.sexo[0],
        idade : personagem.idade[0],
        cabelo : personagem.cabelo[0],
        olhos : personagem.olhos[0],
        origem : personagem.origem[0],
        atividade : personagem.atividade[0],
        voz : personagem.voz[0], 
        mae : personagem.pessoasrelacionadas[0].mae[0], 
        pai : personagem.pessoasrelacionadas[0].pai[0],
        
    }, callback, catch_error);
    
    
    function callback (rows){
        
        if(personagem.caracteristicas.length > 0){
            console.log('Caracteristicas: ' + personagem.caracteristicas);

            personagem.caracteristicas.forEach(function(caracteristica){

                sql.selectOne('caracteristicas', {  
                    nome : caracteristica
                }).then(function(caract){
                  
                    console.log(caract);
                    if(caract){
                        insert_into('personagens_caracteristicas', {
                            personagem : personagem.nome[0],
                            caracteristica : caract.nome
                        }, undefined, undefined);
                    }else{
                        insert_into('caracteristicas', {
                            nome : caracteristica
                        }, function(){
                        
                            insert_into('personagens_caracteristicas', {
                                personagem : personagem.nome[0],
                                caracteristica : caracteristica
                            }, undefined, undefined); 
                        }, undefined); 
                    }
                });  
            });

        }
        res.json({sucess : 'personagem inserido com sucesso'});
        
    }
    
    
    function catch_error (err){
        res.status(400).json(err);
    }
//    
//    sql.insert('personagens', {
//        nome : personagem.nome[0],
//        sexo : personagem.sexo[0],
//        idade : personagem.idade[0],
//        cabelo : personagem.cabelo[0],
//        olhos : personagem.olhos[0],
//        origem : personagem.origem[0],
//        atividade : personagem.atividade[0],
//        voz : personagem.voz[0], 
//        mae : personagem.pessoasrelacionadas[0].mae[0], 
//        pai : personagem.pessoasrelacionadas[0].pai[0],
//        
//    }).then(function(rows){
//        
//        console.log(rows);
////        res.json(rows);
//        
//        console.log(personagem.nome[0]);
//
//        if(personagem.pessoasrelacionadas[0].amigos.length > 0){
//            console.log('Amigos: ' + personagem.pessoasrelacionadas[0].amigos);
//        }
//
//        if(personagem.pessoasrelacionadas[0].inimigos.length > 0){
//            console.log('Inimigos: ' + personagem.pessoasrelacionadas[0].inimigos);
//        }
//
//        //insere caracteristicas do personagem criado;
//        if(personagem.caracteristicas.length > 0){
//            console.log('Caracteristicas: ' + personagem.caracteristicas);
//
//            personagem.caracteristicas.forEach(function(caracteristica){
//
//                sql.insert('caracteristicas', {  
//                    nome : caracteristica,
//                    personagem : personagem.nome[0]    
//                });  
//            });
//
//        }
//
//        console.log('--------');
//
//        res.send(req.body);
//    })
//    .catch(function (err) {
//        
//        res.status(400).json(err);
//    });
    
});


//prefixo
app.use('/api', router);

app.listen(port);

console.log('Serviço aberto na porta: ' + port);
        
        
        
function insert_into (tabela, objeto, callback, error){
    
       sql.insert(tabela, objeto)
           .then(callback)
           .catch(error);  
    
};