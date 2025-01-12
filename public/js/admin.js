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
        const card = addUserCard(user);
    }
}



function addUserCard(user) {
    
    const { userColor, userBtnText, addCardFunction } = user.state === "active" ? 
           {userColor: "success", userBtnText: "DEACTIVATE", addCardFunction: addActiveCard } :
           {userColor: "danger", userBtnText: "ACTIVATE", addCardFunction: addPendingCard };
           
    const userCard = document.createElement("div");
    userCard.id = `user-card-${user.id}`;
    userCard.dataset.id = user.id;
    userCard.className = `userCard bg-${userColor}`;

    const emailDiv = create("div", user.email);
    emailDiv.className = "email";
    const fullName = user.firstName +" " + user.lastName;
    const nameDiv = create("div", fullName);
    nameDiv.className = "name";

    const stateBtn = create("button", userBtnText);
    stateBtn.addEventListener("click", handleTogglePendingClick);
    stateBtn.className = `btn btn-${userColor}`;
    userCard.append(emailDiv, nameDiv, stateBtn);
    addCardFunction(userCard);
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


const noPendingUsersHTML = "<h2> All Done You Did Great! </h2>";
const noActiveUsersHTML = "<h2> What Are You Doing? Start Activating! </h2>";


function addActiveCard(card) {
    console.log("adding active", card);
    if(activeUsersList.innerHTML === noActiveUsersHTML) activeUsersList.innerHTML = "";
    activeUsersList.append(card);
}
function addPendingCard(card) {
    console.log("adding pending", card);

    if(pendingUsersList.innerHTML === noPendingUsersHTML) pendingUsersList.innerHTML = "";
    pendingUsersList.append(card);
}

function removeCard(id) {
    const oldCard = document.getElementById(`user-card-${id}`);
    if(oldCard)
        oldCard.remove();
}

function clearCards(card) {
    pendingUsersList.innerHTML = noPendingUsersHTML;
    activeUsersList.innerHTML = noActiveUsersHTML;
}