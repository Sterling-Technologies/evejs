module.exports = function(id, settings, request, response) {
	//validate
	var errors = this.package('{{name}}').getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('{{name}}-update-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors }, request, response);
		
		return;
	}
	
	{{~#if updated}}
	settings.{{updated}} = this.Time().toDate(Date.now(), 'Y-m-d H:i:s');
	{{/if}}
	
	{{~#if slug}}
	
	this.package('{{name}}')
	.search()
	.addFilter('{{primary}} = ?', id)
	.getRow(function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-update-error', error, request, response);
			return;
		}
		
		this.package('{{name}}').getSlug(settings.{{slug.[1]}}, row.{{slug.[0]}}, function(error, slug) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('{{name}}-update-error', error, request, response);
				return;
			}
			
			settings.{{slug.[0]}} = slug;
			
			//create the model and save
			var model = this.package('{{name}}').model(settings);
	
			model.{{primary}} = id;
			
			model.save(function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					this.trigger('{{name}}-update-error', error, request, response);
					return;
				}
				
				//trigger that we are good
				this.trigger('{{name}}-update-success', request, response);
			}.bind(this));
		}.bind(this));	
	}.bind(this));
	
	{{~else~}}
	
	var model = this.package('{{name}}').model(settings);
	
	model.{{primary}} = id;
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-update-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-update-success', request, response);
	}.bind(this));
	
	{{~/if}}
};