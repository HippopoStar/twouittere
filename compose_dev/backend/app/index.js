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

  /* ------------ REQUESTS' LOG INTRO ----------------------------------------------------- */

  function printLogIntro(message, param) {
    var currentServerDate = new Date();
    console.log("----- ----- ----- ----- ----- [" + currentServerDate.toDateString() + " at " + currentServerDate.toTimeString() + "]");
    if (!(message === undefined) && typeof(message) === "string") {
      console.log(message);
    }
    if (!(param === undefined) && param instanceof Object) {
      if (!(param.password === undefined) && typeof(param.password) === "string") {
        var replacer = (function (key, value) {
            if (key === "password") {
              value = "********";
            }
            return (value);
          }
        );
        console.log(JSON.stringify(param, replacer, 2));
      }
      else {
        console.log(JSON.stringify(param, null, 2));
      }
    }
  }

  /* ------------ USER VERIFICATION ------------------------------------------------------- */

  /* 'req' et 'param' sont 2 arguments distincts car on ignore si la fonction appelante est liee a une request GET ou POST */
  function checkClientAuth(db, req, res, param, callback) {
    var logMessage = "Dans la fonction 'checkClientAuth': ";
    //console.log(logMessage + JSON.stringify(param, null, 2));
    if (!(param["filterObject"] === undefined) && param["filterObject"] instanceof Object
      && !(param["filterObject"]["login"] === undefined) && typeof(param["filterObject"]["login"]) === "string"
      && !(param["filterObject"]["password"] === undefined) && typeof(param["filterObject"]["password"]) === "string")
    {
      var userResearchObject = {
        "email": param["filterObject"]["login"],
        "password": param["filterObject"]["password"],
      };
      replacePasswordByHash(userResearchObject);
      console.log(logMessage + "attempting to recognise:\n" + JSON.stringify(userResearchObject, null, 2));
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

  /* ------------ PASSWORD HASH ----------------------------------------------------------- */

  function replacePasswordByHash(userObject) {
    var logMessage = "Dans la fonction 'replacePasswordByHash': ";
    //console.log(logMessage + JSON.stringify(userObject));
    if (!(userObject === undefined || userObject.password === undefined) && typeof(userObject.password) === "string") {
      var hash = crypto.createHash('sha256');
      hash.update(userObject["password"]);
      userObject["password_hash"] = hash.digest('hex');
      delete userObject["password"];
    }
    //console.log(logMessage + JSON.stringify(userObject));
  }

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    let db = client.db("Twouittere");
    assert.equal(null, err);

    /* ---------- TEST 02 ----------------------------------------------------------------- */

    app.get('/', (request, response) => {
      printLogIntro("Bonjour de Node.js");
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

    /* ---------- AUTHENTICATION ---------------------------------------------------------- */

    app.get("/auth/login=:login/password=:password", (req, res) => {
      var logMessage = "Dans la requete GET '/auth/login': ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");

      printLogIntro(logMessage + "attempting to authenticate:", req.params);
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
      var logMessage = "Dans la requete POST '/auth/register': ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");
      const reEmail = /^(\w+)((\.{1})(\w+))?@(\w+)\.(\w{2,3})$/; // le login ne doit notamment pas pouvoir etre 'default' (voir frontend: auth.service)
      const reWord = /^(\w+)$/;

      printLogIntro(logMessage + "attempting to register:", req.body);
      if (!(req.body.login === undefined) && typeof(req.body.login) === "string" && reEmail.test(req.body.login) && req.body.login.length <= loginFieldMaxLength
        && !(req.body.password === undefined) && typeof(req.body.password) === "string" && reWord.test(req.body.password) && req.body.password.length <= passwordFieldMaxLength
        && !(req.body.firstname === undefined) && typeof(req.body.firstname) === "string" && reWord.test(req.body.firstname) && req.body.firstname.length <= firstnameFieldMaxLength
        && !(req.body.lastname === undefined) && typeof(req.body.lastname) === "string" && reWord.test(req.body.lastname) && req.body.lastname.length <= lastnameFieldMaxLength)
      {
        async.waterfall(
          [
            function (callback) {
              var userRegistrationObject = {
                "email": req.body.login,
                "password": req.body.password,
                "firstname": req.body.firstname,
                "lastname": req.body.lastname
              };
              replacePasswordByHash(userRegistrationObject);
              db.collection("Users")
                .find({ "email": userRegistrationObject.email })
                .toArray()
                .then((documents) => {
                  if (!(documents === undefined) && documents.length == 0) {
                    callback(null, userRegistrationObject);
                  }
                  else {
                    console.log(logMessage + "L'utilisateur \"" + userRegistrationObject.email + "\" existe deja !");
                    //res.end(JSON.stringify({ "status": "fail" }));
                    callback(true);
                  }
                })
                .catch((err) => {
                  console.log(logMessage + "an error occured while checking login availability in database: " + err);
                  res.end(JSON.stringify({ "status": "fail" }));
                });
            },
            function (submittedUser, callback) {
              db.collection("Users")
                .insertOne(submittedUser) //Ca ajoute la propriete '_id' a l'objet passe en parametre !
                .then((result) => {
                  //console.log(logMessage + "result:\n" + JSON.stringify(result, null, 2));
                  if (!(result.ops === undefined) && result.ops instanceof Array && result.ops.length == 1) {
                    console.log("Nouvel utilisateur:\n"+JSON.stringify(result.ops[0], null, 2));
                    callback(null, result.ops[0]);
                  }
                  else {
                    callback(true);
                  }
                })
                .catch((err) => {
                  console.log(logMessage + "an error occured while adding new user to the database: " + err);
                  res.end(JSON.stringify({ "status": "fail" }));
                });
            },
            function (insertedUser, callback) {
              res.end(JSON.stringify({
                "status": "success",
                "content": insertedUser
              }));
              console.log(logMessage + "async.waterfall completed");
            }
          ],
          function () {
            console.log(logMessage + "async.waterfall didn't go all along the way !");
            res.end(JSON.stringify({ "status": "fail" }));
          }
        );
      }
      else {
        console.log(logMessage + "Invalid parameters");
        res.end(JSON.stringify({ "status": "fail" }));
      }
    });

    /* ---------- PUBLICATION ------------------------------------------------------------- */

    app.post("/articles/publish", (req, res) => {
      var logMessage = "Dans la requete POST '/articles/publish': ";
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");

      printLogIntro(logMessage + "attempting to publish:", req.body);
      async.waterfall(
        [
          function (callback) {
            checkClientAuth(db, req, res, { "filterObject": req.body }, (db, req, res, param, documents) => {
              //console.log(logMessage + "param:\n" + JSON.stringify(param, null, 2));
              //console.log(logMessage + "param[\"filterObject\"]:\n" + JSON.stringify(param["filterObject"], null, 2));
              callback(null, param["filterObject"]);
            });
          },
          function (requestBody, callback) {
            if (!(requestBody["content"] === undefined) && typeof(requestBody["content"]) === "string" && requestBody["content"].length <= contentFieldMaxLength) {
              var newArticle = {
                "author": requestBody["login"],
                "content": requestBody["content"],
                "publication_date": new Date().toISOString()
              };
              callback(null, newArticle);
            }
            else {
              console.log(logMessage + "invalid parameters:\n" + JSON.stringify(requestBody, null, 2));
              //res.end(JSON.stringify({ "status": "fail" }));
              callback(true);
            }
          },
          function (submittedArticle, callback) {
            db.collection("Articles").insertOne(submittedArticle) //Ca ajoute la propriete '_id' a l'objet passe en parametre !
              .then((result) => {
                /* Ces 2 lignes commentees representent des tests concernant l'usage de 'typeof' et 'instanceof' */
                //console.log(JSON.stringify(typeof([])));
                //console.log(JSON.stringify([] instanceof Array));
                if (!(result.ops === undefined) && result.ops instanceof Array && result.ops.length == 1) {
                  console.log("Nouvel article poste:\n"+JSON.stringify(result.ops[0], null, 2));
                  callback(null, result.ops[0]);
                }
                else {
                  callback(true);
                }
              })
              .catch((err) => {
                console.log(logMessage + "an error occured while adding new article to the database: " + err);
                res.end(JSON.stringify({ "status": "fail" }));
              });
          },
          function (insertedArticle, callback) {
            db.collection("Users").findOneAndUpdate({ email: insertedArticle.author }, { $push: { published_articles: insertedArticle._id } }, { returnOriginal: false })
              .then((result) => {
                if (!(result.value === undefined)) {
                  console.log("Donnees utilisateur mises a jour:\n"+JSON.stringify(result.value, null, 2));
                  callback(null, insertedArticle, result.value);
                }
                else {
                  callback(true);
                }
              })
              .catch((err) => {
                console.log(logMessage + "an error occured while updating user publications array in database: " + err);
                res.end(JSON.stringify({ "status": "fail" }));
              });
          },
          function (insertedArticle, updatedUser, callback) {
            res.end(JSON.stringify({
              "status": "success",
              "content": {
                "article_id": insertedArticle._id,
                "updated_user": updatedUser
              }
            }));
            //callback(null);
            console.log(logMessage + "async.waterfall completed");
          }
        ],
        function () {
          console.log(logMessage + "async.waterfall didn't go all along the way !");
          res.end(JSON.stringify({ "status": "fail" }));
        }
      );
    });

    /* ---------- FEED -------------------------------------------------------------------- */

    app.get("/articles/feed/login=:login/password=:password/last_article_date=:last_article_date/last_article_id=:last_article_id", (req, res) => {
      var logMessage = "Dans la requete GET '/articles/feed': ";
      var reDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;
      res.setHeader("Content-type","application/json; charset=UTF-8");
      res.setHeader("Access-Control-Allow-Origin","*");

      printLogIntro(logMessage + "attempting to load:", req.params);
      console.log(logMessage + "reDate test: " + JSON.stringify(reDate.test("1970-00-00T00:00:00.000Z")));
      async.waterfall(
        [
          function (callback) {
            /* TODO: En soit ce n'est pas genant que 'last_article_id' ne soit pas valide si 'last_article_date' vaut "None" */
            if (!(req.params.last_article_date === undefined) && typeof(req.params.last_article_date) === "string"
              && !(req.params.last_article_id === undefined) && typeof(req.params.last_article_id) === "string")
            {
              callback(null);
            }
            else {
              console.log(logMessage + "invalid parameters");
              //res.end(JSON.stringify({ "status": "fail" }));
              callback(true);
            }
          },
          function (callback) {
            if (req.params.last_article_date === "None" || !reDate.test(req.params.last_article_date)) {
              console.log(logMessage + "Init/Refresh");
              req.params.last_article_date = new Date().toISOString();
              req.params.last_article_id = "\0";
            }
            db.collection("Articles")
              .find({ "publication_date": { $lt: req.params.last_article_date } })
              .sort({
                "publication_date": -1,
                "_id": 1
              })
              .limit(10)
              .toArray()
              .then((documents) => {
                if (!(documents === undefined && documents instanceof Array && documents.length > 0)) {
                  //console.log(logMessage + "documents: " + JSON.stringify(documents, null, 2));
                  callback(null, documents);
                }
                else {
                  console.log(logMessage + "No matching articles");
                  //res.end(JSON.stringify({ "status": "fail" }));
                  callback(true);
                }
              })
              .catch((err) => {
                console.log(logMessage + "an error occured while loading articles from database: " + err);
                res.end(JSON.stringify({ "status": "fail" }));
              });
          },
          function (loadedArticles, callback) {
            console.log(logMessage + "OK");
            res.end(JSON.stringify({
              "status": "success",
              "result": loadedArticles,
              "server_time": new Date().toISOString()
            }));
            console.log(logMessage + "async.waterfall completed");
          }
        ],
        function () {
          console.log(logMessage + "async.waterfall didn't go all along the way !");
          res.end(JSON.stringify({ "status": "fail" }));
        }
      );
    });

});

