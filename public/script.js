// const socket = io('http://localhost:9000'); // the / namespace/endpoint
const username = prompt("Enter your username")
const socket = io('http://localhost:9000',{
    query: {
        username
    }
}); // the / namespace/endpoint
socket.on('connect',()=>{
    console.log(socket.id)
})
let nsSocket;


socket.on('nsList',(nsData) => {
    console.log(nsData);
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    nsData.forEach(ns => {
        namespacesDiv.innerHTML += `<div class='namespace'><img ns='${ns.endpoint}' src='${ns.img}'/></div>`
    });
    Array.from(document.getElementsByClassName('namespace')).forEach(ele => {
        ele.addEventListener('click',(e) => {
            const nsEndpoint = e.target.getAttribute('ns');
            console.log(`clicked to join ${nsEndpoint}`);
            joinNs(nsEndpoint);
        })
    })

    joinNs('/wiki');
    
})