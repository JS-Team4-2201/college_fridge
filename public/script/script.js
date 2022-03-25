import { getRecipes } from "../third-party-API/edamamAPI.js"
import { getRecipesFromDB, addRecipeToDB, updateRecipeInDB, deleteRecipeFromDB} from "./fetch.js"
import { clearResults, resetField, resetForm, empty, displayModal, dbFeedback } from "./cleanup.js"

// reused const variables for event or element location functionality
const add = document.querySelector(".add-btn")
const pressEnter = document.querySelector("input")  
const submit = document.querySelector(".submit-btn")
const clearTags = document.querySelector(".clear-btn")
const tagContainer = document.querySelector(".tag-container")
const recipesLink = document.querySelector('.in-house-link')
const addRecipe = document.querySelector('#addRecipe')
const cardContainer = document.querySelector('.result-container')
const addModal = document.querySelector("#add-modal")
const addModalBtn = document.querySelector("#add-recipes")

// general reused application const variables
const errorColor = "linear-gradient(to right, red, orange)"
const errorMessage="Oops! Something went wrong!"
const successColor = "linear-gradient(to right, rgb(71, 84, 207), #eb08c5)"


// event handlers
submit.addEventListener("click", onSubmitClick)         // submit btn used to hit edmamam API
add.addEventListener("click", onAddClick)               // add tags to container
clearTags.addEventListener("click", onClearTagsClick)   //  clears tags from container
recipesLink.addEventListener("click", linkClicked)      // touchs OUR API to return card from db info
addRecipe.addEventListener('submit', addOrUpdate)       // determines whether to add or update info to db


// use to handle tags and query value for edamam
let tagArray= []
let query = ""


// quick fix for the submit doc that appears after you submit/ subject to change
let submitClicked = false;

// to handle user input with Enter key
pressEnter.onkeydown = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault()
        onAddClick()
    }
}

function validInput(str){
    return /^[\.a-zA-Z, ]*$/.test(str);
}

// function for add event 
function onAddClick(){
    const tagBox = document.querySelector("#ingredient-list")
    const tagBoxValue = tagBox.elements[0].value

    if(validInput(tagBoxValue) && tagBoxValue.length > 0) {
        let tempTagArray = tagBoxValue.split(',')
        tagArray = tagArray.concat(tempTagArray);
        tagArray = tagArray.map(str => str.trim());
        renderElements(tempTagArray) 
    } else {
        //split the value into a temp array to then concat with the original
        alert("Not a valid ingredient, please try again.")
    }
    resetField(document.querySelector("#ingredient-list-text")) 
}

// creating element for tag, rendering ingredient elements to tagBox, tagContainer, and some style  
function renderElements(tagBoxValue) {
    tagBoxValue.forEach(element => {
        let tag = document.createElement("p")
        tag.innerText = element;
        tag.setAttribute("class", "card-tag-match")
        tag.style.cursor = "pointer"   // adds a change of cursor to pointer when hovering over ingredients
        tag.onclick = () => removeIngredientFromTags(tag) // calls function to remove ingredient once clicked
    
        tagContainer.appendChild(tag)
        
    });
    
}

// removing ingredient from 'Tags' section and array
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

// function for submit event 
async function onSubmitClick() {
    clearResults();

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
                let currentCard = data.hits[i].recipe;
                
                let card = createCard(currentCard.label, currentCard.image, currentCard.ingredients, currentCard.url)
                cardContainer.appendChild(card)
            }
        })
        .catch(err => console.error(err))

        if (submitClicked===false) {
            const inHouseText = document.querySelector(".in-house")
            inHouseText.innerText = "Not what you're looking for?"
            const recipes = document.createElement("a")
            recipes.setAttribute("class", "in-house-link")
            recipes.innerText = " Click here!"
            inHouseText.appendChild(recipes)
           

            const recipesLink = document.querySelector('.in-house-link')
            recipesLink.addEventListener("click", linkClicked)
            submitClicked = true;
        }

        const addModal = document.querySelector("#add-modal")
        addModal.style.display = "none"
}

