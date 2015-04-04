var restify = require("restify"); 
var mongodb = require("mongodb");
var fs 		= require("fs");

var mongoClient = mongodb.MongoClient;
var server = restify.createServer({
    name: "Airports"
});
server.use(restify.queryParser());

var host = "mongodb://pilot:aF2ChIOiQD@ds039351.mongolab.com:39351/airports";
//var host = "mongodb://localhost:27017";

mongoClient.connect(host, function(err, db) {

	if(err) throw err;
	var airportsCol = db.collection("airports");

	// home
	server.get("/", function(req, res, next) {
		fs.readFile("/var/www/airports/index.html", "utf8", function (err, body) {
			if (err) throw err;
			  
			// set up header
			res.writeHead(200, {
				"Content-Length": Buffer.byteLength(body),
				"Content-Type"	: "text/html"
			});

			// spit out html
			res.write(body);
			res.end();
			return;
		});
	});

	// closest
	server.get("/closest", function (req, res, next) {

	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	    res.header("Access-Control-Allow-Headers", "X-Requested-With");

		var latitude = parseFloat(req.query.lat);
		var longitude = parseFloat(req.query.lon);
		var location = [latitude, longitude];

	    // find closest airport
	    airportsCol.find({
	    	"Coordinate": {"$near": location}
	    }, {"limit": 30}).toArray(function(err, airports) {

		    db.close();
		    res.send(airports);
	    });
	});

	server.listen(5000, function() {
	    console.log('%s listening at %s, love & peace', server.name, server.url);
	});
});