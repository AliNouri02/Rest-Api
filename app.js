const path = require('path')

const fileUpload = require('express-fileupload');
const express = require('express');
const dotEnv = require('dotenv');
const connectDb = require('./config/db');
const { errorHandler } = require('./middlewares/errors');
const { setHeaders } = require('./middlewares/headers');

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
app.use(setHeaders)

// File Upload Middleware 
app.use(fileUpload())



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