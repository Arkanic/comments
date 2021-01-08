let PAGE = "test";
let LINK = "https://8080-d3cf9c59-5ad8-4226-9e36-93d65409fca2.ws-us03.gitpod.io/"

let commentsbox = document.getElementById("commentsbox");
let name = document.getElementById("name");
let message = document.getElementById("message");
let submit = document.getElementById("submit");

submit.addEventListener("click", (e) => {
    if(name.value == "") return error("name is empty");
    if(message.value == "") return error("message is empty");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", LINK + "api/postcomment");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if(xhr.readyState != 4) return;
        let res = JSON.parse(xhr.responseText);
        if(!res.success) return error(res.message);
        getComments();
    }
    xhr.send(JSON.stringify({"name": name.value, "page": PAGE, "content": message.value}));
});

function comments(res) {
    commentsbox.innerHTML = "";
    let comments = res.content.sort((a, b) => b.created - a.created);
    for(let i in comments) {
        console.log("h");
        renderComment(comments[i], commentsbox);
    };
}
function renderComment(c, e) {
    let box = document.createElement("div");
    box.innerHTML = `
    <p><b>${c.name}</b></p>
    <p>${c.content}</p>
    <p><small>${new Date(c.created).toString()}</small></p>
    <div id="children-${c.id}"></div>
    <hr>
    `;
    e.appendChild(box);
}

function getComments() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", LINK + "api/getcomments");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if(xhr.readyState != 4) return;
        let res = JSON.parse(xhr.responseText);
        if(!res.success) return error(res.message);
        comments(res);
    }
    xhr.send(JSON.stringify({"page": PAGE}));
}  
getComments();

function error(msg) {
    console.log(msg);
}