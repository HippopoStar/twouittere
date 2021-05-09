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
const crypto = require("crypto");

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
let url = "mongodb://root:example@database:27017";

const loginFieldMaxLength = 30;
const passwordFieldMaxLength = 20;
const firstnameFieldMaxLength = 20;
const lastnameFieldMaxLength = 20;
const contentFieldMaxLength = 500;

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
      var logMessage = "Dans la fonction 'checkClientAuth': ";
      console.log(logMessage + JSON.stringify(param));
      /* Ces quelques lignes commentees representent des tests concernant l'usage de 'typeof' et 'instanceof' */
      //console.log(JSON.stringify(param["filterObject"] !== undefined));
      //console.log(JSON.stringify(param["filterObject"] instanceof Object));
      //console.log(JSON.stringify(param["filterObject"]["login"] !== undefined));
      //console.log(JSON.stringify(param["filterObject"]["login"] instanceof String));
      //console.log(typeof param["filterObject"]["login"]);
      //console.log(typeof(typeof "I need to know"));
      //console.log(JSON.stringify(typeof(param["filterObject"]["login"]) == "string"));
      if (!(param["filterObject"] === undefined) && param["filterObject"] instanceof Object
        && !(param["filterObject"]["login"] === undefined) && typeof(param["filterObject"]["login"]) === "string"
        && !(param["filterObject"]["password"] === undefined) && typeof(param["filterObject"]["password"]) === "string")
      {
        var hash = crypto.createHash('sha256');
        hash.update(param["filterObject"]["password"]);
        var userResearchObject = {
          "email": param["filterObject"]["login"],
          "password": param["filterObject"]["password"],
          "password_hash": hash.digest('hex')
        };
        console.log(logMessage + JSON.stringify(userResearchObject));
        delete userResearchObject["password"];
        console.log(logMessage + "SEARCHING item " + JSON.stringify(userResearchObject));
        db.collection("Users").find(userResearchObject).toArray((err, documents) => {
          if (err) {
            console.log(logMessage + err);
            res.end(JSON.stringify({ "status": "fail" }));
          }
          else if (!(documents === undefined) && documents.length > 0) {
            console.log(logMessage + "OK");
            callback(db, req, res, param, documents); /* CALLBACK */
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

    /* ---------- AUTHENTICATION ---------------------------------------------------------- */

    app.get("/auth/login=:login/password=:password", (req, res) => {
      var logMessage = "Dans la requete '/auth/login' - GET: ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");
      if (!(req.params.login === undefined) && typeof(req.params.login) === "string"
        && !(req.params.password === undefined) && typeof(req.params.password) === "string")
      {
/*
**        let login = req.params.login;
**        let password = req.params.password;
**        console.log(logMessage + "Demande d'authentification avec login="+login+" et password="+password);
**        db.collection("Users").find({
**          "email": login,
**          "password": password
**        }).toArray(function(err, documents) {
**          if (documents !== undefined && documents.length == 1) {
**            console.log(logMessage+"Authentification de "+documents[0].firstname+" "+documents[0].lastname);
**            res.end(JSON.stringify({
**              "status": "success",
**              "content": documents[0]
**            }));
**          }
**          else {
**            console.log(logMessage+"Pas d'authentification");
**            res.end(JSON.stringify({ "status": "fail" }));
**          }
**        });
*/
        checkClientAuth(db, req, res, { "filterObject": req.params }, (db, req, res, param, documents) => {
          console.log(logMessage + JSON.stringify(req.params));
          res.end(JSON.stringify({
            "status": "success",
            "content": documents[0]
          }));
        });
      }
      else {
        console.log(logMessage+"Invalid parameters");
        res.end(JSON.stringify({ "status": "fail" }));
      }
    });

    /* ---------- REGISTRATION ------------------------------------------------------------ */

    app.post("/auth/register", (req, res) => {
      var logMessage = "Dans la requete '/auth/register' - POST: ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");
      const reEmail = /^(\w+)((\.{1})(\w+))?@(\w+)\.(\w{2,3})$/; // le login ne doit notamment pas pouvoir etre 'default' (voir frontend: auth.service)
      const reWord = /^(\w+)$/;

      if (!(req.body.login === undefined) && typeof(req.body.login) === "string" && reEmail.test(req.body.login) && req.body.login.length <= loginFieldMaxLength
        && !(req.body.password === undefined) && typeof(req.body.password) === "string" && reWord.test(req.body.password) && req.body.password.length <= passwordFieldMaxLength
        && !(req.body.firstname === undefined) && typeof(req.body.firstname) === "string" && reWord.test(req.body.firstname) && req.body.firstname.length <= firstnameFieldMaxLength
        && !(req.body.lastname === undefined) && typeof(req.body.lastname) === "string" && reWord.test(req.body.lastname) && req.body.lastname.length <= lastnameFieldMaxLength)
      {
        console.log(logMessage + JSON.stringify(req.body));
        var hash = crypto.createHash('sha256');
        hash.update(req.body.password);
        var userRegistrationObject = {
          "email": req.body.login,
          "password": req.body.password,
          "password_hash": hash.digest('hex'),
          "firstname": req.body.firstname,
          "lastname": req.body.lastname
        };
        console.log(logMessage + JSON.stringify(userRegistrationObject));
        delete userRegistrationObject.password;
        db.collection("Users").find({"email": userRegistrationObject.email}).toArray((err, documents) => {
          if (documents !== undefined && documents.length == 0) {
            console.log(logMessage + "INSERTING item " + JSON.stringify(userRegistrationObject));
            db.collection("Users").insertOne(userRegistrationObject); //Ca ajoute la propriete '_id' a l'objet passe en parametre !
            res.end(JSON.stringify({
              "status": "success",
              "content": userRegistrationObject
            }));
            console.log(logMessage + "Nouvel utilisateur : " + userRegistrationObject.firstname + " " + userRegistrationObject.lastname);
          }
          else {
            console.log(logMessage + "L'utilisateur \"" + userRegistrationObject.email + "\" existe deja !");
            res.end(JSON.stringify({ "status": "fail" }));
          }
        });
      }
      else {
        console.log(logMessage + "Invalid parameters");
        res.end(JSON.stringify({ "status": "fail" }));
      }
    });

    /* ---------- PUBLICATION ------------------------------------------------------------- */

    app.post("/articles/publish", (req, res) => {
      var logMessage = "Dans la requete '/articles/publish' - POST: ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");

      checkClientAuth(db, req, res, { "filterObject": req.body }, (db, req, res, param, documents) => {
        console.log(logMessage + JSON.stringify(req.body));
        if (!(param["filterObject"]["login"] === undefined) && typeof(param["filterObject"]["content"]) === "string"
          && !(param["filterObject"]["content"] === undefined) && typeof(param["filterObject"]["content"]) === "string"
          && param["filterObject"]["content"].length <= contentFieldMaxLength)
        {
          let newArticle = {
            "author": param["filterObject"]["login"],
            "content": param["filterObject"]["content"],
            "publication_date": new Date().toISOString()
          };
          db.collection("Articles").insertOne(newArticle); //Ca ajoute la propriete '_id' a l'objet passe en parametre !
          console.log("Nouvel article poste:\n"+JSON.stringify(newArticle));
          res.end(JSON.stringify({
            "status": "success",
            "content": newArticle._id
          }));
        }
        else {
          console.log(logMessage + "invalid parameters");
          res.end(JSON.stringify({ "status": "fail" }));
        }
      });
      //A partir d'ici on est sortis du callback de l'appel de db.collection(<collection name>).find() de la fonction 'checkClientAuth'
    });

    /* ---------- FEED -------------------------------------------------------------------- */

    app.get("/articles/feed/login=:login/password=:password/last_article_date=:last_article_date/last_article_id=:last_article_id", (req, res) => {
      var logMessage = "Dans la requete '/articles/feed' - GET: ";
      var reDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");

      console.log(logMessage + JSON.stringify(req.params));
      console.log("reDate test: " + JSON.stringify(reDate.test("1970-00-00T00:00:00.000Z")));
      if (!(req.params.last_article_date === undefined) && typeof(req.params.last_article_date) === "string"
        && !(req.params.last_article_id === undefined) && typeof(req.params.last_article_id) === "string") //TODO
      {
        if (req.params.last_article_date === "None" || !reDate.test(req.params.last_article_date)) {
          console.log(logMessage + "Init/Refresh");
          req.params.last_article_date = new Date().toISOString();
          req.params.last_article_id = "\0"; //TODO
        }
        db.collection("Articles").find({
          "publication_date": { $lt: req.params.last_article_date }
        }).sort({
          "publication_date": -1,
          "_id": 1
        }).limit(10).toArray((err, documents) => {
          if (err) {
            console.log(logMessage + err);
            res.end(JSON.stringify({ "status": "fail" }));
          }
          else if (documents !== undefined && documents.length > 0) {
            console.log(logMessage + "OK");
            res.end(JSON.stringify({
              "status": "success",
              "result": documents,
              "server_time": new Date().toISOString()
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
        console.log(logMessage + "invalid parameters");
        res.end(JSON.stringify({ "status": "fail" }));
      }
    });

});

