define(function() {
	return function(e, id, request, action) {
		var url = this.Controller().getServerUrl() + '/file/restore/';
		
		$.getJSON(url + id, function(response) {
			//if error
			if(response.error) {
				this.Controller().trigger('file-restore-error', response.message, request, action);
				return;	
			}
			
			this.Controller().trigger('file-restore-success', request, action);
		}.bind(this));
	};
});