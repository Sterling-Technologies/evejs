var Mocha 	= require('mocha'),
	eden 	= require('edenjs'),
	mocha 	= new Mocha();

exports.reset = function() {
	mocha 	= new Mocha();
	return this;
};

exports.run = function(local, environment, config, callback) {
	callback = callback || function() {};
	config.test = config.test || [];
	
	var tests, 
		i 		= 0, 
		suite 	= [], 
		count 	= 0, 
		done 	= function() {
			if(++count < config.test.length) {
				return;
			}
			
			//run mocha
			for(var i = 0; i < suite.length; i++) {
				//native path or eden file object?
				mocha.addFile(suite[i]);
			}
			
			mocha.reporter('list').ui('tdd').run(callback);
		};
	
	//what tests to run
	for(; i < config.test.length; i++) {
		//what is the right path in deploy
		//server/node/test  /package/  sample/sample / control
		tests = local + '/package/' + config.test[i] + '/' + environment + '/test';
		
		//get files
		tests = eden('folder', tests);
		
		//is it a real folder ?
		if(!tests.isFolder()) {
			continue;
		}
		
		//get all files
		tests.getFiles(null, true, function(files) {
			for(var j = 0; j < files.length; j++) { 
				suite.push(files[j].path);
			}
			
			done();
		});
	}
};