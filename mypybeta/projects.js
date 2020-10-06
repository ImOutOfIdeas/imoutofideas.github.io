// Accent Switching Handling
const accent = localStorage.getItem("--accent-color");
const switcher = document.getElementById("accentSwitcher");

if (accent) {
    oldColor = accent;
    document.documentElement.style.setProperty("--accent-color", accent);
}

var accentColor = ["#F71735", "#008BF8", "#F5F749", "#C04CFD", "#FFAC0D", "#41EAD4", "#C52184", "#50FFB1", "#1EDA1B"];
var oldColor = "";
console.log(accentColor.length);

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function themeSwitch() {
    ran = randInt(0, (accentColor.length) - 1);
    newColor = accentColor[ran];
    if (newColor != oldColor) {
        oldColor = newColor;
        localStorage.setItem("--accent-color", newColor);
        document.documentElement.style.setProperty("--accent-color", newColor);
    } else {
        themeSwitch()
    }
}

switcher.onclick = () => {
    localStorage.setItem("--accent-color", newColor);
}



// Project Opening
const pyMenu = document.getElementById("pyProjects");
const jsMenu = document.getElementById("jsProjects");
const unityMenu = document.getElementById("unityProjects");
const topBtn = document.getElementById("topBtn");


function pyify() {
    if (pyMenu.style.display == "none") {
        pyMenu.style.display = "block";
        jsMenu.style.display = "none";
        unityMenu.style.display = "none";
        topBtn.style.display = "block";
    }
    else{
        pyMenu.style.display = "none";
        topBtn.style.display = "none";
    }
}

function jsify() {
    if (jsMenu.style.display == "none") {
        pyMenu.style.display = "none";
        jsMenu.style.display = "block";
        unityMenu.style.display = "none";
        topBtn.style.display = "block";
    }
    else{
        jsMenu.style.display = "none";
        topBtn.style.display = "none";
    }
}

function unityify() {
    if (unityMenu.style.display == "none") {
        pyMenu.style.display = "none";
        jsMenu.style.display = "none";
        unityMenu.style.display = "block";
        topBtn.style.display = "block";
    }
    else{
        unityMenu.style.display = "none";
        topBtn.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Other
}

function iframeEditor() {
    $("iframe > #document > #menu > section.left.title-bar > span > img").remove();
    $("iframe > #document > #menu > section.left.title-bar > span").append("My Py Trash");
    $("#wrapper > div");
    $("#wrapper > div > section");

}

window.onload = iframeEditor();



// Voice Recognition Color Changer

const btn = document.querySelector("#speechRegBtn");
// const content = document.querySelector(".content");
const status = document.querySelector("#vrThemeSwither");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var colors = [ "red", "blue", "yellow", "purple", "Orange", "turquoise", "pink", "mint", "green"];
var accentColor = ["#F71735", "#008BF8", "#F5F749", "#C04CFD", "#FFAC0D", "#41EAD4", "#C52184", "#50FFB1", "#1EDA1B"];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';

console.log("Voice commands, as of now, are not supported on MS Edge.")
console.log("")
console.log("List of available colors: " + colors)

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function reset() {
    status.innerHTML = "Voice Accent Color";
}

recognition.onstart = function() {
    status.innerHTML = "Listening...";
};

recognition.onspeechend = function() {
    recognition.stop();
    status.innerHTML = "Stopped Listening";
    setTimeout (reset, 800);
};

recognition.onnomatch = function(event) {
    console.log("I didn't recognise that color.");
    setTimeout (reset, 800);
}

recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript;
    var confidence = event.results[0][0].confidence;
    console.log(transcript.toLowerCase() + ": " + confidence * 100 + "% Confidence");
    if (colors.includes(transcript)){
        console.log("Valid Color");
        i = colors.indexOf(transcript);
        vrColor = accentColor[i];
        localStorage.setItem("--accent-color", vrColor);
        document.documentElement.style.setProperty("--accent-color", vrColor);
    }

    setTimeout (reset, 800);
};

recognition.onerror = function(event) {
    console.log(event.error);
};

btn.addEventListener("click", () => {
    recognition.start();
});




//---------------------------------------------//
