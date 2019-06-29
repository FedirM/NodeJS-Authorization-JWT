const db = require("../db/user_schema");
const crypto = require("../controllers/crypto");
const authorization = require("../controllers/authorization_module");

module.exports = function(app){
    app.get("/admin", function(req, res){
        authorization.decode_token_from_cookie(req.cookies, (payload) => {
            if( payload.success ){
                db.find({}).exec((err, usersData) => {
                    if(err){
                        res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
                    } else {
                        res.render("admin", {usersData, u_name: payload.decoded.u_name, u_role: payload.decoded.u_role});
                    }                    
                });
            } else {
                res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
            }
        });
    });

    app.get('/admin/edit/:id', function( req, res ){
        console.log(" ADMIN EDIT userid: ", req.params);
        authorization.decode_token_from_cookie(req.cookies, (payload) => {
            if( payload.success ){
                db.find({u_id: req.params.id}).exec((err, result) => {
                    if(err){
                        res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
                    } else {
                        let obj = {
                            u_name: result[0].u_name,
                            u_role: result[0].u_role
                        };
                        res.render("admin_edit", obj);
                    }
                });
            } else {
                res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
            }            
        });
    });

    app.get('/admin/view/:id', function( req, res ){
        authorization.decode_token_from_cookie(req.cookies, (payload) => {
            if( payload.success ){
                db.find({u_id: req.params.id}).exec((err, result) => {
                    if(err){
                        res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
                    } else {
                        let obj = {
                            u_name: result[0].u_name,
                            u_role: result[0].u_role,
                            lastseen: result[0].lastseen,
                            u_id: result[0].u_id
                        };
                        res.render("admin_view", obj);
                    }
                });
            } else {
                res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
            }            
        });
    });

    app.post('/admin/edit', function( req, res ){
        authorization.decode_token_from_cookie(req.cookies, ( payload ) => {
            if( payload.success ){
                let data = {
                    u_name: req.body.username,
                    u_pass: req.body.password,
                    u_role: false,
                };
            
                if( 'isAdmin' in req.body ){
                    data.u_role = true;
                }

                console.log("Update obj: ", data);
        
                if( data.u_name && data.u_pass ){
                    data.u_pass = crypto.crypt_passwords(data.u_pass);
                    db.updateOne({u_name: data.u_name}, data, (err, result) => {
                        if( err ){
                            res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
                        } else{
                            req.body.username = payload.decoded.u_name;
                            req.body.password = payload.decoded.u_pass;
                            authorization.update_cookie( req, res );
                        }
                    });
                }
            } else {
                res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
            }
        });
    });
}