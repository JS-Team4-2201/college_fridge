const mongoose = require('mongoose')

const RecipeSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    recipeUrl: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model("recipe", RecipeSchema)