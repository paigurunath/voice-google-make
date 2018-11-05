'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const express = require('express')
const bodyParser = require('body-parser')
var marketInsights = require('./app/marketinsights/app');

var NODE_ENV = process.env.NODE_ENV || 'development';
var models = require("./app/model");
var port = process.env.VCAP_APP_PORT || 3000;

const db = require('./app/model');

//Sync Database
models
    .sequelize
    .sync()
    .then(function () {
        console.log('Nice! Database syncup looks fine');
    })
    .catch(function (err) {
        console.log("Something went wrong with the Database Update!");
        console.log(err);
    });


const expressApp = express().use(bodyParser.json())

//third middleware
// expressApp.use((request,next,cb)=>{
expressApp.use((request,response, next)=>{
    console.log('--------------------------------------------------request------------------------------');
    console.log(JSON.stringify(request.body));
    console.log('--------------------------------------------------request------------------------------');
    
    db.voicedata.create({
        logdata: JSON.stringify(request.body)
      }).then(output => {
          console.log("log inserted request");
      }).catch(err => {
          console.log('Error in storing the request log record');
          console.log(err);
      }) ;

    next();
    // console.log('--------------------------------------------------response------------------------------');
    // console.log(response.socket['body']);
    // console.log(JSON.stringify(response.req.body));
    // console.log(response.res);
    // console.log('--------------------------------------------------response------------------------------');

    // next(request, function(err, response) {

    //     console.log('--------------------------------------------------response------------------------------');
    //     // console.log(response.socket['body']);
    //     // console.log(JSON.stringify(response.req.body));
    //     console.log(response);
    //     // console.log(response.res);
    //     console.log('--------------------------------------------------response------------------------------');
    //     cb(err,response);
    // });
});

expressApp.use(logResponseBody);

expressApp.post('/voice/google/marketinsights', marketInsights)
 

function logResponseBody(req, res, next) {
    console.log('--------------------------response--------------------------------');
    console.log(res.end)
    console.log('--------------------------response--------------------------------');
  var oldWrite = res.write,
      oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk)
      chunks.push(chunk);

    var body = Buffer.concat(chunks).toString('utf8');
    console.log(req.path, body);

    db.voicedata.create({
        logdata: JSON.stringify(body)
      }).then(output => {
          console.log("log inserted request");
      }).catch(err => {
          console.log('Error in storing the request log record');
          console.log(err);
      }) ;

    console.log(body)
    // console.log('--------------------------response--------------------------------');

    oldEnd.apply(res, arguments);
  };

  next();
}



// function modifyResponseBody(req, res, next) {
//     var oldSend = res.send;

//     console.log('--------------------------------------------------response------------------------------');
//     console.log(oldSend);
//     console.log('--------------------------------------------------response------------------------------');
//     res.send = function(data){
//         // arguments[0] (or `data`) contains the response body
//         arguments[0] = "modified : " + arguments[0];
        
//         oldSend.apply(res, arguments);
//     }
//     next();
// }

// expressApp.use(modifyResponseBody);

// expressApp.listen(process.env.PORT);
// expressApp.listen(80)
// Start server
expressApp.listen(port, function () {
    console.log('************' + NODE_ENV + '******************');
    // console.log('************' + process.env.VCAP_APP_PORT + '******************');
    console.log("Server started.");
    console.log('*******************************');
  
  });