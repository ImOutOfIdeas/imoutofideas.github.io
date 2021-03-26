var lastScrollTop = 0;

var secHt = document.getElementById('section1').offsetHeight;
console.log(secHt);

window.addEventListener("resize", () => {
    var secHt = document.getElementById('section1').offsetHeight;
    window.scrollTo(0, 0)
    console.log(secHt);
});

window.addEventListener("scroll", function() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    //console.log(st, lastScrollTop);
    if (st > lastScrollTop && st > 0 && st < secHt){
        window.scrollTo({left: 0, top: secHt, behavior: "smooth"}); // downscroll code
    } else if (st > lastScrollTop && st > secHt && st < 2 * secHt) {
        window.scrollTo({left: 0, top: 2 * secHt, behavior: "smooth"}); // downscroll code
    } else if (st > lastScrollTop && st > 2 * secHt && st < 3 * secHt) {
        window.scrollTo({left: 0, top: 3 * secHt, behavior: "smooth"}); // downscroll code
    } else if (st > lastScrollTop && st > 3 * secHt && st < 4 * secHt) {
        window.scrollTo({left: 0, top: 4 * secHt, behavior: "smooth"}); // downscroll code
    } else if (st < lastScrollTop && st > 0 && st < secHt){
        window.scrollTo({left: 0, top: 0, behavior: "smooth"}); // upscroll code
    } else if (st < lastScrollTop && st > secHt && st < 2 * secHt) {
        window.scrollTo({left: 0, top: secHt, behavior: "smooth"}); // upscroll code
    } else if (st < lastScrollTop && st > 2 * secHt && st < 3 * secHt) {
        window.scrollTo({left: 0, top: 2 * secHt, behavior: "smooth"}); // upscroll code
    } else if (st < lastScrollTop && st > 3 * secHt && st < 4 * secHt) {
        window.scrollTo({left: 0, top: 3 * secHt, behavior: "smooth"}); // upscroll code
    }
    lastScrollTop = st <= 0 ? 0 : st;
})