function createCard(item, imageURL, ingredients, recipeURL, id) {
    
    let card = document.createElement("div")
    card.setAttribute("class", "card card-style")

    if(id){
        card.setAttribute("id", id)
    }

    let img = document.createElement("img")
    img.setAttribute("class", "card-img-style")
    img.setAttribute("src", imageURL)
    card.appendChild(img)
    let cardBody = document.createElement("div")
    cardBody.setAttribute("class", "card-body")
    
    let recipeName = document.createElement("h5")
    recipeName.setAttribute("class", "card-title")
    recipeName.innerText = item
    cardBody.appendChild(recipeName)
    let tagdiv = document.createElement('div');

    tagdiv.setAttribute('class', 'tags d-flex flex-row flex-wrap')

    cardBody.append(tagdiv)
    for (const ingredient of ingredients){  
        let currentIngredient = document.createElement("p")
        currentIngredient.setAttribute("class", "card-text")
        if(ingredient.food){
            currentIngredient.innerText = ingredient.food.toLowerCase();
        }
        else{
            currentIngredient.innerText = ingredient
        }
        //currentIngredient.innerText = ingredient.food // gonna break for inhouse
        if(tagContains(currentIngredient)){
            currentIngredient.setAttribute('class', 'card-tag-match')
        }
        else{
            currentIngredient.setAttribute('class', 'card-tag-nomatch')
        }
        tagdiv.appendChild(currentIngredient)
    }
    let recipeDiv = document.createElement('div')
    let link = document.createElement('a')
    link.setAttribute('class', 'recipe-link')
    link.innerText = "See Full Recipe"
    recipeDiv.appendChild(link)
    cardBody.appendChild(recipeDiv)
    link.setAttribute("href",  recipeURL)
    link.setAttribute("target",  "_blank")
    card.appendChild(cardBody)
    return(card);
}

function linkClicked(e) {
    clearResults();
    const hiddenButtons = document.querySelector(".hide")
    hiddenButtons.style.display = "flex"
    //hiddenButtons.setAttribute('class', "d-flex flex-column")
    
    getRecipesFromDB()
        .then(res => {
            res.data.forEach(element => {
                const card = createCard(element.title, element.imageUrl, element.ingredients, element.recipeUrl, element._id)
                const buttonDiv = document.createElement('div')
                buttonDiv.setAttribute("class", "card-btn-container")
                const editBtn = document.createElement('button')
                editBtn.setAttribute("class", "btn edit-btn card-btn")
                editBtn.innerText = "Edit"
                const deleteBtn = document.createElement('button')
                            
                deleteBtn.innerText = "Delete"
                deleteBtn.setAttribute("class", "btn delete-btn card-btn")
                                         buttonDiv.appendChild(editBtn);
                buttonDiv.appendChild(deleteBtn);

                card.appendChild(buttonDiv);

                cardContainer.appendChild(card) 

                editBtn.addEventListener("click", onEditClicked)
                deleteBtn.addEventListener('click', onDeleteClicked)
        })
    })
  
}


// breaks down the ingredient by spaces and sees if our the ingredient is apart of our tags that we provided
function tagContains(currentIngredient){
    let checkArr = currentIngredient.innerText.split(" ");
    //console.log(tagArray)
    for (let i = 0; i < checkArr.length; i++) {
        if(tagArray.includes(checkArr[i])){
            return true;
        }
    }
    return false;
}

function onClearTagsClick() {
    empty(tagContainer)
    tagArray = []
}

//modal event handlers
addModalBtn.addEventListener("click", () => {
    const addModal = document.querySelector("#add-modal")
    displayModal(addModal)
})


// addRecipe.addEventListener('submit', addOrUpdate)


function onEditClicked(e) {
    const addModal = document.querySelector("#add-modal")
    displayModal(addModal)
    resetForm(addRecipe)

    const card = e.target.parentElement.parentElement
    const cardTags  = document.getElementById(e.path[2].id)
    const children = cardTags.children[1].children[1].children
    
    addRecipe.elements[0].value = card.querySelector(".card-title").innerText
    for (let i = 0; i < children.length; i++) {
        addRecipe.elements[1].value += `${children[i].innerText},`
    }
  
    addRecipe.elements[2].value = card.querySelector(".recipe-link").getAttribute("href")
    addRecipe.elements[3].value = card.querySelector(".card-img-style").getAttribute("src")
    addRecipe.elements[4].value = card.getAttribute("id")
}

function onDeleteClicked(e) {
    const id = e.path[2].id
    const recipeName = document.getElementById(e.path[2].id).children[1].children[0].innerText
    const message = `Smells like the ${recipeName} sat in the fridge a little too long`
    const color = "linear-gradient(to right, rgb(71, 84, 207), #eb08c5)"

    deleteRecipeFromDB(id)
        .then(() => {
            dbFeedback(message, color)
            linkClicked()
        })
        .catch(() => {
            dbFeedback(message, color)
        })
}

function addOrUpdate(e) {
    e.preventDefault();
    const ingredientsArray = addRecipe.elements[1].value.split(',');
    const id = addRecipe.elements[4].value
    const message = "You've successfully updated your fridge content!!"

    if (id !== "") {
        updateRecipeInDB(id, addRecipe, ingredientsArray)
            .then(()=> {
                dbFeedback(message, successColor)
            })
            .catch(() => {
                dbFeedback(errorMessage, errorColor)
            })
    }
    else {
        addRecipeToDB(addRecipe, ingredientsArray)
            .then(() => {
                const message = "You've successfully stocked the fridge!!"
                dbFeedback(message, successColor)
            })
            .catch(() => {
                dbFeedback(errorMessage, errorColor)
            })
    }
    addModal.style.display = "none"
    linkClicked()
    resetForm(addRecipe)
}




