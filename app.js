var express = require("express.io");
var fs = require("fs");
var app = express();
var busboy = require('connect-busboy');
app.http().io()

app.engine('ejs', require('ejs').__express); // use ejs

app.use(express.compress()); // send as "zip"
app.use(express.static(__dirname + '/public')); // use public/ as public folder
app.use(express.cookieParser()); // used for sessions
app.use(express.session({secret: 'this is super gay lol horse penis'})); // add your session secret
app.use(busboy());

app.set('views', __dirname + '/views'); // set website folder
app.set('view engine', 'ejs'); // set default file extension



app.get("/", function (req, res) // GET /
{
	var isauth = false;
	if(req.session.isauth) isauth = true;
	res.render("index",
	{
		title: "Cheating Website",
		auth: isauth
	});
});

app.get("/auth/:secret", function (req, res) // GET /auth/secret
{
	if(req.params.secret == "dat-admin-pw") // insert your custom admin password (not your real password) here
	{
		req.session.isauth = true; // Set session as admin
	}
	res.redirect("/"); // Redirect to normal site
});

app.post("/upload", function (req, res)
{
	if (req.session.isauth)
	{
		var fstream;
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename)
		{
			console.log("Uploading: " + filename);
			fstream = fs.createWriteStream(__dirname + '/public/files/' + filename);
			file.pipe(fstream);
			fstream.on('close', function ()
			{
				res.redirect('/');
				app.io.broadcast("file", { link: "/files/" + filename, name: filename });
			});
		});
	}
	else
		res.redirect("/");
});

app.io.route('chat', { // Real-Time file & message transfer
	sendmsg: function (req)
	{
		if (req.session.isauth)
			app.io.broadcast("chat", { admin: true, msg: req.data });
		else
			app.io.broadcast("chat", { admin: false, msg: req.data });
	},
	getfiles: function (req)
	{
		fs.readdir(__dirname + "/public/files/", function (err, files)
		{
			if (err)
			{
				req.io.emit("chat", { admin: true, msg: "Couldn't get files :(" });
				console.log(err);
			} else
			{
				for (var i = 0; i < files.length; i++)
					req.io.emit("file", { link: "/files/" + files[i], name: files[i] });
			}
		});
	}
});

var port = 80;
app.listen(port);
console.log("LISTENING TO PORT " + port);