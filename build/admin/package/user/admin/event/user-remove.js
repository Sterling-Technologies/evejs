define(function() {
	return function(e, id, request, action) {
		var url = this.Controller().getServerUrl() + '/user/remove/';
		
		$.getJSON(url + id, function(response) {
			//if error
			if(response.error) {
				this.Controller().trigger('user-remove-error', response.message, request, action);
				return;	
			}
			
			this.Controller().trigger('user-remove-success', request, action);
		}.bind(this));
	};
});