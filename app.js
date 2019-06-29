
const express = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

// const urlencodedParser = parser.json();
app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    console.log("Curr path: /");
    res.redirect("/login");
});

require("./routes/login")(app);
require("./routes/register")(app);
require("./routes/logout")(app);
require("./routes/edit")(app);
require("./routes/admin")(app);
require("./routes/info")(app);


app.listen(3000, () => { console.log(" Listening port 3000... ") });