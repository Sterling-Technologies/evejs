define(function() {
	return function(e, {{to.schema.name}}, request, action) {
		{{#if from.many}}{{else}}
		//case for -> a {{to.schema.name}} having only one {{from.schema.name}}
		//also send up the link between a {{from.schema.name}} and a {{to.schema.name}} 
		if(parseInt({{to.schema.name}}) && parseInt(request.data.{{from.schema.name}})) {
			var {{from.schema.name}} = request.data.{{from.schema.name}};
			//send
			var url = this.Controller().getServerUrl() + '/{{name}}/create/';
		
			$.getJSON(url + {{from.schema.name}} + '/' + {{to.schema.name}}, function(response) {
				//if error
				if(response.error) {
					this.Controller().trigger('{{name}}-create-error', 
					response.message, {{from.schema.name}}, {{to.schema.name}}, request, action);
					return;	
				}
				
				this.Controller().trigger('{{name}}-create-success', {{from.schema.name}}, {{to.schema.name}}, request, action);
			}.bind(this));
		}
		{{/if}}
		{{#if to.many}}
		//case for -> a {{from.schema.name}} having many {{to.schema.name}}
		//when we create a {{to.schema.name}} and we know the {{from.schema.name}} id
		//lets make the link between a {{from.schema.name}} and a {{to.schema.name}}
		if(request.path.indexOf('/{{to.schema.name}}/create/{{name}}/') === 0) {
			//link to {{from.schema.name}}
			var {{from.schema.name}} = request.variables[1];
			
			//send
			var url = this.Controller().getServerUrl() + '/{{name}}/create/';
		
			$.getJSON(url + {{from.schema.name}} + '/' + {{to.schema.name}}, function(response) {
				//if error
				if(response.error) {
					this.Controller().trigger('{{name}}-create-error', 
					response.message, {{from.schema.name}}, {{to.schema.name}}, request, action);
					return;	
				}
				
				this.Controller().trigger('{{name}}-create-success', {{from.schema.name}}, {{to.schema.name}}, request, action);
			}.bind(this));
		}
		{{/if}}
	};
});