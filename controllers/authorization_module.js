const jwt = require("jsonwebtoken");
const db = require("../db/user_schema");
const crypto = require("./crypto");
const secretKey = require("./key").secretKey;

exports.login_user = function (req, res) {
  //console.log("\n REQ query: ", req.query, "\n#######END############");
  let data = {
    u_name: req.body.username,
    u_pass: req.body.password
  };
  if( !data.u_pass ){
    res.render('error', { type: "Authorization error", message: 'Wrong password...', linkUrl: '/', linkLbl: 'Log in'});
  }

  db.find({ "u_name": data.u_name }).exec((err, results) => {
    if (results.length) {
      if (crypto.compare_passwords(results[0].u_pass, data.u_pass)) {
        results[0].lastseen = Date.now();
        db.updateOne({ u_id: results[0].u_id }, { lastseen: Date.now() }).exec((err, update) => {
          if (!err) {
            const token = jwt.sign({
              u_name: results[0].u_name,
              u_id: results[0].u_id,
              u_role: results[0].u_role,
              lastseen: results[0].lastseen,
            }, secretKey, { expiresIn: 3600 });
            console.log("Create new token: ", token);

            if (results[0].u_role) {
              res.cookie('token', token, { maxAge: 600000, httpOnly: true });
              res.redirect("/admin");
            } else {
              res.cookie('token', token, { maxAge: 600000, httpOnly: true });
              res.redirect("/info");
              //res.set('x-access-token', token).render("info", { username: results[0].u_name, userrole: results[0].u_role, usertoken: token, userid: results[0].u_id });
            }
          } else {
            res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
          }
        });
      } else {
        res.render('error', { type: "Authorization error", message: 'Wrong password...', linkUrl: '/', linkLbl: 'Log in'});
      }
    } else {
      res.render('error', { type: "Authorization error", message: 'Unregistered user...', linkUrl: '/', linkLbl: 'Log in'});
    }

  });
}

exports.update_cookie = (req, res) => {
  this.decode_token_from_cookie(req.cookies, (payload) => {
    if(payload.success){
      db.find({u_id: payload.decoded.u_id}).exec((err, results) => {
        if(err){
          res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
        } else {
          const token = jwt.sign({
            u_name: results[0].u_name,
            u_id: results[0].u_id,
            u_role: results[0].u_role,
            lastseen: results[0].lastseen,
          }, secretKey, { expiresIn: 3600 });
          res.cookie('token', token, {maxAge: 600000, httpOnly: true});

          if(results[0].u_role){
            res.redirect('/admin');
          } else {
            res.redirect('/info');
          }
        }
      });
    } else {
      res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
    }
  });
}

exports.decode_token_from_cookie = (cookies, cb) => {
  console.log("Trying decode token.....");
  //let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['x-Authorization'];
  let token = cookies['token'];
  console.log("Getting token from client: ", token);
  let response = {
    token,
    success: true,
    message: ''
  };

  if (token) {

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
      response.token = token;
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        response.success = false;
        response.message = 'Token is not valid';
        cb( response );
      } else {
        response.decoded = decoded;
        cb( response );
      }
    });
  } else {
    response.success = false;
    response.message = 'Auth token is not supplied';
    cb( response );
  }

};

exports.logout_user = (req, res) => {
  this.decode_token_from_cookie(req.cookies, (payload) => {
    if(payload.success){
      payload.decoded.lastseen = Date.now();
      db.updateOne({u_id: payload.decoded.u_id}, payload.decoded).exec((err, result) => {
        if(err){
          res.render('error', { type: "DB error", message: err.message, linkUrl: '/', linkLbl: 'Log in'});
        } else {
          return;
        }
      });
    } else {
      res.render('error', { type: "DB error", message: payload.message, linkUrl: '/', linkLbl: 'Log in'});
    }
  });


  res.clearCookie('token').redirect("/");
}