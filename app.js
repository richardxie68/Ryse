const express = require('express');
const profileRoutes = require('./routes/profile-routes');
const authRoutes = require('./routes/signup-routes');
const keys = require('./db/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const User = require('./model/user-recruiter.model');
const bodyParser = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;
const Recruiter = require('./model/user-recruiter.model');
const Endorser = require('./model/user-endorser.model');
const Seeker = require('./model/user-seeker.model');


//express app
const app = express();

//body-parser stuff
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//deploy 
const port = process.env.PORT || 3000;

//cookie session
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.cookie.session]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set up view engine
app.set('view engine', 'hbs');

//getting statics
app.use("/Assets", express.static(__dirname + '/Assets'));
app.use('/views', express.static(__dirname + '/views'));

//setup routes
app.use('/profile', profileRoutes);
app.use('/signup', authRoutes);

//route to first page
app.get('/', (req, res) => {
    res.render("landing");
});

//login page route
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/why-hire-from-us', (req, res) => {
    res.render('whyhire');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// app.get('/profile', (req, res) => {
//     res.render('profile', {
//         email: req.body.email,
//         firstName: req.user.firstName,
//         lastName: req.user.lastName
//     }); 
// });

//serialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


//deserialize 
passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});


var inputCheck = function(req, res, next) {
    if(req.body.email === "") {
        return res.render('login', {
            error: "Please enter a valid email."
        })
    } else if (req.body.password === "") {
        return res.render('login', {
            error: "Please enter a valid password."
        })
    }
    next();
};

var accountCheck = function(req, res, next) {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        if (user) {
           next();
        }
    }).catch(() => {
        return res.render('login', {
            error: "Account not found."
        })
    });
}

passport.use('local-login', new LocalStrategy({
    usernameField: "email", passwordField: "password", passReqToCallback: true
},
    function (req, username, password, done) {

        if(req.body.accountType === 'recruiter') {
            Recruiter.findByCredentials(req.body.email, req.body.password).then((user) => {
                if (user) {
                    done(null, user);
                }
            }).catch(() => {
                done(null, false);
            });
        } else if(req.body.accountType == 'endorser') {
            Endorser.findByCredentials(req.body.email, req.body.password).then((user) => {
                if (user) {
                    done(null, user);
                }
            }).catch(() => {
                done(null, false);
            });
        } else {
            Seeker.findByCredentials(req.body.email, req.body.password).then((user) => {
                if (user) {
                    done(null, user);
                }
            }).catch(() => {
                done(null, false);
            });
        }
        
    }
));

//Login POST 
app.post('/profile', [urlencodedParser,
    passport.authenticate('local-login')],
    function (req, res) {
        if(req.body.accountType === 'recruiter') {
            res.render('recruiter-profile', {
                first: req.user.first,
                last: req.user.last,
                location: req.user.location, 
                company: req.user.company,
                email: req.user.email,
                website: req.user.website,
                about: req.user.about,
                positions: req.user.positions,
                req: req.user.req,
                res: req.user.res

            });
        } else if(req.body.accountType === 'seeker') {
            res.render('seeker-profile', {
                first: req.user.first ,
                last: req.user.last,
                username: req.user.username,
                location: req.user.location,
                phone: req.user.phone,
                email: req.user.email,
                skills: req.user.skills,
                q1: req.user.q1,
                q2: req.user.q2,
                q3: req.user.q3,
                q4: req.user.q4,
                q5: req.user.q5,
                q6: req.user.q6,
                q7: req.user.q7,
                q8: req.user.q8,
                q9: req.user.q9,
                q10: req.user.q10
            });
        } else if(req.body.accountType === 'endorser') {
            res.render('endorser-profile', {
                first: req.user.first,
                last: req.user.last,
                organization: req.user.organization,
                about: req.user.about,
                email: req.user.email,
                location: req.user.location,
                position: req.user.position
            });
        }
    });

app.get('/logout', (req, res) => {
    req.logout();
    res.render('landing');
});


app.listen(port, () => {
    console.log(`app now up on port ${port}`);
});