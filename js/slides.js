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
	
	slideshow.loadData = function(a){
		imgdata = a;
		//Preloading images. Should be async delayed so it won't delay loading.
		for(var i = 0; i < imgdata.length; i++){
			imgdata[i].img = new Image();
			imgdata[i].img.src = imgdata[i].imgurl;
		}
		
		return slideshow;
	}
	
	slideshow.firstSlide = function(){
		//Hax to make the first slide not appear to move after the title
		slideshow.nextSlide();
		$(".slideshow-image.curr").css("background","transparent");
		$(".slideshow-image.next").css({left:-25,right:-25,opacity:1});
		
		return slideshow;
	}
	
	slideshow.start = function(){
		isPlaying = true;
		slideTimeoutId = setTimeout(function(){
			hideTitle();
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
		previ = nowi;
		nowi = nexti;
		nexti = (nexti + 1) % imgdata.length;
		
		$(".slideshow-text.prev").remove();
		$(".slideshow-text.curr").removeClass("curr").addClass("prev");
		$(".slideshow-text.next").removeClass("next").addClass("curr");
		var el = document.createElement("h1");
		$(el).addClass("slideshow-text next").text(imgdata[nexti].text);
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
		$(el).addClass("slideshow-image next").css("background-image","url('"+imgdata[nexti].imgurl+"')");
		$(".slideshow-image-wrapper").append(el);
	}
	
	slideshow.nextSlideChained = function(){ //Because setInterval sometimes hangs and then speeds up to catch up.
		slideNum++;
		if((slideNum % 5) === 0){
			showTitle();
			$(".byline").height("1.5em");
			$(".slideshow-text-filler").css({height:0});
			$(".slideshow-text.curr").css({left:-50,right:0,opacity:0});
			slideTimeoutId = setTimeout(slideshow.nextSlideChained,5000);
		}
		else{
			$(".byline").height(0);
			$(".slideshow-text-filler").css({height:"1em"});
			hideTitle();
			slideshow.nextSlide();
			slideTimeoutId = setTimeout(slideshow.nextSlideChained,3000);
		}
	}

	function hideTitle(){/*
		$(".make .slidehide").each(function(){
			this.origWidth = $(this).width() || this.origWidth; //if it's zero, ignore
			$(this).width(this.origWidth).width(0);
		});*/
	}
	function showTitle(){/*
		$(".make .slidehide").each(function(){
			$(this).width(0).width(this.origWidth);
		});*/
	}
	
	/*TO ADD: navbuttons*/
}(window.slideshow = window.slideshow || {}, jQuery));

