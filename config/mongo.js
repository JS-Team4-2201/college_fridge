const mongoose = require("mongoose")
// allow access to .env 
require('dotenv').config({path: './config/.env'})

// connect to Database
const startMongoServer = async () => {
    try {
        await mongoose.connect(process.env.CONN_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to Database!")
    }
    catch (e) {
        console.log(e)
        throw e;
    }
}

//export connect function to access elsewhere
module.exports = startMongoServer;
