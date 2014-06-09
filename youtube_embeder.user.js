// ==UserScript==
// @name          Youtube Video Embed-er
// @description   Converts elements on click to an embeded version of the youtube video on your subscriptions page. 
// @version		  1.2
// @namespace     rbucinell.youtubeembed
// ==/UserScript==
var EMBED_BUTTON_CLASS = "embedbutton";
var EMBED_IFRAME_CLASS = "embediframe";

/**
* Main Method
**/
var main = function(){
	console.log('--Executing YouTube Video Embeder--');
	clearCrap();
	var contentItems = turnObjToArray(document.getElementsByClassName('feed-item-main-content'));
	for( var i = 0; i < contentItems.length; i++ )
	{
		//the feedItemDiv contains the icon, title, post time views and description, its only child is the
		var ytItem = contentItems[ i ].children[0];
		var thumbnail = ytItem.children[0];
		var content = ytItem.children[1];

		//Get the video ID
		var videoId;
		var thumbAnchor = thumbnail.children[0];
		videoId = thumbAnchor.getAttribute("href").substring( thumbAnchor.getAttribute("href").indexOf( '?v=') + 3 );
		
		var url = "https://www.youtube.com/embed/" + videoId + "?vq=hd720&autoplay=1";
		
		var button = document.createElement('button');
		button.className = EMBED_BUTTON_CLASS;
		var t=document.createTextNode("Embed Video");
		
		button.name = url;
		button.appendChild(t);
		button.onclick = setsrc;
		content.appendChild( button );
		
	}
};

//// Helper functions
var turnObjToArray = function(obj) {
  return [].map.call(obj, function(element) {
    return element;
  })
};

var clearCrap = function() {
	//remove the meta
	var meta = turnObjToArray(document.getElementsByClassName('yt-lockup-meta'));
	for( var i = 0; i < meta.length; i++ )
	{
		meta[i].parentNode.removeChild( meta[i] );
	}
	
	//remove the description
	var description = turnObjToArray(document.getElementsByClassName('yt-lockup-description'));
	for( var i = 0; i < description.length; i++ )
	{
		description[i].parentNode.removeChild( description[i] );
	}
	
	//remove any button
	var embed = turnObjToArray(document.getElementsByClassName(EMBED_BUTTON_CLASS));
	for( var i = 0; i < embed.length; i++ )
	{
		embed[i].parentNode.removeChild( embed[i] );
	}
	
	//remove any iframes
	var iframes = turnObjToArray(document.getElementsByClassName(EMBED_IFRAME_CLASS));
	for( var i = 0; i < iframes.length; i++ )
	{
		iframes[i].parentNode.removeChild( iframes[i] );
	}

};

var setsrc = function( event ) {
	var button = event.target;
	var iframe = document.createElement('iframe');
	iframe.allowfullscreen = 'allowfullscreen';
	iframe.frameborder="1";
	iframe.width = 450;//500;
	iframe.height = 270;//300;
	iframe.src = button.getAttribute('name');
	iframe.sytle = 'padding: 5px;';	
	iframe.onclick = setsrc;
	
	var div = document.createElement( 'div' );
	div.className = EMBED_IFRAME_CLASS;
	var parent = button.parentNode;
	var lockup = parent.parentNode;
	var thumbnail = lockup.children[0];
	console.log( parent.parentNode.parentNode );
	parent.appendChild( div );
	div.appendChild( iframe );
	
	//This should add 'WATCHED' to the thumbnail. need to go up 2 steps then down through a different a sibling
	var watched = document.createElement( 'div' );
	watched.className = 'watched-badge';
	watched.innerHTML = 'WATCHED';
	
	thumbnail.children[0].appendChild(watched );
	thumbnail.children[0].className += ' watched ';
	//Lastly remove the the embed button
	parent.removeChild( button );
};

var createLoadButton = function()
{
	var appbar = document.getElementById( 'appbar-nav' );
	var ul;
	if( appbar != null )
	{
		//ul = appbar.children[0];
	}
	else
	{
		//This means we are on a collection, not subscriptions page
		appbar = document.getElementById('channel-navigation-menu').parentNode;
	
	}
	
	ul = appbar.children[0];
	
	var li = document.createElement( 'li' );
	li.innerHTML = '<h2 class="epic-nav-item ">Load Embeding</h2>';
	li.onclick = main;
	ul.appendChild( li );
	
}

var isOperationalURL = function()
{
	var ytFeed = 'https://www.youtube.com/feed/';
	var url = window.location.href;
	
	try
	{
		for( var i = 0; i < ytFeed.length; i++ )
		{
			if( url.charAt(i) != ytFeed.charAt(i) )
				return false;
		}
	} catch ( err ){ return false; }
	return true;
}

////Lastly execute script after DOM is read iff we are on the youtube sub page
if( isOperationalURL() ) {
	createLoadButton();
};
