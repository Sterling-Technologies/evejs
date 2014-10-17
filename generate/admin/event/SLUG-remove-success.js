define(function() {
	return function(e, request, action) {
		this.notify('Success', '{{singular}} has been removed!', 'success');
		this.trigger('{{name}}-response', request, action);
		window.history.back();
	};
});