define(function() {
	return function(e, error, request, action) {
		this.notify('Error', error, 'error');
		this.trigger('user-response', request, action);
		
		window.history.back();
	};
});