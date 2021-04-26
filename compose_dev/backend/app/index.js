"use strict";

/* ---------- TEST 01 ----------------------------------------------------------------- */

//var express	= require('express');
//var app = express();
//
//app.get('/', (request, response) => {
//	response.setHeader('ContentType', 'text/plain');
//	response.setHeader('Access-Control-Allow-Origin', '*');
//	response.end('Bonjour de Node.js');
//});
//
//app.listen(3000);

const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const assert = require("assert");
const cors = require("cors");
const bodyParser = require("body-parser");

const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
    ca: fs.readFileSync('./ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};      

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

https.createServer(options, app).listen(3000);

let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
let url = "mongodb://root:example@mongo:27017";


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    let db = client.db("Twouittere");
    assert.equal(null, err);

    /* ---------- TEST 02 ----------------------------------------------------------------- */

    app.get('/', (request, response) => {
      response.setHeader('ContentType', 'text/plain');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.end('Bonjour de Node.js');
    });

    /* ---------- TEST 03 ----------------------------------------------------------------- */

//    app.get('/init_users_db', (request, response) => {
//      const default_users = [
//        {
//          "email" : "delune@lirmm.fr",
//          "password" : "sideree",
//          "firstname" : "Claire",
//          "lastname" : "DELUNE"
//        },
//        {
//          "email" : "pompidor@lirmm.fr",
//          "password" : "2fast4U",
//          "firstname" : "Pierre",
//          "lastname" : "POMPIDOR"
//        }
//      ];
//      db.collection("Users").insertMany(default_users);
//      response.setHeader('ContentType', 'text/plain');
//      response.setHeader('Access-Control-Allow-Origin', '*');
//      response.end('Initialisation de la collection "Users" de la base de donnees !');
//    });

    /* ---------- AUTHENTIFICATION -------------------------------------------------------- */

    app.get("/auth/login=:login/password=:password", (req, res) => {
	let login = req.params.login;
	let password = req.params.password;
	console.log("Demande d'authentification avec login="+login+" et password="+password);
        db.collection("Users").find({"email":login, "password":password})
	  .toArray(function(err, documents) {
	    res.setHeader("Content-type","application/json; charset=UTF-8");
	    res.setHeader("Access-Control-Allow-Origin","*");
	    if (documents !== undefined && documents.length == 1) {
	        console.log("Authentification de "+documents[0].firstname+" "+documents[0].lastname);		
                res.end(JSON.stringify([documents[0].firstname, documents[0].lastname]));
	    }
	    else {
	        console.log("Pas d'authentification");
	        res.end(JSON.stringify([]));	    
	    }
	  });
    });

	app.post("/auth", (req, res) => {
      let login = req.body.login;
      let password = req.body.password;
      let firstname = req.body.firstname;
      let lastname = req.body.lastname;
      console.log(JSON.stringify(req.body));
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");
      res.end(JSON.stringify([firstname, lastname]));
    });

});

