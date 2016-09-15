javascript:(function(){
	var titleCollection = document.getElementsByClassName("yt-lockup-title contains-action-menu");
	
	var ids = [];
	var longStr = "";
	for( var i = 0; i < titleCollection.length;i++)
	{
		if( i !== 0 )
		{
			longStr = longStr + ",";
		}
		var url = titleCollection[i].childNodes[0].href;
		if( url.includes('embed'))
		{
			url = url.replace( 'https://www.youtube.com/embed/', '');
			url = url.replace( '?vq=hd720&autoplay=1&iv_load_policy=3', '');
		}
		else
		{
			url = url.replace("https://www.youtube.com/watch?v=","");
		}
		ids.push(url);
		longStr = longStr + url;
		
	}
	document.open();
	for( var i = 0; i < ids.length; i++ )
	{
		document.write(ids[i] + "<br>");
	}
})();
