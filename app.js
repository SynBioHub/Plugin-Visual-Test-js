const express = require('express')
const fs = require('fs');
const app = express();
const http = require('http');
const https = require('https');
const port = 5000

app.use(express.json());

app.get('/Status', function (req, res) {
	res.status(200).send('The test visualisation plugin is up and running')
})

app.post('/Evaluate', function (req, res) {
	var data =  JSON.stringify(req.body)
	var rdf_type = req.body.type.toString()
	
	////////REPLACE THIS SECTION WITH OWN RUN CODE ////////////
	acceptable = true
	//////////////////END SECTION//////////////////////////////
	
	if (acceptable) {
		res.status(200).send(`The type sent (${rdf_type}) is an accepted type`);
	} else {
		res.status(415).send(`The type sent (${rdf_type}) is NOT an accepted type`);
	};
})

app.post('/Run', async function (req, res) {
	//make all of the data accessible as a string
	var data =  JSON.stringify(req.body)
	
	//pull out specific key value pairs
	var url = req.body.complete_sbol.toString()
	var url = url.replace("/sbol","");
	var instance = req.body.instanceUrl.toString()
	var uri = req.body.top_level.toString()
	var token = (typeof req.body.token === 'undefined' || req.body.token === null) ? undefined : req.body.token.toString()
	

	var tokenVal = (typeof token === 'undefined' || token === null) ? 'null' : token;
		var headers = { 'Accept': 'text/plain' };
		if (tokenVal !== 'null') {
			headers['X-authorization'] = tokenVal;
		}

		var responseStatusCode = 'ERROR';
		if (typeof fetch === 'function') {
			var response = await fetch(url, { method: 'GET', headers: headers });
			responseStatusCode = response.status;
		} else {
			// Fallback for older Node: use http/https without changing control flow elsewhere.
			responseStatusCode = await new Promise(function(resolve) {
				var client = url.startsWith('https://') ? https : http;
				var req2 = client.get(url, { headers: headers }, function(r) {
					r.on('data', function(){});
					r.on('end', function(){ resolve(r.statusCode); });
				});
				req2.on('error', function(){ resolve('ERROR'); });
			});
		}
	
	//read in html and substitute in the values extracted from the request above
	fs.readFile('Test.html', function(err, data) {
		var html_read = data.toString()
		html_read = html_read.replace("INSTANCE_REPLACE", instance);
		html_read = html_read.replace("URI_REPLACE", uri);
		html_read = html_read.replace("URL_REPLACE", url);
		html_read = html_read.replace("TOKEN_REPLACE", tokenVal);
		html_read = html_read.replace("REQUEST_REPLACE", JSON.stringify(req.body));
		html_read = html_read.replace("RESPONSE_CODE_REPLACE", String(responseStatusCode));
		
		//return html
		res.send(html_read)
	});
})

app.listen(port, () => console.log(`Test Visualisation app is listening at http://localhost:${port}`))
