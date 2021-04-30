const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const assert = require("assert");

const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
    ca: fs.readFileSync('./ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};      
    
https.createServer(options, app).listen(8443);

let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
let url = "mongodb://root@example@127.0.0.1:27017";


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    let db = client.db("OnlineSales");
    assert.equal(null, err);

    app.get("/auth/login=:login/password=:password", function(req, res){
	let login = req.params.login;
	let password = req.params.password;

	console.log("Serveur avec "+login+" "+password);
        res.setHeader("Content-type","text/plain; charset=UTF-8");	
        db.collection("Users").find({"email":login, "password":password}).toArray(function(err, doc) { if (doc !== undefined && doc.length == 1) { res.end("1"); console.log("1"); }else {res.end("0"); console.log("0"); }});
    });

});
