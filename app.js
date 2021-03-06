const express = require('express')
const fs = require('fs');
const app = express();
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

app.post('/Run', function (req, res) {
	//make all of the data accessible as a string
	var data =  JSON.stringify(req.body)
	
	//pull out specific key value pairs
	var url = req.body.complete_sbol.toString()
	var url = url.replace("/sbol","");
	var instance = req.body.instanceUrl.toString()
	var uri = req.body.top_level.toString()
	
	//read in html and substitute in the values extracted from the request above
	fs.readFile('Test.html', function(err, data) {
		var html_read = data.toString()
		html_read = html_read.replace("INSTANCE_REPLACE", instance);
		html_read = html_read.replace("URI_REPLACE", uri);
		html_read = html_read.replace("URL_REPLACE", url);
		html_read = html_read.replace("REQUEST_REPLACE", JSON.stringify(req.body));
		
		//return html
		res.send(html_read)
	});
})

app.listen(port, () => console.log(`Test Visualisation app is listening at http://localhost:${port}`))
