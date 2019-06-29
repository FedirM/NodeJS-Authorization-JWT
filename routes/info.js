const authorization = require('../controllers/authorization_module');

module.exports = function(app){
    app.get("/info", (req, res) => {
        authorization.decode_token_from_cookie(req.cookies, (payload) => {
            if( payload.success ){
                console.log("Req decoded:", payload.decoded);
                let obj = {
                    u_name: payload.decoded.u_name,
                    u_role: payload.decoded.u_role,
                    u_id: payload.decoded.u_id,
                    lastseen: payload.decoded.lastseen
                };
                res.render("info", obj);
            } else {
                res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
            }
        });
    });
}