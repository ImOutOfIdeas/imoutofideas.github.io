const socket = io('ws://24.210.75.194:5500/');

socket.on('message', text => {
    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el);
});

document.querySelector('button').onclick = () => {
    const input = document.querySelector('input');

    const text = input.value;

    input.value = "";

    socket.emit('message', text);
}