let LocalStrategy = require('passport-local').Strategy;
let data = require('../data');
let users = data.users;
let auth = require('./bcryptLib');

const configPassport = (passport) => {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            users.getUserByUsername(username)
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    else {
                        return auth.comparePassword(user, password)
                            .then((valid) => {
                                if (!valid) {
                                    return done(null, false, { message: 'Incorrect password.' });
                                }
                                else {
                                    return done(null, user);
                                }
                            })
                            .catch((err) => {
                                return done(err);
                            })
                    }
                })
                .catch((err) => {
                    return done(err);
                })
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.profile.username);
    })

    passport.deserializeUser((username, done) => {
        users.getUserByUsername(username)
            .then((user) => {
                done(null, user);
            })
            .catch((err) => {
                done(err);
            })
    })
}