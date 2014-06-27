//require denpendancies
var eden      = require('./build/server/node_modules/edenjs/lib/index');

//get schema if theres any
var schemaFolder = eden('array').slice(process.argv, 2);

//require modules
var paths = require('./config'),
fs        = require('fs');

//check if package already exist
var packageExists = function(schema, folderCount, next) {
    var message = false;
    for(var folder in schema ){
        (function() {
            var path = paths.dev + paths.packages + '/' + folder;
            fs.exists(path, function(exist) {
                if(exist) {
                    //display message once.
                    if(message === false) {
                        message = true;
                        process.stdin.setEncoding('utf8');
                        console.log('Package ' + folder + ' already exist. \nDo you want to overwrite it? [yes/no]');
                        process.stdin.resume();
                        process.stdin.on('data', function (text) {
                            var lowerText = text.toString().toLowerCase().trim();
                            switch(lowerText) {
                                case 'yes':
                                    console.log('Overwriting package...');
                                    next(schema, folderCount);
                                    break;
                                case 'no':
                                    process.exit();
                                    break;
                            }
                        });
                        return;
                    }
                }else{
                    if(message === false){
                        next(schema, folderCount);
                    } 
                }
            });
        })(folder);
    }
};

//start sequence
eden('sequence')

//get folders in schema
.then(function(next) {
    var folderCount = 0;
    var schema = {};
    //get schema base on inputted folder
    if(eden('string').size(schemaFolder.toString()) >= 1) {
        var c = 0;
        for(var i = 0; i < schemaFolder.length; i++) {
            (function() {   
                c++;
                folderCount++;
                var folder = schemaFolder[i],
                path       = paths.dev + paths.schema + '/' + folder;
                fs.exists(path, function(exists) {
                    if(exists) {
                        schema[folder] = path;
                        if(0===--c){
                             //check if package already existing
                            packageExists(schema, folderCount, next);
                        }
                    } else {
                        console.log('Package not found');
                    }
                });
            })(schemaFolder[i]);
        }
    } else {
        console.log('Getting All Folders...');
        eden('folder', paths.dev + paths.schema)
        .getFolders(null, false, function(folders) {
            for(var folder in folders) {
                folderCount++;
                (function() {
                    var path   = folders[folder].path,
                    thisFolder = eden('string')
                        .substring(path, eden('string').lastIndexOf(path, '/') + 1,
                        eden('string').size(path));
                        schema[thisFolder] = path;
                })();
            }

            //check if package already existing
            packageExists(schema, folderCount, next);
        });
    } 
})

