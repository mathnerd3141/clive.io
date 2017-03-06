animations = 
  'Lorenz': {title: 'Lorenz Strange Attractor', desc: 'Click around to add streamers!'}

$ =>
  # Set the canvas to automatically resize
  resize = =>
    $ 'canvas#splash'
      .attr 'width', $('header').outerWidth()
      .attr 'height', $('header').outerHeight()
  resize()
  $('window').resize resize
  
  # Fetch and run the simulation
  name = Object.keys(animations)[Math.floor Math.random()*Object.keys(animations).length]
  $.getScript name + '.js', =>
    $('canvas#splash').css {opacity: 1}
  $('#simulation-name').text animations[name].title
  $('#simulation-note').text animations[name].desc
  $('#simulation-info').show()

$ =>
  # Smooth scrolling, adapted from calcbee and onestep
  # Originally adapted from //http://www.paulund.co.uk/smooth-scroll-to-internal-links-with-jquery
  $('a[href^="#"]').on 'click', (e) ->
    $('html, body').stop().animate {scrollTop: $(@hash).offset().top}, 900, 'swing', =>
      window.location.hash = @hash
    e.preventDefault()

# Google Analytics
`(function(C,l,i,v,e,I,O){C['GoogleAnalyticsObject']=e;C[e]=C[e]||function(){
(C[e].q=C[e].q||[]).push(arguments)},C[e].l=1*new Date();I=l.createElement(i),
O=l.getElementsByTagName(i)[0];I.async=1;I.src=v;O.parentNode.insertBefore(I,O)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-62605323-2', 'auto');
ga('send', 'pageview');`
