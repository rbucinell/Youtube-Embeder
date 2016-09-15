var YTObj = function( videoURL, imgURL, title, channel, channelURL )
{
	this.VideoURL = videoURL;
	this.VideoThumbnail = imgURL;
	this.Title = title;
	this.Channel = channel;
	this.ChannelURL = channelURL;
}

var videos = [];
$(".yt-shelf-grid-item").each( function( i ){
	var vhref 	= $(this).find(".yt-lockup-thumbnail > a").attr("href");
	var vimg 	= $(this).find(".yt-lockup-thumbnail > a").find(".yt-thumb-simple > img").attr("src");
	var vtitle 	= $(this).find(".yt-lockup-title > a").attr("title");
	var vhc 	= $(this).find(".yt-lockup-byline > a").text();
	var vhcurl 	= $(this).find(".yt-lockup-byline > a").attr("href");
	
	videos.push( new YTObj( vhref, vimg, vtitle, vhc, vhcurl ));
});

document.open();

var vlist = document.createElement( "ol" );
vlist.id = "vlist";
//vlist.style = "-moz-column-count: 5;-moz-column-gap: 20px;-webkit-column-count: 5;-webkit-column-gap: 20px;column-count: 5;column-gap: 20px;";
vlist.style.background = "linear-gradient(greeen,red)" 
vlist.style.listStylePosition = "inside";


document.appendChild( vlist );
for( var i = 0; i < videos.length; i++ )
{
	var li = document.createElement( "li" );
	//li.style.width = "50%";
	//li.style.margin = "auto";
	//li.style.border = "1px solid black";
	//li.style.backgroundColor = "whitesmoke"; //styles now applied in header
	
	var row = document.createElement( "div");
	
	var strongA = document.createElement( "a" );
	strongA.href = videos[i].VideoURL;
	
	var strong = document.createElement( "strong");
	strong.innerHTML = videos[i].Title;
	
	strongA.appendChild( strong );	
	row.appendChild( strongA );
	
	li.appendChild( row );
	
	
	var secondDiv = document.createElement( "div");
	
	var channelSpan = document.createElement( "span");	
	//channelSpan.style.cssFloat = "right";
	//channelSpan.style.padding = "5px"; //styles now applied in header
	channelSpan.innerHTML = videos[i].Channel;
		
	secondDiv.appendChild( channelSpan );
	
	var imgA = document.createElement( "a" );
	imgA.href = videos[i].VideoURL;
	var img = document.createElement( "img" );
	img.src = videos[i].VideoThumbnail;
	imgA.appendChild( img );
	
	secondDiv.appendChild( imgA );
	
	li.appendChild( secondDiv );
	
	vlist.appendChild( li );
}

$("ul#vlist li").on("click", function(){ 
	$(this).css('background-color', 'gray');
});

//Right Click to Remove the list element
$("#vlist li").mouseup(function() { if( event.button === 2){ $(this).remove(); } });

////////////////////////////
//code snippets to remember:
////////////////////////////

//remove everything after the selected
//$("#vlist > li:nth-child(1027)").nextAll().remove()

//find and remove elements containing search term
//$('strong:contains("LCK")').closest('li').remove();


