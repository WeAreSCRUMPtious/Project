/*

let express = require('express');
let app = express.Router();

app.get('/search/:term', function(req, res) {
    let mysql = req.app.get('mysql');

    let term = req.params.term;
    let sql = 'SELECT profile_id, first_name, last_name from Profiles P
               INNER JOIN Profiles_Skills PS ON P.profile_id = PS.profile_id
               INNER JOIN Skills S ON PS.skill_id = S.skill_id
               INNER JOIN Profiles_Courses PC ON P.profile_id = PC.profile_id
               INNER JOIN Courses C ON PC.course_id = C.course_id
               WHERE S.skill_name = ? OR C.course_name = ?
               GROUP BY P.profile_id';
    
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

*/