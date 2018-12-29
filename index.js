'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const express = require('express')
const bodyParser = require('body-parser')
var marketInsights = require('./app/marketinsights/app');
var myNextMove = require('./app/mynextmove/handlers/app');

var NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.VCAP_APP_PORT || 3000;

const expressApp = express().use(bodyParser.json())

//third middleware
// expressApp.use((request,next,cb)=>{

marketInsights.middleware((conv) => {
    console.log('------------------------------middleware--------------------------------');
    console.log(JSON.stringify(conv));
    console.log('------------------------------middleware--------------------------------');
});

// expressApp.use((request,response, next)=>{
//     console.log('--------------------------------------------------request------------------------------');
//     console.log(JSON.stringify(request.body));
//     console.log('--------------------------------------------------request------------------------------');
    
//     db.voicedata.create({
//         logdata: JSON.stringify(request.body)
//       }).then(output => {
//           console.log("log inserted request");
//       }).catch(err => {
//           console.log('Error in storing the request log record');
//           console.log(err);
//       }) ;

//     next();
   
// });

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
    console.log(body)
    oldEnd.apply(res, arguments);
  };

  next();
}

expressApp.post('/voice/google/mynextmove', myNextMove)
 

function logResponseBody(req, res, next) {
    // console.log('--------------------------response--------------------------------');
    // console.log(res.end)
    // console.log('--------------------------response--------------------------------');
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
    // console.log(req.path, body);
    // console.log(body)
    oldEnd.apply(res, arguments);
  };

  next();
}

expressApp.listen(port, function () {
    console.log('************' + NODE_ENV + '******************');
    console.log("Server started.");
    console.log('*******************************');
  
});