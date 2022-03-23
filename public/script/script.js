import { getRecipes } from "../third-party-API/edamamAPI.js"

// const variables for needed event handlers
const add = document.querySelector(".add-btn")
const pressEnter = document.querySelector("input")  
const submit = document.querySelector(".submit-btn")
const clearTags = document.querySelector(".clear-btn")
const tagContainer = document.querySelector(".tag-container")

// event handlers
submit.addEventListener("click", onSubmitClick)
add.addEventListener("click", onAddClick)
clearTags.addEventListener("click", onClearTagsClick)



// use to handle tags and query value for edamam
let tagArray= []
let query = ""
let submitClicked = false

// to handle user input with Enter key
pressEnter.onkeydown = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault()
        // console.log("submit")
        onEnterPress()
    }
};

// function for add event 
function onAddClick(){
    const tagBox = document.querySelector("#ingredient-list")
    const tagBoxValue = tagBox.elements[0].value

    if(tagBoxValue === '') {
        alert("No ingredient submitted, please try again.")
    } else {
        query = tagArray.join()
        renderElements(tagBoxValue)   
    }

    resetField(document.querySelector("#ingredient-list-text")) 
}

// function to add on pressEnter
function onEnterPress() {
    const enterInput = document.querySelector("#ingredient-list")
    const tagBoxValue = enterInput.elements[0].value

    if(tagBoxValue === "") {
        alert("No ingredient added, please try again.")
    } else {
        query = tagArray.join()
        renderElements(tagBoxValue)
    }
}

//  removing ingredient from 'Tags' section and array
function removeIngredientFromTags(ingredient) {
    let ingredients = tagArray
    tagArray = tagArray.filter(ingredient => ingredient !== ingredients)
    console.log(ingredient.innerText)
    for (let i = 0; i < tagArray.length; i++) {      // iterating thru array to find clicked ingredient
        if (tagArray[i] === ingredient.innerText){
            tagArray.splice(i, 1)                    // removing from array once found
            tagContainer.removeChild(ingredient)     // removing from tagContainer
            break;
        }
    }
    console.log(tagArray);
}

// creating element for tag, rendering ingredient elements to tagBox, tagContainer, and some style
function renderElements(tagBoxValue) {
    let tag = document.createElement("p")
    tag.innerText = tagBoxValue
    tag.style.backgroundColor = "yellow"    // styling (colors background of box containing ingredient)
    tag.style.borderRadius = "10%"          // styling (changes style of box around ingredient to add soft edges)
    tag.style.padding = "3px"               // styling (adds padding between edge of word and background box)
    tagContainer.appendChild(tag)
    tagArray.push(tagBoxValue)
    console.log(tagArray)
    
    tag.style.cursor = "pointer"   // adds a change of cursor to pointer when hovering over ingredients
    tag.onclick = () => removeIngredientFromTags(tag) // calls function to remove ingredient once clicked
    
}


// function for submit event 
async function onSubmitClick() {
    submitClicked = true
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

        if (submitClicked) {
            let more = document.createElement('p')
            more.innerText = "Not what you're looking for?"
            let recipes = document.createElement('a')
            recipes.setAttribute("class", "recipes-link")
            recipes.innerText = "Try our in house recipes!"
            document.querySelector('.button-container').appendChild(more)
            document.querySelector('.button-container').appendChild(recipes)

            let recipesLink = document.querySelector('.recipes-link')
            recipesLink.addEventListener("click", linkClicked)
        }

        tagArray = []
        submitClicked = false
}

async function linkClicked(e) {
    console.log("clicked")
    // let response = await fetch("https://localhost:3000/recipes")
    // let data = await response.json()
    // console.log(data)
}

function onClearTagsClick() {
    empty(tagContainer)
    tagArray = []
}


function resetField(formField) {
   formField.value = ''
}

// clear tags from page
function empty(element) {
    while(element.firstElementChild) {
        element.firstElementChild.remove();
     }
}

//modal incorporation code
const addModal = document.querySelector("#add-modal")
const addModalBtn = document.querySelector("#add-recipes")
const updateModal = document.querySelector("#update-modal")
const deleteModal = document.querySelector("#delete-modal")

addModalBtn.addEventListener("click", () => {
    const addSpan = document.querySelector(".close")
    addModal.style.display = "flex"
    addSpan.onclick = () => addModal.style.display = "none"
    // window.onclick = (event) => {
    //     if (event.target == addModal) {
    //       addModal.style.display = "none";
    //     }
    //   }
})
