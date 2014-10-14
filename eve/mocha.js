var Mocha 	= require('mocha'),
	mocha 	= new Mocha(),
	noop	= function() {};

exports.reset = function() {
	mocha 	= new Mocha();
	return this;
};

exports.run = function(eve, tests, callback) {
	callback = callback || noop;
	var suite = [];
	
	eve().sync(function(next) {
		next.thread('loop-tests', 0);
	})
	.thread('loop-tests', function(i, next) {
		if(i < tests.length) {
			//is it a test file?
			if(tests[i].substr(tests[i].length - 3) === '.js') {
				suite.push(tests[i]);
				next.thread('loop-tests', i + 1);
				return;
			}
			
			//it's a folder
			var callback = next.thread.bind(null, 'loop-files', i);
			this.Folder(tests[i]).getFiles(null, true, callback);
			return;
		}
		
		next();
	})
	.thread('loop-files', function(i, error, files, next) {	
		for(var j = 0; j < files.length; j++) {
			if(tests[i].substr(files[j].length - 3) === '.js') {
				suite.push(files[j].path);
			}
		}
		
		next.thread('loop-tests', i + 1);
	})
	.then(function(next) {
		//run mocha
		for(var i = 0; i < suite.length; i++) {
			//native path or eden file object?
			mocha.addFile(suite[i]);
		}
		
		mocha.reporter('list').ui('tdd').run(callback);
	});
};