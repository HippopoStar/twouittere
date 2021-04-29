mongoimport --db OnlineSales --collection Users --file /var/lib/mongodb/listeClients.json --jsonArray --drop
mongoimport --db OnlineSales --collection Products --file /var/lib/mongodb/listeProduits.json --jsonArray --drop
mongoimport --db OnlineSales --collection Carts --file /var/lib/mongodb/listePaniers.json --jsonArray --drop

