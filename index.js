var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var request = require('request')
var db = require('./models');
var passport = require('./config/ppConfig');
var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var fs = require('fs');
var app = express();
var lastSearch;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.alerts = req.flash();
	next();
});


app.get('/', function(req, res) {
	res.render('main/index');
});


app.get('/raw', function(req, res) {
	var qs = {
		query: 'pirate',
		key: 'DRyeXAnXJz',
		format: 'json',
		type: 'S'
	};

	request({
		url: 'https://rebrickable.com/api/search?',
		qs: qs
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var dataObj = JSON.parse(body);
			res.send(dataObj);

		}
	});
});

app.get('/results', function(req, res) {
	var searchTerm = req.query.searchTerm;
	if (!searchTerm) {
		searchTerm = lastSearch;
	} else {
		lastSearch = searchTerm;
	};
	var qs = {
		query: searchTerm,
		key: 'DRyeXAnXJz',
		format: 'json',
		type: 'S'
	};

	request({
		url: 'https://rebrickable.com/api/search?',
		qs: qs
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var dataObj = JSON.parse(body);
			res.render("main/results", {
				results: dataObj.results,
				searchTerm: searchTerm
			});
		}
	});
});

app.get('/stuff', function(req, res) {

	var fileContents = fs.readFileSync('./data.json');
	var dataObj = JSON.parse(fileContents);
	res.render("main/stuff", {
		results: dataObj.results,
		searchTerm: "pirates"
	});
});

app.get('/profiled', function(req, res) {

	var fileContents = fs.readFileSync('./data.json');
	var dataObj = JSON.parse(fileContents);
	res.render("main/profiled", {
		results: dataObj.results,
		searchTerm: "pirates"
	});
});

app.get('/details/:id', function(req, res) {
	var qs = {
		set_id: req.params.id,
		key: 'DRyeXAnXJz',
		format: 'json',
		type: 'S'
	}
	request({
		url: 'https://rebrickable.com/api/get_set?',
		qs: qs
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var dataObj = JSON.parse(body);
			console.log(dataObj);
			res.render("main/details", {
				details: dataObj
			});
		}
	});
});

// app.post('list/own', function(req,res){
//   db.user.findOne({where: {id: req.body.user}}).then(function(user){
//       user.createSet({
//         setnum: req.body.setnum,
//         setname: req.body.setname
//       }).then(function(post){
//         console.log(post.get());
//         res.flash("Added to Owned Sets");
//       });
//   })
// });

app.post('list/want', function(req, res) {
	db.user.findOne({
		where: {
			id: req.body.user
		}
	}).then(function(user) {
		user.createSet({
			setnum: req.body.id,
			setname: req.body.name
		}).then(function(post) {
			console.log(post.get());
			res.flash("Added to Wishlist");
		});
	})
});

app.get('/profile', isLoggedIn, function(req, res) {
	db.user.findAll().then(function(users) {
		res.render("main/profile");
	});
});
// app.get('/parts', function(req, res) {
// 	var qs = {
// 		set: '40158-1',
// 		key: 'DRyeXAnXJz',
// 		format: 'json',
// 	}
// 	request({
// 		url: 'https://rebrickable.com/api/get_set_parts?',
// 		qs: qs
// 	}, function(error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			var dataObj = JSON.parse(body);
// 			console.log(dataObj);
// res.render("main/parts", {
// 				partsData: dataObj.parts
// 			});
// 					}
// 	});
// });


app.use('/auth', require('./controllers/auth'));


var server = app.listen(process.env.PORT || 3000);

module.exports = server;