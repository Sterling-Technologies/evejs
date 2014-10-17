define(function() {
	return function(e, request, action) {
		//yay done!
		this.notify('Success', '{{singular}} has been created!', 'success');
		//trigger generic response
		this.trigger('{{name}}-response', request);
		//redirect out
		this.redirect('/{{name}}');
	};
});