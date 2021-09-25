const usersList = document.getElementById("users-list");
let users = {};
updateUsers();



async function updateUsers() {
    const allUsers = await UserApi.getAll();
    allUsers.forEach(user => users[user.id] = user );
    updateUserCards()
}

function updateUserCards() {
    for(let id in users){
        const user = users[id];
        const card = createUserCard(user);
        updateCard(id, card);
    }
}

function createUserCard(user) {
    const container = document.createElement("div");
    container.id = `user-card-${user.id}`;
    container.dataset.id = user.id;
    container.className = `userCard ${user.state}`;

    const emailDiv = create("div", user.email);
    const fullName = user.firstName +" " + user.lastName;
    const nameDiv = create("div", fullName);
    const stateBtn = create("button", user.state);
    stateBtn.onclick = handleTogglePendingClick;

    container.append(emailDiv, nameDiv, stateBtn);
    return container;
}

function create(tag, text = "") {
    const el = document.createElement(tag);
    el.innerText = text;
    return el;
}

async function handleTogglePendingClick(evt) {
    console.log("HELLO!");
    const id = +evt.target.parentElement.dataset.id;
    togglePending(users[id]);
    //update the UI
    const newUserCard = createUserCard(users[id]);
    updateCard(id, newUserCard);

    //make the API call to update the state serverside
    await UserApi.update(users[id]);

}

function togglePending(user) {  
    //getting new State
    const updatedState = user.state === "pending" ? "active" : "pending";
    //working with the updated user object
    user = { ...user, state: updatedState };
    //updating the users state client side 
    users[user.id] = user;
}


function updateCard(id, card) {
    //if on DOM, remove it
    removeCard(id);
    //add the card to the DOM
    if (users[id].state === "pending") {
        console.log("prepeding")
        usersList.prepend(card);
    } else {
        console.log("appending")
        usersList.append(card);
    }
    
}

function removeCard(id) {
    const oldCard = document.getElementById(`user-card-${id}`);
    if(oldCard)
        oldCard.remove();
}
