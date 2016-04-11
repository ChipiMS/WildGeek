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
	// get all users
	app.get('/api/users', function(req, res) {
		db.Users.find(function(err,users) {
			if(err)
				res.send(err);
			res.json(users);
		});
	});
	//create a comment
	app.post('/api/comments', function(req, res){
		db.Users.findAndModify({
			query: {name: req.body.name},
			update: {$set: {comments: req.body.comments}},
		},function (err,doc){
			if(err)
				res.send(err);
			db.Users.find(function(err,users){
				if(err)
					res.send(err);
				res.json(users);
			});
		})
	});
	//create a user
	app.post('/api/users', function(req, res) {
		db.Users.save({
			name: req.body.name,
			password: req.body.password,
			projects: [],
			about: "",
			comments: [],
		}, function(err, user) {
			if(err)
				res.send(err);
			db.Users.find(function(err,users) {
				if (err)
					res.send(err)
				res.json(users);
			});
		});
	});
	//edit a user
	app.post('/api/user',function(req, res){
		db.Users.findAndModify({
			query: {name: req.body.name},
			update: {$set: {projects: req.body.editProjects,about: req.body.editAbout}},
		},function (err,doc){
			if(err)
				res.send(err);
			db.Users.find(function(err,users){
				if(err)
					res.send(err);
				res.json(users);
			});
		})
	});
	// delete a user
	app.delete('/api/users/:user', function(req, res) {
		db.Users.remove({
			name: req.params.user
		}, function(err,user) {
			if (err)
				res.send(err);
			db.Users.find(function(err,users){
				if(err)
					res.send(err)
				res.json(users);
			});
		});
	});

// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");