const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer(); //?? what does this do

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({extended: true })); 
router.use(upload.array());

// database
const dbUrl = 'mongodb://localhost/expressDemo';
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

let userSchema = mongoose.Schema({
	id: Number,
	name: String,
	handle: String
});

let User = mongoose.model("user", userSchema);

// Page: User List
router.get('/', function(req, res){

	User.find(function (err, userList) {
		if (err) { return console.error(err); }
		res.render('users/get', {pageClass : "userList", userData : userList}); 
	});
});

// Page: User by id || Edit User by id
router.get('/:id([0-9]+):edit(/edit)?', function(req, res){

	let userId = parseInt(req.params.id);
	let isEdit = req.params.edit;

	User.findOne({ id: userId}, function (err, user) {
		if (err) { return console.error(err); }

		let buttonText = "Update";
		let data = {
			pageClass : "userDetail", 
			userData : user,
			buttonText: buttonText,
			pageType: "edit"
		};
		let pageUrl = (isEdit === undefined) ? "users/get_id" : "users/get_id_edit";

		res.render(pageUrl, data);
	});

});

// Page: New User
router.get('/new', function(req, res){

	let userId = 0;

	let buttonText = "Create";
	let user = {
		id: 0,
		name: "",
		handle: ""
	}
	let data = {
		pageClass : "userDetail", 
		userData : user, 
		buttonText: buttonText,
		pageType: "new"
	};
	let pageUrl = "users/get_id_edit";

	res.render(pageUrl, data);

});

// Action: New user
router.post('/new', function(req, res) {

	// validate
	let issues = validateUserData(req);

	if (issues.length > 0) {
		res.end(JSON.stringify(Rxx.Validation(issues)));//, "Please correct the issues to continue")));
		return;
	}

	let newUser = new User();

	// Find max id number to increment
	User.findOne({}, function(err, data) {
		let newUser = new User();
		newUser.id = data.id + 1;
		newUser.name = req.body.name;
		newUser.handle = req.body.handle;
		newUser.save(function(err, data) {
			if (err) {
				console.log(err);
			}
			else {
				res.end(JSON.stringify(Rxx.Redirect("/users", 1.5, "User Created")));
			}
		});
	}).sort({"id":-1});
});

// Action: Update User
router.post('/:id([0-9]+)/edit', function(req, res){

	// validate
	let issues = validateUserData(req);

	if (issues.length > 0) {
		res.end(JSON.stringify(Rxx.Validation(issues)));//, "Please correct the issues to continue")));
		return;
	}

	let userId = parseInt(req.params.id);

	let userData = {
		name: req.body.name, 
		handle: req.body.handle
	};
	User.update({id: userId}, userData, function(err, data) {
		if (err) {
			console.log(err);
		}
		else {
			res.end(JSON.stringify(Rxx.Redirect("/users/" + userId, 1.5, "User Updated")));
		}
	});
});

// Action: Delete User
router.post('/delete', function(req, res){
	let userId = parseInt(req.body.id);
	console.log("/delete received from js");
	User.deleteOne({id : userId}, function(err, obj) {
		if (err) {
			console.log(err);
		}
		else {
			res.end(JSON.stringify(Rxx.Redirect("/users", 1.5, "User Deleted")));
		}
  	});
});

router.get('/getComponent', function(req, res) {
	res.end("<div><img src='http://lorempixel.com/400/200/' /></div>");
});

///////////////////////////////// HELPER FUNCTIONS //////////////////////
function validateUserData(req) {
	
	var issues = [];
	if (!req.body.name || req.body.name.length === 0) {
		issues.push({id: "name", message: "Required"});
	}
	if (!req.body.handle || req.body.handle.length === 0) {
		issues.push({id: "handle", message: "Required"});
	}
	return issues;
}

function goToUsers(res, optionalUserId) {
	if (optionalUserId) {
		res.redirect("/users/" + optionalUserId);
	}
	else {
		res.redirect("/users");
	}
}

// pre-defined response object
class Rxx {
	constructor(type, data) {
		this.version = "Rxx-v1";
		this.type = type;
		this.data = data;
	}
	static Error(code, data, message) {
		let error = new Rxx("error", data);
		error.code = code;
		error.message = message;
		return error;
	}
	static Validation(data, message) {
		let validation = new Rxx("validation", data);
		if (message) { validation.message = message };
		return validation;
	}
	static Redirect(url, pause, message, messageType) {
		let redirect = new Rxx("redirect", url);
		(pause) ? redirect.pause = pause : redirect.pause = 1;
		if (message) { redirect.message = message };
		if (messageType) { redirect.messageType = messageType };
		return redirect;
	}
}

//export this router to use in our index.js
module.exports = router;