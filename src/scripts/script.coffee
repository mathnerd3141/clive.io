animations = 
  'Lorenz Strange Attractor': 'Lorenz'

$ =>
  WIDTH = HEIGHT = 0
  resize = =>
    WIDTH = $('header').outerWidth()
    HEIGHT = $('header').outerHeight()
    $ 'canvas#splash'
      .attr 'width', WIDTH
      .attr 'height', HEIGHT
  resize()
  $('window').resize resize
  
  $('#simulation-desc').show()
  
  names = Object.keys animations
  name = names[Math.floor Math.random()*names.length]
  $('#simulation-name').text name
  $('main section').click (e) =>
    e.stopPropagation()
  
  script = $.extend document.createElement('script'),
    type: 'text/javascript'
    async: true
    defer: true
    onload: =>
      $('canvas#splash').css {opacity: 1}
      window[animations[name]]()
    src: animations[name] + '.js'
  document.getElementsByTagName('head')[0].appendChild(script)


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
