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

/** For use in future sprints to refactor to use Router **/
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

/** Obtain detailed profile fields for specific profile_id including profile_id, profile_pic, first_name, last_name, email, industry, github_link, linkedin_link, twitter_link **/
function getProfileSelectedDetails(res, req, mysql, context, complete){
     var selectedId = req.params.id;
     var sql1 = "SELECT profile_id as profile_id, profile_pic as profile_pic, first_name as first_name, last_name as last_name, email as email, industry as industry, github_link as github_link, linkedin_link as linkedin_link, twitter_link as twitter_link FROM Profiles WHERE profile_id=?";
     mysql.pool.query(sql1, selectedId, function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.profile  = results;
         complete();
     });
  }

/** Obtain detailed profile fields for specific profile_id including skills **/
function getProfileSelectedSkills(res, req, mysql, context, complete){
     var selectedId = req.params.id;
     var sql2 = "SELECT skill_name FROM Skills S INNER JOIN Profiles_Skills PS ON S.skill_id = PS.skill_id Where PS.profile_id = ?;"
     mysql.pool.query(sql2, selectedId, function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.skills  = results;
         complete();
     });
}

/** Obtain detailed profile fields for specific profile_id including courses **/
function getProfileSelectedCourses(res, req, mysql, context, complete){
    var selectedId = req.params.id;
     var sql3 = "SELECT course_name FROM Courses C INNER JOIN Profiles_Courses PC ON C.course_id = PC.course_id Where PC.profile_id = ?;"
     mysql.pool.query(sql3, selectedId, function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.courses  = results;
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

app.get('/profile/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getProfileSelectedDetails(res, req, mysql, context, complete);
        getProfileSelectedCourses(res, req, mysql, context, complete);
        getProfileSelectedSkills(res, req, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
              res.render('profiledetail', context);
            }
        }
});

/** We may revisit this in future sprints to see if we can refactor to make this work **/
/** Route to get selected Expert Profile details based on profile_id **/
// app.get('/profile/:id', function(req, res){
//         var callbackCount = 0;
//         var context = {};
//         var mysql = req.app.get('mysql');
//         //var selection = req.params.id;
//         getProfileSelected(res, req, mysql, context, complete);
//         function complete(){
//             callbackCount++;
//             if(callbackCount >= 1){
//               res.render('profiledetail', context);
//             }
//         }
// });

app.get('/search/:term', function(req, res) {
    let mysql = req.app.get('mysql');

    let term = req.params.term;
    let sql = "SELECT profile_id, first_name, last_name from Profiles P INNER JOIN Profiles_Skills PS ON P.profile_id = PS.profile_id INNER JOIN Skills S ON PS.skill_id = S.skill_id INNER JOIN Profiles_Courses PC ON P.profile_id = PC.profile_id INNER JOIN Courses C ON PC.course_id = C.course_id WHERE S.skill_name = ? OR C.course_name = ? GROUP BY P.profile_id;"
    mysql.query(sql, [term, term], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            /*
            let listExperts = [];

            for(i = 0; i < result.length; i++) {
                listExperts[i].push(result[i].profile_id);
            }
            */
            res.status(200).render('searchresults', {expert: results});
        }
    })
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
