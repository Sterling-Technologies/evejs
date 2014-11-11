define(function() {
	return function(e, request, response) {
		jQuery('#eve-block-'+ request.id).append(response).trigger('ready');
	};
});