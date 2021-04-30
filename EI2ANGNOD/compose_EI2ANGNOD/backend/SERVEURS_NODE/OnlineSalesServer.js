"use strict";

let express = require("express");
let cors = require("cors");
let app = express();
var bodyParser = require('body-parser');
let assert = require("assert");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.listen(8888);

let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
let url = "mongodb://root:example@database:27017";

// Recherche de produits : cette fonction retourne le message passé en paramètre en cas d'erreur
function productResearch(db, param, callback) {
    db.collection("Products").find(param["filterObject"]).toArray(function(err, documents) {
        if (documents !== undefined) callback(param["message"], documents);
	else                         callback(param["message"], []);
    });
}

// Recheche des sélecteurs pour permettre de filtrer les produits suivant leurs caractéristiques
function distinctValuesResearch(db, selectors, propriete, callback) {
    db.collection("Products").distinct(propriete, function(err, documents) {
	if (err) selectors.push({"name": propriete, "values":[]});
        else if (documents !== undefined) {
	       let values = [];
	       if (propriete == "price") {
                   let min = Math.min.apply(null, documents);  // On pourrait aussi trier documents
                   let max = Math.max.apply(null, documents);  // et prendre les deux éléments d'indices 0 et max
		   let minTranche = Math.floor(min / 100)*100;
		   let maxTranche = minTranche + 99;
		   values.push(minTranche+" - "+maxTranche);
	           while (max > maxTranche) {
		       minTranche += 100;
		       maxTranche += 100;
		       values.push(minTranche+" - "+maxTranche);
		   }
		   selectors.push({"name": propriete, "values":values});
	        }
	        else selectors.push({"name": propriete, "values":documents.sort()});
	        console.log(" -> "+propriete+" : "+documents.length);		   
	     }
	     else selectors.push({"name": propriete, "values":[]});
	callback(selectors);	 
    });
};


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
   let db = client.db("OnlineSales");
   assert.equal(null, err);

/* ---------- PRODUCT MANAGEMENT ----------------------------------------------------- */    
    
    // Construction des listes de recherche
    app.get("/Products/selectors", (req,res) => {
	distinctValuesResearch(db, [], "type", function(selectors) {
            distinctValuesResearch(db, selectors, "brand", function(selectors) {
		distinctValuesResearch(db, selectors, "price", function(selectors) {
		    distinctValuesResearch(db, selectors, "popularity", function(selectors) {
	                let json=JSON.stringify(selectors);
		        console.log("selectors = "+json);
	                res.setHeader("Content-type","application/json; charset=UTF-8");
                        res.end(json);
			console.log("Traitement /selecteurs terminé !");
		    });
		});
	    });
        });
    });

    // Recherche par criteres  
    app.get("/Products/criteria/:type/:brand/:minprice/:maxprice/:minpopularity", (req,res) => {
	
	console.log("Dans /Products/criteria/"+req.params.type+"/"+req.params.brand+"/"+req.params.minprice+"/"+req.params.maxprice+"/"+req.params.minpopularity);
	let filterObject = {};
	if (req.params.type != "*") { filterObject.type = req.params.type; }
	if (req.params.brand != "*") { filterObject.brand = req.params.brand; }
	if (req.params.minprice != "*" || req.params.maxprice != "*") {
	    filterObject.price = {};
	    if (req.params.minprice != "*") filterObject.price.$gte = parseInt(req.params.minprice);
	    if (req.params.maxprice != "*") filterObject.price.$lte = parseInt(req.params.maxprice);
	}
	if (req.params.minpopularity != "*") {
            filterObject.popularity = {$gte: parseInt(req.params.minpopularity)};
        }
	//console.dir(filterObject);
	
        productResearch(db, {"message":"/Products", "filterObject": filterObject}, function(step, results) {
	    console.log("     "+step+" avec "+results.length+" produits sélectionnés");
            res.setHeader("Content-type","application/json; charset=UTF-8");
            let json=JSON.stringify(results);
            // console.log(json);
            res.end(json);
	});
    });

    // Recherche sur un mot clef
    app.get("/Products/keyword=:keyword", (req,res) => {
	let keyword = req.params.keyword;
	console.log("Dans /Products/keyword avec "+keyword);
	let filterObject = {};
	filterObject.name = new RegExp(keyword, "i");
        db.collection("Products").find(filterObject).toArray(function(err, documents) {
            res.setHeader("Content-type","application/json; charset=UTF-8");
            let json=JSON.stringify(documents);
            console.log(json);
            res.end(json);
	});
    });

    // Recherche sur une liste de mots clefs
    app.get("/Products/keywords", (req,res) => {
	console.log("Dans /Products/keywords avec "+req.query);
        let keywords = [];
        for (let keyword in req.query) keywords.push(keyword);
        // console.log(keywords);
        db.collection("Products").find({}, {"_id": 0}).toArray(function(err, documents) {
           let results = [];
	   documents.forEach(function(product) {
              // console.log("Analyse de "+product.name);
              let match = true;
              for (let k of keywords) {
                   let found = false;
                   for (let p in product) {
                       let regexp = new RegExp(k, "i");
                       if (regexp.test(product[p])) {
                           found = true;
			   // console.log(k+" trouvé dans "+product[p]);
                           break;
                       }
                   }
                   if ( !found ) match = false;
              }
              if ( match ) {
		  results.push(product); // console.log(" -> sélection");
              }
           });
           res.setHeader("Content-type","application/json; charset=UTF-8");
           let json = JSON.stringify(results);
           console.log(json);
           res.end(json);
	});
    });
    
    app.get("/Product/id=:id", (req,res) => {
	let id = req.params.id;
	console.log("Dans /Product/id="+id);
        if (/[0-9a-f]{24}/.test(id))
            db.collection("Products").find({"_id": ObjectId(id)}).toArray(function(err, documents) {
	       let json = JSON.stringify({});
	       if ( documents !== undefined && documents[0] !== undefined )
		    json = JSON.stringify(documents[0]);
               console.log("     "+json);
               res.end(json);
	    });
        else res.end(JSON.stringify({}));
    });
    


