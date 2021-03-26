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
        window.scrollTo(0, secHt); // downscroll code
    } else if (st > lastScrollTop && st > secHt && st < 2 * secHt) {
        window.scrollTo(0, 2 * secHt); // downscroll code
    } else if (st > lastScrollTop && st > 2 * secHt && st < 3 * secHt) {
        window.scrollTo(0, 3 * secHt); // downscroll code
    } else if (st > lastScrollTop && st > 3 * secHt && st < 4 * secHt) {
        window.scrollTo(0, 4 * secHt); // downscroll code
    } else if (st < lastScrollTop && st > 0 && st < secHt){
        window.scrollTo(0, 0); // upscroll code
    } else if (st < lastScrollTop && st > secHt && st < 2 * secHt) {
        window.scrollTo(0, secHt); // upscroll code
    } else if (st < lastScrollTop && st > 2 * secHt && st < 3 * secHt) {
        window.scrollTo(0, 2 * secHt); // upscroll code
    } else if (st < lastScrollTop && st > 3 * secHt && st < 4 * secHt) {
        window.scrollTo(0, 3 * secHt); // upscroll code
    }
    lastScrollTop = st <= 0 ? 0 : st;
})
