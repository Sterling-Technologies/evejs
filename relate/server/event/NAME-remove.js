module.exports = function({{from.schema.name}}, {{to.schema.name}}, request, response) {
	var filter = '{{from.schema.name}} = ' + {{from.schema.name}} + ' AND {{to.schema.name}} = ' + {{to.schema.name}};
	
	if({{from.schema.name}} === 0) {
		filter = '{{to.schema.name}} = ' + {{to.schema.name}};
	} else if({{to.schema.name}} === 0) {
		filter = '{{from.schema.name}} = ' + {{from.schema.name}};
	}
	
	this.database().removeRows('{{name}}', filter, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-remove-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-remove-success', request, response);
	}.bind(this));
};