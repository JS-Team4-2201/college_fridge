const express = require("express");
const bodyParser = require('body-parser')
const { sendFile } = require("express/lib/response");
const res = require("express/lib/response");
const { LEGAL_TCP_SOCKET_OPTIONS } = require("mongodb");
const app = express();
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb+srv://CFridge:BudgetFood2022@cluster0.ykuti.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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

        app.listen(3000, function() {
            console.log("listening on 3000")
        })
    })
    .catch(error => console.error(error))