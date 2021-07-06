function joinRoom(roomName){
    nsSocket.emit('joinRoom',roomName,(newNumberOfMembers)=>{
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    });

    nsSocket.on('historyCatchup',history=>{
        // console.log(history);
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML = '';
        history.forEach(msg => {
            const newMsg = buildHtml(msg);
            const currMsg = messagesUl.innerHTML;
            messagesUl.innerHTML = currMsg+newMsg;
        })
        messagesUl.scrollTo(0,messagesUl.scrollHeight);
        nsSocket.on('updateMembers',(numberOfClinets) => {
            document.querySelector('.curr-room-num-users').innerHTML = `${numberOfClinets} <span class="glyphicon glyphicon-user"></span>`
            document.querySelector('.curr-room-text').innerText = `${roomName}`
        })
    })
}