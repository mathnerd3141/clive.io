animations = 
  'Lorenz': {title: 'Lorenz Strange Attractor', desc: 'Click or tap anywhere to add streamers!'}
  # Gravitation, Swarm intelligence, Delaunay face, machine learning, stereoscopic simulations, Hyperloop!

$ =>
  # Set original canvas dimensions
  orig_dims = {width: $('header').outerWidth(), height: $('header').outerHeight()}
  $('canvas#splash').attr orig_dims
  
  # Make the canvas automatically resize without redrawing (CSS resize only)
  resize = =>
    curr_dims = {width: $('header').outerWidth(), height: $('header').outerHeight()}
    if curr_dims.width / curr_dims.height > orig_dims.width / orig_dims.height
      $('canvas#splash').css
        width: curr_dims.width
        height: curr_dims.width / orig_dims.width * orig_dims.height
        'margin-left': 0
        'margin-top': (curr_dims.height - curr_dims.width / orig_dims.width * orig_dims.height) / 2
    else
      $('canvas#splash').css
        width: curr_dims.height * orig_dims.width / orig_dims.height
        height: curr_dims.height
        'margin-left': (curr_dims.width - curr_dims.height * orig_dims.width / orig_dims.height) / 2
        'margin-top': 0
  getScalingFactor = =>
    curr_dims = {width: $('header').outerWidth(), height: $('header').outerHeight()}
    if curr_dims.width / curr_dims.height > orig_dims.width / orig_dims.height
      curr_dims.width / orig_dims.width
    else
      curr_dims.height / orig_dims.height
  resize()
  $(window).resize resize
  
  # Fetch and run the simulation
  name = Object.keys(animations)[Math.floor Math.random()*Object.keys(animations).length]
  props = window[name] "canvas#splash"
  
  # Deal with scaling problems for onclick/touch
  if typeof props?.onclicktouch == "function"
    $(window).on "mousedown click touchstart tap touch", (e) =>
      scale = getScalingFactor()
      props.onclicktouch (e.pageX - parseInt($('canvas#splash').css('margin-left'))) / scale,
        (e.pageY - parseInt($('canvas#splash').css('margin-top'))) / scale
  
  # Fade in and add content
  $('canvas#splash').css {opacity: 1}
  $('#simulation-name').text animations[name].title
  $('#simulation-note').text animations[name].desc
  $('#simulation-info').show()

# Google Analytics
`(function(C,l,i,v,e,I,O){C['GoogleAnalyticsObject']=e;C[e]=C[e]||function(){
(C[e].q=C[e].q||[]).push(arguments)},C[e].l=1*new Date();I=l.createElement(i),
O=l.getElementsByTagName(i)[0];I.async=1;I.src=v;O.parentNode.insertBefore(I,O)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-62605323-2', 'auto');
ga('send', 'pageview');`
