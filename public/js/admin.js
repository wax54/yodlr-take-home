const activeUsersList = document.getElementById("active-users-list");
const pendingUsersList = document.getElementById("pending-users-list");
let users = {};
updateUsers();

const sort = {
    firstName: function (a, b) {
        return a.firstName < b.firstName ? -1 : 1;
    },
    stateThenFirstName: function(a, b) {
        if (a.state !== b.state) {
            //if the states are different, put the pending one before the active one
            return a.state === "pending" ? -1 : 1;
        } else {
            //otherwise, organize by first name
            return a.firstName < b.firstName ? -1 : 1;
        }
    }
}
async function updateUsers() {
    const allUsers = await UserApi.getAll();
    allUsers.forEach(user => users[user.id] = user );
    updateUserCards()
}

function updateUserCards() {
    clearCards();

    const allUsers = Object.values(users).sort(sort.firstName);;
    for(let user of allUsers){
        const card = createUserCard(user);
        (user.state === "active") ? 
            addActiveCard(card) :
            addPendingCard(card)
    }
}

function createUserCard(user) {
    const container = document.createElement("div");
    container.id = `user-card-${user.id}`;
    container.dataset.id = user.id;
    container.className = `userCard ${user.state}`;

    const emailDiv = create("div", user.email);
    emailDiv.className = "email";
    const fullName = user.firstName +" " + user.lastName;
    const nameDiv = create("div", fullName);
    nameDiv.className = "name";

    const stateBtn = create("button", user.state);
    stateBtn.addEventListener("click", handleTogglePendingClick);
    stateBtn.className = "btn";


    container.append(emailDiv, nameDiv, stateBtn);
    return container;
}

function create(tag, text = "") {
    const el = document.createElement(tag);
    el.innerText = text;
    return el;
}

async function handleTogglePendingClick(evt) {
    const id = +evt.target.parentElement.dataset.id;
    togglePending(id);
    //update the UI
    updateUserCards();
    //make the API call to update the state serverside
    await UserApi.update(users[id]);

}

/** toggles the state of the user with the given ID in memory 
 * (throws error on invalid ID)
*/
function togglePending(id) {  
    //getting new State
    const updatedState = users[id].state === "pending" ? "active" : "pending";
    //updating the users state in memory 
    users[id].state = updatedState;
}


function addActiveCard(card) {
    activeUsersList.append(card);
}
function addPendingCard(card) {
    pendingUsersList.append(card);
}

function removeCard(id) {
    const oldCard = document.getElementById(`user-card-${id}`);
    if(oldCard)
        oldCard.remove();
}

function clearCards(card) {
    pendingUsersList.innerHTML = "";
    activeUsersList.innerHTML = "";

}