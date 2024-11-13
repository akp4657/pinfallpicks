import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';

import * as user_service from './src_api/userService.js'

import cors from 'cors'
const app = express();
const port = 3000;

// Mounting the app under the process.env.ROUTE as a parent route (if present)
var route = process.env.ROUTE;
var parent_app;

// Enable CORS for all routes
app.use(cors());

import http_server from 'http'
if(route == undefined) {
  http_server.createServer(app);
} else {
  parent_app = express();
  parent_app.use("/" + route, app);
  http_server.createServer(parent_app);
}

// body parser set up
app.use(bodyParser.urlencoded({ 
  limit: '200mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '200mb',
  extended: true
}));

// Endpoints for FE
app.post('/login', user_service.login);
app.post('/addUser', user_service.addUser);


// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

