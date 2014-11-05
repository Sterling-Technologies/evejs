define(function() {
	return function(e, percent, request) {
		this.notify('Submitting Form', percent + '%', 'info');
	};
});