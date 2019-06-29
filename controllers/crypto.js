
const bcrypt = require('bcryptjs');

exports.compare_passwords = function(hash, password){
    return bcrypt.compareSync(password, hash);
}

exports.crypt_passwords = function( password ){
    return bcrypt.hashSync(password, 10);
}