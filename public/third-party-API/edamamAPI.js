const ENDPOINT = "https://api.edamam.com"
const APP_ID = "725ce1d4"
const APP_KEY = "50389e85ff3b13317789a5d9909b658b"

//async function to return results based on tags
async function getRecipes(query) {
    let response = await fetch(`${ENDPOINT}/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`)
    let data = await response.json()
    return data
}

//export function to access inside of script.js
export{getRecipes}