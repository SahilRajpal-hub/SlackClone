function joinNs(endpoint){
    if(nsSocket){
        // check if nsSocket is already a socket
        nsSocket.close();
        document.querySelector('.message-form').removeEventListener('submit',formSubmission);
    }
    nsSocket = io(`http://localhost:9000${endpoint}`);

    nsSocket.on('nsRoomLoad',nsRooms => {
        // console.log(nsRooms);
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach(nsRoom => {
            let glpyh;
            if(nsRoom.privateRoom){
                glpyh='lock';
            }else{
                glpyh='globe';
            }
            roomList.innerHTML += `<li  class="room"><span class="glyphicon glyphicon-${glpyh}"></span>${nsRoom.roomTitle}</li>`
        })

        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach(ele => {
            ele.addEventListener('click',(e)=>{
                // console.log(e.target.innerText)
                joinRoom(e.target.innerText);
            })
        })

        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        // console.log(topRoomName);
        joinRoom(topRoomName);
    })

    nsSocket.on('messageToClients',(msg)=>{
        console.log(msg);
        document.querySelector('#messages').innerHTML += buildHtml(msg);
    })

    document.querySelector('.message-form').addEventListener('submit',formSubmission);
}

function formSubmission(e){
    e.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer',{text:newMessage});
}

function buildHtml(msg){
    const newConvertedString = new Date(msg.time).toLocaleDateString();
    const newHtml = `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username}<span>${newConvertedString}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>
    `
    return newHtml;
}