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

//app.use('/', express.static('public'));
//app.use('/static', express.static('public'));
//app.use('/profile', require('./routes/profile.js'));

/** Get all Expert Profiles  **/
function getProfileAll(res, mysql, context, complete){
     mysql.pool.query("SELECT profile_id as profile_id, first_name as first_name, last_name as last_name, email as email, industry as industry, github_link as github_link, linkedin_link as linkedin_link, twitter_link as twitter_link FROM Profiles", function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.profile  = results;
         complete();
     });
   }

/** Get a selected profile based on a given profile_id **/
/** Works with fields in KM database:
function getProfileSelected(res, req, mysql, context, complete){
     var sql = "SELECT profile_id as profile_id, name as name, skills as skills, courses as courses, industry as industry, github_link as github_link, linkedin_link as linkedin_link, twitter_link as twitter_link FROM Profiles WHERE profile_id=?";
     var selectedId = req.params.id;
     mysql.pool.query(sql, selectedId, function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.profile  = results;
         complete();
     });
   }
**/

/** Get a selected profile based on a given profile_id **/
/** Works with fields in Jeff's DB: **/
function getProfileSelected(res, req, mysql, context, complete){
     var sql = "SELECT profile_id as profile_id, first_name as first_name, last_name as last_name, email as email, industry as industry, github_link as github_link, linkedin_link as linkedin_link, twitter_link as twitter_link FROM Profiles WHERE profile_id=?";
     var selectedId = req.params.id;
     mysql.pool.query(sql, selectedId, function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.profile  = results;
         complete();
     });
  }

app.get('/', (req, res) => {
   res.redirect('homepage');
});

app.get('/homepage', (req, res) => {
   res.render('home');
});

app.get('/profile', (req, res) => {
   res.render('profile');
});

/** Route to get all Expert profiles **/
app.get('/profile/all', function(req, res){
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getProfileAll(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
              res.render('profile', context);
            }

        }
});

/** Route to get selected Expert Profile details based on profile_id **/
app.get('/profile/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        //var selection = req.params.id;
        getProfileSelected(res, req, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
              res.render('profiledetail', context);
            }
        }
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
