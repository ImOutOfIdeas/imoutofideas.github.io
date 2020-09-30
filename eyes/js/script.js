var s = Snap("#svgEyes");

// Instantiate
var circle_1 = s.circle(300, 100, 80);
var circle_2 = s.circle(265, 100, 80);
var circle_3 = s.circle(600, 100, 80);
var circle_4 = s.circle(565, 100, 80);
var ellipse_1 = s.ellipse(282, 110, 100, 50);
var ellipse_2 = s.ellipse(582, 110, 100, 50);


// Group
var circles_1 = s.group(circle_1, circle_2);
var circles_2 = s.group(circle_3, circle_4);
var eyes = s.group(circles_1, circles_2, ellipse_1, ellipse_2)

//Style
circles_1.attr({
  fill: 'coral',
  fillOpacity: .6,
  mask: ellipse_1
});

circles_2.attr({
  fill: 'coral',
  fillOpacity: .6,
  mask: ellipse_2
});

ellipse_1.attr({
  fill: '#fff',
  opacity: .8
});

ellipse_2.attr({
  fill: '#fff',
  opacity: .8
});

// Animate
function blink(){
    ellipse_1.animate({ry:3}, 220,function(){
        ellipse_1.animate({ry: 50}, 300);
  })
  ellipse_2.animate({ry:3}, 220,function(){
      ellipse_2.animate({ry: 50}, 300);
  })
}

function unblink(){
    ellipse_1.animate({ry: 50}, 300);
    ellipse_2.animate({ry: 50}, 300);
 }

 function randInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min);
 }

// Loop
function loop(){
    var ran = randInt(1000, 3200);
    blink();
    setTimeout(loop, ran);
}


loop();
