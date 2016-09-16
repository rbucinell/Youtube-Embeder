var vlist = document.getElementById('vlist');
var showImg = true;
		

var toggleImages = function()
{
	if( showImg )
	{
		$("img").css("display", "none");
		showImg = false;
	}
	else
	{
		$("img").css("display", "block");
		showImg = true;
		scrollToBottom();
	}
}		

var scrollToBottom = function()
{
	$('html, body').animate({scrollTop:$(document).height()}, 'slow');
}
				
var closemodalClick = function( processData )
{
	var txtArea = document.getElementById("addvideoinput");
	if( processData )
	{
		var val = txtArea.value.replace(/\n/g,",");
		var valList = val.split(",");
		populateMediaList(valList);
		txtArea.value = "";
	}
	else
	{
		txtArea.value = "";
	}				
}

var populateMediaList = function( idArray )
{
	for( var i = 0; i < idArray.length; i++ )
	{
		var id = idArray[i];
		if( id !== "" &&  ! $("#vlist #" + id ).length )
		{
			getPublishDate( id );
		}
		
	}
}

var createVideoElement = function( data, videoID )
{

	//console.log( videoID, data);
	var publishDate = data.publishedAt;
	var channel = data.channelTitle;
	var title = data.title;
	var desc = data.description;
	var imgSrc = data.thumbnails.standard.url;
	
	var li = createElement('li', 'media list-group-item');					
	li.id = videoID;
	li.appendChild( createCloseBadge() );
	
	
		var medialeft = createElement( 'div', 'media-left');
			var anchor = document.createElement('a');
			anchor.setAttribute('href', 'https://www.youtube.com/embed/' + videoID + '?vq=hd720&autoplay=1&iv_load_policy=3');
				var img = createElement('img', 'media-object');
				img.src = imgSrc;
				anchor.appendChild(img);
			medialeft.appendChild(anchor);
		li.appendChild(medialeft);
	
		var mediabody = createElement( 'div', 'media-body');
			var h4title = createElement('h4', 'media-heading');
			h4title.innerText = title;
			mediabody.appendChild(h4title);
			
			var descParagraph = document.createElement('p');
			descParagraph.innerText = desc;
			mediabody.appendChild( descParagraph );
			
			var dateTag = createElement( 'span', 'label label-default');
			dateTag.innerText = new Date(publishDate).toDateString();
			mediabody.appendChild( dateTag );
		
			var channelTag = createElement( 'span', 'label label-info');
			channelTag.innerText = channel;
			mediabody.appendChild( channelTag );
			
		li.appendChild(mediabody);
	vlist.appendChild( li );
}

var createElement = function( element, className )
{
	var e = document.createElement( element );
	e.setAttribute( 'class', className );
	return e;
}

var createCloseBadge = function()
{
	var closeBadge = createElement( 'span', 'badge badge-error');
	var removeIcon = createElement( 'span', 'glyphicon glyphicon-remove');
	closeBadge.appendChild( removeIcon );
	$(closeBadge).on('mouseup', function(){
		$(this).closest('li').remove();
	});	
	return closeBadge;
}

var getPublishDate = function( videoID )
{
	var APIKey  = "AIzaSyCU6hEwe3LQ5pF3RbkJI-s1pkayzljjajc";
	var baseURL = "https://www.googleapis.com/youtube/v3/videos";
	
	var snippet;
	$.ajax( {
		url: baseURL,
		dataType: 'json',
		async: true,
		data: 
			{
				key: APIKey,
				part: "snippet",
				id: videoID
			},
		success: function(data)
		{
			snippet = data.items[0].snippet;
			createVideoElement( snippet, videoID );
		}
	});
}

var readFile = function( file )
{
	var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200) {
			var response = xhr.responseText;
			var arr = response.split(/\n/g);
			populateMediaList( arr );
		}
		
	}
	xhr.open('get', file);
	xhr.send();
}

$(function()
{
	readFile('sublist.txt');
	
	$(".badge-error").on('mouseup', function(){
		$(this).closest('li').remove();
	});				
});
