function search()
{
	//var urlRegex = /twitch\.tv\/([^\/]+)\/(\w)\/([\d]+)/g;
	//var channelUrlRegex = /twitch\.tv\/([^\/]+)/g
	$("#search_button,#search_box").prop('disabled', true);
	$("#results").hide();
	$("#resultsChannel").hide();
	
	var name = $('#search_box').val();
	//var result = urlRegex.exec(url);
	//var channelResult = channelUrlRegex.exec(url);
	/*
	if ( !result && !channelResult )
	{
		$("#msg").text("Sorry, this doesn't look like an expected twitch.tv URL. Please retype it.");
		$("#search_button,#search_box").prop('disabled', false);
		return;
	}
*/
	searchByChannel( name );
	
}

function searchByChannel( name )
{
	var l = name.slice(0, 1);

	if( l.search(/[A-z]/i) == -1 )
	{

		l = "0"; //0.json holds urls for all channel names begging with a number or character

	}

	var filename = "./jsdata/channel/"+l+".json";
	
	$("#msg").text("Searching...");
	
	$.getJSON(filename)
	.done(function(data) {
		var videoIds = data[name];
		
		if (videoIds === undefined) {
			$("#msg").text("Sorry, no videos were saved for this channel.");
			return;
		}
		
		$("#msg").text("");
		
		$("#resultsChannel").show();
		var texts = [];
		
		for ( var i = 0; i < videoIds.length; i++ )
		{
			var id = videoIds[i];
			var url = 'https://web.archive.org/web/2015im_/http://blip.tv/file/get/' + name + '-' + id;

			texts.push('<li><a href="' + url + '" target="_blank">' + url.slice( 60, url.length ) + '</a></li>');
			//texts.push('<button onclick="$(\'#search_box\').val(\'' + url + '\');$(\'#search_button\').click()">Search FLV</button><br>');
			
		}
		
		$("#url_container_channels").html(texts.join('\n'));
	})
	.fail(function(jqXHR) {
		if (jqXHR.status == 404) {
			$("#msg").text("Sorry, this video doesn't seem to be archived as part of this project.");
		} else {
			$("#msg").text("Oops! Something went wrong during the search. Please try again.");
		}
		return;
	})
	.always(function() {
		$("#search_button,#search_box").prop('disabled', false);
	});
}

$('#search_button').click(search);