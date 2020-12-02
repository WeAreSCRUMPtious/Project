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

/** Sign up user with details provided in signup form **/
function signupUser (res, req, mysql, context, complete){
	var profileArray = [req.body.firstname, req.body.lastname, req.body.email, req.body.industry, req.body.github,
						req.body.linkedin, req.body.twitter, req.body.email];
	// console.log(profileArray);
    var profileSql = "INSERT INTO Profiles (profile_pic, first_name, last_name, email, industry, github_link, linkedin_link, twitter_link) \
						SELECT  NULL, ?, ?, ?, ?, ?, ?, ? \
						WHERE NOT EXISTS \
    					(SELECT email FROM Profiles WHERE email = ?) \
    					LIMIT 1;";
    mysql.pool.query(profileSql, profileArray, function(error, results, fields){
    	if(error){
    		// console.log(profileSql);
    		res.write(JSON.stringify(error));
    		res.end();
    	}
      complete();
    });
}

/** Updates user profile details **/
function editUser(res, req, mysql, context, complete) {
  var newDetails = [req.body.firstname, req.body.lastname, req.body.email, req.body.industry,
                    req.body.github, req.body.linkedin, req.body.twitter, req.params.id];
  
  var updateSql = "UPDATE Profiles \
                   SET first_name = ?, last_name = ?, email = ?, industry = ?, github_link = ?, linkedin_link = ?, twitter_link = ? \
                   WHERE profile_id = ?;";

  mysql.pool.query(updateSql, newDetails, function(error, results, fields) {
    if(error) {
      console.log(updateSql);
      res.write(JSON.stringify(error));
      res.end();
    }
    complete();
  });
}

/** Check that email address is alrady prsesent in Profiles table and return True if found **/
function duplicateEmailFound(res, req, mysql, context, complete){
	var emailSearch = req.body.email;
    var emailSQL = "SELECT profile_id from Profiles WHERE email=?;";
    mysql.pool.query(emailSQL, emailSearch, function(error, results, fields){
    	if(error){
    		// console.log(profileSql);
    		res.write(JSON.stringify(error));
    		res.end();
    	}
      // console.log("Here are results from IdFromEmail:")
      // console.log(results);
      if (results.length > 0) {
        return true;
      }
      else if (results.length == 0) {
        return false;
      }
    });
}

/** Attach Skills to new user Profile **/
function signupUserSkills (res, req, mysql, context, complete){
	var profileEmail = req.body.email;
	var skillArray = req.body.skill;
  var sqlquery1 = "INSERT INTO Profiles_Skills (profile_id, skill_id) VALUES"
  var paramString = ""

if(skillArray.length == 1){
    skillToAdd = skillArray[0];
    paramString = `((SELECT profile_id from Profiles p where p.email = '${profileEmail}'), '${skillToAdd}')`
  }
  else{
    for (i = 0; i < skillArray.length; i++) {
        if(i < skillArray.length-1){
        paramString += `((SELECT profile_id from Profiles p where p.email = '${profileEmail}'), ${skillArray[i]}),`;
    }
    if(i == skillArray.length-1){
    paramString += `((SELECT profile_id from Profiles p where p.email = '${profileEmail}'), ${skillArray[i]})`;
    }
  }
}
    var skillsqlquery = sqlquery1 + paramString
	mysql.pool.query(skillsqlquery,function(error, results, fields){
    	if(error){
    		res.write(JSON.stringify(error));
    		res.end();
    	}
    complete();
    });
}

/** Attach Skills to new user Profile **/
function signupUserCourses (res, req, mysql, context, complete){
	var profileEmail = req.body.email;
	var courseArray = req.body.course;
  var sqlquery1 = "INSERT INTO Profiles_Courses (profile_id, course_id) VALUES"
  var paramString = ""

  if(courseArray.length == 1){
    courseToAdd = courseArray[0];
    paramString = `((SELECT profile_id from Profiles p where p.email = '${profileEmail}'), '${courseToAdd}')`
  }
  else{
    for (i = 0; i < courseArray.length; i++) {
        if(i < courseArray.length-1){
        paramString += `((SELECT profile_id from Profiles p where p.email = '${profileEmail}'), ${courseArray[i]}),`;
    }
    if(i == courseArray.length-1){
    paramString += `((SELECT profile_id from Profiles p where p.email = '${profileEmail}'), ${courseArray[i]})`;
    }
  }
}
    var coursesqlquery = sqlquery1 + paramString
	mysql.pool.query(coursesqlquery,function(error, results, fields){
    // console.log("signupUserCourses query:")
    // console.log(coursesqlquery)
    	if(error){
    		res.write(JSON.stringify(error));
    		res.end();
    	}
    complete();
    });
}

/** Get list of skills from Skills database table **/
function getAllSkills(res, req, mysql, context, complete){
    var skillsql = "SELECT * FROM Skills ORDER BY skill_name"
    mysql.pool.query(skillsql, function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.allskills  = results;
         complete();
     });
}

/** Get list of courses from courses database table **/
function getAllCourses(res, req, mysql, context, complete){
  var coursesql = "SELECT * FROM Courses ORDER BY course_name"
  mysql.pool.query(coursesql, function(error, results, fields){
       if(error){
           res.write(JSON.stringify(error));
           res.end();
       }
       context.allcourses  = results;
       complete();
   });
}

