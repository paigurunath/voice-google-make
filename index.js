'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const express = require('express')
const bodyParser = require('body-parser')

var marketInsights = require('./app/actions/marketinsights/handlers/app');
var myNextMove = require('./app/actions/mynextmove/handlers/app');
var eyeOnTheMarket = require('./app/actions/eyeonthemarket/handlers/app');

var NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.VCAP_APP_PORT || 3000;

const expressApp = express().use(bodyParser.json())

marketInsights.middleware((conv) => {
    console.log('-----------------------------marketInsights-middleware--------------------------------');
    console.log(JSON.stringify(conv));
    console.log('-----------------------------marketInsights-middleware--------------------------------');
});

myNextMove.middleware((conv) => {
  console.log('-----------------------------myNextMove-middleware--------------------------------');
  console.log(JSON.stringify(conv));
  console.log('-----------------------------myNextMove-middleware--------------------------------');
});

eyeOnTheMarket.middleware((conv) => {
  console.log('-----------------------------eyeOnTheMarket-middleware--------------------------------');
  console.log(JSON.stringify(conv));
  console.log('-----------------------------eyeOnTheMarket-middleware--------------------------------');
});


// var mung = require('express-mung');

// expressApp.use(mung.json(
//   function transform(body, req, res) {
//       // do something with body
//       console.log('-----------------------------eyeOnTheMarket-middleware--------------------------------');
//       // console.log(JSON.stringify(body));
//       // console.log('-----------------------------eyeOnTheMarket-middleware--------------------------------');
//       // console.log(JSON.stringify(req));
//       // console.log('-----------------------------eyeOnTheMarket-middleware--------------------------------');
//       console.log(JSON.stringify(res));
//       console.log('-----------------------------eyeOnTheMarket-middleware--------------------------------');
//       // next();
//   }
// ));
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

// expressApp.use(logResponseBody);

expressApp.post('/voice/google/marketinsights', marketInsights);
expressApp.post('/voice/google/mynextmove', myNextMove);
expressApp.post('/voice/google/eyeonthemarket', eyeOnTheMarket);

expressApp.listen(port, function () {
  console.log('************' + NODE_ENV + '******************');
  console.log("Server started.");
  console.log('*******************************');

});

function logResponseBody(req, res, next) {
    console.log('----------------------1----response--------------------------------');
    console.log(res.end)
    console.log('----------------------2----response--------------------------------');
    console.log(req)
    console.log('----------------------3----response--------------------------------');
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
};