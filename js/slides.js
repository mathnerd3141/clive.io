/*
slides.js
Script for a slideshow.
Originally written by Clive Chan for http://cchan.github.io/makerspace
Adapted by Clive Chan for http://clive.io */

/*

	<div class="slideshow-image-wrapper">
		<div class="slideshow-image curr"></div>
		<div class="slideshow-image next"></div>
	</div>
	
	<div class="slideshow-text-wrapper">
		<div class="slideshow-text-filler">&nbsp;</div>
		<div class="slideshow-text curr"></div>
		<div class="slideshow-text next"></div>
	</div>

*/



Array.prototype.shuffle = function(){
	for(var i = 0; i < this.length; i++){
		var other = i + Math.floor((this.length-i) * Math.random());
		var tmp = this[i];
		this[i] = this[other];
		this[other] = tmp;
	}
} //make a matrix library?

(function(slideshow, $, undefined){
	var previ = 0, nowi = 0, nexti = 0;
	var imgdata;
	var slideNum = 0;
	var slideTimeoutId;
	var isPlaying = false;
	var callback = function(){};
	
	slideshow.onchange = function(cb){
		callback = cb;
		return slideshow;
	}
	slideshow.changeTo = function(i){
		nexti = i;
		slideshow.stop();
		loadNextSlide();
		slideshow.nextSlide();
		slideshow.start();
	}
	
	slideshow.loadData = function(a){
		imgdata = a;
		//Preloading images. Should be async delayed ($(function(){})) so it won't delay loading.
		for(var i = 0; i < imgdata.length; i++){
			imgdata[i].img = new Image();
			imgdata[i].img.src = imgdata[i].imgurl;
		}
		
		return slideshow;
	}
	
	slideshow.firstSlide = function(){
		slideshow.changeTo(0);
		//Hax to make the first slide not appear to move after the title
		//$(".slideshow-image.curr").css("background","transparent");
		//$(".slideshow-image.next").css({left:-25,right:-25,opacity:1});
		
		return slideshow;
	}
	
	slideshow.start = function(){
		isPlaying = true;
		slideTimeoutId = setTimeout(function(){
			//hideTitle();
			$(window).focus(function(){if(isPlaying){slideshow.nextSlideChained();}}).blur(function(){clearTimeout(slideTimeoutId);});
			slideshow.nextSlideChained();
		},3000);
		
		return slideshow;
	}
	
	slideshow.stop = function(){
		clearTimeout(slideTimeoutId);
		isPlaying = false;
		
		return slideshow;
	}
	
	slideshow.nextSlide = function(){
		loadNextSlide();
		
		previ = nowi;
		nowi = nexti;
		nexti = (nexti + 1) % imgdata.length;
		
		callback(nowi);
		
		$(".slideshow-text.prev").remove();
		$(".slideshow-text.curr").removeClass("curr").addClass("prev");
		$(".slideshow-text.next").removeClass("next").addClass("curr");
		var el = document.createElement("h1");
		$(el).addClass("slideshow-text next");
		$(".slideshow-text-wrapper").append(el);
		/*http://stackoverflow.com/a/13933418/1181387*/
		/*$("h1").css({
			"background":				"url('"+imgdata[nexti].imgurl+"') repeat",
			"-webkit-text-fill-color":	"transparent",
			"-webkit-background-clip":	"text"
		});*/
		
		$(".slideshow-image.prev").remove();
		$(".slideshow-image.curr").removeClass("curr").addClass("prev");
		$(".slideshow-image.next").removeClass("next").addClass("curr");
		el = document.createElement("div");
		$(el).addClass("slideshow-image next");
		$(".slideshow-image-wrapper").append(el);
	}
	
	function loadNextSlide(){
		$(".slideshow-text.next").text(imgdata[nexti].text);
		$(".slideshow-image.next").css("background-image","url('"+imgdata[nexti].imgurl+"')");
	}
	
	slideshow.nextSlideChained = function(){ //Because setInterval sometimes hangs and then speeds up to catch up.
		slideNum++;
		slideshow.nextSlide();
		clearTimeout(slideTimeoutId);
		slideTimeoutId = setTimeout(slideshow.nextSlideChained,5000);
	}
	
	/*TO ADD: navbuttons*/
}(window.slideshow = window.slideshow || {}, jQuery));

