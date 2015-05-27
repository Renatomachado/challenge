var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/views/root.html');
});


app.listen(8080);

console.log("Serviço para o site iniciado na porta 8080");