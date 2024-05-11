const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path')
const connect = require('./database/connection.js');
const userRoutes = require('./routes/userRouter.js');
// const uploadRoutes = require('./routes/uploadRoutes.js');
const homeRoutes = require('./routes/homeRoutes');


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

/** Middlewares */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))


app.use(express.json());
app.use(cors());
app.disable('x-powered-by'); // Correct typo in 'x-powered-by'

const port = 4000;

/** HTTP Requests */
app.use(homeRoutes)
app.use(userRoutes);
// app.use(uploadRoutes);

/** Connect to MongoDB */
const startServer = async () => {
    try {
        // await connect();
        app.listen(port);
        console.log(`Server connected to http://localhost:${port}`);
    } catch (error) {
        console.log("An error occurred during starting of server", error);
    }
};

startServer();
