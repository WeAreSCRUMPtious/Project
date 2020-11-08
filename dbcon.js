var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
//  port: '3306',
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs361_manserka',
  password: '1756',
  database: 'cs361_manserka',
});

module.exports.pool = pool;
