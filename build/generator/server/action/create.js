module.exports = (function() { 
	var Definition = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, prototype = Definition.prototype;

	/* Public Properties
    -------------------------------*/
    prototype.controller  	= null;
    prototype.request   	= null;
    prototype.response  	= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    prototype.__load = Definition.load = function(controller, request, response) {
        return new Definition(controller, request, response);
    };
    
	/* Construct
    -------------------------------*/
	prototype.__construct = function(controller, request, response) {
		//set request and other usefull data
		this.controller = controller;
		this.request  	= request;
		this.response  	= response;
	};
	
	/* Public Methods
    -------------------------------*/
	prototype.render = function() {
		//1. SETUP: change the string into a native object
		var query = this
			.controller.eden.load('string')
			.queryToHash(this.request.message);
		
		//if query is not valid
		if(!_valid.call(this, query)) {
			//do noting more
			return;
		}
		
		//2. TRIGGER
		this.controller
			//when there is an error 
			.once('{{name}}-create-error', _error.bind(this))
			//when it is successfull
			.once('{{name}}-create-success', _success.bind(this))
			//Now call to remove the {{name}}
			.trigger('{{name}}-create', this.controller, query);
	};
	
	/* Private Methods
    -------------------------------*/
	var _success = function() {
		//set up a success response
		this.response.message = JSON.stringify({ error: false });
		//dont listen for error anymore
		this.controller.unlisten('{{name}}-create-error');
		//trigger that a response has been made
		this.controller.trigger('{{name}}-action-response', this.request, this.response);
	};
			
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message,
			validation: error.errors || [] });
		
		//dont listen for success anymore
		this.controller.unlisten('{{name}}-create-success');
		//trigger that a response has been made
		this.controller.trigger('{{name}}-action-response', this.request, this.response);
	};
	
	var _valid = function(query) {
		var errors = [];
		
		{{#loop fields ~}} 
			{{~#loop value.valid ~}} 
				{{~#when value.[0] '==' 'required' ~}}
				
		if(!query.{{../../key}} || !query.{{../../key}}.length) {
			errors.push({ {{../../key}}: '{{../../key}} is required!' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}}.length <= {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be greater than {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}} <= {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be greater than {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}}.length < {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be greater than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}} < {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be greater than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}}.length >= {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be less than {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}} >= {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be less than {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}}.length > {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be less than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(query.{{../../../key}} && query.{{../../../key}} > {{../../value.[1]}}) {
			errors.push({ {{../../../key}}: '{{../../../key}} must be less than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'one' ~}}
		if(
		{{~#loop value.[1] ~}}
		query.{{../../../key}} !== '{{value.value}}'
		{{~#unless last}} 
		&& {{/unless~}}
		{{/loop}}
		) {
			errors.push({ {{../../key}}: '{{../../key}} must be one of {{#loop value.[1] ~}}
			{{value.label}}{{~#unless last}}, {{/unless~}}{{/loop}}' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'email' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^(([^<>()[\\]\\.,,:\\s@\\"]+(\\.[^<>()[\\]\\.,,:\\s@\\"]+)*)|(\\' + 
			'".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' + 
			'\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} is not a valid email' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'hex' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^[0-9a-fA-F]{6}$', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} is not a valid hexadecimal' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'cc' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3' +
			'[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} is not a valid credit card' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'html' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'<\\/?\\w+((\\s+(\\w|\\w[\\w-]*\\w)(\\s*=\\s*(?:\\".*?' + 
			'\\"|\'.*?\'|[^\'\\">\\s]+))?)+\\s*|\\s*)\\/?>', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} is not valid HTML' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'url' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^(http|https|ftp):\\/\\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\\/?', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} is not a valid URL' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'slug' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^[a-z0-9-]+', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} is not a valid slug' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanum' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9]+$', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} must be alpha-numeric' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumhyphen' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-]+$', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} must be alpha-numeric-hyphen' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumscore' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9_]+$', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} must be alpha-numeric-underscore' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumline' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-_]+$', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} must be alpha-numeric-hyphen-underscore' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'regex' ~}}
				
		if(query.{{../../key}} && !(new RegExp(
			'{{../value.[1]}}', 'ig'))
			.test(query.{{../../key}})) {
			errors.push({ {{../../key}}: '{{../../key}} is not valid' });
		}
		
				{{~/when~}}
		{{~#if last}} 
		
		{{else}} else {{/if~}}
		
			{{~/loop~}}	
		{{~/loop}}
		if(!errors.length) {
			return true;
		}
		
		_error.call(this, { message: 'Data sent to server is invalid', errors: errors });
		
		return false;
	};
	
	/* Adaptor
	-------------------------------*/
	return Definition; 
})();