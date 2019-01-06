const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var endorserSchema = mongoose.Schema({
        type: String,
        first:  String,
        last: String,
        location: String,
        email: String,
        organization: String,
        position: String,
        about: String,
        password: String,
        passwordConfirm: String
});

var Endorser = module.statics = module.exports = mongoose.model('Endorser', endorserSchema);

module.statics.emailVeri = function(email) {
    var Endorser = this;
    return Endorser.findOne({email}).then((user) => {
        if(user) {
            return Promise.reject();
        }
    })
};


module.statics.findByCredentials = function(email, password) {
    var Endorser = this;
    return Endorser.findOne({email: email}).then((user) => {
        console.log(user);
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                console.log(res);
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        })
    });

}

module.exports.getUserById = function(username, callback) {
var query = {username: username};
Endorser.findOne(query, callback);
};

