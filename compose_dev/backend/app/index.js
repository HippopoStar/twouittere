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
const async = require("async");

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

    /* ---------- USER VERIFICATION ------------------------------------------------------- */

    function checkClientAuth(db, req, res, param, callback) {
      var logMessage = "In \"checkClientAuth\": ";
      console.log(logMessage + JSON.stringify(param));
      console.log(JSON.stringify(param["filterObject"] !== undefined));
      console.log(JSON.stringify(param["filterObject"] instanceof Object));
      console.log(JSON.stringify(param["filterObject"]["login"] !== undefined));
      console.log(JSON.stringify(param["filterObject"]["login"] instanceof String));
      console.log(typeof param["filterObject"]["login"]);
      console.log(typeof(typeof "I need to know"));
      console.log(JSON.stringify(typeof(param["filterObject"]["login"]) == "string"));
      if (param["filterObject"] !== undefined && param["filterObject"] instanceof Object
        && param["filterObject"]["login"] !== undefined && typeof(param["filterObject"]["login"]) === "string"
        && param["filterObject"]["password"] !== undefined && typeof(param["filterObject"]["password"]) === "string") {
        db.collection("Users").find({
          "email": param["filterObject"]["login"],
          "password": param["filterObject"]["password"]
        }).toArray((err, documents) => {
          if (err) {
            console.log(logMessage + err);
            res.end(JSON.stringify({ "status": "fail" }));
          }
          else if (documents !== undefined && documents.length > 0) {
            console.log(logMessage + "OK");
            callback(db, req, res, param, documents);
          }
          else {
            console.log(logMessage + "auth not found in \"Users\" database");
            res.end(JSON.stringify({ "status": "fail" }));
          }
        });
      }
      else {
        console.log(logMessage + "invalid parameters");
        res.end(JSON.stringify({ "status": "fail" }));
      }
    }

    /* ---------- AUTHENTIFICATION -------------------------------------------------------- */

    app.get("/auth/login=:login/password=:password", (req, res) => {
	let login = req.params.login;
	let password = req.params.password;
	console.log("Demande d'authentification avec login="+login+" et password="+password);
        db.collection("Users").find({
          "email": login,
          "password": password
        })
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

    /* ---------- REGISTRATION ------------------------------------------------------------ */

	app.post("/auth/register", (req, res) => {
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");
      const reEmail = /^(\w+)@(\w+)\.(\w{2,3})$/;
      const reWord = /^(\w+)$/;

      if (!(req.body.login === null) && reEmail.test(req.body.login)
        && !(req.body.password === null) && reWord.test(req.body.password)
        && !(req.body.firstname === null) && reWord.test(req.body.firstname)
        && !(req.body.lastname === null) && reWord.test(req.body.lastname)) {
        let newUser = {
          "email": req.body.login,
          "password": req.body.password,
          "firstname": req.body.firstname,
          "lastname": req.body.lastname
        };
        console.log(JSON.stringify(req.body));
        db.collection("Users").find({"email": newUser.email}).toArray((err, documents) => {
          if (documents !== undefined && documents.length == 0) {
            db.collection("Users").insertOne(newUser);
            res.end(JSON.stringify([newUser.firstname, newUser.lastname]));
            console.log("Nouvel utilisateur : " + newUser.firstname + " " + newUser.lastname);
          }
          else {
            console.log("L'utilisateur \"" + newUser.login + "\" existe deja !");
            res.end(JSON.stringify([]));
          }
        });
      }
      else {
        console.log("Erreur dans la requete ('/auth/register' - POST)");
        res.end(JSON.stringify([]));
      }
    });

    /* ---------- PUBLICATION ------------------------------------------------------------- */

	app.post("/articles/publish", (req, res) => {
      var logMessage = "Dans la requete '/articles/publish' - POST: ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");

      checkClientAuth(db, req, res, { "filterObject": req.body }, (db, req, res, param, documents) => {
        console.log(logMessage + JSON.stringify(req.body));
        if (param["filterObject"]["content"] !== undefined && typeof(param["filterObject"]["content"]) === "string") {
          let newArticle = {
            "author": param["filterObject"]["login"],
            "content": param["filterObject"]["content"],
            "publication_date": "2020-04-26"
          };
          db.collection("Articles").insertOne(newArticle);
          console.log("Nouvel article poste:\n"+JSON.stringify(newArticle));
          res.end(JSON.stringify({ "status": "success" }));
        }
        else {
          console.log(logMessage + "invalid parameters");
          res.end(JSON.stringify({ "status": "fail" }));
        }
      });
      //A partir d'ici on est sortis du callback de l'appel de db.collection(<collection name>).find() de la fonction 'checkClientAuth'
    });

    /* ---------- FEED -------------------------------------------------------------------- */

    app.get("/articles/feed/login=:login/password=:password/lastLoadedArticle=:lastLoadedArticle", (req, res) => {
      var logMessage = "Dans la requete '/articles/feed' - GET: ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");

      console.log(logMessage + JSON.stringify(req.params));
      if (req.params.login !== undefined && typeof(req.params.login) === "string")
      {
        if ((req.params.login === "default") || true) {
          db.collection("Articles").find().toArray((err, documents) => {
            if (err) {
              console.log(logMessage + err);
              res.end(JSON.stringify({ "status": "fail" }));
            }
            else if (documents !== undefined && documents.length > 0) {
              console.log(logMessage + "OK");
              res.end(JSON.stringify({
                "status": "success",
                "result": documents
              }));
              //callback(db, req, res, params, documents);
            }
            else {
              console.log(logMessage + "No matching articles");
              res.end(JSON.stringify({ "status": "fail" }));
            }
          });
        }
        else {
        }
      }
      else {
        console.log(logMessage + "invalid parameters");
      }
    });

});

