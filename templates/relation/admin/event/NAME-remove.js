define(function() {
	return function(e, {{from.schema.name}}, {{to.schema.name}}, request, action) {
		var url = this.Controller().getServerUrl() + '/{{name}}/remove/';
		
		$.getJSON(url + {{from.schema.name}} + '/' + {{to.schema.name}}, function(response) {
			//if error
			if(response.error) {
				this.Controller().trigger('{{name}}-remove-error', response.message, {{from.schema.name}}, {{to.schema.name}}, request, action);
				return;	
			}
			
			this.Controller().trigger('{{name}}-remove-success', {{from.schema.name}}, {{to.schema.name}}, request, action);
		}.bind(this));
	};
});