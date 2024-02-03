const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const config = require('./config/database');

// Connexion base de donnée
mongoose.connect(config.database);

// Connecté avec succés
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

// Erreur de connexion
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

// Utilisation de Express js
const app = express();

// users routing
const users = require('./routes/users');

// port 3000
const port = 3000;

// CORS middleware
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
    secret: config.secret, // Change this to a secret key for production
    resave: true,
    saveUninitialized: true
}));

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// index route
app.get('/', (req, res) => {
    res.send('Invalide');
});

// start server
app.listen(port, () => {
    console.log('Server ' + port);
});