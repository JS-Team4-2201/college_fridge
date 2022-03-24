
import { getRecipes } from "../third-party-API/edamamAPI.js"

// const variables for needed event handlers
const add = document.querySelector(".add-btn")
const pressEnter = document.querySelector("input")  
const submit = document.querySelector(".submit-btn")
const clearTags = document.querySelector(".clear-btn")
const tagContainer = document.querySelector(".tag-container")
let addRecipe = document.querySelector('#addRecipe')

// event handlers
submit.addEventListener("click", onSubmitClick)
add.addEventListener("click", onAddClick)
clearTags.addEventListener("click", onClearTagsClick)


// use to handle tags and query value for edamam
let tagArray= []
let query = ""

// quick fix for the submit doc that appears after you submit/ subject to change
let submitClicked = 0;

// to handle user input with Enter key
pressEnter.onkeydown = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault()
        // console.log("submit")
        onAddClick()
    }
};

// function for add event 
function onAddClick(){
    const tagBox = document.querySelector("#ingredient-list")
    const tagBoxValue = tagBox.elements[0].value

    if(validInput(tagBoxValue) && tagBoxValue.length > 0) {
        console.log(validInput(tagBoxValue))
        let tempTagArray = tagBoxValue.split(',')
        tagArray = tagArray.concat(tempTagArray);
        console.log("tagArray: " + tagArray)
        
        renderElements(tempTagArray) 
    } else {
        //split the value into a temp array to then concat with the original
        alert("Not a valid ingredient, please try again.")
    }
    resetField(document.querySelector("#ingredient-list-text")) 
}

function validInput(str){
    return /^[\.a-zA-Z, ]*$/.test(str);
}

//  removing ingredient from 'Tags' section and array
function removeIngredientFromTags(ingredient) {
    let ingredients = tagArray
    //tagArray = tagArray.filter(ingredient => ingredient !== ingredients)
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
    tagBoxValue.forEach(element => {
        let tag = document.createElement("p")
        tag.innerText = element;
        tag.style.backgroundColor = "yellow"    // styling (colors background of box containing ingredient)
        tag.style.borderRadius = "10%"          // styling (changes style of box around ingredient to add soft edges)
        tag.style.padding = "3px"               // styling (adds padding between edge of word and background box)
    
        tag.style.cursor = "pointer"   // adds a change of cursor to pointer when hovering over ingredients
        tag.onclick = () => removeIngredientFromTags(tag) // calls function to remove ingredient once clicked
    
        tagContainer.appendChild(tag)
        
    });
    console.log(tagArray)
    
}


// function for submit event 
async function onSubmitClick() {
    clearResults();
    submitClicked++;

    if(tagArray.length === 0){
        submitClicked = false;
        return;
    }
    query = tagArray.join()
    // call to edamam api
    getRecipes(query)
        .then(data => {
            console.log(data)

            for (let i = 0; i < data.hits.length; i++) {

                const currentRecipe = data.hits[i].recipe
                let cardContainer = document.querySelector('.result-container')
                let card = document.createElement("div")
                card.setAttribute("class", "card card-style")
                cardContainer.appendChild(card)

                let img = document.createElement("img")
                img.setAttribute("class", "card-img-style")
                img.setAttribute("src", currentRecipe.image)
                card.appendChild(img)

                let cardBody = document.createElement("div")
                cardBody.setAttribute("class", "card-body")
                
                let recipeName = document.createElement("h5")
                recipeName.setAttribute("class", "card-title")
                recipeName.innerText = currentRecipe.label
                cardBody.appendChild(recipeName)

                let tagdiv = document.createElement('div');
                tagdiv.setAttribute('class', 'd-flex flex-row flex-wrap justify-content-evenly')
                cardBody.append(tagdiv)

                for (const ingredient of currentRecipe.ingredients){  
                    let currentIngredient = document.createElement("p")
                    currentIngredient.setAttribute("class", "card-text")
                    currentIngredient.innerText = ingredient.food
                    if(tagContains(currentIngredient)){
                        currentIngredient.setAttribute('class', 'card-tag-match')
                    }
                    else{
                        currentIngredient.setAttribute('class', 'card-tag-nomatch')
                    }
                    tagdiv.appendChild(currentIngredient)
                }

                let link = document.createElement('a')
                link.innerText = "See Full Recipe"
                cardBody.appendChild(link)
                link.setAttribute("href",  currentRecipe.url)
                link.setAttribute("target",  "_blank")
                card.appendChild(cardBody)

            }
        })
        .catch(err => console.error(err))

        if (submitClicked===1) {
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
}

async function linkClicked(e) {
    clearResults();
    let hiddenButtons = document.querySelector(".hide")
    hiddenButtons.style.display = "flex"


}

function clearResults(){
    document.getElementById("results-container").innerHTML = "";
}

function tagContains(currentIngredient){
    console.log(tagArray.some(element => element === currentIngredient.innerText));
    return tagArray.some(element => element === currentIngredient.innerText)
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

// const for modal buttons
const addModalBtn = document.querySelector("#add-recipes")
const updateModalBtn =document.querySelector("#update-recipes")
const deleteModalBtn =document.querySelector("#delete-recipes")

//modal event handlers
addModalBtn.addEventListener("click", () => {
    const addModal = document.querySelector("#add-modal")
    displayModal(addModal)
})

updateModalBtn.addEventListener("click", () => {
    const updateModal = document.querySelector("#update-modal")
    displayModal(updateModal)
})

deleteModalBtn.addEventListener("click", ()=> {
    const deleteModal = document.querySelector("#delete-modal")
    displayModal(deleteModal)
})

// function that takes care of displaying modal
function displayModal(modal) {
    modal.style.display = "block"
    modal.setAttribute("class", "show")

    const close = document.querySelector(".close")
    close.addEventListener("click", () => {
        modal.style.display = "none"
    })
}


addRecipe.addEventListener('submit', (req, res) => {
    req.preventDefault();
    let arr = addRecipe.elements[1].value.split(',');

    fetch('/recipes', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: addRecipe.elements[0].value,
            ingredients: arr,
            recipeUrl: addRecipe.elements[2].value,
            imageUrl: addRecipe[3].value
        })
    })
})