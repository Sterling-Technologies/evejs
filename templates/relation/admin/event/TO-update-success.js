define(function() {
	return function(e, request, action) {
		var {{to.schema.name}} = request.variables[0];
		//case for -> a {{to.schema.name}} having only one {{from.schema.name}}
		//also send up the link between a {{from.schema.name}} and a {{to.schema.name}} 
		if(parseInt({{to.schema.name}}) && parseInt(request.data.{{from.schema.name}})) {
			var {{from.schema.name}} = request.data.{{from.schema.name}};
			//send
			var url = this.Controller().getServerUrl() + '/{{name}}/create/';
		
			$.getJSON(url + {{from.schema.name}} + '/' + {{to.schema.name}} + '/0/1', function(response) {
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