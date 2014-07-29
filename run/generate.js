module.exports = function(eve, local, args) {
	//---------------------------------------
	// START: VARIABLE LIST
	
	var eden		= require('edenjs');
	var sequence	= eden('sequence');
	var parameter 	= args[0];
	var packages 	= [];
	var settings	= {};
	var vendor 		= null;
	
    var paths = {
        control     : local + '/config/control/packages.js',
        server      : local + '/config/server/packages.js',
        schema      : local + '/schema/',
        package     : local + '/package/',
        generator   : __dirname + '/../build/generator/' };
		
	var copy = {
		field: require(paths.generator + '/field.js'),
		valid: require(paths.generator + '/valid.js'),
		active: require(paths.generator + '/active.js'),
		created: require(paths.generator + '/created.js'),
		updated: require(paths.generator + '/updated.js'),
	};

	// END: VARIABLE LIST
	//---------------------------------------
	
	//---------------------------------------
	// START: VALIDATION
	
	sequence.then(function(next) {
		//is there a parameter?
		if(!parameter || !parameter.length) {
			eve.trigger('error', 'Invalid parameter. Must be in the form of vendor or vendor/package');
			return;
		}
		//is the schema valid?
		if(parameter.split('/').length > 2) {
			eve.trigger('error', 'Invalid parameter. Must be in the form of vendor or vendor/package');
			return;
		}
		
		//is there a slash?
		if(parameter.split('/').length == 2 && !eden('file', paths.schema + parameter + '.js').isFile()) {
			eve.trigger('error', paths.schema + parameter + '.js does not exist.');
			return;
		}
		
		next();
	});
	
	// END: VALIDATION
	//---------------------------------------
	
	//---------------------------------------
	// START: GET DEPLOY PATH
	
	sequence.then(function(next) {
		eden('file', local + '/build.json').getContent(next);
	});
	
	sequence.then(function(error, content, next) {
		if(error) {
			eve.trigger('error', error);
			return;
		}
		
		settings = JSON.parse(content);	
		
		next();
	});
	
	// END: GET DEPLOY PATH
	//---------------------------------------
	
	//---------------------------------------
	// START: DETERMINE PACKAGES
	
	sequence.then(function(next) {
		vendor = parameter.split('/')[0];
		if(parameter.split('/').length == 2) {
			 packages.push(parameter.split('/')[1]);
		}
		
		if(packages.length) {
			next([]);
			return;
		}
		
		//there is no packages
		//get the list of packages by folder
		//is this a valid folder ? 
        if(!eden('folder', paths.schema + vendor).isFolder()) {
            eve.trigger('error', paths.schema + vendor + ' does not exist.');
            return;
        }
		
		//query the vendor folder for the list of packages
        eden('folder', paths.schema + vendor).getFiles(null, false, next);
	});
	
	sequence.then(function(files, next) {
		//parse through files
		eden('array').each(files, function(i, file) {
			//if this is not a js file
			if(file.getExtension() != 'js') {
				//skip it
				return;
			}
			
			//store the package
			packages.push(file.getBase());
		});
		
		next();
	});
	
	// END: DETERMINE PACKAGES
	//---------------------------------------
	
	//---------------------------------------
	// START: VALIDATE PACKAGES
	
	sequence.then(function(next) {
		var error = false;
		
		eden('array').each(packages, function(i, package) {
			//determine the destination path
            var destination = eden('folder', paths.package + vendor + '/' + package);
			
            //does the destination package exist?
            if(destination.isFolder()) {
				error = true;
                eve.trigger('error', destination.path + ' already exists. If you want to build a new package, you must delete this package first.');
            }
		});
		
		//were there errors?
		if(error) {
			//stop
			return;
		}
		
		next();
	});
	
	// END: VALIDATE PACKAGES
	//---------------------------------------
	
	//---------------------------------------
	// START: GENERATE PACKAGES
	
	sequence.then(function(next) {
		//loop through packages
		eden('array').each(packages, function(i, package) {
			//require the source path
			var config = require(paths.schema + vendor + '/' + package);
			
			//going to be forking the sequence
            var sequence2 = eden('sequence');
            
			//get all server files recursively
			sequence2.then(function(next2) {
				eden('folder', paths.generator + 'server').getFiles(null, true, next2);
			});
			
			//copy generator server folders to destination
			sequence2.then(function(files, next2) {
				//old school sequence :D
				var count = 0, done = function() {
					if(++count >= files.length) {
						next2();
					}
				};
				
				eden('array').each(files, function(i, file) {
					//determine the destination
					var root 	= 'build/generator/server/';
					var start 	= file.path.indexOf(root) + root.length;
					var path 	= file.path.substr(start);
					
					var destination = paths.package 
						+ vendor + '/' 
						+ package + '/server/' 
						+ path;
						
					var deploy = settings.server.path 
						+ '/package/' + vendor 
						+ '/' + package 
						+ '/' + path;
		
					generate(config, file, destination, deploy, done);
				});
			});
			
			//get all control files recursively
			sequence2.then(function(next2) {
				eden('folder', paths.generator + 'control').getFiles(null, true, next2);
			});
			
			//copy generator control folders to destination
			sequence2.then(function(files) {
				//old school sequence :D
				var count = 0, done = function() {
					if(++count >= files.length) {
						next();
					}
				};
				
				eden('array').each(files, function(i, file) {
					//determine the destination
					var root 	= 'build/generator/control/';
					var start 	= file.path.indexOf(root) + root.length;
					var path 	= file.path.substr(start);
					
					var destination = paths.package 
						+ vendor + '/' 
						+ package + '/control/' 
						+ path;
						
					var deploy = settings.control.path 
						+ '/application/package/' 
						+ vendor + '/' 
						+ package + '/' 
						+ path;
					
					generate(config, file, destination, deploy, done);
				});
			});
		});
	});
	
	// END: GENERATE PACKAGES
	//---------------------------------------
	var generate = function(config, source, destination, deploy, done) {
		destination = destination.replace('SLUG', config.slug);
		deploy = deploy.replace('SLUG', config.slug);
		
		//if this is not an html css, or js file
		if(source.getExtension() !== 'js' 
		&& source.getExtension() !== 'html'
		&& source.getExtension() !== 'json') {
			//just pass it along
			source.copy(destination, function() {
				//also deploy it
				source.copy(deploy, function() {
					done();
				});
			});
			
			return;
		}
		
		//get the content
		source.getContent(function(error, content) {
			if(error) {
				eve.trigger('error', error);
				return;
			}
			
			content = render(content.toString(), config);
			
			//send back
			eden('file', destination).setContent(content, function(error) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				//also deploy it
				eden('file', deploy).setContent(content, function(error) {
					if(error) {
						eve.trigger('error', error);
						return;
					}
					
					done();
				});
			});
		});
	};
	
	var normalizeField = function(field) {
		var normal = { type: field.type || 'string' };
		
		normal.field 	= field.field 	|| ['text'];
		normal.valid 	= field.valid 	|| [];
		normal.label 	= field.label 	|| '';
		normal.holder 	= field.holder 	|| '';
		
		if(field.field === false) {
			normal.field = false;
		} else if(typeof normal.field === 'string') {
			normal.field = [normal.field];
		}
		
		if(typeof normal.valid === 'string') {
			normal.valid = [[normal.valid]];
		}
		
		if(typeof field.default != 'undefined') {
			normal.default = field.default;
		}
		
		var valid = [];
		
		for(var i = 0; i < normal.valid.length; i++) {
			if(normal.valid[i] instanceof Array) {
				valid.push(normal.valid[i]);
				continue;
			}
			
			valid.push([normal.valid[i]]);
		}
		
		normal.valid = valid;
		
		if(field.options instanceof Array) {
			normal.options = [];
			for(var i = 0; i < field.options.length; i++) {
				if(typeof field.options[i] == 'string') {
					normal.options.push({
						value: field.options[i],
						label: field.options[i][0].toUpperCase() + field.options[i].substr(1)
					});
					
					continue;
				}
				
				normal.options.push(field.options[i]);
			}
		}
		
		return normal;
	};
	
	var render = function(content, data) {
		//add active field if wanted
		if(data.use_active) {
			data.fields.active = {
				label	: 'Active',
				type	: 'boolean',
				default	: true,
				field	: false
			};
		}
		
		//add created field if wanted
		if(data.use_created) {
			data.fields.created = {
				label	: 'Created',
				type	: 'date',
				default	: 'now()',
				field	: false
			};
		}
		
		//add updated field if wanted
		if(data.use_updated) {
			data.fields.updated = {
				label	: 'Updated',
				type	: 'date',
				default	: 'now()',
				field	: false
			};
		}
		
		if(content.indexOf('{SCHEMA}') !== -1) {
			content = renderSchema(content, data);
		}
		
		if(content.indexOf('{FIELDSET}') !== -1) {
			content = renderFieldset(content, data);
		}
		
		if(content.indexOf('{HEADERS}') !== -1) {
			content = renderHeaders(content, data);
		}
		
		if(content.indexOf('{COLUMNS}') !== -1) {
			content = renderColumns(content, data);
		}
		
		if(content.indexOf('{ENUMS}') !== -1) {
			content = renderEnums(content, data);
		}
		
		if(content.indexOf('{DEFAULTS}') !== -1) {
			content = renderDefaults(content, data);
		}
		
		if(content.indexOf('{SERVER_CONVERT}') !== -1) {
			content = renderServerConvert(content, data);
		}
		
		if(content.indexOf('{CONTROL_CONVERT}') !== -1) {
			content = renderControlConvert(content, data);
		}
		
		if(content.indexOf('{SEARCHABLE}') !== -1) {
			content = renderSearchable(content, data);
		}
		
		if(content.indexOf('{VALIDATION}') !== -1) {
			content = renderValidation(content, data);
		}
		
		if(content.indexOf('{OUTPUT_FORMAT}') !== -1) {
			content = renderOutputFormat(content, data);
		}
		
		if(content.indexOf('{USE_ACTIVE') !== -1) {
			content = renderUseActive(content, data);
		}
		
		if(content.indexOf('{USE_CREATED') !== -1) {
			content = renderUseCreated(content, data);
		}
		
		if(content.indexOf('{USE_UPDATED') !== -1) {
			content = renderUseUpdated(content, data);
		}
		
		//Change variables
		content = eden('string').replace(content, /{SLUG}/g		, data.slug);
		content = eden('string').replace(content, /{ICON}/g		, data.icon);
		content = eden('string').replace(content, /{SINGULAR}/g	, data.singular);
		content = eden('string').replace(content, /{PLURAL}/g	, data.plural);
		content = eden('string').replace(content, /{VENDOR}/g	, vendor);
		
		return content;
	};
	
	var renderSchema = function(content, data) {
		//determine the schema
		var schema = {};
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			var meta = { type: field.type };
			var more = false;
			
			if(field.options) {
				meta.enum = [];
				for(var i = 0 ; i < field.options.length; i++) {
					meta.enum.push(field.options[i].value);
				}
				
				more = true;
			}
			
			if(typeof field.default != 'undefined') {
				meta.default = field.default;
				more = true;
				
				//if default is a native object
				if(meta.default === 'now()') {
					meta.default = '{NOW}';
				}
			}
			
			for(var i = 0; i < field.valid.length; i ++) {
				if(field.valid[i][0] === 'required') {
					meta.required = true;
					more = true;
					break;
				}
			}
			
			schema[name] = meta;
			
			schema[name].type = '{' + schema[name].type.toUpperCase() + '}';
			
			if(!more) {
				schema[name] = schema[name].type;
			}
		});
		
		schema = JSON.stringify([schema], null, 4);
		
		schema = schema.substr(6, schema.length - 8);
		
		schema = eden('string').replace(schema, /"{STRING}"/g	, 'String');
		schema = eden('string').replace(schema, /"{DATE}"/g		, 'Date');
		schema = eden('string').replace(schema, /"{NUMBER}"/g	, 'Number');
		schema = eden('string').replace(schema, /"{BOOLEAN}"/g	, 'Boolean');
		schema = eden('string').replace(schema, /"{BUFFER}"/g	, 'Buffer');
		schema = eden('string').replace(schema, /"{NOW}"/g		, 'Date.now');
		
		schema = 'prototype.schema = ' + schema + ';';
		
		return eden('string').replace(content, /{SCHEMA}/g	, schema);
	};
	
	var renderHeaders = function(content, data) {
		var headers = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			if(field.field instanceof Array 
			&& (field.field[0] == 'textarea'
			|| field.field[0] == 'wysiwyg'
			|| field.field[0] == 'markdown')) {
				return;
			}
			
			headers.push('<th>'+normalizeField(field).label+'</th>');
		});
		
		return eden('string').replace(content, /{HEADERS}/g	, headers.join("\n                        "));
	};
	
	var renderColumns = function(content, data) {
		var columns = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			if(field.field instanceof Array 
			&& (field.field[0] == 'textarea'
			|| field.field[0] == 'wysiwyg'
			|| field.field[0] == 'markdown')) {
				return;
			}
			
			columns.push('<td>{{'+name+'}}</td>');
		});
		
		return eden('string').replace(content, /{COLUMNS}/g	, columns.join("\n                        "));
	};
	
	var renderEnums = function(content, data) {
		var enums = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			//if there is no enum
			if(!field.options || !(field.options instanceof Array)) {
				return;
			}
			
			list = JSON.stringify([[field.options]], null, 4);
			list = list.substr(16, list.length - 24);
			
			enums.push('this.data.' + name + 'List = ' + list + ';');
		});
		
		return eden('string').replace(content, /{ENUMS}/g	, enums.join("\n		"));
	};
	
	var renderDefaults = function(content, data) {
		var defaults = [];
		
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			var variable = 'this.data.' + data.slug + '.' + name;
			
			if(field.default) {
				var value = field.default;
				
				if(value == 'now()') {
					value = '_convertToControlDate(Date.now());';
				}
				
				defaults.push(variable + ' = ' + value + ';');
			}
		});
		
		return eden('string').replace(content, /{DEFAULTS}/g	, defaults.join("\n		"));
	};
	
	var renderControlConvert = function(content, data) {
		var convert = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			
			var variable = 'this.data.' + data.slug + '.' + name;
			
			if(field.field[0] === 'datetime') {
				convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
				convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ');');
				convert.push('}');
				return;
			}
			
			if(field.field[0] === 'date') {
				convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
				convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ', false, true);');
				convert.push('}');
				return;
			}
			
			if(field.field[0] === 'time') {
				convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
				convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ', true);');
				convert.push('}');
				return;
			}
		});
		
		return eden('string').replace(content, /{CONTROL_CONVERT}/g	, convert.join("\n		"));
	};
	
	var renderServerConvert = function(content, data) {
		var convert = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			
			var variable = 'this.data.' + data.slug + '.' + name;
			
			if(field.field[0] === 'datetime'
			|| field.field[0] === 'date'
			|| field.field[0] === 'time') {
				convert.push(variable + ' = ' + '_convertToServerDate(' + variable + ');');
				return;
			}
		});
		
		return eden('string').replace(content, /{SERVER_CONVERT}/g	, convert.join("\n			"));
	};
	
	var renderFieldset = function(content, data) {
		var fields = [];
		
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			
			if(field.field === false || !copy.field[field.field[0]]) {
				return;
			}
			
			var holder 	= field.holder || '';
			var pattern = field.field[1] || '';
			
			if(holder.length) {
				holder = ' \'placeholder="' + holder + '"\'';
			}
			
			var html = copy.field[field.field[0]]
				.replace(/{SLUG}/g 			, name)
				.replace(/{PACKAGE}/g 		, data.slug)
				.replace(/{PLACEHOLDER}/g 	, holder)
				.replace(/{PATTERN}/g		, pattern)
				.replace(/{LIST}/g			, '../'+name+'List');
				
			if(field.options && field.field[0] !== 'select') {
				var items = [];
				eden('array').each(field.options, function(i, item) {
					items.push(html.replace('{CHOICE}', item.value).replace('{LABEL}', item.label));
				});
				
				html = html.join("\n");
			} else {
				html = html.replace('{CHOICE}', 1).replace('{LABEL}', 'Yes');
			}
			
			html = copy.field.fieldset
				.replace('{LABEL}', field.label)
				.replace('{SLUG}', name)
				.replace('{FIELD}', "\n                    	"+html+"\n                    ");
				
			fields.push(html);
		});
		
		return eden('string').replace(content, /{FIELDSET}/g	, fields.join("\n\n		    		"));
	};
	
	var renderValidation = function(content, data) {
		var validation = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			
			var variable 	= 'this.data.' + data.slug + '.' + name;
			var conditional = [];
			
			//enum
			if(field.options instanceof Array) {
				var equalsOne = [];
				var values = [];
				for(var i = 0; i < field.options.length; i++) {
					values.push(field.options[i].value);
					equalsOne.push(variable + ' !== \'' + field.options[i].value + '\'');
				}
				
				conditional.push([
					variable + ' && ' + equalsOne.join(" \n		&& "), 
					field.label + ' must be one of ' + values.join(', ')]);
			}
			
			eden('array').each(field.valid || [], function(i, method) {
				if(!(method instanceof Array)) {
					return;
				}
				
				switch(method[0]) {
					case 'required':
						conditional.push([
							'!' + variable + ' || !' + variable + '.length', 
							field.label + ' is required!']);
							break;
					case 'gt':
						if(field.type === 'number') {
							conditional.push([
								variable + ' && ' + variable + ' <= ' + method[1], 
								field.label + ' must be greater than ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length <= ' + method[1], 
							field.label + ' characters must be greater than ' + method[1]]);
						break;
					case 'gte':
						if(field.type === 'number') {
							conditional.push([
								variable + ' && ' + variable + ' < ' + method[1], 
								field.label + ' must be greater than or equal to ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length < ' + method[1], 
							field.label + ' characters must be greater than or equal to' + method[1]]);
						break;
					case 'lt':
						if(field.type === 'number') {
							conditional.push([
								variable + ' && ' + variable + ' >= ' + method[1], 
								field.label + ' must be less than ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length >= ' + method[1], 
							field.label + ' characters must be less than ' + method[1]]);
						break;
					case 'lte':
						if(field.type === 'number') {
							conditional.push([
								variable + ' && ' + variable + ' > ' + method[1], 
								field.label + ' must be less than or equal to ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length > ' + method[1], 
							field.label + ' characters must be less than or equal to' + method[1]]);
						break;
					case 'email':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.email+"', 'ig')).test("+variable+")", 
							field.label + ' must be a valid email.']);
						break;
					case 'hex':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.hex+"', 'ig')).test("+variable+")", 
							field.label + ' must be a valid hex.']);
						break;
					case 'cc':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.cc+"', 'ig')).test("+variable+")",
							field.label + ' must be a valid credit card.']);
						break;
					case 'html':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.html+"', 'ig')).test("+variable+")", 
							field.label + ' must be valid html.']);
						break;
					case 'url':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.url+"', 'ig')).test("+variable+")", 
							field.label + ' must be a valid url.']);
						break;
					case 'slug':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.slug+"', 'ig')).test("+variable+")", 
							field.label + ' must be a valid slug.']);
						break;
					case 'alphanum':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.alphanum+"', 'ig')).test("+variable+")", 
							field.label + ' must be alpha-numeric.']);
						break;
					case 'alphanumhyphen':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.alphanumhyphen+"', 'ig')).test("+variable+")", 
							field.label + ' must be alpha-numeric-hyphen.']);
						break;
					case 'alphanumscore':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.alphanumscore+"', 'ig')).test("+variable+")", 
							field.label + ' must be alpha-numeric-underscore.']);
						break;
					case 'alphanumline':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+copy.valid.alphanumline+"', 'ig')).test("+variable+")", 
							field.label + ' must be alpha-numeric-hyphen-underscore.']);
						break;
					case 'regex':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+method[1]+"', 'ig')).test("+variable+")", 
							field.label + ' is invalid.']);
						break;
				}
			});
			
			//format conditional
			eden('array').each(conditional, function(i, condition) {
				var state = 'if';
				if(i > 0) {
					state = '} else if';
				}
				validation.push('//' + condition[1]);
				validation.push(state + '(' + condition[0] + ') {');
				validation.push('    this.data.errors.' + name + ' = \'' + condition[1] + '\';');
				if((i + 1) === conditional.length) {
					validation.push('}');
					validation.push('');
				}
			});
		});
		
		return eden('string').replace(content, /{VALIDATION}/g	, validation.join("\n		"));
	};
	
	var renderSearchable = function(content, data) {
		var searchable = [];
		//for each fields
		//	 or.push([
		//		{ field1	: new RegExp(keyword, 'ig') },
		//		{ field2	: new RegExp(keyword, 'ig') },
		//		{ field3	: new RegExp(keyword, 'ig') } ]);
		eden('hash').each(data.fields, function(name, field) {
			if(!field.search) {
				return;
			}
			
			var term = {};
			term[name] = '{VALUE}';
			searchable.push(term);
		});
		
		searchable = JSON.stringify([[[searchable]]], null, 4);
		
		searchable = searchable.replace(/"{VALUE}"/g, 'new RegExp(keyword, \'ig\')');
		
		searchable = searchable.substr(30, searchable.length - 48);
		
		searchable = 'or.push(' + searchable + ');'
		
		return eden('string').replace(content, /{SEARCHABLE}/g	, searchable);
	};
	
	var renderOutputFormat = function(content, data) {
		var output = [];
		
		eden('hash').each(data.fields, function(name, field) {
			field = normalizeField(field);
			
			var variable = 'response.batch[0].results[i].' + name;
			
			switch(field.type) {
				case 'date':
					output.push(variable + ' = $.timeToDate((new Date('+variable+')).getTime());');
					break;
				case 'boolean':
					output.push(variable + ' = ' + variable+' ? \'Yes\': \'No\'');
					break;
			}
		});
		
		return eden('string').replace(content, /{OUTPUT_FORMAT}/g	, output.join("\n		   		"));
	};
	
	var renderUseActive = function(content, data) {
		for(var key in copy.active) {
			if(data.use_active) {
				content = eden('string').replace(content, new RegExp('{USE_ACTIVE_'+key.toUpperCase()+'}', 'g'), copy.active[key][0]);
			}
			
			content = eden('string').replace(content, new RegExp('{USE_ACTIVE_'+key.toUpperCase()+'}', 'g'), copy.active[key][1]);
		}
		
		return content;
	};
	
	var renderUseCreated = function(content, data) {
		for(var key in copy.created) {
			if(data.use_created) {
				content = eden('string').replace(content, new RegExp('{USE_CREATED_'+key.toUpperCase()+'}', 'g'), copy.created[key][0]);
			}
			
			content = eden('string').replace(content, new RegExp('{USE_CREATED_'+key.toUpperCase()+'}', 'g'), copy.created[key][1]);
		}
		
		return content;
	};
	
	var renderUseUpdated = function(content, data) {
		for(var key in copy.updated) {
			if(data.use_updated) {
				content = eden('string').replace(content, new RegExp('{USE_UPDATED_'+key.toUpperCase()+'}', 'g'), copy.updated[key][0]);
			}
			
			content = eden('string').replace(content, new RegExp('{USE_UPDATED_'+key.toUpperCase()+'}', 'g'), copy.updated[key][1]);
		}
		
		return content;
	};
};