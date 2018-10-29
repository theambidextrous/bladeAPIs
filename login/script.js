var express = require('express');
var mysql = require('mysql');
var app = express();
var pool = mysql.createPool({
    //properties;
    connectionLimit:10,
    host: 'finstockevarsity.com',
    user: 'finstoc1_usrport',
    password: 'vT^Fw+wbXS-%',
    database: 'finstoc1_dev'
});

app.get('/', function(req, res){
    pool.getConnection(function(err, connection){
        if(err) {throw err;}else{ console.log('Server on');}
        connection.query("select UserType from mis_portal limit 10", function(err, rows, fields){
            connection.release();
            if(err){ throw err;
            }
            else{ 
                console.log(fields);
                res.send(rows);
            }
        });
    });
});
app.listen(3000);
// conn.connect(function(error){
//     // if(!!error){
//     //     console.log('Error');
//     // }else{
//     //     console.log('server is on');
//     // }
//      if (error) {throw error}else{ console.log('Server on');};
// });

// app.get('/', function(req, res){
//  conn.query("select * from mis_portal", function(error, rows, fields){
//     if (error){ throw error;}
//     else{
//        console.log(rows) ;
//     }
//     // if(!!error){
//     //     console.log('Error occured:'+error);
//     // }else{
//     //     console.log('Queried!');
//     // }
//  });
// });
// app.listen(3000);