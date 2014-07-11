(function() {
    var eden        = require('./build/server/node_modules/edenjs/lib/index');
    var parameter   = eden('array').slice(process.argv, 2)[0];
    
    var paths = {
        schema      : __dirname + '/schema/',
        package     : __dirname + '/package/',
        generator   : __dirname + '/build/generator/' };
    
    //is there a parameter?
    if(!parameter || !parameter.length) {
        console.log('\x1b[31m%s\x1b[0m', 'Invalid parameter. Must be in the form of vendor or vendor/package');
        return;
    }
    
    parameter = parameter.split('/');

    //is the schema valid?
    if(parameter.length > 2) {
        console.log('\x1b[31m%s\x1b[0m', 'Invalid parameter. Must be in the form of vendor or vendor/package');
        return;
    }
    
    var packages = [];

    var blockActions = {
        'autocomplete': { attributeIndex: 4, path: 'field/autocomplete' },
        'button':       { attributeIndex: 1, path: 'field/button', noName: true },
        'checkbox':     { attributeIndex: 4, path: 'field/checkbox'     },
        'color':        { attributeIndex: 3, path: 'field/color'        },
        'combobox':     { attributeIndex: 4, path: 'field/combobox'     },
        'country':      { attributeIndex: 3, path: 'field/country'      },
        'date':         { attributeIndex: 4, path: 'field/date'         },
        'datetime':     { attributeIndex: 4, path: 'field/datetime'     },
        'file':         { attributeIndex: 3, path: 'field/file'         },
        'markdown':     { attributeIndex: 2, path: 'field/markdown'     },
        'mask':         { attributeIndex: 4, path: 'field/mask'         },
        'number':       { attributeIndex: 6, path: 'field/number'       },
        'password':     { attributeIndex: 3, path: 'field/password'     },
        'radio':        { attributeIndex: 4, path: 'field/radio'        },
        'select':       { attributeIndex: 4, path: 'field/select', pipeOptions: 2 },
        'slider':       { attributeIndex: 6, path: 'field/slider'       },
        'switch':       { attributeIndex: 5, path: 'field/switch'       },
        'tag':          { attributeIndex: 4, path: 'field/tag'          },
        'textarea':     { attributeIndex: 2, path: 'field/textarea'     },
        'text':         { attributeIndex: 3, path: 'field/text'         },
        'time':         { attributeIndex: 4, path: 'field/time'         },
        'wysiwyg':      { attributeIndex: 3, path: 'field/wysiwyg'      },
        'fieldset':     { attributeIndex: 5, path: 'form/fieldset', noName: true },
    };

    setFullFunctionNames();
    
    //is there a slash?
    if(parameter.length == 2) {
        //is this a valid file ? 
        if(!eden('file', paths.schema + parameter.join('/') + '.js').isFile()) {
            console.log('\x1b[31m%s\x1b[0m', paths.schema + parameter.join('/') + '.js does not exist.');
            return;
        }
        
        packages.push(parameter[1]);
    }
    
    //set the vendor 
    var vendor = parameter[0];
    
    //start up sequence
    var sequence = eden('sequence');
    
    //if there is no package
    if(!packages.length) {
        //is this a valid folder ? 
        if(!eden('folder', paths.schema + vendor).isFolder()) {
            console.log('\x1b[31m%s\x1b[0m', paths.schema + vendor + ' does not exist.');
            return;
        }
        
        sequence.then(function(next) {
            //query the vendor folder for the list of packages
            eden('folder', paths.schema + vendor).getFiles(null, false, next);
        });
        
        sequence.then(function(files, next) {
            //parse through files
            for(var i = 0; i < files.length; i++) {
                //if this is not a js file
                if(files[i].getExtension() != 'js') {
                    //skip it
                    continue;
                }
                
                //store the package
                packages.push(files[i].getBase());
            }
            
            next();
        });
    }
    
    //loop through packages
    sequence.then(function(next) {
        for(var source, destination, i = 0; i < packages.length; i++) {
            //require the source path
            source = require(paths.schema + vendor + '/' + packages[i]);
            
            //determine the destination path
            destination = eden('folder', paths.package + vendor + '/' + packages[i]);
            
            //does the destination package exist?
            if(destination.isFolder()) {
                console.log('\x1b[31m%s\x1b[0m', destination.path + ' already exists.');
                console.log('\x1b[31m%s\x1b[0m', 'If you want to build a new package, you must delete this package first.');
                return;
            }
            
            //going to be forking the sequence
            var subsequence = eden('sequence');
            
            //create the folder
            subsequence.then(function(source, destination, subnext) {
                destination.mkdir(0777, function(error) {
                    if(error) {
                        console.log('\x1b[31m%s\x1b[0m', error);
                        return;
                    }
                    
                    subnext(source, destination);
                });
            }.bind(this, source, destination));
            
            //copy control and server folders only.
            var generatorFolders = ['control', 'server'];
            for (key in generatorFolders) {
                //copy generator folders to destination
                subsequence.then(function(folder, source, destination, subnext) {
                    eden('folder', paths.generator + '/' + folder).
                        copy(destination.path + '/' + folder, function(error) {
                        if(error) {
                            console.log('\x1b[31m%s\x1b[0m', error);
                            return;
                        }
                        
                        subnext(source, destination);
                    });
                }.bind(this, generatorFolders[key]));
            }

            //get output form
            subsequence.then(function(source, destination, subnext) {
                var output = readFields(source.fields);
                subnext(source, destination, output);
            });

            //create the form file
            subsequence.then(function(source, destination, output, subnext) {
                var file = eden('file', destination.path + '/control/template/index.html');
                file.setContent(output, function () {
                    subnext(source, destination);
                });
            });

            //get validation
            subsequence.then(function(source, destination, subnext) {
                eden('argument').testValue(source.fields, 'object');
                eden('argument').testValue(source.fields.valid, 'array', 'undefined');

                var output = '';
                var numFields = Object.keys(source.fields).length;
                var i = 0;
                for (name in source.fields) {
                    var data = source.fields[name];
                    var dataName  = 'this.data.' + source.slug + '.' + name;
                    var errorName = 'this.data.errors.' + name;
                    var upperName = eden('string').ucFirst(name);
                    var belowSubSequence = eden('sequence');

                    belowSubSequence.then(function(dataName, errorName, upperName, data, belowSubNext) {
                        var subOutput = '';
                        
                        if (data.meta.required) {
                            data.valid.push('required');
                        }

                        if (data.valid && data.valid.length) {
                            var j = 0;
                            eden('array').each(data.valid, function(key, value) {
                                eden('argument').testValue(value, 'array', 'string');

                                if (eden('string').isString(value)) {
                                    value = [value];
                                }

                                var validationName = value[0];
                                var replacement = value[1];
                                var file = eden('file', paths.generator + '/validation/' + validationName + '.js');

                                if (!file.isFile()) {
                                    if (++j >= data.valid.length) {
                                        belowSubNext(dataName, errorName, upperName, subOutput, false);
                                    }

                                    subOutput += '//manually add validation for ' + upperName + ': ' + validationName

                                    return;
                                }

                                file.getContent(function(replacement, error, content) {
                                    if(error) {
                                        console.log('\x1b[31m%s\x1b[0m', error);
                                        return;
                                    }

                                    console.log(replacement);

                                    if (!replacement) {
                                        replacement = '';
                                    }

                                    subOutput += eden('string').replace(
                                        content.toString(),
                                        /{VALUE}/g,
                                        replacement.toString()) + '\r\n';

                                    if (++j >= data.valid.length) {
                                        belowSubNext(dataName, errorName, upperName, subOutput, false);
                                    }
                                }.bind(this, replacement));
                            });
                        }
                        else {
                            belowSubNext(dataName, errorName, upperName, subOutput, true);
                        }
                    }.bind(this, dataName, errorName, upperName, data));

                    belowSubSequence.then(function(dataName, errorName, upperName, subOutput, skip, belowSubNext) {
                        if (!skip && subOutput) {
                            subOutput = eden('string').replace(subOutput, /{ERROR}/g, errorName);
                            subOutput = eden('string').replace(subOutput, /{DATA}/g,  dataName);
                            subOutput = eden('string').replace(subOutput, /{NAME}/g,  upperName);
                            output += subOutput + '\r\n';
                        }

                        if (++i >= numFields) {
                            source.validation = output;
                            subnext(source, destination);
                        }

                        belowSubNext();
                    });
                }
            });

            //get mongoose schema as code string.
            subsequence.then(function(source, destination, subnext) {
                //stripToSchema will change the object, create deep copy.
                var schema = Object.create(source.fields);
                schema = stripToSchema(schema);
                //schema string.
                source.schema = convertObjectToString(schema);
                subnext(source, destination);
            });

            //get all files
            subsequence.then(function(source, destination, subnext) {
                destination.getFiles(null, true, function(files) {
                    subnext(source, destination, files);
                });
            });
            
            //change out templates
            subsequence.then(function(source, destination, files, subnext) {
                for(var done = 0, i = 0; i < files.length; i++) {
                    files[i].getContent(function(file, error, data) {
                        if(error) {
                            console.log('\x1b[31m%s\x1b[0m', error);
                            return;
                        }

                        if (!eden('string').isString(data)) {
                            data = data.toString();
                        }

                        //Change variables
                        data = eden('string').replace(data, /{SLUG}/g       , source.slug);
                        data = eden('string').replace(data, /{ICON}/g       , source.icon);
                        data = eden('string').replace(data, /{SINGULAR}/g   , source.singular);
                        data = eden('string').replace(data, /{PLURAL}/g     , source.plural);
                        data = eden('string').replace(data, /{VALIDATION}/g , source.validation);
                        data = eden('string').replace(data, /{SCHEMA}/g     , source.schema);
                        
                        var convertedPath = eden('string').replace(file.path, /{SLUG}/g, source.slug);

                        if (convertedPath !== file.path) {
                            file.remove(function() {
                                //we don't care what happens.
                            });
                            
                            file = eden('file', convertedPath);
                        }

                        //send back
                        file.setContent(data, function(error) {
                            if(error) {
                                console.log('\x1b[31m%s\x1b[0m', error);
                                return;
                            }
                            
                            //old school sequence :D
                            if((++done) == files.length) {
                                console.log(
                                    '\x1b[32m%s\x1b[0m',
                                    'Package was successfully created in ' +
                                        destination.path);
                                subnext();
                            }
                        });
                    }.bind(this, files[i]));
                }
            });
            
            //this must be the last subsequence.
            subsequence.then(function() {
                // if this is the last package
                // call next();
            });
        }
    });

    /**
     * Shorter version using JSON.stringify.
     * However, convertObjectToString's output looks better.
     * 
     * @param  {Object} object object.
     * @return {String}        what it should look like in code.
     */
    function convertObjectToJSONString(object) {
        var schemaString = JSON.stringify(object, function(key, value) {
            if (typeof value === 'function') {
                return '{F}' + (value.displayName ? value.displayName : value.name) + '{F}';
            }

            return value; 
        }, 4);

        return eden('string').replace(schemaString, /"*{F}"*/g, '');
    }

    /**
     * Transform an object to its string code representation.
     * @param  {Object}  object  object.
     * @param  {Int}     level   recursion level.
     * @param  {Boolean} isArray if the object is coming from an array.
     * @return {String}          what it should look like in code.
     */
    function convertObjectToString(object, level, isArray) {
        var level       = level || 0;
        isArray         = isArray || false;
        var output      = '';
        var length      = Object.keys(object).length;
        var i           = 0;
        var defaultTabs = Array(3).join('\t');
        var key;

        for (key in object) {
            var isMulti = eden('array').isArray(object[key]) && typeof object[key][0] == 'object';

            if (isMulti) {
                output += '\r\n';
            }

            if (level == 0 || isArray) {
                output += '\r\n' + (isArray ? '\t' : '') + defaultTabs;
            }

            output += key + ': ';

            if (typeof object[key] == 'function') {
                output += object[key].displayName ? object[key].displayName : object[key].name;
            }
            else if (isMulti) {
                output += '[{' + convertObjectToString(object[key][0], level + 1, true) +
                    '\r\n' + defaultTabs + '}]';
            }
            else if (typeof object[key] == 'object') {
                output += '{ ' + convertObjectToString(object[key], level + 1) + ' }';
            }
            else {
                var append  = '';
                var prepend = '';
                if (eden('string').isString(object[key])) {
                    append = prepend = '\''
                }

                output += prepend + object[key] + append;
            }

            if (++i < length) {
                output += ', ';
            }

            if (isMulti) {
                output += '\r\n';
            }
        }

        return output;
    }

    /**
     * Transfrom our schema object to mongoose schema
     * object.
     * 
     * @param  {Object} schema the original schema object.
     * @return {Object}        the mongoose schema object.
     */
    function stripToSchema(schema) {
        var i, j;
        for (i in schema) {
            if (typeof schema[i] == 'object' && 'meta' in schema[i]) {
                for (j in schema[i]) {
                    if (j !== 'meta') {
                        delete schema[i][j];
                    }
                }

                if (eden('array').isArray(schema[i]['meta'])) {
                    schema[i] = [stripToSchema(schema[i]['meta'][0])];
                }
                else {
                    schema[i] = schema[i]['meta'];
                }
            }
            else {
                delete schema[i];
            }
        }

        return schema;
    }

    /**
     * Read the fields.
     * 
     * @param  {Object} fields fields data.
     * @param  {Int}    level  recursion level, to be used by readField.
     * @return {String}        handlebar form output of all fields.
     */
    function readFields(fields, level) {
        level          = level || 0;
        var output     = '';
        var validation = '';

        for (i in fields) {
            output += readField(fields[i], i, level) + '\r\n';
        }

        return output;
    }

    /**
     * Read field and convert to handlebar form.
     * 
     * @param  {Object} data  field data.
     * @param  {String} name  name of the field
     * @param  {Int}    level recursion level.
     * @return {String}       handlebar form output.
     */
    function readField(data, name, level) {
        eden('argument').testValue(data.field, 'array', 'undefined');
        eden('argument').testValue(data.meta, 'array', 'object', 'function');
        eden('argument').testValue(data.placeholder, 'string', 'undefined');
        eden('argument').testValue(data.title, 'string', 'undefined');
        eden('argument').testValue(data.value, 'string', 'undefined');

        level           = level || 0;
        var tabs        = Array(level + 1).join('\t');
        var field       = data.field ? data.field : false;
        var metaEnum    = data.meta.enum ? data.meta.enum : false;
        var placeholder = data.placeholder ? data.placeholder : false;
        var upperName   = eden('string').ucFirst(name);
        var title       = data.title ? data.title : upperName;
        var value       = data.value ? data.value : '';
        var innerOutput = false;

        var outputTemplate = tabs + '{{#block form/fieldset {TITLE}}}\r\n';
        // Add slashes.
        title = eden('string').addSlashes(title);
        value = eden('string').addSlashes(value);

        if (field === false) {
            field = '';

            if (eden('array').isArray(data.meta)) {
                innerOutput = readFields(data.meta[0], level + 1);
            }
        }
        else {
            if (!(field[0] in blockActions)) {
                throw new Error(field + ' does not exist as a block action.');
            }

            var action = blockActions[field[0]];
            var noName = action.noName || false;

            //this does have a name, insert to the second position.
            //this will correspond to the first parameter of setData(name, ...)
            if (!noName) {
                eden('array').splice(field, 1, 0, name);
            }

            //test values, and convert arrays to value1|value2|..
            field = eden('array').map(field, function(key, value)  {
                eden('argument').testValue(value, 'string', 'array');
                if (eden('array').isArray(value)) {
                    value = eden('array').implode(value, '|');
                }
                
                return value;
            });

            if (placeholder !== false || metaEnum !== false) {
                //the index of "attributes" parameter in setData(..).
                //this is also the last parameter. Counting starts at 1.
                //does not include first field argument.
                var attributeIndex = action.attributeIndex;
                var pipeSeparatedOptions = action.pipeOptions;

                for (var i = 0; i < (attributeIndex + 1); i++) {
                    if (field[i] === undefined) {
                        field[i] = "";
                    }

                    if (placeholder && attributeIndex == i) {
                        field[i] += (field[i] ? ' ': '') +
                            'placeholder="' + placeholder + '"';
                    }

                    if (metaEnum && pipeSeparatedOptions == i) {
                        // Just override it.
                        field[i] = eden('array').join(metaEnum, '|');
                    }
                }

                //Note: it would not matter if fields were over the number of
                //parameters the action will take, it should just ignore it.
            }

            field[0] = action.path

            // Add slashes and single quotes
            field = eden('array').map(field, function (key, value) {
                return "'" + eden('string').addSlashes(value) + "'";
            });

            field = eden('array').join(field, ' ');
        }

        //we have an inner output.
        if (innerOutput !== false) {
            outputTemplate += innerOutput;
        }
        else if (value) { //value is not undefined.
            outputTemplate += tabs + '\t{{#block {FIELD}}}{VALUE}{{/block}}\r\n';
            outputTemplate = eden('string').replace(outputTemplate, /{VALUE}/g, value);
        }
        else {
            outputTemplate += tabs + '\t{{{block {FIELD}}}}\r\n';
        }

        outputTemplate = eden('string').replace(outputTemplate, /{TITLE}/g, title);
        outputTemplate = eden('string').replace(outputTemplate, /{FIELD}/g, field);

        return outputTemplate + tabs + '{{/block}}\r\n'
    }

    /**
     * Function's like Date.now will resolve to now using
     * the name property. Let's define the name so it would
     * resolve properly.
     */
    function setFullFunctionNames() {
        Date.now.displayName = 'Date.now';
    };
})();