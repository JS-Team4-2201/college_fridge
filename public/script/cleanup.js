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

// success/error popups
function dbFeedback(message, color) {
    return Toastify({
        text: message,
        className: "info",
        duration: 3000,
        style: {
          background: color,
        }
      }).showToast();
}

export { clearResults, resetField, resetForm, empty, displayModal, dbFeedback }