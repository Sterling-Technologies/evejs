module.exports = function(settings, request, response) {
	//validate
	var errors = this.package('{{name}}').getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('{{name}}-create-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors 
		}, request, response);
		
		return;
	}
	
	{{~#if created}}
	settings.{{created}} = this.Time().toDate(Date.now(), 'Y-m-d H:i:s');
	{{/if}}
	{{~#if updated}}
	settings.{{updated}} = this.Time().toDate(Date.now(), 'Y-m-d H:i:s');
	{{/if}}
	
	{{~#if slug}}
	this.package('{{name}}').getSlug(settings.{{slug.[1]}}, null, function(error, slug) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-create-error', error, request, response);
			return;
		}
		
		settings.{{slug.[0]}} = slug;
		
		//create the model and save
		this.package('{{name}}').model(settings).save(function(error, model) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('{{name}}-create-error', error, request, response);
				return;
			}
			
			//trigger that we are good
			this.trigger('{{name}}-create-success', model.{{primary}}, request, response);
		}.bind(this));
	}.bind(this));
	
	{{~else~}}
	
	//create the model and save
	this.package('{{name}}').model(settings).save(function(error, model) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-create-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-create-success', model.{{primary}}, request, response);
	}.bind(this));
	
	{{~/if}}
};