/** Obtain details of all profiles that meet the searched term in either skills or courses **/
function getSearchResults(res, req, mysql, context, complete){
 	var term = context.term;
 	var termArray = [term, term];
	var sql = 	"SELECT * from Profiles P \
				INNER JOIN Profiles_Skills PS ON P.profile_id = PS.profile_id \
				INNER JOIN Skills S ON PS.skill_id = S.skill_id \
				INNER JOIN Profiles_Courses PC ON P.profile_id = PC.profile_id \
				INNER JOIN Courses C ON PC.course_id = C.course_id \
				WHERE S.skill_name = ? OR C.course_name = ? GROUP BY P.profile_id;"
	mysql.pool.query(sql, termArray, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.searchRes = results;
        complete();
    });
}

/** Get the skills for a given profile ID that are not already added
to the expert's profile, so they are available to be added **/
function getSkillsAvailableToAdd(res, req, mysql, context, complete){
     var selectedId = req.params.id;
     var sql = "SELECT * FROM Skills \
        WHERE skill_name NOT IN ( \
        SELECT skill_name FROM Skills S \
        INNER JOIN Profiles_Skills PS ON S.skill_id = PS.skill_id \
        WHERE PS.profile_id = ?)"
      mysql.pool.query(sql, selectedId, function(error, results, fields){
          if(error){
            res.write(JSON.stringify(error));
            res.end();
      }
        context.availableSkills = results;
        // console.log("context.skillsAvailable:")
        // console.log(context.availableSkills)
             complete();
    });
}

/** Get the courses for a given profile ID that are not already added
to the expert's profile, so they are available to be added **/
function getCoursesAvailableToAdd(res, req, mysql, context, complete){
     var selectedId = req.params.id;
     var sql = "SELECT * FROM Courses \
        WHERE course_name NOT IN ( \
        SELECT course_name FROM Courses C \
        INNER JOIN Profiles_Courses PS ON C.course_id = PS.course_id \
        WHERE PS.profile_id = ?)"
      mysql.pool.query(sql, selectedId, function(error, results, fields){
          if(error){
            res.write(JSON.stringify(error));
            res.end();
      }
        context.availableCourses = results;
        // console.log("context.availableCourses:")
        // console.log(context.availableCourses)
             complete();
    });
}

app.get('/', (req, res) => {
   res.redirect('homepage');
});

app.get('/homepage', (req, res) => {
   res.render('home');
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

/** Route to get detailed profile view for individual profile **/
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

/** Route to edit form of a profile **/
app.get('/editprofile/:id', function(req, res){
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getProfileSelectedDetails(res, req, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 1){
      res.render('editprofile', context);
    }
  }
});

/** Route to submit profile changes from edit form **/
app.post('/submitprofilechange/:id', function(req, res) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');

  editUser(res, req, mysql, context, complete);
  
  function complete() {
    callbackCount++;
    if(callbackCount >= 1) {
      res.render('profilechangeconfirmation', context);
    }
  }
});

/** Route to get search results after completed search **/
app.post('/search', function(req, res) {
	var callbackCount = 0;
  	let mysql = req.app.get('mysql');
  	let context = {};
 	  let term = req.body.term;
  	context.term = term;
  	getSearchResults(res, req, mysql, context, complete);
  	function complete(){
        callbackCount++;
        if(callbackCount >= 1){
        	res.render('searchresults', context);
        }
	}
});

/** Route to render the sign up form for creating new Expert profile **/
app.get('/signup', function(req, res) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getAllSkills(res, req, mysql, context, complete);
  getAllCourses(res, req, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
          res.render('signup', context);
        }
    }
});

/** Route to handle submission of signup form **/
app.post('/signup', function(req, res) {
  // console.log(req.body);
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  if(!duplicateEmailFound(res, req, mysql)){
    signupUser(res, req, mysql, context, complete);
  }
    function complete(){
        callbackCount++;

        if(callbackCount==1){
          signupUserSkills(res, req, mysql, context, complete);
        }

        if(callbackCount==2){
          signupUserCourses(res, req, mysql, context, complete);
        }

        if(callbackCount >= 3){
          res.render('signupconfirmation', context);
        }
        if(callbackCount == 0){
          res.render('duplicateemail', context);
        }
      }
});

/** Route to display all current skills for a user, all available skills,
and the form will then allow user to submit in order to Edit this user's
profile by adding new skill(s) to their profile **/
app.get('/editskills/:id', function (req, res) {
  var callbackCount = 0;
  var context = {}
  var mysql = req.app.get('mysql');
  getProfileSelectedSkills(res, req, mysql, context, complete);
  getSkillsAvailableToAdd(res, req, mysql, context, complete);
  getProfileSelectedDetails(res, req, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 3){
        res.render('editskills.handlebars', context);
      }
  }
});

/** Route to display all current courses for a user, all available courses,
and the form will then allow user to submit in order to Edit this user's
profile by adding new course(s) to their profile **/
app.get('/editcourses/:id', function (req, res) {
  var callbackCount = 0;
  var context = {}
  var mysql = req.app.get('mysql');
  getProfileSelectedCourses(res, req, mysql, context, complete);
  getCoursesAvailableToAdd(res, req, mysql, context, complete);
  getProfileSelectedDetails(res, req, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 3){
        res.render('editcourses.handlebars', context);
      }
  }
});

/** Route to handle a POST request received by submitting the form to
Edit a user's profile by adding additional courses **/
app.post('/editcourses', function (req, res) {
  // console.log ("req.body of POST to /editcourses/");
  // console.log(req.body);
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  signupUserCourses(res, req, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
          res.render('profilechangeconfirmation', context);
        }
      }
});

/** Route to handle a POST request received by submitting the form to
Edit a user's profile by adding additional skills **/
app.post('/editskills', function (req, res) {
  // console.log ("req.body of POST to /editskills/");
  // console.log(req.body);
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  signupUserSkills(res, req, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
          res.render('profilechangeconfirmation', context);
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
