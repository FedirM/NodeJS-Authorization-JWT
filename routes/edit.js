const db = require("../db/user_schema");
const crypto = require("../controllers/crypto");
const authorization = require("../controllers/authorization_module");
const jwt = require("jwt-express");

module.exports = function(app){
    app.get('/edit', function( req, res ){
        authorization.decode_token_from_cookie(req.cookies, (payload) => {
            if( payload.success ){
                let obj = {
                    u_name: payload.decoded.u_name,
                    u_role: payload.decoded.u_role
                };
                res.render("edit", obj);
            } else {
                res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
            }
        });
    });

    app.post('/edit', function (req, res) {
        console.log("Curr url: /edit");
        authorization.decode_token_from_cookie(req.cookies, ( payload ) => {
            if( payload.success ){
                let data = {
                    u_name: req.body.username,
                    u_pass: req.body.password
                };

                console.log(" Edit obj: ", data);

                if( data.u_name && data.u_pass ){
                    data.u_pass = crypto.crypt_passwords(data.u_pass);
                    db.updateOne({u_name: data.u_name}, data, (err, result) => {
                        if( err ){
                            console.log("Update error: ", err.message);
                            res.status(405).send("DB error occured: " + err.message);
                        } else{
                            if( payload.decoded.u_role ){
                                res.redirect("/admin");
                            } else {
                                res.redirect("/info");
                            }
                        }
                    });
                }
            } else {
                res.json({message: payload.message});
            }
        });
    });
};