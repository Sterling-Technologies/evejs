module.exports = (function() {
	var Definition = function(controller) {
		this.__construct.call(this, controller);	
	}, prototype = Definition.prototype;
	
	/* Properties
	-------------------------------*/
	var store 	= require('./store');
	
	/* Loader
	-------------------------------*/
	prototype.__load = Definition.load = function(controller) {
		if(!this.__instance) {
			this.__instance = new Definition(controller);
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	prototype.__construct = function(controller) {
		this.controller = controller;
	};
	
	/* Public Methods
	-------------------------------*/
	prototype.store = function() {
		return store.load();
	};
	
	prototype.path = function(key) {
		return this.controller.path('{{name}}/' + key);
	};
	
	prototype.upload = function(stream, callback) {
		var files 		= {}, 
			self 		= this, 
			sequence 	= this.controller.eden.load('sequence');
	
		stream
		//when we have an incoming file
		.on('file-start', function(name, mime, key) {
			var orm 		= require('mongoose'),
				database 	= orm.connection.db,
				gridStore	= orm.mongo.GridStore,
				objectId	= orm.mongo.ObjectID;
				
			//queue sequence
			sequence.then(function(next) {
				var id  = new objectId();
	
				//setup the gridstore	
				(new gridStore(
					database, id, name, 
					'w+', { root: '{{name}}' })
				).open(function(error, store) {
					//if there are errors
					if(error) {
						callback(error);
						return;
					}
					
					//manually set the mime 
					store.contentType = mime;
					//it is now okay to move on
					next(id, store, key); 
				});
			});
		})
		//when we receive chunks of that file
		.on('file-data', function(chunk) {
			//queue sequence
			sequence.then(function(chunk, id, store, key, next) {
				//write to the store
				store.write(chunk, function(error, store) {
					//if there are errors
					if(error) {
						callback(error);
						return;
					}
					
					//it is now okay to move on
					next(id, store, key);
				});
			//make sure to capture the chunk
			//variable for the callback
			}.bind(null, chunk));
		}) 
		//when the file is done sending
		.on('file-end', function() {
			//queue sequence
			sequence.then(function(id, store, key, next) { 			
				//we are good to close the store
				//this will actually save the
				//file / record to mongo
				store.close(function(error, data) {
					//if there is an error
					if(error) {
						callback(error);
						return;
					}
	
					//push the newly created file(s)
					if(!files[key]) {
						files[key] = [];
					}
					
					files[key].push(data);
					next();
				});
			});
		})
		//when we are done getting everything
		.on('complete', function(query) {
			//queue sequence
			sequence.then(function(next) {
				//change query to object
				query = self.controller.eden.load('string').queryToHash(query);
				
				//add files to query
				for(var key in files) {
					if(files.hasOwnProperty(key)) {
						query[key] = files[key];
					}
				}
				
				//at this point, files were passed
				
				callback(null, query);
				
				next();
			});
		})
		//let's start it up
		.start();
		
		return this;
	};
	
	prototype.getErrors = function(query) {
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
		
		return errors;
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return Definition;  
})();