define(function() {
	return function(e, request, action) {
		this.trigger('client-response', request, action);
	};
});