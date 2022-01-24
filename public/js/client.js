const socket = io();

var username;
var chats = document.querySelector(".chats");
var users_list= document.querySelector(".users-list");
var users_count= document.querySelector(".users-count");
var msg_send = document.querySelector('#user-send');
var user_msg = document.querySelector('#user-msg');
var con = document.querySelector('.container'); 

do
{
    username = prompt("Enter your name :");
}while(!username);//here we says that this propmt will apear until user enter his name

/*it will be called when user will join*/
socket.emit("new-user-joined",username);//socket.emit is used for telling that new user is joined.
//when socket.emit function will called then request will send to server

/*Notifying that user is joined*/
socket.on('user-connected',(socket_name)=>{
userJoinedLeft(socket_name,'joined');
});

/* function to create join/left status div*/
function userJoinedLeft(name,status){
  let div = document.createElement("div");
  div.classList.add("user-join");
  let content = `<p class="txt"><b>${name}</b> ${status} the chat</p>`;
  div.innerHTML = content;
  chats.appendChild(div);
  con.scrollTop = con.scrollHeight;
} 

/*Notifying that user has left*/
socket.on('user-disconnected',(user)=>{
  userJoinedLeft(user,'left');
});

/*for updating user list and user counts */
socket.on('user-list',(users)=>{
  users_list.innerHTML = "";
  users_arr=Object.values(users);//we says that in variable users_arr store the value of users means names of users
  for(i=0;i<users_arr.length;i++){//this loop will create 'p' tags and stores names of users in those 'p' tags
  let p=document.createElement("p");
  p.innerText = users_arr[i];
  users_list.appendChild(p);//'users_list' is declared at top in variables that is a div tag
  // in which we a new appending child tag that is 'p' in which name of user is stored  
}
users_count.innerHTML = users_arr.length;
})


msg_send.addEventListener('click',()=>{
  let data={
    user:username,
    msg:user_msg.value
  };
  if(user_msg.value!=''){
    appendMessage(data,'outgoing');
    socket.emit('message',data);
    user_msg.value='';
  }
})

function appendMessage(data,status){
  let div=document.createElement('div');
  div.classList.add('message',status);
  let content = `<h5>${data.user}</h5><p class="data_msg">${data.msg}</p>`;
  div.innerHTML = content;
  chats.appendChild(div);
  con.scrollTop = con.scrollHeight;
}

socket.on('message',(data)=>{
  appendMessage(data,'incoming');
})