var express	= require('express');
var app = express();

app.get('/', (request, response) => {
	response.setHeader('ContentType', 'text/plain');
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.end('Bonjour de Node.js');
});

app.listen(3000);

