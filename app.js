const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const uuid = require('node-uuid');
let app = express();
const static = express.static(__dirname + '/public');
const path = require("path");
let passport = require("passport");
const express_session = require("express-session");
const flash = require('connect-flash');

const configRoutes = require("./routes");
const configPassport = require('./config/passport')

const exphbs = require('express-handlebars');

const Handlebars = require('handlebars');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    },
    partialsDir: [
        'views/partials/'
    ]
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'uploads'))
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, uuid.v4() + ext);
    }
})
app.use(multer({ storage: storage }).single('itemImage'));
app.use(rewriteUnsupportedBrowserMethods);

app.use(require("cookie-parser")());
app.use(express_session({
    secret: 'cs546 final project',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.engine('handlebars', handlebarsInstance.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

configPassport(passport);
configRoutes(app, passport);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});