import { getRecipes } from "../third-party-API/edamamAPI.js"

// const variables for needed event handlers
const add = document.querySelector(".add-btn")
const pressEnter = document.querySelector("input")  
const submit = document.querySelector(".submit-btn")
const clearTags = document.querySelector(".clear-btn")
const tagContainer = document.querySelector(".tag-container")
const recipesLink = document.querySelector('.in-house-link')
const addRecipe = document.querySelector('#addRecipe')

// event handlers
submit.addEventListener("click", onSubmitClick)
add.addEventListener("click", onAddClick)
clearTags.addEventListener("click", onClearTagsClick)
recipesLink.addEventListener("click", linkClicked)


// use to handle tags and query value for edamam
let tagArray= []
let query = ""
let cardContainer = document.querySelector('.result-container')

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
    console.log(tagArray)
    
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
}

function createCard(item, imageURL, ingredients, recipeURL){
    
    let card = document.createElement("div")
    card.setAttribute("class", "card card-style")
    let img = document.createElement("img")
    img.setAttribute("class", "card-img-style")
    img.setAttribute("src", imageURL)
    card.appendChild(img)
    let cardBody = document.createElement("div")
    cardBody.setAttribute("class", "card-body")
    
    let recipeName = document.createElement("h5")
    recipeName.setAttribute("class", "card-title")
    recipeName.innerText = item // gonna not work
    cardBody.appendChild(recipeName)
    let tagdiv = document.createElement('div');
    tagdiv.setAttribute('class', 'd-flex flex-row flex-wrap')
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
    
    fetch("/recipes")
        .then(res => res.json())
        .then(res => {
            res.data.forEach(element => {
                let card = createCard(element.title, element.imageURL, element.ingredients, element.recipeURL)

                let buttonDiv = document.createElement('div')
                let editbtn = document.createElement('button')
                editbtn.innerText = "Edit";
                let deleteBtn = document.createElement('button')
                deleteBtn.innerText = "Delete";
                buttonDiv.appendChild(editbtn);
                buttonDiv.appendChild(deleteBtn);
                
                card.appendChild(buttonDiv);

                cardContainer.appendChild(card)
            });
        })
}

function clearResults(){
    document.getElementById("results-container").innerHTML = "";
}

// breaks down the ingredient by spaces and sees if our the ingredient is apart of our tags that we provided
function tagContains(currentIngredient){
    let checkArr = currentIngredient.innerText.split(" ");
    console.log(tagArray)
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


//modal event handlers
addModalBtn.addEventListener("click", () => {
    const addModal = document.querySelector("#add-modal")
    displayModal(addModal)
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
    const ingredientsArray = addRecipe.elements[1].value.split(',');
    fetch('/', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: addRecipe.elements[0].value,
            ingredients: ingredientsArray,
            recipeUrl: addRecipe.elements[2].value,
            imageUrl: addRecipe[3].value
        })
    })
})

// document.getElementById("#searchBar").addEventListener('keypress', (e) => {
//     if(e.key === 'Enter'){

//     }
// })





