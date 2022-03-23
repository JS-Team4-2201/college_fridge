const express = require("express");
const bodyParser = require('body-parser')
require('dotenv').config({path: './config/.env'})

const app = express();
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(process.env.CONN_STRING, {
    useUnifiedTopology: true})
    .then(client => {
        console.log("Connected to Database")
        const db = client.db("simple-recipes")
        const recipesCollection = db.collection("recipes")


        app.set("view engine", "ejs")
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static(__dirname + "/public"))
        app.use(bodyParser.json())

        app.get('/', (req,res) => {
            db.collection('recipes').find().toArray()
            .then(results =>{
                console.log(results);
                res.render('index.ejs', {recipes: results})
            })
        })

        app.listen(process.env.PORT, function() {
            console.log("listening on 3000")
        })
    })
    .catch(error => console.error(error))


