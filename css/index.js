const socket = io();

var username;
var messagebox = document.querySelector(".messagebox");
const form = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const messagesend = document.getElementById("btn");
var user_list = document.querySelector(".list");
var audio = new Audio('css/ting.mp3');


do{
    username = prompt("Enter Your Name");
}while(!username);

socket.emit("new-user-joined",username);

socket.on('user-join', (socket_name) =>{
    userJoinLeft(socket_name,'joined');
});

function userJoinLeft(name,status){
    let div = document.createElement('div');
    div.classList.add('user-joined');
    let content = `<p><b>${name}</b> ${status} the chat </p>`;
    div.innerHTML = content;
    messagebox.appendChild(div);
}

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
});

socket.on('user-list',(users)=>{
    user_list.innerHTML="";
    users_arr = Object.values(users);
    for(i=0;i<users_arr.length;i++){
        let p = document.createElement('li');
        p.innerText = users_arr[i];
        user_list.appendChild(p);
    }
})

messagesend.addEventListener('click',()=>{
    let data = {
        user: username,
        msg: messageInput.value
    };
    if(messageInput.value!=""){
        appendMessage(data,'outgoing');
        socket.emit('message-right',data);
        messageInput.value = "";
    }
});

function appendMessage(data,status){
    let div = document.createElement('div');
    div.classList.add('message-right',status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>`;
    div.innerHTML = content;
    messagebox.appendChild(div);
}
function appendMessages(data,status){
    let div = document.createElement('div');
    div.classList.add('message-left',status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>`;
    div.innerHTML = content;
    messagebox.appendChild(div);
    audio.play();
}

socket.on("message-right",(data)=>{
    appendMessages(data,'incoming');
})