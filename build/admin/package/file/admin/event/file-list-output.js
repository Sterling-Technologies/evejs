define(function() {
	return function(e, request, action) {
		this.trigger('file-response', request, action);
	};
});