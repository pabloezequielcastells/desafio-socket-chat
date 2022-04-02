let socket = io();
let chatBox = document.getElementById('chatBox');
let chatbody = document.getElementById('chatbody');
let user;


let avatars = [
    'https://bootdey.com/img/Content/avatar/avatar1.png',
    'https://bootdey.com/img/Content/avatar/avatar2.png',
    'https://bootdey.com/img/Content/avatar/avatar3.png',
    'https://bootdey.com/img/Content/avatar/avatar4.png',
    'https://bootdey.com/img/Content/avatar/avatar5.png',
    'https://bootdey.com/img/Content/avatar/avatar6.png',
    'https://bootdey.com/img/Content/avatar/avatar7.png',
    'https://bootdey.com/img/Content/avatar/avatar8.png',
];

Swal.fire({
    title: "Identifícate",
    input: 'text',
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && '¡Necesitas escribir un nombre de usuario para participar!';
    }
}).then(result => {
    socket.emit('login', { user });
    user = {
        name: result.value,
        id: socket.id,
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
    };
});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user, text: chatBox.value.trim() });
            chatBox.value = "";
        }
    }
});

socket.on('chat', data => {
    let messages = "";
    data.forEach(message => {
        messages = messages + `<div class="${ message.user.id == user.id ? 'answer right' : 'answer left' }">
            <div class="avatar">
                <img src="${ message.user.avatar }" alt="User name">
            </div>
            <div class="name">${ message.user.id == user.id ? 'Yo' : message.user.name }</div>
            <div class="text">
                ${message.text}
            </div>
            <div class="time">${ message.time } min ago</div>
        </div>`;
    });

    chatbody.innerHTML = messages + `<div class="answer right">
                                        <div style="height: 300px;"></div>
                                      </div>`;

    window.scrollTo(0, document.body.scrollHeight);
});