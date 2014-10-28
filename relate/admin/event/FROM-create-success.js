define(function() {
	return function(e, {{from.schema.name}}, request, action) {
		{{#if to.many}}{{else}}
		//case for -> a {{from.schema.name}} having only one {{to.schema.name}}
		//also send up the link between a {{from.schema.name}} and a {{to.schema.name}} 
		if(parseInt({{from.schema.name}}) && parseInt(request.data.{{to.schema.name}})) {
			var {{to.schema.name}} = request.data.{{to.schema.name}};
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
		{{#if from.many}}
		//case for -> a {{to.schema.name}} having many {{from.schema.name}}
		//when we create a {{to.schema.name}} and we know the {{from.schema.name}} id
		//lets make the link between a {{from.schema.name}} and a {{to.schema.name}}
		if(request.path.indexOf('/{{from.schema.name}}/create/{{name}}/') === 0) {
			//link to {{from.schema.name}}
			var {{to.schema.name}} = request.variables[1];
			
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