//Loop through each folder in schema
.then(function(schema, folderCount, next) {

    //loop through each package and create a template
    var createPackage = function(schemaFolder, vendor) {
        var subSequence = eden('sequence');

        //form handlebars template
        var template     = [],
        startBlock       = "{{#block 'form/fieldset' ",
        endStartBlock    = '}}',
        innerStartBlock  = '{{#block ',
        endBlock         = '}}',
        newLine          = '\n',
        tab              = '\t',
        innerBlock       = '{{{block ',
        innerCloserBlock = '}}}',
        closerBlock      = '{{/block}}',

        innerForm        = false,
        innerKey         = '',
        isArray          = false;
        var setTemplate = function(data, field, schema, value, title, required, type) {
            //set template accoding to type
            if(type === 'checkbox' || type === 'radio') {
                
                //start template block
                template += newLine + tab
                    +  startBlock 
                    +  '\'' + title + required + '\' '
                    +  'errors.' + value + '.message' 
                    +  endStartBlock;

                //if data is set, it has multiple data, so loop through it
                if(data) {
                    data = eden('string').split(data, '|');
                    for (var i = 0; i < eden('array').size(data); i++) {
                        template += newLine + tab + tab
                            +  innerStartBlock
                            +  '\'field/' + type +'\' '
                            +  '\'' + field  +  '\' '
                            +  '../'+ schema + '.' + value
                            +  endStartBlock
                            +  eden('string').ucFirst(data[i])
                            +  closerBlock;
                    }

                //otherwise, just set the template.
                } else {
                    template += newLine + tab + tab
                        +  innerStartBlock
                        +  '\'field/' + type +'\' '
                        +  '\'' + field  +  '\' '
                        +  '../'+ schema + '.' + value
                        +  endStartBlock
                        +  'True'
                        +  closerBlock
                        +  newLine + tab + tab
                        +  innerStartBlock
                        +  '\'field/' + type +'\' '
                        +  '\'' + field  +  '\' '
                        +  '../'+ schema + '.' + value
                        +  endStartBlock
                        +  'False'
                        +  closerBlock;
                }

                //close template block
                template += newLine + tab
                    +  closerBlock
                    +  newLine;

            //template for select
            } else if(type === 'select') {
                //template for select
                template += newLine + tab
                    +  startBlock 
                    +  '\'' + title + required + '\' '
                    +  'errors.' + value + '.message' 
                    +  endStartBlock
                    +  newLine + tab + tab
                    +  innerBlock
                    +  '\'field/' + type +'\' '
                    +  '\'' + field  +  '\' '
                    +  '\'' + data   +  '\' '
                    +  '../'+ schema + '.' + value
                    +  innerCloserBlock
                    +  newLine + tab
                    +  closerBlock
                    +  newLine;

            //default template
            } else {
                template += newLine + tab
                    +  startBlock 
                    +  '\'' + title + required + '\' '
                    +  'errors.' + value + '.message' 
                    +  endStartBlock
                    +  newLine + tab + tab
                    +  innerBlock
                    +  '\'field/' + type +'\' '
                    +  '\'' + field  + '\' '
                    +  '../'+ schema + '.' + value
                    +  innerCloserBlock
                    +  newLine + tab
                    +  closerBlock
                    +  newLine;
            }    
        };

        var _readKeys = function(content, schema) {
            for(var key in content) {
                var data = '',
                field    = '',
                required = '',
                title    = '',
                type     = '',
                value    = '';

                //check if there's field property
                if(content[key].field !== undefined) {
                    type  = content[key].field;
                    if(content[key].hasOwnProperty('enum')) {

                        //get items
                        for(var items in content[key].enum) {
                           data += content[key].enum[items] + '|';
                        }
                        
                        data = eden('string').substr(data, 0, eden('string').size(data)-1);
                    }

                //check if its select
                } else if(content[key].hasOwnProperty('enum')) {
                    
                    //if theres enum property, default is select
                    type  = 'select';
                    
                    //otherwise, check if it has field property
                    //and et its value
                    if(content[key].hasOwnProperty('field')) {
                        type = content[key].field.toString();
                    }

                    //get items
                    for(var items in content[key].enum) {
                       data += content[key].enum[items] + '|';
                    }
                    
                    data = eden('string').substr(data, 0, eden('string').size(data)-1);
                } else if(content[key].hasOwnProperty('data')) {

                    //its a data, recurse
                    _readKeys(content[key].data, schema);

                //check if its an array
                } else if(content[key] instanceof Array) {                    
                    //we need to put a block
                    //to group all collections
                    innerForm = true;
                    innerKey  = key;
                    isArray   = true;
                    template += newLine + '<hr />' 
                             +  newLine + startBlock
                             +  '\'' + 'Start: Template for ' 
                             +  eden('string').ucFirst(key) + '\' '
                             +  endBlock + closerBlock;

                    _readKeys(content[key][0], schema);

                    template += newLine + startBlock
                             +  '\'' + 'End: Template for ' 
                             +  eden('string').ucFirst(key) + '\' '
                             +  endBlock + closerBlock 
                             +  newLine + '<hr/ >' + newLine;
                    innerForm = false;
                    isArray   = false;

                //if no field property is set, get its type property
                } else {

                    //get field according to type property
                    if(content[key].hasOwnProperty('type')) {
                        field = content[key].type.toString();
                        field = eden('string').toLowerCase(field);
                    } else {
                        
                        //if its not a key
                        if(key != 0) {

                            //we need to put a block
                            //to group all collections
                            innerForm = true;
                            innerKey  = key;
                            template += newLine + '<hr />' 
                                     +  newLine + startBlock
                                     +  '\'' + 'Start: Template for ' 
                                     +  eden('string').ucFirst(key) + '\' '
                                     +  endBlock + closerBlock;

                            //its a collection, recurse
                            _readKeys(content[key], key);

                            template += newLine + startBlock
                                     +  '\'' + 'End: Template for ' 
                                     +  eden('string').ucFirst(key) + '\' '
                                     +  endBlock + closerBlock 
                                     +  newLine + '<hr/ >' + newLine;
                            innerForm = false;
                        }
                    }

                    //get type of input
                    //if its string then its text
                    if (eden('string').indexOf(field, 'string') !== -1 ) {
                        type = 'text';

                    //if its boolean then its radio
                    } else if(eden('string').indexOf(field, 'boolean') !== -1) {
                        type = 'radio';

                    //if its date then its date
                    } else if(eden('string').indexOf(field, 'date') !== -1) {
                        type = 'date';
                    }
                }

                //get the field, title, value
                field = key;            
                title = eden('string').ucFirst(field);
                value = field;

                //if its under the collection
                //add the collection name
                if(innerForm) {
                    if(isArray) {
                        field = innerKey + '[0][' +field + ']';
                    } else {
                        field = innerKey + '[' + field + ']';
                    }
                }

                //ignore if field is created or updated
                if(key === 'created' || key === 'updated') {
                    continue;
                }
                //check if it has required property!
                if(content[key].hasOwnProperty('required')) {
                    required = ' <span>*</span>';
                } else if(content[key].hasOwnProperty('data')) {
                    if (content[key].data.hasOwnProperty('required')){
                        required = ' <span>*</span>';
                    }
                }

                //now we got all the data, lets add it to template
                //check field type and assign it to template
                switch(type) {
                    //for radio
                    case 'radio':
                        setTemplate(data, field, schema, value, title, required, type);
                        break;

                    //for checkbox
                    case 'checkbox':
                        setTemplate(data, field, schema, value, title, required, type);
                        break;
                    //for select
                    case 'select':
                        setTemplate(data, field, schema, value, title, required, type);
                        break;

                    //default template
                    default:
                        //check if it has type before assigning it to template
                        if(content[key].hasOwnProperty('type')) {
                            setTemplate(data, field, schema, value, title, required, type);
                        }

                        break;
                }
            }
        };

        //create form template
        var createFormTemplate = function(file, template) {
            fs.writeFile(paths.dev + paths.packages + '/' + vendor + '/' + file + '/control/template/' + 'form.html', template, function(err) {
                if (err) {
                    console.log('failed to create',file, 'template');
                } else {
                    console.log(vendor, file, 'form.html template has been created.');
                }            
            });
        };

        var createTemplate = function(file, folder, destination, sourceFile, schema) {
            subSequence.then(function(subNext) {
                fs.readFile(paths.dev + folder +  sourceFile, 'utf-8', function(err, data){
                    var currentSchema;
                    //if its schema
                    //read and replace data base on schema
                    if(sourceFile === 'store.js') {
                        --folderCount;
                        currentSchema = eden('string').replace(schemaFolder[schema], 'module.exports = ', ''),
                        currentTemplate   = eden('string').replace(data, /{TEMPORARY}/g, currentSchema);
                    //else read and replace data base on file
                    } else {
                        currentTemplate = eden('string').replace(data, /{TEMPORARY}/g, file);
                    }

                    subNext(file, currentTemplate);
                });
            })

            //write file
            subSequence.then(function(file, currentTemplate, subNext) {
                var path;
                //if destination is event folder, filename is file-sourceFile
                if (destination === '/server/event/') {
                    path = paths.dev + paths.packages + '/' + vendor + '/' + file + destination + file +'-' + sourceFile;

                //else, filename is file
                } else {
                    path = paths.dev + paths.packages + '/' + vendor + '/' + file + destination + sourceFile;
                }

                fs.writeFile(path, currentTemplate, function(err) {
                    if (err) {
                        console.log('failed to create event template for', file);
                    } else {
                        console.log(vendor, file + destination + sourceFile, 'has been created');
                        if(folderCount === 0) {
                            //all has been created.
                            //exit
                            process.exit();
                        } else {
                            //loop again
                            subNext();
                        }   
                    }        
                });
            });
        };

        //get files in given directory
        var getFiles = function(file, dir, destination, subNext) {
            eden('folder', dir).getFiles(null, false, function(files){
                for (var page in files) {
                    var path = files[page].path;
                    var thisFile = eden('string')
                        .substring(path, eden('string').lastIndexOf(path, '/') + 1,
                        eden('string').size(path));
                    
                    createTemplate(file, eden('string').substr(dir,1, eden('string').size(dir)) , destination, thisFile);
                }
                subNext(file);
            });
        };

        //loop through schema folder
        for(var schemas in schemaFolder) {
            
            (function(){ 
                var schema = schemas;
                //get schema data and file
                subSequence.then(function(subNext) {
                    //get file name of schema
                    var file = schema.toString();
                    file     = eden('string').substring(file, 0, eden('string').size(file)-3),
                    content  = require(paths.dev + paths.schema + '/' + vendor + '/' + schema);

                    //reset template
                    template = '<form method="post" class="' + file + '-form-horizontal">\n';
                    subNext(file, content);
                })

                //create folder per schema
                //create control folder
                .then(function(file, content, subNext) {
                    console.log('Creating Control folder for', file, 'package');
                    eden('folder', paths.dev + paths.packages + '/' + vendor + '/' + file + '/control')
                    .mkdir(0777, function(err) {
                        subNext(file, content);
                    });
                })

                //create control/action
                .then(function(file, content, subNext) {
                    eden('folder', paths.dev + paths.packages + '/' + vendor + '/' + file + '/control/action')
                    .mkdir(0777, function(err) {
                        subNext(file, content);
                    });
                })

                //create control/template
                .then(function(file, content, subNext) {
                    eden('folder', paths.dev + paths.packages + '/' + vendor + '/' + file + '/control/asset')
                    .mkdir(0777, function(err) {
                        subNext(file, content);
                    });
                })

                //create control/asset
                .then(function(file, content, subNext) {
                    eden('folder',paths.dev + paths.packages + '/' + vendor + '/' + file + '/control/template')
                    .mkdir(0777, function(err) {
                        subNext(file, content);
                    });
                })

                //create server/folder
                .then(function(file, content, subNext) {
                    console.log('Creating Server folder for', file, 'package');
                    eden('folder', paths.dev + paths.packages + '/' + vendor + '/' + file + '/server')
                    .mkdir(0777, function(err) {
                        subNext(file, content);
                    });
                })

                //create server/event
                .then(function(file, content, subNext) {
                    eden('folder', paths.dev + paths.packages + '/' + vendor + '/' + file + '/server/event')
                    .mkdir(0777, function(err) {
                        subNext(file, content);
                    });
                })

                //create server/action
                .then(function(file, content, subNext) {
                    eden('folder', paths.dev + paths.packages + '/' + vendor + '/' + file + '/server/action')
                    .mkdir(0777, function(err) {
                        subNext(file, content);
                    });
                })

                //now all folders has been created
                //read properties of schema and create a form template
                .then(function(file, content, subNext) {
                    //read properties
                    _readKeys(content, file);
                    //create form
                    template += '</form>';
                    createFormTemplate(file, template);
                    subNext(file);
                })

                //get files in control/action and create a control action
                .then(function(file, subNext) {
                    console.log('Creating Control Action for', file);
                    var dir = './build/schema/template/control/action/';
                    getFiles(file, dir, '/control/action/', subNext);
                })

                //get files in control/asset and create a control action
                .then(function(file, subNext) {
                    console.log('Creating Control Action for', file);
                    var dir = './build/schema/template/control/asset/';
                    getFiles(file, dir, '/control/asset/', subNext);
                })

                //get files in server/event and create server event
                .then(function(file, subNext) {
                    console.log('Creating Server Event for', file);
                    var dir = './build/schema/template/server/event/';
                    getFiles(file, dir, '/server/event/', subNext);
                })

                //get files in control/template and create a control template
                .then(function(file, subNext) {
                    console.log('Creating Control Action for', file);
                    var dir = './build/schema/template/control/template/';
                    getFiles(file, dir, '/control/template/', subNext);
                })

                //get files in server/action and create a server action
                .then(function(file, subNext) {
                    console.log('Creating Server Action for', file);
                    var dir = './build/schema/template/server/action/';
                    getFiles(file, dir, '/server/action/', subNext);
                })

                // for server/, index, store and factory
                // we need to pass the schema, as store will be using it
                .then(function(file, subNext) {
                    var dir = './build/schema/template/server/';
                    var server = {};
                    eden('folder', dir).getFiles(null, false, function(files){
                        server = files;
                        for (var page in server) {
                            var path = server[page].path;
                            var thisFile = eden('string')
                                .substring(path, eden('string').lastIndexOf(path, '/') + 1,
                                eden('string').size(path));

                            createTemplate(file, eden('string').substr(dir,1, eden('string').size(dir)) , '/server/', thisFile, schema);
                        }
                    });
                    subNext();
                });
            })(schemas);
        }  
    };

    console.log('Getting All Schema in folder...');
    for (var folder in schema) {
        var schemaFolder = {};
        (function(){
            var dir      = schema[folder],
            schemaFolder = {},
            vendor = eden('string')
                .substring(dir, eden('string').lastIndexOf(dir, '/') + 1,
                eden('string').size(dir));

            fs.readdir(dir + '/', function(err,files) {
                if (err) throw err;
                var c=0;
                files.forEach(function(file){
                    c++;
                    fs.readFile(dir + '/' + file,'utf-8',function(err, schema) {
                        if (err) {
                            console.log('invalid file', file);
                            return;
                        }

                        schemaFolder[file]=schema;
                        if (0===--c) {

                            //call create package
                            createPackage(schemaFolder, vendor);
                        }
                    });
                });
            });
        })(schema[folder], schemaFolder);
    }
});