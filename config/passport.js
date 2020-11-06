// module for adding header authentication on every API request in this website after login

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const key = require("./keys");
const r = require("rethinkdb");
const Users = require("../models/User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretKey;

/* module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      r.table("users")
        .filter(r.row("email").eq(jwt_payload.email))
        .run(RethinkDBConnection, (err, cursor) => {
          if (err) return done(null, false);
          else {
            if (cursor._responses.length === 0) {
              return done(null, false);
            } else {
              cursor.toArray((err, results) => {
                if (err) return done(null, false);
                else {
                  return done(null, results[0]);
                }
              });
            }
          }
        });
    })
  );
}; */

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Users.findOne({ email: jwt_payload.email })
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch((err) => {
          console.log(err);
          done(null, false);
        });
    })
  );
};
