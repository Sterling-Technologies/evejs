define(function() {
	return function(e, id, request, action) {
		var url = this.Controller().getServerUrl() + '/user/restore/';
		
		$.getJSON(url + id, function(response) {
			//if error
			if(response.error) {
				this.Controller().trigger('user-restore-error', response.message, request, action);
				return;	
			}
			
			this.Controller().trigger('user-restore-success', request, action);
		}.bind(this));
	};
});