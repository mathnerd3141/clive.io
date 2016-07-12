// (From http://wow.techbrood.com/static/20151028/2960.html)
$(function(){

//I've included as many comments as possible for the variables associated with Lorenz Mathamatics so you can edit and play.  The rest of the script should be self - explanatory, if not, you can refer to the D3.js docs.
//Lorenz Attractor Parameters
var dt = 0.001, // (δτ) Represents time. Draw curve - higher the value, straighter the lines
    p = 28, // (ρ) point of origin
    w = 10, // (σ)width of main element - higher the number, narrower the width
    beta = 8 / 3, // (β) points of equilibrium - this applied value results in the infinity symbol. higher values will break the equilibrium, causing the ends to separate and spread. When ρ = 28, σ = 10, and β = 8/3, the Lorenz system has chaotic solutions; it is this set of chaotic solutions that make up the Lorenz Attractor (the infinity symbol).  If ρ < 1 then there is only one equilibrium point, which is at the origin. This point corresponds to no convection. All orbits converge to the origin when ρ  < 1.  The 'fork' occurs occurs at ρ = 1, or ρ > 1 Try it. 

    //Below x, y, and z values are the components of a given three dimensional location in space
    x0 = .5, //change in x,y, or z with respect to time
    y0 = .5, //"                                       "
    z0 = 10; //"                                       "

var width, height, canvas = d3.select("canvas#splash");
var context = canvas.node().getContext("2d");
function setDims(){
  width = $("header").outerWidth();
  height = $("header").outerHeight();
  
  canvas.attr("width", width)
      .attr("height", height);
  
  // set how the new images are drawn onto the existing image. 'lighter' will  display the new over the old
  context.globalCompositeOperation = "lighter";
  context.translate(width / 2, height / 2);
  context.scale(12, 8);
  context.lineWidth = .2;
}
$(window).resize(setDims);
setDims();

//Color Range
var color = d3.scale.linear()
    .domain([0, 20, 30, 45])
    .range(["white", "cyan", "blue", "navyblue"])
    .interpolate(d3.interpolateHcl);


//mouse reactions
d3.select("body").on("mousemove", function() {
    var m = d3.mouse(canvas.node());
    x0 = (m[0] - width / 2) / 12;
    y0 = (m[1] - height / 2) / 8;
    z0 = 10;
});

//consistent timing of animations when concurrent transitions are scheduled for fluidity
setInterval(function() {
    var x = (width * Math.random() - width / 2)/12, //x0 + (Math.random() - .5) * 4,
        y = (height * Math.random() - height / 2)/8, //y0 + (Math.random() - .5) * 4,
        z = z0 + (Math.random() - .5) * 4,
        n = Math.random() * 3 | 0,
        t1 = Math.random() * 10000 + 15000; // time it's allowed to swirl for
    
    if(Math.random() < 0.5){
      x = x0 + (Math.random() - .5) * 4;
      y = y0 + (Math.random() - .5) * 4;
    }
    
    d3.timer(function(t0) {
        for (var i = 0; i < n; ++i) {
            context.strokeStyle = color(z);
            context.beginPath();
            context.moveTo(x, y);
            x += dt * w * (y - x);
            y += dt * (x * (p - z) - y);
            z += dt * (x * y - beta * z);
            context.lineTo(x, y);
            context.stroke();
        }
        return t0 > t1;
    });

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);

    //source-atop draws old image on top of the new image, eliminating the part of the old image that is outside of the new image range.
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = "rgba(0,0,0,.03)";
    context.fillRect(0, 0, width, height);
    context.restore();
}, 50);

});