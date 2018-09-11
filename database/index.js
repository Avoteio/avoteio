const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'bbj31ma8tye2kagi.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user     : 'yocqduprp1mltiz3',
    password : 'd5t9cuu1l8i2uqav',
    database : 'fysv1ohxudop09ay',
    port: 3306
  });
  
connection.connect((err)=>{
    if(err) throw err;
    console.log('woohoo connected!')
})

connection.end();
module.exports = connection;

