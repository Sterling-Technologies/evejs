define(function() {
	return function(e, request, action) {
		this.cookie('auth', null).trigger('auth-logout-success', request, action);
	};
});