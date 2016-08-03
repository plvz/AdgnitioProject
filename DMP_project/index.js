'use strict';
var conversion = require('./csvjson.js'); //call csvjson.js file
var visu = require('./visu.js'); //call visu.js file

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pathcsv = __dirname + '/views/';

//initialize the repository. Start the localhost server with index.html file
app.use(express.static(__dirname +'/views/'));

//listening the node server on port 3000
http.listen(80, function () {
    console.log('listening on *:80');
})

var url = "";
//CSVtoJSON
//socket server get message from a webpage and execute CSVtoJSON function
io.on('connection', function (socket) {
    socket.on('sending_link', function (msg) {
        url = msg["message"];

        conversion.getobj(url); //call csvjson.js file and execute the function CSVtoJSON
        var message = 'done';
        //send the message 'done' to csvjson.js file
        socket.emit('sending_response',
        {
            response: message
        });

    });
});


//get request from visu.html
io.on('connection', function (socket2) {
    socket2.on('sending_visu', function (msg2) {
        var url2 = msg2["message2"];
        if(url2 == "visu")
        {
          visu.getobj(List); //call csvjson.js file and execute the function CSVtoJSON
        }

    });
});

//send arraylist to visu.html
var List = function (err, result){
  io.on('connection', function (socket3) {
    var msg3 = result;
    socket3.emit("sending_histo", {
        message3: msg3
    });
  });
}
