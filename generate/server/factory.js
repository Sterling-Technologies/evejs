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
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is required!' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length <= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be greater than {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} <= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be greater than {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length < {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be greater than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} < {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be greater than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length >= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be less than {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} >= {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be less than {{../../value.[1]}}' });
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length > {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be less than or equal to {{../../value.[1]}}' });
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} > {{../../value.[1]}}) {
			errors.push({ name: '{{../../../key}}', message: '{{../../../key}} must be less than or equal to {{../../value.[1]}}' });
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
			errors.push({ name: '{{../../key}}', message: '{{../../key}} must be one of {{#loop value.[1] ~}}
			{{value.label}}{{~#unless last}}, {{/unless~}}{{/loop}}' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'email' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(([^<>()[\\]\\.,,:\\s@\\"]+(\\.[^<>()[\\]\\.,,:\\s@\\"]+)*)|(\\' + 
			'".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' + 
			'\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is not a valid email' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'hex' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[0-9a-fA-F]{6}$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is not a valid hexadecimal' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'cc' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3' +
			'[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is not a valid credit card' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'html' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'<\\/?\\w+((\\s+(\\w|\\w[\\w-]*\\w)(\\s*=\\s*(?:\\".*?' + 
			'\\"|\'.*?\'|[^\'\\">\\s]+))?)+\\s*|\\s*)\\/?>', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is not valid HTML' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'url' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(http|https|ftp):\\/\\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\\/?', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is not a valid URL' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'slug' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-z0-9-]+', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is not a valid slug' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanum' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} must be alpha-numeric' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumhyphen' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} must be alpha-numeric-hyphen' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumscore' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9_]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} must be alpha-numeric-underscore' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumline' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-_]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} must be alpha-numeric-hyphen-underscore' });
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'regex' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'{{../value.[1]}}', 'ig'))
			.test(data.{{../../key}})) {
			errors.push({ name: '{{../../key}}', message: '{{../../key}} is not valid' });
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
					if(regex.test(rows[i].{{slug.[1]}})) {
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
	
	/**
	 * Install to database programmatically
	 *
	 * @param boolean
	 * @param function
	 * @return this
	 */
	this.install = function(fixtures, callback) {
		var database = this._controller.database();
		this
		//drop
		.sync(function(next) {
			database.query('DROP TABLE IF EXISTS `{{name}}`;', next);
		})
		//create
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			var schema = [];
			schema.push('CREATE TABLE `{{name}}` (');
			schema.push('`{{primary}}` int(10) unsigned NOT NULL,');
			{{#if slug~}}
			schema.push('`{{slug.[0]}}` varchar(255) NOT NULL,');
			{{/if~}}
			{{#loop fields~}}
			{{#when value.type '==' 'int'~}}
			schema.push("`{{../key}}` int(10) {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'float'~}}
			schema.push("`{{../key}}` float(10,2) {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'file'~}}
			schema.push("`{{../key}}` varchar(255) {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'string'~}}
			schema.push("`{{../key}}` varchar(255) {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'text'~}}
			schema.push("`{{../key}}` text {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'boolean'~}}
			schema.push("`{{../key}}` int(1) unsigned {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'date'~}}
			schema.push("`{{../key}}` date {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'datetime'~}}
			schema.push("`{{../key}}` datetime {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{#when value.type '==' 'time'~}}
			schema.push("`{{../key}}` time {{#if ../value.default~}}
				NOT NULL DEFAULT {{{../value.default}}}
				{{~else~}}
				NOT NULL
				{{~/if~}},");
			{{/when~}}
			{{/loop~}}
			
			{{#if active~}}
			schema.push('`{{active}}` int(1) unsigned NOT NULL DEFAULT \'1\',');
			{{/if~}}
			
			{{#if created~}}
			schema.push('`{{created}}` int(1) datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
			{{/if~}}
			
			{{#if updated~}}
			schema.push('`{{updated}}` int(1) datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
			{{/if}}
			var last = schema[schema.length - 1];
			schema[schema.length - 1] = last.substr(0, last.length - 1);
			schema.push(') ENGINE=InnoDB DEFAULT CHARSET=latin1;');
				
			database.query(schema.join("\n"), next);
		})
		
		//add primary
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `{{name}}` ADD PRIMARY KEY (`{{primary}}`);', next);
		})
		
		{{#if slug~}}
		//add slug
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `{{name}}` ADD UNIQUE KEY `{{slug.[0]}}` (`{{slug.[0]}}`);', next);
		})
		{{/if~}}
		
		//add auto increment
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `{{name}}` MODIFY `{{primary}}` int(10) unsigned NOT NULL AUTO_INCREMENT;', 
			next);
		})
		
		{{#if fixture~}}
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			if(!fixtures) {
				callback(null);
				return;
			}
			
			next();
		})
		
		{{#loop fixture~}}
		.then(function(next) {
			var model = database.model({{../name}});
			
			model.___construct({
				{{#loop value~}}
				{{key}}: '{{value}}',
				{{/loop}}
			});
			
			model.save(function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next();		
			}.bind(this));
		})
		{{/loop~}}
		//finish up
		.then(function(next) {
			callback(null);
		});
		
		{{~else~}}
		//finish up
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			callback(null);
		});
		{{/if}}
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();