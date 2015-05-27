var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mysql = require('mysql');
var createMySQLWrap = require('mysql-wrap');
var xmlparser = require('express-xml-bodyparser');
var _und = require('underscore');
var async = require('async');

var port = process.env.APP_PORT || 3000;
var host = process.env.DB_HOST || 'localhost';
var user = process.env.DB_USER || 'root';
var password = process.env.DB_PASSWORD || '';
var database = process.env.DB_NAME || 'challenge';

var connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

var sql = createMySQLWrap(connection);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//rotas
var router = express.Router();
router.use(xmlparser());
router.use(cors());

//list personagens
router.get('/personagens', function (req, res) {

    //paginação
    var page, perPage;
    if (req.query.page)
        page = req.query.page;
    else
        page = 1;

    if (req.query.perPage)
        perPage = req.query.perPage;
    else
        perPage = 30

    var count;
    sql.query('SELECT COUNT(*) AS count FROM personagens')
        .then(function (r) {
            count = r[0].count;
        });

    sql.select({
        table: 'personagens',
        fields: ['*'],
        paginate: {
            page: page,
            resultsPerPage: perPage
        }
    }).then(function (rows) {

        async.forEach(rows, function (row, forEach_callback) {

            row.pessoasRelacionadas = {};

            async.parallel([
                function (callback) { //caracteristicas
                    sql.select({
                            table: 'personagens_caracteristicas',
                            fields: ['caracteristica']
                        }, {
                            personagem: row.nome
                        })
                        .then(function (caracteristicas) {

                            row.caracteristicas = _und.pluck(caracteristicas, 'caracteristica');
                            callback();

                        }).catch(function (err) {
                            res.json(err);

                        });
                },
                function (callback) { //amigos
                    sql.select({
                            table: 'relacionamentos',
                            fields: ['relacionado']
                        }, {
                            personagem: row.nome,
                            tipo: 'amigos'
                        })
                        .then(function (amigos) {
                            row.pessoasRelacionadas.amigos = _und.pluck(amigos, 'relacionado');
                            callback();
                        })
                },
                function (callback) { //inimigos
                    sql.select({
                            table: 'relacionamentos',
                            fields: ['relacionado']
                        }, {
                            personagem: row.nome,
                            tipo: 'inimigos'
                        })
                        .then(function (inimigos) {
                            row.pessoasRelacionadas.inimigos = _und.pluck(inimigos, 'relacionado');
                            callback();
                        });
                },
                function (callback) { //mae
                    sql.select({
                            table: 'relacionamentos',
                            fields: ['relacionado']
                        }, {
                            personagem: row.nome,
                            tipo: 'mae'
                        })
                        .then(function (mae) {
                            row.pessoasRelacionadas.mae = _und.pluck(mae, 'relacionado')[0];
                            callback();
                        });
                },
                function (callback) { //pai
                    sql.select({
                            table: 'relacionamentos',
                            fields: ['relacionado']
                        }, {
                            personagem: row.nome,
                            tipo: 'pai'
                        })
                        .then(function (pai) {
                            row.pessoasRelacionadas.pai = _und.pluck(pai, 'relacionado')[0];
                            callback();
                        });
                }
            ], function (e) {
                if (e) res.json(e);

                forEach_callback();
            });
        }, function (err) {
            if (err) res.json(err);

            var obj = {
                total: count,
                list: rows
            }
            res.send(obj)
        });
    });

});

//criar personagens
//insere caracteristicas caso não exista
//adiciona relacionamentos de amigos e inimigos
router.post('/personagens', function (req, res) {

    var personagem = req.body.personagem;

    sql.insert('personagens', {
        nome: personagem.nome[0],
        sexo: personagem.sexo[0],
        idade: personagem.idade[0],
        cabelo: personagem.cabelo[0],
        olhos: personagem.olhos[0],
        origem: personagem.origem[0],
        atividade: personagem.atividade[0],
        voz: personagem.voz[0]
    }).then(function (rows) {

        async.parallel([
            function (callback) {
                if (personagem.caracteristicas.length > 0) { //caracteristicas
                    personagem.caracteristicas.forEach(function (caracteristica) {

                        sql.selectOne('caracteristicas', {
                            nome: caracteristica
                        }).then(function (caract) {
                            if (caract === undefined) {

                                sql.insert('caracteristicas', {
                                    nome: caracteristica
                                }).then(function () {
                                    sql.insert('personagens_caracteristicas', {
                                        personagem: personagem.nome[0],
                                        caracteristica: caracteristica
                                    }).then(function () {
                                        callback();
                                    }).catch(function () {
                                        //catch error
                                        callback();
                                    });
                                }).catch(function () {
                                    //catch error
                                    callback();
                                });


                            } else {
                                sql.insert('personagens_caracteristicas', {
                                    personagem: personagem.nome[0],
                                    caracteristica: caracteristica
                                }).then(function () {
                                    callback();
                                }).catch(function () {
                                    //catch error
                                    callback();
                                });
                            }
                        });
                    });
                } else {
                    callback();
                }
            },
            function (callback) {
                if (personagem.pessoasrelacionadas[0].amigos != undefined) { //amigos
                    personagem.pessoasrelacionadas[0].amigos.forEach(function (relacionado) {
                        sql.insert('relacionamentos', {
                            personagem: personagem.nome[0],
                            relacionado: relacionado,
                            tipo: 'amigos'
                        }).then(function () {
                            callback();
                        }).catch(function () {
                            //catch error
                            callback();
                        });
                    });
                } else {
                    callback();
                }
            },
            function (callback) {
                if (personagem.pessoasrelacionadas[0].inimigos != undefined) { //inimigos
                    personagem.pessoasrelacionadas[0].inimigos.forEach(function (relacionado) {
                        sql.insert('relacionamentos', {
                            personagem: personagem.nome[0],
                            relacionado: relacionado,
                            tipo: 'inimigos'
                        }).then(function () {
                            callback();
                        }).catch(function () {
                            //catch error
                            callback();
                        });
                    });
                } else {
                    callback();
                }
            },
            function (callback) {
                if (personagem.pessoasrelacionadas[0].mae != undefined) {
                    sql.insert('relacionamentos', {
                        personagem: personagem.nome[0],
                        relacionado: personagem.pessoasrelacionadas[0].mae[0],
                        tipo: 'mae'
                    }).then(function () {
                        callback();
                    }).catch(function () {
                        //catch error
                        callback();
                    });
                } else {
                    callback();
                }
            },
            function (callback) {
                if (personagem.pessoasrelacionadas[0].pai != undefined) {
                    sql.insert('relacionamentos', {
                        personagem: personagem.nome[0],
                        relacionado: personagem.pessoasrelacionadas[0].pai[0],
                        tipo: 'pai'
                    }).then(function () {
                        callback();
                    }).catch(function () {
                        //catch error
                        callback();
                    });
                } else {
                    callback();
                }
            }
        ], function () {

            res.json({
                sucess: 'personagem inserido com sucesso'
            });
        });
    }).catch(function (err) {
        if (err) {
            res.status(400).json({
                error: err
            });
        } else {
            res.json({
                sucess: 'personagem inserido com sucesso'
            });
        }

    });

});

//prefixo
app.use('/api', router);

//inicia server
app.listen(port);
console.log('Serviço da api aberto na porta: ' + port);