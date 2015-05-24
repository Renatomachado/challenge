var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var createMySQLWrap = require('mysql-wrap');
var xmlparser       = require('express-xml-bodyparser');
var _und            = require('underscore');
var async           = require('async');

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
    
    //paginação
    var page, perPage;
    if(req.query.page)
        page = req.query.page;
    else
        page = 1;
        
    if(req.query.perPage)
        perPage = req.query.perPage;
    else
        perPage = 30
   
    sql.select({
        table : 'personagens',
        fields : ['*'],
        paginate : {
            page : page,
            resultsPerPage : perPage
        }
    }).then(function(rows){
        
        async.forEach(rows, function(row, forEach_callback){
            
            async.parallel([
                function(callback){ //caracteristicas
                    sql.select({
                        table : 'personagens_caracteristicas',
                        fields : ['caracteristica']
                    }, { personagem : row.nome })
                    .then(function(caracteristicas){

                        row.caracteristicas = _und.pluck(caracteristicas, 'caracteristica');
                        callback();  

                    }).catch(function(err){
                        res.json(err);

                    }); 
                },
                function(callback){ //amigos
                    sql.select({
                        table : 'relacionamentos',
                        fields : ['relacionado']
                    }, {personagem : row.nome, tipo : 'amigos'})
                    .then(function(amigos){
                        row.amigos = _und.pluck(amigos, 'relacionado');
                        callback();
                    })
                }, 
                function(callback){ //inimigos
                    sql.select({
                        table : 'relacionamentos',
                        fields : ['relacionado']
                    }, {personagem : row.nome, tipo : 'inimigos'})
                    .then(function(inimigos){
                        row.inimigos = _und.pluck(inimigos, 'relacionado');
                        callback();
                    });
                }
            ], function(e){
                if (e) res.json(e);
                
                forEach_callback();
            });
        }, function(err){
            if (err) res.json(err);
            
            res.send(rows)
        });
    });
 
});

//show personagens
router.get('/personagens/:nome', function(req, res) {

    sql.selectOne({
        table : 'personagens',
        fields : ['*'],
    },{ 
        nome: req.params.nome
    }).then(function(row){
        
         async.parallel([
            function(callback){ //caracteristicas
                sql.select({
                    table : 'personagens_caracteristicas',
                    fields : ['caracteristica']
                }, { personagem : row.nome })
                .then(function(caracteristicas){

                    row.caracteristicas = _und.pluck(caracteristicas, 'caracteristica');
                    callback();  

                }).catch(function(err){
                    res.json(err);

                }); 
            },
            function(callback){ //amigos
                sql.select({
                    table : 'relacionamentos',
                    fields : ['relacionado']
                }, {personagem : row.nome, tipo : 'amigos'})
                .then(function(amigos){
                    row.amigos = _und.pluck(amigos, 'relacionado');
                    callback();
                })
            }, 
            function(callback){ //inimigos
                sql.select({
                    table : 'relacionamentos',
                    fields : ['relacionado']
                }, {personagem : row.nome, tipo : 'inimigos'})
                .then(function(inimigos){
                    row.inimigos = _und.pluck(inimigos, 'relacionado');
                    callback();
                });
            }
        ], function(e){
            if (e) res.json(e);

            res.json(row);
        });
        
    }).catch(function(err){
        res.json(err);
    });
});

//criar personagens
//insere caracteristicas caso não exista
//adiciona relacionamentos de amigos e inimigos
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
        
    }, retorno, catch_error);
    
    function retorno (rows){
        
        if(personagem.caracteristicas.length > 0){
            personagem.caracteristicas.forEach(function(caracteristica){
                
                sql.selectOne('caracteristicas', {  
                    nome : caracteristica
                }).then(function(caract){
                  
                    if(caract){
                        insert_into('personagens_caracteristicas', {
                            personagem : personagem.nome[0],
                            caracteristica : caract.nome
                        }, null, catch_error);
                    }else{
                        insert_into('caracteristicas', {
                            nome : caracteristica
                        }, function(){
                            insert_into('personagens_caracteristicas', {
                                personagem : personagem.nome[0],
                                caracteristica : caracteristica
                            }, null, catch_error); 
                        }, catch_error); 
                    }
                });  
            });
        }
        
        if(personagem.pessoasrelacionadas[0].amigos.length){
            personagem.pessoasrelacionadas[0].amigos.forEach(function(relacionado){
                insert_into('relacionamentos', {
                    personagem : personagem.nome[0],
                    relacionado : relacionado,
                    tipo : 'amigos'
                }, null, catch_error);
            });            
        }
        
        if(personagem.pessoasrelacionadas[0].inimigos.length){
            personagem.pessoasrelacionadas[0].inimigos.forEach(function(relacionado){
                insert_into('relacionamentos', {
                    personagem : personagem.nome[0],
                    relacionado : relacionado,
                    tipo : 'inimigos'
                }, null, catch_error);
            });   
            
        }
        
        res.json({sucess : 'personagem inserido com sucesso'}); 
    }
    
    function catch_error (err){
        res.status(400).json(err);
    }
});

//prefixo
app.use('/api', router);

//inicia server
app.listen(port);
console.log('Serviço aberto na porta: ' + port);
        
        
//helper functions      
function insert_into (table, object, callback, error){
    sql.insert(table, object)
       .then(callback)
       .catch(error);  
};