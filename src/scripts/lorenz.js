// (Adapted from http://wow.techbrood.com/static/20151028/2960.html)
$(function(){
  $("#simulation-name").text("Lorenz Strange Attractor");
  $("main").click(function(e){e.stopPropagation();});

  //I've included as many comments as possible for the variables associated with Lorenz Mathamatics so you can edit and play.  The rest of the script should be self - explanatory, if not, you can refer to the D3.js docs.
  //Lorenz Attractor Parameters
  var dt = 0.001, // (δτ) Represents time. Draw curve - higher the value, straighter the lines
      p = 28, // (ρ) point of origin
      w = 10, // (σ)width of main element - higher the number, narrower the width
      beta = 8 / 3, // (β) points of equilibrium - this applied value results in the infinity symbol. higher values will break the equilibrium, causing the ends to separate and spread. When ρ = 28, σ = 10, and β = 8/3, the Lorenz system has chaotic solutions; it is this set of chaotic solutions that make up the Lorenz Attractor (the infinity symbol).  If ρ < 1 then there is only one equilibrium point, which is at the origin. This point corresponds to no convection. All orbits converge to the origin when ρ  < 1.  The 'fork' occurs occurs at ρ = 1, or ρ > 1 Try it. 

      //Below x, y, and z values are the components of a given three dimensional location in space
      x0 = 0.5, //change in x,y, or z with respect to time
      y0 = 0.5, //"                                       "
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
    context.lineWidth = 0.2;
  }
  $(window).resize(setDims);
  setDims();

  //Color Range
  var color = d3.scalePow()
                .domain([0, 8, 23, 55])
                .range(["white", "cyan", "deepskyblue", "#00f"])
                .exponent(1.5)
                .interpolate(d3.interpolateRgb);


  //mouse reactions
  d3.select("body").on("mousemove", function() {
    var m = d3.mouse(canvas.node());
    x0 = (m[0] - width / 2) / 12;
    y0 = (m[1] - height / 2) / 8;
    z0 = 10;
  });

  function spawnSprite(spawnAtMouse) {
    if(typeof spawnAtMouse == "undefined" || spawnAtMouse !== true)
      spawnAtMouse = false;
    
    var x, y;
    do{
      x = width * Math.random() - width / 2;
      y = height * Math.random() - height / 2;
    }while(Math.abs(x) < width / 4 && Math.abs(y) < height / 4); //Redo it until it's not in the center quarter (by area) of the screen
    x = x / 12;
    y = y / 8;
    var z = z0 + (Math.random() - 0.5) * 10,
        n = Math.random() * 3 | 1, //different speeds
        t1 = Math.random() * 10000 + 20000; // time (sec) it's allowed to swirl for //--todo-- there are way too many and they never end :(
    
    if(spawnAtMouse){
      x = x0;
      y = y0;
    }
    
    
    var offset = Math.random() * 30; //to vary the colors more
    
    var t = d3.timer(function(t0) {
      for (var i = 0; i < n; ++i) {
        context.strokeStyle = color(z + offset);
        context.beginPath();
        context.moveTo(x, y);
        x += dt * w * (y - x);
        y += dt * (x * (p - z) - y);
        z += dt * (x * y - beta * z);
        context.lineTo(x, y);
        context.stroke();
      }
      if(t0 > t1)
        t.stop();
    });
  }
  function fadeTick(){
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);

    //source-atop draws old image on top of the new image, eliminating the part of the old image that is outside of the new image range.
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = "rgba(0,0,0,.05)";
    context.fillRect(0, 0, width, height);
    context.restore();
  }

  d3.interval(function(elapsedTime){spawnSprite();}, 500);
  d3.interval(function(elapsedTime){fadeTick();}, 200);
  for(var i = 0; i < 30; i++)
    spawnSprite();
  $("body").on("click", function(){
    spawnSprite(true);
  });

});
