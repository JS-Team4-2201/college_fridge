const express = require("express")
const router = express.Router()
const recipes = require("../model/Recipe")
const failMessage = "Request Failed - check data and try again"

router.get("/", async (req, res, next) => {
    try{
        res.render("index")
    } catch {
        res.status(404).json({success: false, data: failMessage})
    }
})

router.get("/recipes", async (req, res, next) => {
    try{
        const getRecipes = await recipes.find()
        res.status(200).json({success: true, data: getRecipes})
    } catch {
        res.status(404).json({success: false, data: failMessage})
    }
})

router.post("/", async (req, res) => {
    try{
        const create = await recipes.create(req.body)
        res.status(201).json({success: true, data: create})
    } catch {
        res.status(400).json({success: false, data: failMessage})
    }
})

router.put("/", async (req, res) => {
    try{
        const update = await recipes.findOneAndUpdate(
            {_id: req.body._id},
            {
                $set: {
                        title: req.body.title,
                        ingredients: req.body.ingredients,
                        recipeUrl: req.body.recipeUrl,
                        imageUrl: req.body.imageUrl,
                        }
            }
        )
        res.status(200).json({success: true, data: update})
    }
    catch {
        res.status(400).json({success: false, data: failMessage})
    }
})

router.delete("/", async (req, res) => {
    try{
        const deleteRecipe = await recipes.findOneAndDelete(
            {_id : req.body._id}
        )
        res.status(200).json({success: true, data: deleteRecipe})
    } 
    catch {
        res.status(404).json({success: false, data: failMessage})
    }
})


module.exports = router