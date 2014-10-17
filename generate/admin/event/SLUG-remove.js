define(function() {
	return function(e, id, request, action) {
		var url = this.Controller().getServerUrl() + '/{{name}}/remove/';
		
		$.getJSON(url + id, function(response) {
			//if error
			if(response.error) {
				this.Controller().trigger('{{name}}-remove-error', response.message, request, action);
				return;	
			}
			
			this.Controller().trigger('{{name}}-remove-success', request, action);
		}.bind(this));
	};
});