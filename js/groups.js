const join_text = document.querySelector('#join-group');
const join_button = document.querySelector('#join-button');

const create_text = document.querySelector('#create-group');
const create_button = document.querySelector('#create-button');

const image_label = document.querySelector('#image_upload');
let imageData = null;

// This will be all the groups created by the local user
let groups = []
localStorage.setItem("groups", JSON.stringify(groups));

function generateUniqueID(){
    return (Date.now().toString(36) + Math.random().toString(36).substring(2, 5)).toUpperCase().substring(0, 8)
}

function createGroupButtonElement (name, image, altText){
    const div = document.createElement('div');
    div.classList.add("group-card");

    const button = document.createElement('button');
    const img =  document.createElement('img');

    img.src = image;
    img.alt = altText;
    img.width = 50;
    img.height = 50;
    img.className = "group-button-image";

    button.appendChild(img); // make the image a child of the button
    button.appendChild(document.createTextNode(name)); // make the name a child of the button

    div.appendChild(button); // make the button a child of the div

    document.querySelector('#groups-grid').appendChild(div); // make the div a child of the group-buttons div
}

function getRawImage (event){
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file && file.type.startsWith('image/')) {
        reader.onload = function () {
            imageData = reader.result
        };
        reader.onerror = function () {
            alert("Error reading file");
        }
        reader.readAsDataURL(file); // this is called first, then the onload function is called
    }
    else{
        alert("Please upload an image file");
    }
}


function onCreate (){
    let userJson = localStorage.getItem("user");
    let userObject = JSON.parse(userJson);

    const groupId = generateUniqueID();
    const groupName = create_text.value;


    if (groupName === "" || checkForWhiteSpace(groupName)){
        alert("Please a real group name!");
        return;
    }

    if (imageData === null){
        alert("Please upload an image for the group");
    }

    let group = {
        id : groupId,
        groupName : groupName,
        creator : userObject.name, // in the future we will use a join so that if it updates in one place it updates in all places
        dateCreated : Date.now(),
        profilePic : imageData,
        allChats : [
            {
                "author" : "Admin",
                "time" : 0,
                "text" : "This is just texter text",
            }
        ],
        members : [userObject.name], // in the future we will use a join so that if it updates in one place it updates in all places
        admins : [userObject.name], // in the future we will use a join so that if it updates in one place it updates in all places
    }

    let allGroups = JSON.parse(localStorage.getItem("groups"));
    allGroups.push(group);
    localStorage.setItem("groups", JSON.stringify(allGroups));

    // We are going to add this group to the users groups here

    // in the future we will use a join so that if it updates in one place it updates in all places (groups)

    // in the future we will use a join so that if it updates in one place it updates in all places (user)

    userObject.groups.push(group.id);
    localStorage.setItem("user", JSON.stringify(userObject));


    console.log("Group created");
}

function onJoin (){
    const user = localStorage.getItem("user");
    let userObject = JSON.parse(user);
    const groupId = join_text.value;

    // make sure the group id is valid
    if (groupId === "" || checkForWhiteSpace(groupId)){
        alert("Please a real group id!");
        return;
    }

    // look for the group in the local storage

    let allGroups = JSON.parse(localStorage.getItem("groups"));
    let joinedGroup = null;
    for (let group in allGroups){
        if (group.id === groupId){
            joinedGroup = group;
        }
    }

    // alert user if group doesnt exit

    if (joinedGroup === null) {
        alert("Group not found");
        return;
    }

    // add the user to the group

    joinedGroup.members.push(user.name);

    // add the group to the users groups

    userObject.groups.push(joinedGroup.id);


    // update the local storage

    localStorage.setItem("user", JSON.stringify(userObject));
    localStorage.setItem("groups", JSON.stringify(allGroups));

}

function populateGroups (){ // in the future we will want to parse the database to get only groups the user is in
    let allGroups = JSON.parse(localStorage.getItem("groups"));
    for (let group in allGroups){
        createGroupButtonElement(group.groupName, group.profilePic, group.groupName);
    }
}

image_label.addEventListener('change', getRawImage);
populateGroups();
