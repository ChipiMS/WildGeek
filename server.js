// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var mongojs = require('mongojs');            // mongojs for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var db=mongojs("localhost",["Users"]);

// routes ======================================================================
	// api ---------------------------------------------------------------------
	//create a comment
	//create a user
	app.post('/api/users', function(req, res) {
		db.Users.save({
			name: req.body.name+req.body.second,
			password: req.body.password,
			email: req.body.email,
			children: [],
		}, function(err, user) {
			if(err)
				res.send(err);
			res.json(user);
		});
	});
	//edit a user
	app.post('/api/user',function(req, res){
		db.Users.findAndModify({
			query: {email: req.body.email},
			update: {$set: {children: req.body.children}},
		},function (err,user){
			if(err)
				res.send(err);
			res.json(user);
		})
	});
	//login
	app.get('/api/users', function(req, res) {
		db.Users.findOne({email: req.body.email,password: req.body.password},function(err,users) {
			if(err)
				res.send(err);
			res.json(users);
		});
	});

// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");