// Accent Switching Handling
const accent = localStorage.getItem("--accent-color");
const switcher = document.getElementById("accentSwitcher");

if (accent) {
    oldColor = accent;
    document.documentElement.style.setProperty("--accent-color", accent);
}

var accentColor = ["#F52F57", "#008BF8", "#35A7FF", "#98CE00", "#F5F749", "#5E239D", "#CCFF66", "#FCAB10", "#E03616", "#C04CFD", "#AF42AE", "#F71735", "#41EAD4", "#03CEA4", "#FCAB10", "#F56476", "#008DD5", "#5EEB5B", "#C52184", "#50FFB1", "#01BAEF", "#FFB30F", "#FEEA00", "#70D6FF", "#4EFFEF", "#2CEAA3", "#EEC643", "#EEF0F2", "#E98A15", "#98E2C6", "#EF798A", "#7A28CB", "#FC60A8", "#FFE74C", "#35A7FF"];
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







//---------------------------------------------//
