//DBCON file for hosted database on EECS server under PORTEJEF
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'mysql.eecs.oregonstate.edu',
  user            : 'cs361_portejef',
  password        : '4220',
  database        : 'cs361_portejef'
});

module.exports.pool = pool;