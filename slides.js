function shuffle(arr){
	for(var i = 0; i < arr.length; i++){
		var other = i + Math.floor((arr.length-i) * Math.random());
		var tmp = arr[i];
		arr[i] = arr[other];
		arr[other] = tmp;
	}
}

(function(slideshow, $, undefined){
	var previ = 0, nowi = 0, nexti = 0;
	var imgdata;
	var slideNum = 0;
	
	function loadData(a){
		imgdata = a;
		//Preloading images. Should be async delayed so it won't delay loading.
		for(var i = 0; i < imgdata.length; i++){
			imgdata[i].img = new Image();
			imgdata[i].img.src = imgdata[i].imgurl;
		}
	}
	
	function nextSlide(){
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
	
	function nextSlideChained(){ //Because setInterval sometimes hangs and then speeds up to catch up.
		slideNum++;
		if((slideNum % 5) === 0){
			showTitle();
			$(".byline").height("1.5em");
			$(".slideshow-text-filler").css({height:0});
			$(".slideshow-text.curr").css({left:-50,right:0,opacity:0});
			window.slideTimeout = setTimeout(nextSlideChained,5000);
		}
		else{
			$(".byline").height(0);
			$(".slideshow-text-filler").css({height:"1em"});
			hideTitle();
			nextSlide();
			window.slideTimeout = setTimeout(nextSlideChained,3000);
		}
	}

	/*function hideTitle(){
		$(".make .slidehide").each(function(){
			this.origWidth = $(this).width() || this.origWidth; //if it's zero, ignore
			$(this).width(this.origWidth).width(0);
		});
	}
	function showTitle(){
		$(".make .slidehide").each(function(){
			$(this).width(0).width(this.origWidth);
		});
	}*/
	
	/*TO ADD: navbuttons*/
})(window.slideshow = window.slideshow || {}, jQuery);


$(function(){
	slideshow.loadData([
		{text:"Designs beautiful websites.",			imgurl:""},
		{text:"Coordinates educational events.",		imgurl:""},
		{text:"Researches machine learning.",			imgurl:""},
		//{text:"",			imgurl:""},
	]);
	
	slideshow.nextSlide();
	$(".slideshow-image.curr").css("background","transparent");
	$(".slideshow-image.next").css({left:-25,right:-25,opacity:1});
	//Hax to make it look like it doesn't move on the first slide
	
	setTimeout(function(){
		hideTitle();
		$(window).focus(nextSlideChained).blur(function(){clearTimeout(window.slideTimeout);});
		nextSlideChained();
	},3000);
});
