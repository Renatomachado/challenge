var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/views/root.html');
});


app.listen(8080);