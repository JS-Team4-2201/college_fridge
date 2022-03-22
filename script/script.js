import { getRecipes } from "../third-party-API/edamamAPI.js"

// const for needed selctions/buttons
const add = document.querySelector(".add-btn")
const results = document.querySelector(".results-btn")
const tagContainer = document.querySelector(".tag-container")

// event handlers
results.addEventListener("click", onSubmitClick)
add.addEventListener("click", onAddClick)

// use to handle tags and query value for edamam
let tagArray= []
let query = ""

// function for add event 
function onAddClick(){
    const tagBox = document.querySelector("#ingredient-list")
    const tagBoxValue = tagBox.elements[0].value

    if(tagBoxValue === '') {
        alert("not tag value added")
    } else {
        let tag = document.createElement("p")
        tag.innerText = tagBoxValue
        tagContainer.appendChild(tag)
        tagArray.push(tagBoxValue)
        console.log(tagArray)
        query = tagArray.join()
    }
}

// function for submit event 
async function onSubmitClick() {
    // call to edamam api
    getRecipes(query)
        .then(data => {
            console.log(data)

            for (let i = 0; i < data.hits.length; i++) {

                const currentRecipe = data.hits[i].recipe
                let cardContainer = document.querySelector('.result-container')
                let card = document.createElement("div")
                card.setAttribute("class", "card")
                cardContainer.appendChild(card)

                let img = document.createElement("img")
                img.setAttribute("src", currentRecipe.image)
                card.appendChild(img)

                let cardBody = document.createElement("div")
                cardBody.setAttribute("class", "card-body")
                
                let recipeName = document.createElement("h5")
                recipeName.setAttribute("class", "card-title")
                recipeName.innerText = currentRecipe.label
                cardBody.appendChild(recipeName)

                for (const ingredient of currentRecipe.ingredients){
                    let currentIngredient = document.createElement("p")
                    currentIngredient.setAttribute("class", "card-text")
                    currentIngredient.innerText = ingredient.food
                    cardBody.appendChild(currentIngredient)
                }
            
                card.appendChild(cardBody)

            }
        })

        tagArray = []
        empty(tagContainer)
}

// clear tags from page
function empty(element) {
    while(element.firstElementChild) {
        element.firstElementChild.remove();
     }
}