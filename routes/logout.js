const authorization = require("../controllers/authorization_module");

module.exports = function(app){
    app.get('/logout', (req, res) => {
        authorization.logout_user(req, res);
    });
}