module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._controller = null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(controller) {
		this._controller = controller;
	};
	
	/* Public Methods
	-------------------------------*/
	/**
	 * Returns a package folder given the key
	 *
	 * @param string the key
	 * @return string the absolute path
	 */
	this.path = function(key) {
		return this._controller.path('{{name}}/' + key);
	};
	
	/**
	 * Returns a preset collection 
	 *
	 * @return eden/mysql/collection
	 */
	this.collection = function(rows) {
		var collection = this._controller.database().collection('{{name}}');
		
		if(rows instanceof Array) {
			collection.set(rows);
		}
		
		return collection;
	};
	
	/**
	 * Validates fields to be sent to the database
	 * and returns errors
	 *
	 * @param object
	 * @return object hash of errors
	 */
	this.getErrors = function(data) {
		var errors = [];
		
		//VALIDATION
		//NOTE: BULK GENERATE
		{{#loop fields ~}} 
			{{~#loop value.valid ~}} 
				{{~#when value.[0] '==' 'required' ~}}
				
		if(!data.{{../../key}} || !data.{{../../key}}.length) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is required!' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length <= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be greater than {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} <= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be greater than {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length < {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be greater than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} < {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be greater than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length >= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be less than {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} >= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be less than {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length > {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be less than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} > {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../value.label}} must be less than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'one' ~}}
		if(
		{{~#loop value.[1] ~}}
		data.{{../../../key}} !== '{{value.value}}'
		{{~#unless last}} 
		&& {{/unless~}}
		{{/loop}}
		) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} must be one of {{#loop value.[1] ~}}
			{{value.label}}{{~#unless last}}, {{/unless~}}{{/loop}}' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'email' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(([^<>()[\\]\\.,,:\\s@\\"]+(\\.[^<>()[\\]\\.,,:\\s@\\"]+)*)|(\\' + 
			'".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' + 
			'\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is not a valid email' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'hex' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[0-9a-fA-F]{6}$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is not a valid hexadecimal' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'cc' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3' +
			'[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is not a valid credit card' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'html' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'<\\/?\\w+((\\s+(\\w|\\w[\\w-]*\\w)(\\s*=\\s*(?:\\".*?' + 
			'\\"|\'.*?\'|[^\'\\">\\s]+))?)+\\s*|\\s*)\\/?>', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is not valid HTML' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'url' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(http|https|ftp):\\/\\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\\/?', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is not a valid URL' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'slug' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-z0-9-]+', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is not a valid slug' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanum' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} must be alpha-numeric' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumhyphen' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} must be alpha-numeric-hyphen' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumscore' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9_]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} must be alpha-numeric-underscore' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumline' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-_]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} must be alpha-numeric-hyphen-underscore' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'regex' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'{{../value.[1]}}', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../value.label}} is not valid' });
		}
		
				{{~/when~}}
		{{~#if last}} 
		
		{{else}} else {{/if~}}
		
			{{~/loop~}}	
		{{~/loop}}
		return errors;
	};
	
	{{#if slug~}}
	/**
	 * Returns a unique valid slug
	 *
	 * @param string
	 * @param string
	 * @param function
	 * @return this
	 */
	this.getSlug = function(title, old, callback) {
		var slug = this.String().dasherize(title).substr(0, 250);

		//old is passed when updating
		//if the title to slug didn't change
		var regex = new RegExp('^'+slug.replace(/\-/ig, '\\-')+'(\\-[0-9]+)*$', 'ig');
		
		if(old && regex.test(old)) {
			callback(null, old);
			return this;
		}

		this._controller
			.database()
			.search('{{name}}')
			.addFilter('{{slug.[0]}} LIKE ?', slug+'%')
			.getRows(function(error, rows) {
				if(error) {
					callback(error, null);
					return;
				}
				
				for(var count = 0, i = 0; i < rows.length; i++) {
					if(regex.test(rows[i].{{slug.[0]}})) {
							count++;
					}
				}

				if(count) {
					callback(null, slug+'-'+count);
					return;
				}

				callback(null, slug);
			});

		return this;
	};
	
	{{/if~}}
	
	/**
	 * Returns a preset model
	 *
	 * @return eden/mysql/model
	 */
	this.model = function(data) {
		var model = this._controller.database().model('{{name}}');
		
		if(typeof data === 'object' && data !== null) {
			model.___construct(data);
		}
		
		return model;
	};
	
	/**
	 * Returns a preset search
	 *
	 * @return eden/mysql/search
	 */
	this.search = function() {
		return this._controller.database().search('{{name}}');
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();