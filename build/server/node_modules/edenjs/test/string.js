!function($) {
	var eden = require('../lib/index.js');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
		public.TEST1 	= 'Add Slashes';
		public.TEST2 	= 'Camelize';
		public.TEST3 	= 'Char At';
		public.TEST4 	= 'Char Code At';
		public.TEST5 	= 'Concat';
		public.TEST6 	= 'Dasherize';
		public.TEST7 	= 'HTML Entities';
		public.TEST8 	= 'HTML Entity Decode';
		public.TEST9 	= 'Index Of';
		public.TEST10 	= 'Is JSON True';
		public.TEST11 	= 'Is JSON False';
		public.TEST12 	= 'JSON to object';
		public.TEST13 	= 'Last Index Of';
		public.TEST14 	= 'LC First';
		public.TEST15 	= 'NL2BR';
		public.TEST16 	= 'Match';
		public.TEST17 	= 'MD5';
		public.TEST18 	= 'Path to Array';
		public.TEST19 	= 'Path to Query';
		public.TEST20 	= 'Query to Object';
		public.TEST21 	= 'Replace';
		public.TEST22 	= 'SHA1';
		public.TEST23 	= 'Search';
		public.TEST24 	= 'Slice';
		public.TEST25 	= 'Split';
		public.TEST26 	= 'Strip Slashes';
		public.TEST27 	= 'Substr';
		public.TEST28 	= 'Sub String';
		public.TEST29 	= 'Strip Tags';
		public.TEST30 	= 'Summarize';
		public.TEST31 	= 'Titlize';
		public.TEST32 	= 'To Lower Case';
		public.TEST33 	= 'To Object From Query';
		public.TEST34 	= 'To Object From JSON';
		public.TEST35 	= 'To Path';
		public.TEST36 	= 'To Upper Case';
		public.TEST37 	= 'Trim';
		public.TEST38 	= 'UC First';
		public.TEST39 	= 'UC Words';
		public.TEST40 	= 'Uncamelize';
		public.TEST41   = 'Base 64 Decode';
		public.TEST42   = 'Ends With';
		public.TEST43	= 'Equals';
		public.TEST44	= 'Is Empty';
		public.TEST45	= 'Starts With';
		public.TEST46	= 'Size';
		public.TEST47	= 'Url Decode';
		public.TEST48	= 'Utf Encode';
		public.TEST49	= 'Base64 Encode';
		public.TEST50	= 'Str To Upper';
		public.TEST51	= 'Hmac';
		public.TEST52	= 'Has';

		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		public.testAddSlashes = function(next) {
			this.assertSame("I can\\'t wait", eden('string').addSlashes("I can't wait"), this.TEST1);
			
			next();
		};
		
		public.testBase64Decode = function(next) {
			this.assertSame('test', eden('string').base64Decode('dGVzdA=='), this.TEST41);
			
			next();
		};
		
		public.testBase64Encode = function(next) {
			this.assertSame('dGVzdA==', eden('string').base64Encode('test'), this.TEST49);
			
			next();
		};
		
		public.testCamelize = function(next) {
			this.assertSame('thisIsSparta', eden('string').camelize('this-is-sparta'), this.TEST2);
			
			next();
		};
		
		public.testCharAt = function(next) {
			this.assertSame('t', eden('string').charAt('You cant find me', 7), this.TEST3);
			
			next();
		};
		
		public.testCharCodeAt = function(next) {
			this.assertSame(116, eden('string').charCodeAt('You cant find me', 7), this.TEST4);
			
			next();
		};
		
		public.testConcat = function(next) {
			this.assertSame(
				'You cant find meYes I can', 
				eden('string').concat('You cant find me', 'Yes I can'), 
				this.TEST5);
			
			next();
		};
		
		public.testDasherize = function(next) {
			this.assertSame('this-is-sparta', eden('string').dasherize('This Is Sparta!'), this.TEST6);
			
			next();
		};
		
		public.testEndsWith = function(next) {
			this.assertTrue(true, 
				eden('string').endsWith('To be or not to be that is the question', 'question'), 
				this.TEST42);
			
			next();
		};
		
		public.testEquals = function(next) {
			this.assertTrue(true, eden('string').equals('brown fox', 'brown fox'), this.TEST43);
			
			next();
		};
		
		public.testHmac = function(next) {
			this.assertSame('6455fdb217cfe086953a844dabac0491b05d91d2', 
				eden('string').hmac('test', '1234', 'sha1', 'hex'), this.TEST51);
			
			next();
		};
		
		public.testHtmlEntities = function(next) {
			this.assertSame('4 &lt; 6 &amp; 5', eden('string').htmlEntities('4 < 6 & 5'), this.TEST7);
			
			next();
		};
		
		public.testHtmlEntityDecode = function(next) {
			this.assertSame('4 < 6 & 5', eden('string').htmlEntityDecode('4 &lt; 6 &amp; 5'), this.TEST8);
			
			next();
		};
		
		public.testIsEmpty = function(next) {
			this.assertTrue(true, eden('string').isEmpty(""), this.TEST44);
			
			next();
		};
		
		public.testIndexOf = function(next) {
			this.assertSame(7, eden('string').indexOf('You cant find me', 't'), this.TEST9);
			
			next();
		};
		
		public.testIsJson = function(next) {
			this.assertTrue(eden('string').isJson('{"test1":4}'), this.TEST10);
			this.assertFalse(eden('string').isJson('{test1:4}'), this.TEST11);
			
			next();
		};
		
		public.testJsonToObject = function(next) {
			this.assertSame(4, eden('string').jsonToHash('{"test1":4}').test1, this.TEST12);
			
			next();
		};
		
		public.testLastIndexOf = function(next) {
			this.assertSame(11, eden('string').lastIndexOf('You cant find me', 'n'), this.TEST13);
			
			next();
		};
		
		public.testLcFirst = function(next) {
			this.assertSame(
				'tHIS IS SPARTA', 
				eden('string').lcFirst('THIS IS SPARTA'), 
				this.TEST14);
			
			next();
		};
		
		public.testNl2br = function(next) {
			this.assertSame(
				'THIS<br />IS<br />SPARTA', 
				eden('string').nl2br("THIS\nIS\nSPARTA"), 
				this.TEST15);
			
			next();
		};
		
		public.testMatch = function(next) {
			this.assertSame(
				'ain,ain,ain', 
				eden('string').match('The rain in SPAIN stays mainly in the plain', /ain/g), 
				this.TEST16);
			
			next();
		};
		
		public.testMd5 = function(next) {
			this.assertSame(
				'098f6bcd4621d373cade4e832627b4f6', 
				eden('string').md5('test'), 
				this.TEST17);
			
			next();
		};
		
		public.testPathToArray = function(next) {
			this.assertSame(4, 
				eden('string').pathToArray('/some/path/to/file').length, 
				this.TEST18);
			
			next();
		};
		
		public.testPathToQuery = function(next) {
			this.assertSame(4, 
				eden('string').pathToQuery('/some/path/to/file?test1=4').test1, 
				this.TEST19);
			
			next();
		};
		
		public.testQueryToObject = function(next) {
			this.assertSame(6, 
				eden('string').queryToHash('test1=4&test2=6').test2, 
				this.TEST20);
			
			next();
		};
		
		public.testReplace = function(next) {
			this.assertSame('Thas as Sparta', 
				eden('string').replace('This is Sparta', 'i', 'a'), 
				this.TEST21);
			
			next();
		};
		
		public.testSha1 = function(next) {
			this.assertSame(
				'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 
				eden('string').sha1('test'), 
				this.TEST22);
			
			next();
		};
		
		public.testSize = function(next) {
			this.assertSame(5, eden('string').size('qwert'), this.TEST46);
			
			next();
		};
		
		public.testSearch = function(next) {
			this.assertSame(7, eden('string').search('You cant find me', 't'), this.TEST23);
			
			next();
		};
		
		public.testSlice = function(next) {
			this.assertSame(
				'n SPA', 
				eden('string').slice('The rain in SPAIN stays mainly in the plain', 10, 15), 
				this.TEST24);
			
			next();
		};
		
		public.testSplit = function(next) {
			this.assertCount(4, 
				eden('string').split('The rain in SPAIN stays mainly in the plain', 'ain'), 
				this.TEST25);
			
			next();
		};
		
		public.testStartsWith = function(next) {
			this.assertTrue(true, eden('string').startsWith('Hello', 'He'), this.TEST45);
			
			next();
		};
		
		public.testStripSlashes = function(next) {
			this.assertSame("I can't wait", eden('string').stripSlashes("I can\\'t wait"), this.TEST26);
			
			next();
		};
		
		public.testStrToUpper = function(next) {
			this.assertSame('THIS MUST BE IN UPPERCASE', eden('string').strToUpper('this must be in uppercase'), this.TEST50);
			
			next();
		};
		
		public.testSubstr = function(next) {
			this.assertSame(
				'n SPA', 
				eden('string').substr('The rain in SPAIN stays mainly in the plain', 10, 5), 
				this.TEST27);
			
			next();
		};
		
		public.testSubstring = function(next) {
			this.assertSame(
				'ain i', 
				eden('string').substring('The rain in SPAIN stays mainly in the plain', 10, 5), 
				this.TEST28);
			
			next();
		};
		
		public.testStripTags = function(next) {
			this.assertSame(
				'THISISSPARTA', 
				eden('string').stripTags("THIS<br />IS<br />SPARTA"), 
				this.TEST29);
			
			next();
		};
		
		public.testSummarize = function(next) {
			this.assertSame(
				'The rain in SPAIN', 
				eden('string').summarize('The rain in SPAIN stays mainly in the plain', 4), 
				this.TEST30);
			
			next();
		};
		
		public.testTitlize = function(next) {
			this.assertSame('This Is Sparta', eden('string').titlize('this-is-sparta'), this.TEST31);
			
			next();
		};
		
		public.testToLowerCase = function(next) {
			this.assertSame('this is sparta', eden('string').toLowerCase('This Is Sparta'), this.TEST32);
			
			next();
		};
		
		public.testToHash = function(next) {
			this.assertSame(6, 
				eden('string').toHash('test1=4&test2=6').test2, 
				this.TEST33);
			
			this.assertSame(4, eden('string').toHash('{"test1":4}').test1, this.TEST34);
			
			next();
		};
		
		public.testToPath = function(next) {
			this.assertSame('/some/path/to/file', 
				eden('string').toPath('some/path//to/file/'), 
				this.TEST35);
			
			next();
		};
		
		public.testToUpperCase = function(next) {
			this.assertSame('THIS IS SPARTA', eden('string').toUpperCase('This Is Sparta'), this.TEST36);
			
			next();
		};
		
		public.testTrim = function(next) {
			this.assertSame('This Is Sparta', eden('string').trim('   This Is Sparta  '), this.TEST37);
			
			next();
		};
		
		public.testUcFirst = function(next) {
			this.assertSame('This is sparta', eden('string').ucFirst('this is sparta'), this.TEST38);
			
			next();
		};
		
		public.testUcWords = function(next) {
			this.assertSame('This Is Sparta', eden('string').ucWords('this is sparta'), this.TEST39);
			
			next();
		};
		
		public.testUncamelize = function(next) {
			this.assertSame('this-is-sparta', eden('string').uncamelize('thisIsSparta'), this.TEST40);
			
			next();
		};
		
		public.testUrlDecode = function(next) {
			this.assertSame('my test.asp?name=ståle&car=saab', 
				eden('string').urlDecode('my%20test.asp?name=st%C3%A5le&car=saab'), 
				this.TEST47);
			
			next();
		};
		
		public.testUtf8Encode = function(next) {
			this.assertSame('Kevin van Zonneveld', 
				eden('string').utf8Encode('Kevin van Zonneveld'), 
				this.TEST48);
			
			next();
		};
		
		public.testHas = function(next) {
			this.assertTrue(eden('string').has('thisIsSparta', 'isIs'), this.TEST52);
			
			next();
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'string');
}();