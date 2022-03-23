const express = require("express");
const bodyParser = require('body-parser')
const startMongoServer = require("./config/mongo")
require('dotenv').config({path: './config/.env'})

const app = express();

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json())

startMongoServer()
const recipe = require("./routes/recipeRoute")
app.use("/recipe", recipe)

app.listen(process.env.PORT, function() {
    console.log(`listening on ${process.env.PORT}`)
})



