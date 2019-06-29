const authorization = require("../controllers/authorization_module");

module.exports = function(app){
    app.get('/login', (req, res) => {
        res.render("login");
    });

    app.post('/login', authorization.login_user);
};