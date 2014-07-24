module.exports = function(eve, local, args) {
	//---------------------------------------
	// START: VARIABLE LIST
	
	var eden		= require('edenjs');
	var sequence	= eden('sequence');
	var parameter 	= args[0];
	var packages 	= [];
	var vendor 		= null;
	
    var paths = {
        control     : local + '/config/control/packages.js',
        server      : local + '/config/server/packages.js',
        schema      : local + '/schema/',
        package     : local + '/package/',
        generator   : __dirname + '/../build/generator/' };

	var fieldset = '{{#block \'form/fieldset\' \'{LABEL}\' error.{SLUG}}}{FIELD}{{/block}}';
	
	var text 			= '{{{block \'field/text\' \'{SLUG}\' \'{VALUE}\'{PLACEHOLDER}}}}';
	var password 		= '{{{block \'field/password\' \'{SLUG}\' \'{VALUE}\'{PLACEHOLDER}}}}';
    var file 			= '{{{block \'field/file\' \'{SLUG}\'}}}';
    var slider 			= '{{{block \'field/slider\' \'{SLUG}\' \'{VALUE}\'}}}';
    var number 			= '{{{block \'field/number\' \'{SLUG}\' \'{VALUE}\'}}}';
    var mask 			= '{{{block \'field/mask\' \'{SLUG}\' \'{PATTERN}\' \'{VALUE}\'{PLACEHOLDER}}}}';
    var color 			= '{{{block \'field/color\' \'{SLUG}\' \'{VALUE}\'{PLACEHOLDER}}}}';
    var tag 			= '{{{block \'field/tag\' \'{SLUG}\' \'{VALUE}\' {LIST}{PLACEHOLDER}}}}';
    var datetime 		= '{{{block \'field/datetime\' \'{SLUG}\' \'{VALUE}\'{PLACEHOLDER}}}}';
    var date 			= '{{{block \'field/date\' \'{SLUG}\' \'{VALUE}\'{PLACEHOLDER}}}}';
    var time 			= '{{{block \'field/time\' \'{SLUG}\' \'{VALUE}\'{PLACEHOLDER}}}}';
    var autocomplete 	= '{{{block \'field/autocomplete\' \'{SLUG}\' \'{VALUE}\' {LIST}{PLACEHOLDER}}}}';
    var combobox 		= '{{{block \'field/combobox\' \'{SLUG}\' \'{VALUE}\' {LIST}{PLACEHOLDER}}}}';
    var select 			= '{{{block \'field/select\' \'{SLUG}\' {LIST} \'{VALUE}\'}}}';
    var country 		= '{{{block \'field/country\' \'{SLUG}\' \'{VALUE}\'}}}';
    var textarea 		= '{{#block \'field/textarea\' \'{SLUG}\'{PLACEHOLDER}}}{VALUE}{{/block}}';
    var radio 			= '{{#block \'field/radio\' \'{SLUG}\' \'{CHOICE}\' \'{VALUE}\'{PLACEHOLDER}}}{LABEL}{{/block}}';
    var checkbox 		= '{{#block \'field/checkbox\' \'{SLUG}\' \'{CHOICE}\' \'{VALUE}\'{PLACEHOLDER}}}{LABEL}{{/block}}';
    var switched 		= '{{{block \'field/switch\' \'{SLUG}\' \'{VALUE}\'}}}';
    var markdown 		= '{{#block \'field/markdown\' \'{SLUG}\'{PLACEHOLDER}}}{VALUE}{{/block}}';
    var wysiwyg 		= '{{#block \'field/wysiwyg\' \'{SLUG}\'{PLACEHOLDER}}}{VALUE}{{/block}}';

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
				eden('folder', paths.generator + '/server').getFiles(null, true, next2);
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
					var path = file.path.substr(paths.generator.length);
					
            		var destination = (paths.package + vendor + '/' + package + path).replace('SLUG', config.slug);
					
					//if this is not an html css, or js file
					if(file.getExtension() !== 'js' 
					&& file.getExtension() !== 'html'
					&& file.getExtension() !== 'json') {
						//just pass it along
						file.copy(destination, function() {
							done();
						});
						
						return;
					}
					
					//get the content
					file.getContent(function(error, content) {
						if(error) {
							eve.trigger('error', error);
							return;
						}
						
						content = render(content.toString(), config, vendor);
						
						//send back
						eden('file', destination).setContent(content, function(error) {
							if(error) {
								eve.trigger('error', error);
								return;
							}
							
							done();
						});
					});
				});
			});
			
			//get all control files recursively
			sequence2.then(function(next2) {
				eden('folder', paths.generator + '/control').getFiles(null, true, next2);
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
					var path = file.path.substr(paths.generator.length);
					
            		var destination = (paths.package + vendor + '/' + package + path).replace('SLUG', config.slug);
					
					//if this is not an html css, or js file
					if(file.getExtension() !== 'js' 
					&& file.getExtension() !== 'html'
					&& file.getExtension() !== 'json') {
						//just pass it along
						file.copy(destination, function() {
							done();
						});
						
						return;
					}
					
					//get the content
					file.getContent(function(error, content) {
						if(error) {
							eve.trigger('error', error);
							return;
						}
						
						content = render(content.toString(), config, vendor);
						
						//send back
						eden('file', destination).setContent(content, function(error) {
							if(error) {
								eve.trigger('error', error);
								return;
							}
							
							done();
						});
					});
				});
			});
		});
	});
	
	// END: GENERATE PACKAGES
	//---------------------------------------
	
	var render = function(content, data, vendor) {
		//Change variables
		content = eden('string').replace(content, /{SLUG}/g		, data.slug);
		content = eden('string').replace(content, /{ICON}/g		, data.icon);
		content = eden('string').replace(content, /{SINGULAR}/g	, data.singular);
		content = eden('string').replace(content, /{PLURAL}/g	, data.plural);
		content = eden('string').replace(content, /{VENDOR}/g	, data.vendor);
		
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
		
		return content;
	};
	
	var renderSchema = function(content, data) {
		//determine the schema
		var schema = {};
		eden('hash').each(data.fields, function(name, field) {
			schema[name] = field.meta;
			
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
				schema[name].type = '{NOW}';
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
		
		schema = 'public.schema = ' + schema + ';';
		
		return eden('string').replace(content, /{SCHEMA}/g	, schema);
	};
	
	var renderHeaders = function(content, data) {
		var headers = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
			headers.push('<th>'+name.substr(0, 1).toUpperCase() + name.substr(1)+'</th>');
		});
		
		return eden('string').replace(content, /{HEADERS}/g	, headers.join("\n                        "));
	};
	
	var renderColumns = function(content, data) {
		var columns = [];
		//for each fields
		eden('hash').each(data.fields, function(name, field) {
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
			
			enums.push('this.data.' + name + 'List = ' + JSON.stringify(field.meta.enum) + ';');
		});
		
		return eden('string').replace(content, /{ENUMS}/g	, enums.join("\n			"));
	};
	
	var renderFieldset = function(content, data) {
		var fields = [];
		
		eden('hash').each(data.fields, function(name, config) {
			var field 		= 'text';
			var placeholder = config.holder || '';
			var defaults 	= '';
			var pattern 	= '';
			
			if(config.meta.default) {
				defaults = config.meta.default;
			}
			
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
				.replace('{SLUG}' 			, name)
				.replace('{VALUE}' 			, defaults)
				.replace('{PLACEHOLDER}' 	, placeholder)
				.replace('{PATTERN}'		, pattern)
				.replace('{LIST}'			, '../'+name+'List');
				
			if(config.meta.enum 
			&& config.meta.enum instanceof Array
			&& config.field && config.field[0] != 'select') {
				var items = [];
				eden('array').each(config.meta.enum, function(i, item) {
					items.push(field.replace('{CHOICE}', item));
				});
				
				field = items.join("\n");
			} else {
				field = field.replace('{CHOICE}', 1);
			}
			
			field = fieldset
				.replace('{LABEL}', name.substr(0, 1).toUpperCase() + name.substr(1))
				.replace('{SLUG}', name)
				.replace('{FIELD}', "\n                    	"+field+"\n                    ");
				
			fields.push(field);
		});
		
		return eden('string').replace(content, /{FIELDSET}/g	, fields.join("\n\n		    		"));
	};
};