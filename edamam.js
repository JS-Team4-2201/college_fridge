const ENDPOINT = "https://api.edamam.com"
const APP_ID = "725ce1d4"
const APP_KEY = "50389e85ff3b13317789a5d9909b658b"

const add = document.querySelector(".add-btn")
const results = document.querySelector(".results-btn")
results.addEventListener("click", onResultsClick)
add.addEventListener("click", onAddClick)

function onAddClick(){
    const tagBox = document.querySelector("#ingredient_search")
    let tag = document.createElement("p")
    tag.innerText = tagBox.value
    document.querySelector(".tag_container").appendChild(tag)

}

async function onResultsClick(){

    let response = await fetch(`${ENDPOINT}/search?q=chicken&app_id=${APP_ID}&app_key=${APP_KEY}`)
    let data = await response.json()
    console.log(data)

}