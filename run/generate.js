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

	var fieldset = '{{#block \'form/fieldset\' \'{LABEL}\' errors.{SLUG}}}{FIELD}{{/block}}';
	
	var text 			= '{{{block \'field/text\' \'{SLUG}\' ../{PACKAGE}.{SLUG}{PLACEHOLDER}}}}';
	var password 		= '{{{block \'field/password\' \'{SLUG}\' ../{PACKAGE}.{SLUG}{PLACEHOLDER}}}}';
    var file 			= '{{{block \'field/file\' \'{SLUG}\'}}}';
    var slider 			= '{{{block \'field/slider\' \'{SLUG}\' ../{PACKAGE}.{SLUG}}}}';
    var number 			= '{{{block \'field/number\' \'{SLUG}\' ../{PACKAGE}.{SLUG}}}}';
    var mask 			= '{{{block \'field/mask\' \'{SLUG}\' \'{PATTERN}\' ../{PACKAGE}.{SLUG}{PLACEHOLDER}}}}';
    var color 			= '{{{block \'field/color\' \'{SLUG}\' ../{PACKAGE}.{SLUG}{PLACEHOLDER}}}}';
    var tag 			= '{{{block \'field/tag\' \'{SLUG}\' ../{PACKAGE}.{SLUG} {LIST}{PLACEHOLDER}}}}';
    var datetime 		= '{{{block \'field/datetime\' \'{SLUG}\' ../{PACKAGE}.{SLUG}}}}';
    var date 			= '{{{block \'field/date\' \'{SLUG}\' ../{PACKAGE}.{SLUG}}}}';
    var time 			= '{{{block \'field/time\' \'{SLUG}\' ../{PACKAGE}.{SLUG}∂}}}';
    var autocomplete 	= '{{{block \'field/autocomplete\' \'{SLUG}\' ../{PACKAGE}.{SLUG} {LIST}{PLACEHOLDER}}}}';
    var combobox 		= '{{{block \'field/combobox\' \'{SLUG}\' ../{PACKAGE}.{SLUG} {LIST}{PLACEHOLDER}}}}';
    var select 			= '{{{block \'field/select\' \'{SLUG}\' {LIST} ../{PACKAGE}.{SLUG}}}}';
    var country 		= '{{{block \'field/country\' \'{SLUG}\' ../{PACKAGE}.{SLUG}}}}';
    var textarea 		= '{{#block \'field/textarea\' \'{SLUG}\'{PLACEHOLDER}}}{{../../{PACKAGE}.{SLUG}}}{{/block}}';
    var radio 			= '{{#block \'field/radio\' \'{SLUG}\' \'{CHOICE}\' ../{PACKAGE}.{SLUG}{PLACEHOLDER}}}{LABEL}{{/block}}';
    var checkbox 		= '{{#block \'field/checkbox\' \'{SLUG}\' \'{CHOICE}\' ../{PACKAGE}.{SLUG}{PLACEHOLDER}}}{LABEL}{{/block}}';
    var switched 		= '{{{block \'field/switch\' \'{SLUG}\' ../{PACKAGE}.{SLUG}}}}';
    var markdown 		= '{{#block \'field/markdown\' \'{SLUG}\'{PLACEHOLDER}}}{{../../{PACKAGE}.{SLUG}}}{{/block}}';
    var wysiwyg 		= '{{#block \'field/wysiwyg\' \'{SLUG}\'{PLACEHOLDER}}}{{../../{PACKAGE}.{SLUG}}}{{/block}}';
	
	var validCC				= '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3'
							+ '[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\\\d{3})\\\\d{11})$$';
	
	var validEmail			= '^(([^<>()[\\\\]\\\\.,;:\\\\s@\\\\"]+(\\\\.[^<>()[\\\\]\\\\.,;:\\\\s@\\\\"]+)*)|'
							+ '(\\\\".+\\\\"))@((\\\\[[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}'
							+ '\\\\])|(([a-zA-Z\\\\-0-9]+\\\\.)+[a-zA-Z]{2,}))$$';
							
	var validHex			= '^[0-9a-fA-F]{6}\$';
	
	var validHtml			= '<\\\\/?\\\\w+((\\\\s+(\\\\w|\\\\w[\\\\w-]*\\\\w)(\\\\s*=\\\\s*(?:\\\\".*?\\\\"|\'.'
							+ '*?\'|[^\'\\\\">\\\\s]+))?)+\\\\s*|\\\\s*)\\\\/?>';
	
	var validUrl			= '^(http|https|ftp):\\\\/\\\\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\\\\/?';
	
	var validAlphaNum		= '^[a-zA-Z0-9]+$$';
	
	var validAlphaNumScore	= '^[a-zA-Z0-9_]+$$';
	
	var validAlphaNumHyphen	= '^[a-zA-Z0-9-]+';
	
	var validAlphaNumLine	= '^[a-zA-Z0-9-_]+$$';
	
	var validSlug			= '^[a-z0-9-]+';
	
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
	
	var render = function(content, data) {
		//Change variables
		content = eden('string').replace(content, /{SLUG}/g		, data.slug);
		content = eden('string').replace(content, /{ICON}/g		, data.icon);
		content = eden('string').replace(content, /{SINGULAR}/g	, data.singular);
		content = eden('string').replace(content, /{PLURAL}/g	, data.plural);
		content = eden('string').replace(content, /{VENDOR}/g	, vendor);
		
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
		
		return content;
	};
	
	var renderSchema = function(content, data) {
		//determine the schema
		var schema = {};
		eden('hash').each(data.fields, function(name, field) {
			schema[name] = Object.create(field.meta);
			
			//if meta is a native object
			if(typeof schema[name] === 'function' 
			&& typeof schema[name].name === 'string') {
				schema[name] = '{'+field.meta.name.toUpperCase()+'}';
			//if type is a native object
			} else if(field.meta.type 
			&& typeof field.meta.type === 'function' 
			&& typeof field.meta.type.name === 'string') {
				schema[name].type = '{'+field.meta.type.name.toUpperCase()+'}';
			}
			
			//if default is a native object
			if(schema[name].default 
			&& typeof schema[name].default === 'function' 
			&& schema[name].default.name === 'now') {
				schema[name].default = '{NOW}';
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
			
			headers.push('<th>'+name.substr(0, 1).toUpperCase() + name.substr(1)+'</th>');
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
			//if there is no enum
			if(!field.meta.enum || !(field.meta.enum instanceof Array)) {
				return;
			}
			
			var list = [];
			
			eden('hash').each(field.meta.enum, function(i, choice) {
				var title = choice + '';
				
				if(title.length > 1) {
					title = choice[0].toUpperCase() + choice.substr(1);
				}
				
				list.push({ value: choice, label: title });
			});
			
			list = JSON.stringify([[list]], null, 4);
			list = list.substr(16, list.length - 24);
			
			enums.push('this.data.' + name + 'List = ' + list + ';');
		});
		
		return eden('string').replace(content, /{ENUMS}/g	, enums.join("\n		"));
	};
	
	var renderDefaults = function(content, data) {
		var defaults = [];
		
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			var variable = 'this.data.' + data.slug + '.' + name;
			
			if(field.meta.default) {
				var value = field.meta.default;
				
				//if default is a native object
				if(typeof value === 'function' 
				&& value.name === 'now') {
					defaults.push(variable + ' = ' + '_convertToControlDate(Date.now());');
					return;
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
			var variable = 'this.data.' + data.slug + '.' + name;
			
			if(field.field && field.field[0] === 'datetime') {
				convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
				convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ');');
				convert.push('}');
				return;
			}
			
			if(field.field && field.field[0] === 'date') {
				convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
				convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ', false, true);');
				convert.push('}');
				return;
			}
			
			if(field.field && field.field[0] === 'time') {
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
			var variable = 'this.data.' + data.slug + '.' + name;
			
			if(field.field 
			&& (field.field[0] === 'datetime'
			|| field.field[0] === 'date'
			|| field.field[0] === 'time')) {
				convert.push(variable + ' = ' + '_convertToServerDate(' + variable + ');');
				return;
			}
		});
		
		return eden('string').replace(content, /{SERVER_CONVERT}/g	, convert.join("\n			"));
	};
	
	var renderFieldset = function(content, data) {
		var fields = [];
		
		eden('hash').each(data.fields, function(name, config) {
			var field 		= 'text';
			var placeholder = config.holder || '';
			var pattern 	= '';
			
			if(config.field && config.field[0]) {
				field = config.field[0];
			}
			
			if(config.field && config.field[1]) {
				pattern = config.field[1];
			}
			
			if(placeholder.length) {
				placeholder = ' \'placeholder="' + placeholder + '"\'';
			}
			
			switch(field) {
				case 'text': 			field = text;			break;
				case 'password':		field = password;		break;
				case 'file':			field = file;			break;
				case 'slider':			field = slider;			break;
				case 'number':			field = number;			break;
				case 'mask':			field = mask;			break;
				case 'color':			field = color;			break;
				case 'tag':				field = tag;			break;
				case 'datetime':		field = datetime;		break;
				case 'date':			field = date;			break;
				case 'time':			field = time;			break;
				case 'autocomplete':	field = autocomplete;	break;
				case 'combobox':		field = combobox;		break;
				case 'select':			field = select;			break;
				case 'country':			field = country;		break;
				case 'radio':			field = radio;			break;
				case 'checkbox':		field = checkbox;		break;
				case 'switch':			field = switched;		break;
				case 'textarea':		field = textarea;		break;
				case 'markdown':		field = markdown;		break;
				case 'wysiwyg':			field = wysiwyg;		break;
			}
			
			field = field
				.replace(/{SLUG}/g 			, name)
				.replace(/{PACKAGE}/g 		, data.slug)
				.replace(/{PLACEHOLDER}/g 	, placeholder)
				.replace(/{PATTERN}/g		, pattern)
				.replace(/{LIST}/g			, '../'+name+'List');
				
			if(config.meta.enum 
			&& config.meta.enum instanceof Array
			&& config.field && config.field[0] != 'select') {
				var items = [];
				eden('array').each(config.meta.enum, function(i, item) {
					var title = item + '';
				
					if(item.length > 1) {
						title = item[0].toUpperCase() + item.substr(1);
					}
					
					items.push(field.replace('{CHOICE}', item).replace('{LABEL}', title));
				});
				
				field = items.join("\n");
			} else {
				field = field.replace('{CHOICE}', 1).replace('{LABEL}', 'Yes');
			}
			
			field = fieldset
				.replace('{LABEL}', name.substr(0, 1).toUpperCase() + name.substr(1))
				.replace('{SLUG}', name)
				.replace('{FIELD}', "\n                    	"+field+"\n                    ");
				
			fields.push(field);
		});
		
		return eden('string').replace(content, /{FIELDSET}/g	, fields.join("\n\n		    		"));
	};
	
	var renderValidation = function(content, data) {
		var validation = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			var variable 	= 'this.data.' + data.slug + '.' + name;
			var title 		= name.substr(0, 1).toUpperCase() + name.substr(1);
			var conditional = [];
			
			//required
			if(field.meta.required) {
				conditional.push([
					'!' + variable + ' || !' + variable + '.length', 
					title + ' is required!']);
			}
			
			//enum
			if(field.meta.enum instanceof Array) {
				var equalsOne = [];
				for(var i = 0; i < field.meta.enum.length; i++) {
					equalsOne.push(variable + ' !== \'' + field.meta.enum[i] + '\'');
				}
				
				conditional.push([
					variable + ' && ' + equalsOne.join(" \n		&& "), 
					title + ' must be one of ' + field.meta.enum.join(', ')]);
			}
			
			eden('array').each(field.valid || [], function(i, method) {
				if(!(method instanceof Array)) {
					return;
				}
				
				switch(method[0]) {
					case 'gt':
						if(field.meta.name === 'Number' || (field.meta.type && field.meta.type.name === 'Number')) {
							conditional.push([
								variable + ' && ' + variable + ' <= ' + method[1], 
								title + ' must be greater than ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length <= ' + method[1], 
							title + ' characters must be greater than ' + method[1]]);
						break;
					case 'gte':
						if(field.meta.name === 'Number' || (field.meta.type && field.meta.type.name === 'Number')) {
							conditional.push([
								variable + ' && ' + variable + ' < ' + method[1], 
								title + ' must be greater than or equal to ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length < ' + method[1], 
							title + ' characters must be greater than or equal to' + method[1]]);
						break;
					case 'lt':
						if(field.meta.name === 'Number' || (field.meta.type && field.meta.type.name === 'Number')) {
							conditional.push([
								variable + ' && ' + variable + ' >= ' + method[1], 
								title + ' must be less than ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length >= ' + method[1], 
							title + ' characters must be less than ' + method[1]]);
						break;
					case 'lte':
						if(field.meta.name === 'Number' || (field.meta.type && field.meta.type.name === 'Number')) {
							conditional.push([
								variable + ' && ' + variable + ' > ' + method[1], 
								title + ' must be less than or equal to ' + method[1]]);
							break;
						}
						
						conditional.push([
							variable + ' && ' + variable + '.length > ' + method[1], 
							title + ' characters must be less than or equal to' + method[1]]);
						break;
					case 'email':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validEmail+"', 'ig')).test("+variable+")", 
							title + ' must be a valid email.']);
						break;
					case 'hex':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validHex+"', 'ig')).test("+variable+")", 
							title + ' must be a valid hex.']);
						break;
					case 'cc':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validCC+"', 'ig')).test("+variable+")",
							title + ' must be a valid credit card.']);
						break;
					case 'html':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validHtml+"', 'ig')).test("+variable+")", 
							title + ' must be valid html.']);
						break;
					case 'url':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validUrl+"', 'ig')).test("+variable+")", 
							title + ' must be a valid url.']);
						break;
					case 'slug':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validSlug+"', 'ig')).test("+variable+")", 
							title + ' must be a valid slug.']);
						break;
					case 'alphanum':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validAlphaNum+"', 'ig')).test("+variable+")", 
							title + ' must be alpha-numeric.']);
						break;
					case 'alphanumhyphen':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validAlphaNumHyphen+"', 'ig')).test("+variable+")", 
							title + ' must be alpha-numeric-hyphen.']);
						break;
					case 'alphanumscore':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validAlphaNumScore+"', 'ig')).test("+variable+")", 
							title + ' must be alpha-numeric-underscore.']);
						break;
					case 'alphanumline':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+validAlphaNumLine+"', 'ig')).test("+variable+")", 
							title + ' must be alpha-numeric-hyphen-underscore.']);
						break;
					case 'regex':
						conditional.push([
							variable + ' && ' + "!(new RegExp('"+method[1]+"', 'ig')).test("+variable+")", 
							title + ' is invalid.']);
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
			if(!(field.field instanceof Array)) {
				return;
			}
			
			var type = field.meta.name;
			
			if(field.meta.type && field.meta.type.name) {
				type = field.meta.type.name;
			}
			
			var variable = 'response.batch[0].results[i].' + name;
			
			switch(type) {
				case 'Date':
					output.push(variable + ' = $.timeToDate((new Date('+variable+')).getTime());');
					break;
				case 'Boolean':
					output.push(variable + ' = ' + variable+' ? \'Yes\': \'No\'');
					break;
			}
		});
		
		return eden('string').replace(content, /{OUTPUT_FORMAT}/g	, output.join("\n		   		"));
	};
};