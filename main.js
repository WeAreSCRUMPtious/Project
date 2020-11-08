var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var PORT = 3000;
var app = express();

var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});

app.engine('handlebars', handlebars.engine);

app.set('port', PORT);
app.set('mysql', mysql);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('public'));
app.use('/static', express.static('public'));

app.use('/profile', require('./routes/profile.js'));

app.get('/', (req, res) => {
   res.redirect('homepage');
});

app.get('/homepage', (req, res) => {
   res.render('home');
});

app.use((err, req, res, next) => {
  const { stack } = err;
  console.error(stack);

  res.status(500);
  res.render('500', { errorMessage: stack });
});

app.use((req, res) => {
  const { url } = req;

  res.status(404);
  res.render('404', { url });
});

app.listen(PORT, () => {
  console.log(
    `Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`
  );
});
