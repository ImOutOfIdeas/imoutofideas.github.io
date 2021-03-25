const writeEvent = (text) => {
    // <ul> element
    const parent = document.querySelector("#events");

    // <li> element
    const el = document.createElement("li");
    el.innerHTML = text;

    parent.appendChild(el);
};

writeEvent("Welcome to RPS")
