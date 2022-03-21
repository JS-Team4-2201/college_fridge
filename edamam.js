const ENDPOINT = "https://api.edamam.com"
const APP_ID = "725ce1d4"
const APP_KEY = "50389e85ff3b13317789a5d9909b658b"

const add = document.querySelector(".add-btn")
const results = document.querySelector(".results-btn")

results.addEventListener("click", onSubmitClick)
add.addEventListener("click", onAddClick)

const tagArray=[]
let query = ""

function onAddClick(){
    const tagBox = document.querySelector("#ingredient-list")
    const tagBoxValue = tagBox.elements[0].value

    if(tagBoxValue === '') {
        alert("not tag value added")
    } else {
        let tag = document.createElement("p")
        tag.innerText = tagBoxValue
        document.querySelector(".tag-container").appendChild(tag)
        tagArray.push(tagBoxValue)
        console.log(tagArray)
        query = tagArray.join()
    }
}

async function onSubmitClick(){
    let response = await fetch(`${ENDPOINT}/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`)
    let data = await response.json()
    console.log(data)
    return data
}