$('#suggested-matches li').on('click', function() {
	if($(this).children('.oh-yeah').length){
		$(this).children('.oh-yeah').remove();
	} else {
		$(this).append('<span class="oh-yeah">✔</span>');
	}
})