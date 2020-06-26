var express = require('express');

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('dist'))

app.get('/', function(req, res) {
  var locals = {
    title: 'Page Title',
    description: 'Page Description',
    header: 'Page Header'
  };
  res.render('index', locals);
});

app.get('/page-2', function(req, res) {
  var locals = {
    title: 'Page 2',
    description: 'Page Description',
    header: 'Page Header'
  };
  res.render('page-2', locals);
});

app.get('/page-3', function(req, res) {
  var locals = {
    title: 'Page 3',
    description: 'Page Description',
    header: 'Page Header'
  };
  res.render('page-3', locals);
});

app.listen(3000);