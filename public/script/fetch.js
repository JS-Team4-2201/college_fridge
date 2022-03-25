const getRecipesFromDB = async () => {
    const response = await fetch('/recipes')
    const data = await response.json()
    return data
}

const addRecipeToDB = async (form, ingredients) => { 
    const response = await fetch('/', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
        title: form.elements[0].value,
        ingredients: ingredients,
        recipeUrl: form.elements[2].value,
        imageUrl: form[3].value
        })
    })
    const data = await response.json()
    return data
}

const updateRecipeInDB = async (id, form, ingredients) => {
    const response = await fetch('/', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: id,
            title: form.elements[0].value,
            ingredients: ingredients,
            recipeUrl: form.elements[2].value,
            imageUrl: form[3].value
        })
    })
    const data = await response.json()
    console.log(data)
    return data
}

const deleteRecipeFromDB = async (id) => {
    const response = await fetch('/', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            _id: id
        })
    })
    const data = await response.json()
    return data
}




export { getRecipesFromDB, addRecipeToDB, updateRecipeInDB, deleteRecipeFromDB }