const ENDPOINT = "https://serpapi.com"
const API_KEY = "4958c8a1bfdf8cca9c5ad4eb79efeec8ae28e502df4b70172fb222da81073eed"

async function linkToRecipes(query) {
    let response = await fetch(`${ENDPOINT}/search.json?q=${query}&hl=en&gl=us&api_key=${API_KEY}`)
    let data = await response.json()

    return data
}

export {linkToRecipes}