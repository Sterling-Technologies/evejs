define(function() {
	return function(e, id, request, action) {
		var url = this.Controller().getServerUrl() + '/file/remove/';
		
		$.getJSON(url + id, function(response) {
			//if error
			if(response.error) {
				this.Controller().trigger('file-remove-error', response.message, request, action);
				return;	
			}
			
			this.Controller().trigger('file-remove-success', request, action);
		}.bind(this));
	};
});