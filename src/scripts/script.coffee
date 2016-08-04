# Smooth scrolling, adapted from calcbee and onestep
# Originally adapted from //http://www.paulund.co.uk/smooth-scroll-to-internal-links-with-jquery
$ =>
  $('a[href^="#"]').on 'click', (e) =>
    $('html, body').stop().animate {scrollTop: $(@hash).offset().top}, 900, 'swing', =>
      window.location.hash = @hash
    e.preventDefault()

# On full load of all assets, remove the loading screen
$(window).bind 'load', =>
  $('body').removeClass 'loading'

# Google Analytics
`(function(c,l,i,v,e,I,O){c['GoogleAnalyticsObject']=e;c[e]=c[e]||function(){
(c[e].q=c[e].q||[]).push(arguments)},c[e].l=1*new Date();I=l.createElement(i),
O=l.getElementsByTagName(i)[0];I.async=1;I.src=v;O.parentNode.insertBefore(I,O)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-62605323-2', 'auto');
ga('send', 'pageview');`
