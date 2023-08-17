const path = require('path')

const fileUpload = require('express-fileupload');
const express = require('express');
const dotEnv = require('dotenv');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDb = require('./config/db');
const { errorHandler } = require('./middlewares/errors');

// Load Confg
dotEnv.config({ path: "./config/config.env" })

// DataBase
connectDb();

// Passprot Config
require('./config/passport');


const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false })); // Form data parser middleware for parsing application
app.use(express.json())

// File Upload Middleware 
app.use(fileUpload())

// Session
const store = MongoStore.create({
    mongoUrl: process.env.MOONGO_URL, // Replace with your MongoDB connection URL
    collectionName: 'sessions' // Specify the collection name for storing sessions
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        unset: "destroy",
        store: store
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());


// Flash
app.use(flash());


// Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', require('./routes/blog'));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/users", require("./routes/users"));

// Error Controller
app.use(errorHandler)

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`server listen in ${process.env.NODE_ENV} on ${PORT}`))