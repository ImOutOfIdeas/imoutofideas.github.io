console.log("Use sayIntro function to start the voices");


let voices = [];
voices = window.speechSynthesis.getVoices();

function sayIntro() {
    let speech = new SpeechSynthesisUtterance();
    speech.rate = 0.1;
    speech.text = "Hello, your resolution is 1920 by 1080... Good Luck. You're gonna need it!";
    window.speechSynthesis.speak(speech);
    
}


function sayPos() {
    let speech = new SpeechSynthesisUtterance();
    speech.voice = voices[Math.floor(Math.random() * 25)];
    speech.text = `X ${Math.floor(pos.x)}. Y ${Math.floor(pos.y)}`;
    speech.rate = 2;
    speech.pitch = Math.random() * 2;

    window.speechSynthesis.speak(speech);
}

setTimeout(sayIntro, 500);
setInterval(sayPos, 100);
