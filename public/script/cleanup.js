//clear results container
function clearResults(){
    document.getElementById("results-container").innerHTML = "";
}

// clear tag field
function resetField(tagField) {
    tagField.value = ''
}

// clear modal form
function resetForm(form) {
    for(let i = 0; i < form.length; i++) {
        form[i].value = ""
    }
}

// clear tags from container
function empty(element) {
    while(element.firstElementChild) {
        element.firstElementChild.remove();
     }
}

// validates that ingredient contains no numeric values
function validInput(str){
    return /^[\.a-zA-Z, ]*$/.test(str);
}

// used to control modal visibility
function displayModal(modal) {
    modal.style.display = "block"
    modal.setAttribute("class", "show")

    const close = document.querySelector(".close")
    close.addEventListener("click", () => {
        resetForm(addRecipe)
        modal.style.display = "none"
    })
}

// breaks down the ingredient by spaces and sees if our the ingredient is apart of our tags that we provided
function tagContains(tagArray, currentIngredient){
    let checkArr = currentIngredient.innerText.split(" ");
    //console.log(tagArray)
    for (let i = 0; i < checkArr.length; i++) {
        if(tagArray.includes(checkArr[i])){
            return true;
        }
    }
    return false;
}

// success/error popups
function feedback(message, color) {
    return Toastify({
        text: message,
        className: "info",
        duration: 3000,
        style: {
          background: color,
        }
      }).showToast();
}

export { clearResults, resetField, resetForm, empty, validInput, displayModal, tagContains, feedback }