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


function getProfile(res, mysql, context, complete){
     mysql.pool.query("SELECT profile_id as profile_id, name as name, skills as skills, courses as courses, industry as industry, github_link as github_link, linkedin_link as linkedin_link, twitter_link as twitter_link FROM profiles", function(error, results, fields){
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

// app.get('/profile/:id', (req, res) => {
//   var selection = req.params.id;
//   var context = {};
//   var sql = "SELECT profile_id as profile_id, name as name, skills as skills, courses as courses, industry as industry, github_link as github_link, linkedin_link as linkedin_link, twitter_link as twitter_link FROM profiles WHERE profile_id=?"
//   console.log(sql);
//   mysql.pool.query(sql,selection,function(error, results, fields){
//             if(error){
//                 res.write(JSON.stringify(error));
//                 res.end();
//             }
//             // console.log("These are results:")
//             // console.log(results);
//             console.log("Results[0].profile_id:")
//             console.log(results[0].profile_id);
//             context.profile = results[0];
//             console.log("This is context.profile.profile_id");
//             console.log(context.profile.profile_id);
//             // console.log("This is context.profile object:")
//             // console.log(context.profile);
//     });
//    res.render('profiledetail',context.profile.profile_id);
// });

app.get('/profile/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getProfile(res, mysql, context, complete);
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
