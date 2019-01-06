const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var recruiterSchema = mongoose.Schema({
        type: String,
        first:  String,
        last: String,
        company: String,
        location: String,
        positions: String,
        website: String,
        about: String,
        email: String,
        res: String,
        req: String,
        password: String,
        passwordConfirm: String
});

var Recruiter = module.statics = module.exports = mongoose.model('recruiter', recruiterSchema);

module.statics.emailVeri = function(email) {
    var Recruiter = this;
    return Recruiter.findOne({email}).then((user) => {
        if(user) {
            return Promise.reject();
        }
    })
};


module.statics.findByCredentials = function(email, password) {
    var Recruiter = this;
    return Recruiter.findOne({email: email}).then((user) => {
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
Recruiter.findOne(query, callback);
};

