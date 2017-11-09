const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const registrar = require('./server/routes/registrar');
const learningwriter = require('./server/routes/learningwriter');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/registrar', registrar);
app.use('/learning_writer', learningwriter);
app.options('http://localhost:8101',cors());
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, function () {
  console.log('App running on http://localhost:${port}');
});
