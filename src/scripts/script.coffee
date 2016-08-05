animations = 
  "Lorenz Strange Attractor": "lorenz.js"

$ =>
  WIDTH = 0
  HEIGHT = 0
  
  resize = ->
    WIDTH = $('header').outerWidth()
    HEIGHT = $('header').outerHeight()
    $ 'canvas#splash'
      .attr 'width', WIDTH
      .attr 'height', HEIGHT
  
  resize()
  
  $('window').resize resize
  
  ###
  $(document).mousemove (e) ->
    $('div#title').css
      left: (e.pageX - WIDTH / 2) / 20
      top: (e.pageY - HEIGHT / 2) / 20
    $('.position, .tagline').css
      left: (e.pageX - WIDTH / 2) / 50
      top: (e.pageY - HEIGHT / 2) / 50
  ###
  
  names = Object.keys animations
  name = names[Math.floor Math.random()*names.length]
  $("#simulation-name").text name
  $("main section").click (e) =>
    e.stopPropagation()
  
  script = $.extend document.createElement('script'),
    type: 'text/javascript'
    async: true
    defer: true
    onload: ->
      console.log 'loaded'
      #fade in
    src: animations[name]
  document.getElementsByTagName('head')[0].appendChild(script)


popupData = 
  lhlive:
    title: "LexHack Live Site"
    url: "http://live.lexhack.org"
    desc: "" # I'm hesitant to put this here. Can I copy an html element from elsewhere in the page and drop it into the modal?
            # So then I won't be repeating stuff.
            # OR pug can interpolate...
  #onestep:
  #lsb:
  #lh:
  #lhsmath:
  #lmt:
  #usaco:
  #usapho:
  #usamo:
  #scibowl:

$ =>
  # Smooth scrolling, adapted from calcbee and onestep
  # Originally adapted from //http://www.paulund.co.uk/smooth-scroll-to-internal-links-with-jquery
  $('a[href^="#"]').on 'click', (e) =>
    $('html, body').stop().animate {scrollTop: $(@hash).offset().top}, 900, 'swing', =>
      window.location.hash = @hash
    e.preventDefault()

  $ '[data-popup]'
    .addClass 'linkish'
    .on 'click', (e) ->
      key = $(this).data 'popup'
      #alert popupData[key]
      e.preventDefault()

# On full load of all assets (not just the DOM, as above), remove the loading screen
$(window).bind 'load', =>
  $('body').removeClass 'loading'

# Google Analytics
`(function(C,l,i,v,e,I,O){C['GoogleAnalyticsObject']=e;C[e]=C[e]||function(){
(C[e].q=C[e].q||[]).push(arguments)},C[e].l=1*new Date();I=l.createElement(i),
O=l.getElementsByTagName(i)[0];I.async=1;I.src=v;O.parentNode.insertBefore(I,O)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-62605323-2', 'auto');
ga('send', 'pageview');`
