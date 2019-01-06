const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require("../db/keys.js");
const User = require('./../model/user-model');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    //options for the strategy
    callbackURL: "/auth/google/redirect",
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.find({googleId: profile.id}).then((currentUser) => {
        if(currentUser) {
            console.log('user exists');
            done(null, currentUser);
        } else {
            new User({
                username: profile.displayName,
                googleId: profile.id
            }).save().then((newUser) => {
                console.log("new user", newUser);
                done(null, newUser);
            });
        }
    })
})
);