define(function() {
	return function(e, request, response) {
		jQuery('#eve-block-'+ request.id).replaceWith(response);
	};
});