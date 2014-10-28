define(function() {
	return function(e, error, {{from.schema.name}}, {{to.schema.name}}, request, action) {
		this.notify('Error', error, 'error');
		this.trigger('{{name}}-response', request, action);
		
		window.history.back();
	};
});