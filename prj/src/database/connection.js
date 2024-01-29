const {Pool} = require('pg');

let connection = new Pool({
    host : process.env.HOST,
    user : process.env.DATABASE_USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
})
connection.connect(function(err) {
    if(err) throw err;
    console.log('database connected successfully')
})