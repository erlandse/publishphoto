import * as path from 'path';

import * as express from "express";
import * as bodyParser from "body-parser";
import * as tools from './tools';
import * as transform from './transform';
import * as pg from 'pg';
import * as fs from 'fs';
//import * as nf from 'node-fetch';

var app = express();
var result;
import * as  ejs from 'ejs';
import * as najax from 'najax';
var message = "";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, 'public')));



var server = app.listen(40000, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Listening at http://%s:%s", host, port);
  update();
})


const update = async () => {
  let q= await transform.updateBase();
 }


 
app.get('/test', function (req, res) {
  res.send('Hello World!')
})

