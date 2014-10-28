define(function() {
	return function(e, request, action) {
		var {{from.schema.name}} = request.variables[0];
		//case for -> a {{from.schema.name}} having only one {{to.schema.name}}
		//also send up the link between a {{from.schema.name}} and a {{to.schema.name}} 
		if(parseInt({{from.schema.name}}) && parseInt(request.data.{{to.schema.name}})) {
			var {{to.schema.name}} = request.data.{{to.schema.name}};
			//send
			var url = this.Controller().getServerUrl() + '/{{name}}/create/';
		
			$.getJSON(url + {{from.schema.name}} + '/' + {{to.schema.name}} + '/1', function(response) {
				//if error
				if(response.error) {
					this.Controller().trigger('{{name}}-create-error', 
					response.message, {{from.schema.name}}, {{to.schema.name}}, request, action);
					return;	
				}
				
				this.Controller().trigger('{{name}}-create-success', {{from.schema.name}}, {{to.schema.name}}, request, action);
			}.bind(this));
		}
	};
});