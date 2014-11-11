module.exports = function({{from.schema.name}}, {{to.schema.name}}, clearFrom, clearTo, request, response) {
	this.sync(function(next) {	
		if(clearFrom) {
			//clear it
			var filter = '{{from.schema.name}} = ' + {{from.schema.name}};
			this.database().removeRows('{{name}}', filter, function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					this.trigger('{{name}}-create-error', error, request, response);
					return;
				}
				
				next();
			}.bind(this));
			return;
		}	
		
		next();
	})
	
	.then(function(next) {	
		if(clearTo) {
			//clear it
			var filter = '{{to.schema.name}} = ' + {{to.schema.name}};
			this.database().removeRows('{{name}}', filter, function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					this.trigger('{{name}}-create-error', error, request, response);
					return;
				}
				
				next();
			}.bind(this));
			return;
		}	
		
		next();
	})
	
	.then(function(next) {
		this.database().insertRow('{{name}}', {
			{{from.schema.name}}: {{from.schema.name}},
			{{to.schema.name}}: {{to.schema.name}}
		}, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('{{name}}-create-error', error, request, response);
				return;
			}
			
			//trigger that we are good
			this.trigger('{{name}}-create-success', request, response);
		}.bind(this));
	});
};