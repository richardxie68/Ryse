const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


var seekerSchema = mongoose.Schema({
        type: String,
        username: String,
        first: String,
        last: String,
        email: String,
        location: String,
        phone: String,
        skills: String,
        q1: String,
        q2: String,
        q3: String,
        q4: String,
        q5: String,
        q6: String,
        q7: String,
        q8: String,
        q9: String,
        q10: String,
        endorsements: Array,
        password: String,
        passwordConfirm: String
});

var Seeker = module.statics = module.exports = mongoose.model('Seeker', seekerSchema);

module.statics.emailVeri = function(email) {
    var Seeker = this;
    return Seeker.findOne({email}).then((user) => {
        if(user) {
            return Promise.reject();
        }
    })
};


module.statics.findByCredentials = function(email, password) {
    var Seeker = this;
    return Seeker.findOne({email: email}).then((user) => {
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
Seeker.findOne(query, callback);
};

