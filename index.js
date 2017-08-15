const express = require("express");
const fs = require('fs');
const send = require('send');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();

// setup template engine
app.set('view engine', 'pug');
app.set('views','./views');
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array()); 
// make the /public folder accessible
app.use("/public", express.static(path.join(__dirname, "public")));

// setup modules
app.use('/users', require('./users.js'));

app.get('/', function(req, res){
	let data = {
		pageClass: 'home',
		name:'Home'
	};
	res.render('root/get', data); 

});

//Other routes here
app.get('*', function(req, res){
	res.send('Sorry, this is an invalid URL.');
});

var server = app.listen(8081, function(){
	let host = server.address().address
	let port = server.address().port

	console.log("Server running at http://%s:%s", host, port);
});