define(function() {
	return function(e, request, action) {
		this.trigger('user-response', request, action);
	};
});