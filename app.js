import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import {google} from 'googleapis';
import * as user_service from './src_api/userService.js'
import {authenticate} from '@google-cloud/local-auth';
import path from 'path'


import cors from 'cors'
const app = express();
const port = 3000;

// Mounting the app under the process.env.ROUTE as a parent route (if present)
var route = process.env.ROUTE;
var parent_app;
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  console.log('Name, Major:');
  rows.forEach((row) => {
    // Print columns A and E, which correspond to indices 0 and 4.
    console.log(`${row[0]}, ${row[4]}`);
  });
}

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

