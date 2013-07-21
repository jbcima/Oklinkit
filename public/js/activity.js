var slideToggle = 0;

$('#activity').on('click',function(){
	if (slideToggle == 1) {
		
		$('#activity-feed').slideToggle("750", function(){

		});

	} else {
			$('#feed-requests').empty();
			$('#feed-responses').empty();
			$.get('http://localhost:3000/users/responses/me', function(data) {
					$.each(data, function(key, data){
						$.each(data.responses, function(key, data){
						$('#feed-responses').append('<li><div class="info"><img src="http://placehold.it/100x100" class="rounded"><h2>' + data.name + '</h2><p>“' + data.body + '”</p><a href="mailto:' + data.author + '">' + data.author + '</a><br /><span><i class="icon-trophy"></i> ' + Math.floor((Math.random()*5)+1) +' &nbsp; <i class="icon-frown"></i> ' + Math.floor((Math.random()*5)+1) +'</span></div></li>');
						});
					});
			});	

			$.get('http://localhost:3000/users/requests/me', function(data) {
				$.each(data, function(key, data){
				$('#feed-requests').append('<li><div class="info"><img src="http://placehold.it/100x100" class="rounded"><h2>' + data.request.name + '</h2><p>“' + data.request.description + '”</p><a href="mailto:' + data.request.author + '">' + data.request.author + '</a><br /><span><i class="icon-trophy"></i> ' + Math.floor((Math.random()*5)+1) +' &nbsp; <i class="icon-frown"></i> ' + Math.floor((Math.random()*5)+1) +'</span></div></li>');
				});
			});	


			$('#activity-feed').slideToggle("750");
	}
});


$('#requests').on('click',function(){
	$('#feed-responses').fadeOut(function(){
		$('#feed-requests').fadeIn();
	});

	$('#requests').addClass('active');
	$('#responses').removeClass('active');
});

$('#responses').on('click',function(){
	$('#feed-requests').fadeOut(function(){
		$('#feed-responses').fadeIn();
	});

	$('#requests').removeClass('active');
	$('#responses').addClass('active');
});