define(function() {
	return function(e, request, action) {
		this.trigger('{{name}}-response', request, action);
	};
});