var express = require("express.io");
var app = express();
app.http().io()

app.engine('ejs', require('ejs').__express);

app.use(express.static(__dirname + '/public'));
app.use(express.compress());
app.use(require('express-minify')());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.get("/", function (req, res)
{
	res.render("index",
	{
		title: "Cheating Website"
	});
});

app.listen(3535);
console.log("LISTENING TO PORT 3535");