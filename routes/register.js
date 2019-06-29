const db = require("../db/user_schema");
const crypto = require("../controllers/crypto");
const authorization = require("../controllers/authorization_module");

module.exports = function (app) {
    app.get('/register', function (req, res) {
        res.render("register");
    });

    app.post('/register', function (req, res) {
        let data = {
            u_name: req.body.username,
            u_pass: req.body.password,
            u_id: NaN,
            u_role: false,
            lastseen: Date.now()
        };

        if( !data.u_pass || !data.u_name ){
            res.render('error', { type: "Authorization error", message: "Please fill correctly all fields...", linkUrl: '/register', linkLbl: 'Register'});
        }

        if (data.u_name && data.u_pass) {
            db.find({}).sort({ u_id: -1 }).limit(1).exec((err, results) => {
                if (!err) {
                    if (results.length > 0) {
                        data.u_id = results[0].u_id + 1;
                        data.u_role = false;
                    } else {
                        data.u_id = 1;
                        data.u_role = true;
                    }

                    console.log("Creating new user: ", data);
                    data.u_pass = crypto.crypt_passwords(data.u_pass);

                    db.create(data, (err) => {
                        if (err) {
                            console.log("Creation error: ", err);
                            res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
                        } else {
                            authorization.login_user(req, res);
                        }
                    })
                } else {
                    res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
                }
            });
        }
    });
}