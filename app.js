const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const config = require('./config/database');

// Connexion base de donnée
const MONGODB_URL  = "mongodb+srv://SedraRan:Ran19SedH@gestiodepence.ocz6e5w.mongodb.net/salon_de_beaute";
mongoose
    .connect(MONGODB_URL)
    .then((result) =>{
        if(result){
            console.log("server found and connected to mongodb");
            app.listen(3001);
        }
    })
    .catch((error)=>{
        console.log(error);
    });


// Utilisation de Express js
const app = express();

// users routing
const usersRoutes = require('./routes/users');
const servicesRoutes = require('./routes/service');

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

//Road set
app.use('/users', usersRoutes);
app.use('/services', servicesRoutes);

// index route
app.get('/', (req, res) => {
    res.send('Invalide');
});

// start server
app.listen(port, () => {
    console.log('Server ' + port);
});