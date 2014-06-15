module.exports = function($) {
	var definition = this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.last 	= {};
		public.end 		= 0;
		public.report	= {};
		public.package	= 'main';
			
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function() {
			this.last 		= {};
			this.report		= {};
			this.start 		= (new Date).getTime();
			this.sequence 	= $.load('sequence');
		};
		
		/* Public Methods
		-------------------------------*/
		public.assertHasKey = function(needle, haystack, message) {
			return _runTest.call(this, '_hasKey', [needle, haystack], message);
		};
		
		public.assertContains = function(needle, haystack, message) {
			return _runTest.call(this, '_contains', [needle, haystack], message);
		};
		
		public.assertContainsOnly = function(type, haystack, message) {
			return _runTest.call(this, '_containsOnly', [type, haystack], message);
		};
		
		public.assertCount = function(number, haystack, message) {
			return _runTest.call(this, '_count', [number, haystack], message);
		};
		
		public.assertEmpty = function(actual, message) {
			return _runTest.call(this, '_empty', [actual], message);
		};
		
		public.assertEquals = function(expected, actual, message) {
			return _runTest.call(this, '_equals', [expected, actual], message);
		};
		
		public.assertFalse = function(condition, message) {
			return _runTest.call(this, '_false', [condition], message);
		};
		
		public.assertGreaterThan = function(number, actual, message) {
			return _runTest.call(this, '_greaterThan', [number, actual], message);
		};
		
		public.assertGreaterThanOrEqual = function(number, actual, message) {
			return _runTest.call(this, '_greaterThanOrEqual', [number, actual], message);
		};
		
		public.assertInstanceOf = function(expected, actual, message) {
			return _runTest.call(this, '_instanceOf', [expected, actual], message);
		};
		
		public.assertInternalType = function(type, actual, message) {
			return _runTest.call(this, '_internalType', [type, actual], message);
		};
		
		public.assertLessThan = function(number, actual, message) {
			return _runTest.call(this, '_lessThan', [number, actual], message);
		};
		
		public.assertLessThanOrEqual = function(number, actual, message) {
			return _runTest.call(this, '_lessThanOrEqual', [number, actual], message);
		};
		
		public.assertNull = function(mixed, message) {
			return _runTest.call(this, '_null', [mixed], message);
		};
		
		public.assertRegExp = function(pattern, string, message) {
			return _runTest.call(this, '_regExp', [pattern, string], message);
		};
		
		public.assertSame = function(expected, actual, message) {
			return _runTest.call(this, '_same', [expected, actual], message);
		};
		
		public.assertStringEndsWith = function(suffix, string, message) {
			return _runTest.call(this, '_stringEndsWith', [suffix, string], message);
		};
		
		public.assertStringStartsWith = function(prefix, string, message) {
			return _runTest.call(this, '_stringStartsWith', [prefix, string], message);
		};
		
		public.assertTrue = function(condition, message) {
			return _runTest.call(this, '_true', [condition], message);
		};
		
		public.getPassFail = function(package) {
			var passFail = [0, 0];
			
			if(typeof this.report[package] == 'object') {
				for(var key in this.report[package]) {
					if(this.report[package][key]['pass']) {
						passFail[0]++;
						continue;
					}
					
					passFail[1]++;
				}
				
				return passFail;
			}
			
			var packagePassFail;
			for(package in this.report) {
				packagePassFail = this.getPassFail(package);
				passFail[0] += packagePassFail[0];
				passFail[1] += packagePassFail[1];
			}
			
			return passFail;
		};
		
		public.getReport = function() {
			return this.report;
		};
		
		public.getTotalTests = function(package) {
			var total = 0;
			if(typeof this.report[package] == 'object') {
				for(var key in this.report[package]) {
					total++;
				}
				
				return total;
			}
			
			for(package in this.report) {
				total += this.getTotalTests(package);
			}
			
			return total;
		};
		
		public.run = function() {
			var self = this;
			for(var method in this) {
				//if it's not a testing method
				if(method.indexOf('test') !== 0 
				|| typeof this[method] != 'function') {
					continue;
				}
				
				this.sequence.then((function(name) {
					return function(next) {
						//run the testing method
						self[name].call(self, next);
					};
				})(method));
			}
			
			return this;
		};
	
		public.setPackage = function(name) {
			this.package = name;
			return this;
		};
		
		/* Private Methods
		-------------------------------*/
		var _hasKey = function(needle, haystack) {
			return !!haystack[needle];
		};
		
		var _contains = function(needle, haystack) {
			if(typeof haystack == 'string') {
				return haystack.indexOf(needle) != -1;
			}
			
			//its an array or object
			for(var i in haystack) {
				if(haystack[i] == needle) {
					return true;
				}
			}
			
			return false;
		};
		
		var _containsOnly = function(type, haystack) {
			for(var i in haystack) {
				if(typeof haystack[i] != type) {
					return false;
				}
			}
			
			return true;
		};
		
		var _count = function(number, haystack) {
			return haystack.length == number;
		};
		
		var _equals = function(expected, actual) {
			return expected === actual;
		};
		
		var _false = function(condition) {
			return condition === false;
		};
		
		var _greaterThan = function(number, actual) {
			return  actual > number;
		};
		
		var _greaterThanOrEqual = function(number, actual) {
			return  actual >= number;
		};
		
		var _instanceOf = function(expected, actual) {
			return actual instanceof expected;
		};
		
		var _internalType = function(type, actual) {
			return typeof actual == type;
		};
		
		var _lessThan = function(number, actual) {
			return actual < number;
		};
		
		var _lessThanOrEqual = function(number, actual) {
			return actual <= number;
		};
		
		var _null = function(mixed) {
			return mixed === null;
		};
		
		var _regExp = function(regex, string) {
			if(typeof regex == 'string') {
				regex = new RegExp(regex);
			}
			
			return regex.test(string);
		};
		
		var _same = function(expected, actual) {
			return expected == actual;
		};
		
		var _stringEndsWith = function(suffix, string) {
			return (new RegExp(suffix+'$')).test(string);
		};
		
		var _stringStartsWith = function(prefix, string) {
			return string.indexOf(prefix) === 0;
		};
		
		var _true = function(condition) {
			return condition === true;
		};
		
		var _runTest = function(method, args, message) {
			var test = {
				name	: method,
				start 	: this.start, 
				message : message };
			
			if(this.last && this.last.end) {
				test.start = this.last.end;
			}
			
			try {
				test.pass = eval(method+'.apply(this, args)');
				
				if(!test.pass) {
					test.error = test.name;
					
					if(args.length) {
						test.error += ' -> ' + args.join(', ');
					}
				}
			} catch(e) {
				test.pass = false;
				test.error = e.message;
			}
			
			test.end = (new Date).getTime();
			this.last = test;
			
			if(!this.report[this.package]) {
				this.report[this.package] = [];
			}
			
			this.report[this.package].push(this.last);
			
			return this;
		};
	});
	
	definition.cli = function(package) {
		var error, pass, span, title, i, j;
		
		var suite 	= this.load().setPackage(package).run();
		
		suite.sequence.then(function(next) {
			var results = suite.getPassFail();
			var tests 	= suite.getTotalTests();
			var report 	= suite.getReport();
			
			console.log('');
			console.log('Package:', suite.package);
			
			console.log(
				'Out of', tests, 'tests,', results[0], 
				'passed and', results[1], 'failed.');
			
			if(!report[suite.package]) {
				return;
			}
			
			for(i = 0; i < report[suite.package].length; i++) {
				message = report[suite.package][i].message;
				pass 	= report[suite.package][i].pass ? 'passed' : 'fail  ';
				span 	= report[suite.package][i].end - report[suite.package][i].start+'';
				
				for(var j = message.length; j < 50; j++) {
					message += ' ';
				}
				
				for(var j = span.length; j < 10; j++) {
					span = ' '+span;
				}
				
				error = '';
				if(report[suite.package][i].error) {
					error = ' - '+report[suite.package][i].error;
				}
				
				console.log(message, 'Status:', pass, ' - Time(ms):', span, error);
			}
		});
	};
	
	return definition;
};