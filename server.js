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

        app.post('/recipes', (req,res) => {
            //console.log(req.body)
            recipesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        // Might have to change the criteteria on what we delete later
        app.delete('/recipes', (req,res) => {
            recipesCollection.deleteOne(
                { title: req.body.title }
                )
            .catch(error => console.error(error))
        })

       app.listen(process.env.PORT, function() {
         console.log(`listening on ${process.env.PORT}`)
       })
    })
    .catch(error => console.error(error))


