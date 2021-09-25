
const signupForm = document.getElementById("signup-form");

async function handleSubmit(evt) {
    evt.preventDefault();

    const email = document.getElementById("email-input").value;
    const firstName = document.getElementById("first-name-input").value;
    const lastName = document.getElementById("last-name-input").value;
    clearInputs();
    const user = await UserApi.signup({ email, firstName, lastName });
    if(user) {
        //redirect if successfull
        location.href = "/index.html";
    }
}

function clearInputs(){
    document.getElementById("email-input").value = "";
    document.getElementById("first-name-input").value = "";
    document.getElementById("last-name-input").value = "";
}

signupForm.addEventListener("submit", handleSubmit);