/* ---------- CART MANAGEMENT -------------------------------------------------------- */    
    
    app.get("/CartProducts/productIds/email=:email", (req,res) => {
	let email = req.params.email;
        db.collection("Carts").find({"email":email}).toArray(function(err, documents) {
           if ( documents !== undefined && documents[0] !== undefined ) {	    
	      let order = documents[0].order;
              res.setHeader("Content-type","application/json; charset=UTF-8");
              let json=JSON.stringify(order);
              console.log(json);
              res.end(json);
	   }
	});
    });

    app.get("/CartProducts/products/email=:email", (req,res) => {
	let email = req.params.email;
	console.log("Dans /CartProducts/products/email="+email);
        let pipeline = [
           { $match: {"email": email}},
           { $unwind: "$order" },
           { $lookup: { from: "Products",
                        localField: "order",
                        foreignField: "_id",
                        as: "product" }},
           { $unwind: "$product" },
           { $group: {"_id": "$_id",
                      "order": { "$push": "$order" },
                      "products": { "$push": "$product" }
                     }
           }
        ];
 // [{ $match: {"email": "pompidor@lirmm.fr"}},{ $unwind: "$order" },{ $lookup: { from: "Products", localField: "order", foreignField: "_id", as: "product" }}, { $unwind: "$product" }, { $group: {"_id": "$_id", "order": { "$push": "$order" }, "products": { "$push": "$product" }}}]
	
        db.collection("Carts").aggregate(pipeline).toArray(function(err, documents) {
            let json;
            if ( documents !== undefined && documents[0] !== undefined ) {
	       let productsInE = documents[0].products;
               let productsInI = {};
	       for (let product of productsInE) {
                  if (product._id in productsInI) {
                      productsInI[product._id].nb++;                    
                  }
		  else {
                      productsInI[product._id] = {"_id": product._id, "type": product.type, "brand": product.brand, "name": product.name,
						  "popularity": product.popularity, "price": product.price, "nb": 1};
		  }
               }
               let productList = [];
 	       for (let productId in productsInI) {
                   productList.push(productsInI[productId]);
               }
               json=JSON.stringify(productList);
            }
            else json=JSON.stringify([]);
            res.setHeader("Content-type","application/json; charset=UTF-8");
            console.log("     "+json);
            res.end(json);
	});	
    });

    app.post("/CartProducts", (req,res) => {
        console.log("post avec /CartProducts"); console.dir(req.body);
 	let email = req.body.email;
	let productId = req.body.productId;
	console.log("Dans CartProducts/productId="+productId+"/email="+email+" (post)");
        db.collection("Carts").find({"email":email}).toArray(function(err, documents) {
           let json;
           if ( documents !== undefined && documents[0] !== undefined ) {	    
               let order = documents[0].order;
               order.push(ObjectId(productId));
               console.log("Ajout d'un produit du panier avec order="+order);
               db.collection("Carts").update({"email":email}, {$set: {"order": order}});
               json = JSON.stringify(order);
           }
           else json = JSON.stringify([]);
           res.setHeader("Content-type","application/json; charset=UTF-8");
           res.end(json);	    
        });
    });

    app.delete("/CartProducts/productId=:productId/email=:email", (req,res) => {
	let email = req.params.email;
	let productId = req.params.productId;
        console.log("Dans CartProducts/productId="+productId+"/email="+email+" (delete)");
        db.collection("Carts").find({"email":email}).toArray(function(err, documents) {
           let json = [];
           if ( documents !== undefined && documents[0] !== undefined ) {	    
               let order = documents[0].order;
               let position = order.map(function(e) { return e.toString(); }).indexOf(productId);
	       if (position != -1) {
                  console.log("position="+position);
		  order.splice(position, 1);
                  console.log("Suppression d'un produit du panier avec order="+order);
                  db.collection("Carts").update({"email":email}, {$set: {"order": order}});
                  json = order;
	       }
           }
           res.setHeader("Content-type","application/json; charset=UTF-8");
           res.end(JSON.stringify(json));	    
        });
    });

    app.get("/Cart/reset/email=:email", (req,res) => {
	let email = req.params.email;
        console.log("Dans Cart/reset/email="+email);
        db.collection("Carts").update({"email":email}, {$set: {order: []}});
        res.setHeader("Content-type","application/json; charset=UTF-8");
        res.end("Cart reset done");
    });    

    
    /* ---------- AUTHENTIFICATION -------------------------------------------------------- */

    app.get("/auth/login=:login/password=:password", (req, res) => {
	let login = req.params.login;
	let password = req.params.password;
	console.log("Demande d'authentification avec login="+login+" et password="+password);
        db.collection("Users").find({"email":login, "password":password})
	  .toArray(function(err, documents) {
	    res.setHeader("Content-type","application/json; charset=UTF-8");
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
    
});
