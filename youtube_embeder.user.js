// ==UserScript==
// @name          YTEmbed
// @description   Changes all of the youtube on the sub page to HD embed links
// @version		1.7
// @namespace	rbucinell.youtubeembed
// @grant		none
// @include		*
// ==/UserScript==

/**
 * turns an object to an array
 **/
var turnObjToArray = function(obj) {
  return [].map.call(obj, function(element) {
    return element;
  });
};

/**
 * Adds string.startsWith to prototype. Returns bool if string is at index 0
 **/
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

/**
 * Formatting for youtube links in the subscription feed to alter classes on click
 **/
var setsrc = function( event )
{
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
		div.className = "embediframe";

	var parent = button.parentNode;
	var lockup = parent.parentNode;
	var thumbnail = lockup.children[0];

	parent.appendChild( div );
	div.appendChild( iframe );

	//This should add 'WATCHED' to the thumbnail. need to go up 2 steps then down through a different a sibling
	var watched = document.createElement( 'div' );
	watched.className = 'watched-badge';
	watched.innerHTML = 'YOU DUN SEE DIS';

	thumbnail.children[0].appendChild( watched );
	thumbnail.children[0].className += ' watched ';
	//Lastly remove the the embed button
	parent.removeChild( button );

	thumbnail.parent.addClass( 'watched' );
};

/**
 * Creates the button to force a recheck on anchor tags for a given page.
 **/
var createLoadButton = function()
{
	if( isOperationalURL() )
	{
		var appbar = document.getElementById( 'appbar-nav' );
		var ul;
		if( appbar !== null )
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
		li.innerHTML = '<h2 class="epic-nav-item ">Update Links</h2>';
		li.onclick = ChangeLinks;
		ul.appendChild( li );
	}

	//first make sure there are any yt links before we bother adding the button
	var anchors = document.getElementsByTagName("a");
	var foundYTLink = false;
	for( var i = 0; i < anchors.length; i++ )
	{
		if( anchors[i].href.indexOf( "youtube.com" ) != -1 || anchors[i].href.indexOf( "youtu.be" ) != -1 || anchors[i].href.indexOf("y2u.be") != -1 )
		{
			foundYTLink = true;
			break;
		}
	}
	CreateYoutubeButton();
};

/**
* Creates a button to convert links found into YT links
**/
var CreateYoutubeButton = function()
{
	var div = document.createElement( 'button' );
	div.id = 'YTLinkConverter';
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.style.textAlign = 'center';
	div.style.backgroundColor = '#FF0000';
	div.style.height = '30px';
	div.style.width = '40px';
	div.style.zIndex = 1000;
    div.style.font = '13.3333px Arial';

	div.innerHTML = 'YT';
	div.onclick = ChangeLinks;

	document.getElementsByTagName("body")[0].appendChild( div );
};

/**
 * Determines if conversion button should be embeded as a part of the youtube page,
 * or as its own standalone div
 **/
var isOperationalURL = function()
{
	var ytFeed = 'https://www.youtube.com/feed/subscriptions';
	var url = window.location.href;
	if( url.indexOf( ytFeed) != -1)
	{
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * Convert all anchor tags found that are youtbe.com to youte.be to become embeded links
 **/
var ChangeLinks = function()
{
    //start: http://www.youtube.com/watch?v=TLTTrpYb6OA/
    //goal: https://www.youtube.com/embed/TLTTrpYb6OA&feature=youtu.be?vq=hd720&autoplay=1&iv_load_policy=3

    var embedURL = "https://www.youtube.com/embed/";
	var params = "?vq=hd720&autoplay=1&iv_load_policy=3";//&start=10

    var youtube = "youtube.com/";
    var youtu = "youtu.be/";
    var y2ube = "y2u.be/";

    var anchors = document.getElementsByTagName("a");

	for( var i = 0; i < anchors.length; i++ )
	{
        var curA = anchors[i];

        //We want youtube domains, not reddit
        if( curA.href.startsWith( "https://www.reddit.com/") || curA.href.indexOf( "youtbe.com/embed") != -1 )
        {
            continue;
        }

        //Normal Youtube.com link, find v= and drop everything else
		var videoID = "";
		var rebuiltURL = "";
        if( curA.href.indexOf( youtube ) != -1 )
        {
            var vIndexStart = curA.href.indexOf( "v=" );

            if( vIndexStart === -1 )
            {
                continue;
            }
            else
            {
                vIndexStart += 2; //length of v=
            }
            var VIndexEnd = curA.href.indexOf( "&", vIndexStart );
            if( VIndexEnd === -1 )
            {
                //Didn't find any more params, so use the end of the url
                VIndexEnd = curA.href.length;
            }
            videoID = curA.href.substring( vIndexStart, VIndexEnd );
            rebuiltURL = embedURL + videoID + params;

            UpdateLink( curA, rebuiltURL );
        }
        else if( curA.href.indexOf( youtu ) != -1 )
        {
            //Youtu.be Shortener, video ID is last component of URL
            var startIndex = curA.href.indexOf( youtu ) + youtu.length;
            videoID = curA.href.substring( startIndex );

            rebuiltURL = embedURL + videoID + params;
            UpdateLink( curA, rebuiltURL );
        }
        else if( curA.href.indexOf( y2ube ) != -1 )
        {
            //Some other shortener
            console.log( "Haven't developed conversion for " + y2ube + " yet" );
            curA.target = "_blank";
            curA.className = "";
        }
    }
};

/**
* Modifiy the link with new URL and open in a new tab
*/
var UpdateLink = function( anchorTag, newURL )
{
    anchorTag.href = newURL;
    anchorTag.target = "_blank";
    anchorTag.className = "";
};

////Lastly execute script after DOM is read iff we are on the youtube sub page
ChangeLinks();
createLoadButton();
