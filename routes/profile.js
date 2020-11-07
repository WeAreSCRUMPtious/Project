module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/', function(req, res){
         var callbackCount = 0;
         var context = {};

        // TODO: Add scripts we may need later here
        // context.jsscripts = ["<script-name-here.js>];

         var mysql = req.app.get('mysql');

         getProfile(res, mysql, context, complete);

         function complete(){
             callbackCount++;
             if(callbackCount >= 1){
                 res.render('profiles', context);
             }
         }
     });

     router.post('/', function(req, res){

     var mysql = req.app.get('mysql');

     //TODO: add Photo fields for Expert
     var sql = "INSERT INTO profiles (profile_id, name, skills, courses, industry, github_link, linkedin_link, twitter_link) VALUES (?,?,?,?,?,?,?,?)";
     var inserts = [
        req.body.profile_id,
        req.body.name,
        req.body.skills,
        req.body.courses,
        req.body.industry,
        req.body.github_link,
        req.body.linkedin_link,
        req.body.twitter_link,
     ];

     sql = mysql.pool.query(sql,inserts,function(error, results, fields){
       if(error){
         console.log(JSON.stringify(error))
         res.write(JSON.stringify(error));
         res.end();
       }else{
         res.redirect('/profiles');
       }
      });
    });

    router.delete('/:id', function(req, res){
      var mysql = req.app.get('mysql');
      var sql = "DELETE FROM profiles WHERE profile_id = ?";
      var deletions = [req.params.id];

      sql = mysql.pool.query(sql, deletions, function(error, results, fields){
          if(error){
              console.log(error)
              res.write(JSON.stringify(error));
              res.status(400);
              res.end();
          }else{
              res.status(202).end();
          }
      })
    });

    return router;
}();
