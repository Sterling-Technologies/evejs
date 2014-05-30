!function($) {
	var eden = require('eden');
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
		public.testAddSlashes = function() {
			this.assertSame("I can\\'t wait", eden("I can't wait").addSlashes(), this.TEST1);
		};

		public.testBase64Decode = function() {
			this.assertSame('test', eden('dGVzdA==').base64Decode().get(), this.TEST41);
		};

		public.testBase64Encode = function() {
			this.assertSame('dGVzdA==', eden('test').base64Encode().get(), this.TEST49);
		};
		
		public.testCamelize = function() {
			this.assertSame('thisIsSparta', eden('this-is-sparta').camelize(), this.TEST2);
		};
		
		public.testCharAt = function() {
			this.assertSame('t', eden('You cant find me').charAt(7), this.TEST3);
		};
		
		public.testCharCodeAt = function() {
			this.assertSame(116, eden('You cant find me').charCodeAt(7), this.TEST4);
		};
		
		public.testConcat = function() {
			this.assertSame(
				'You cant find meYes I can', 
				eden('You cant find me').concat('Yes I can').get(), 
				this.TEST5);
		};
		
		public.testDasherize = function() {
			this.assertSame('this-is-sparta', eden('This Is Sparta!').dasherize(), this.TEST6);
		};
		
		public.testEndsWith = function() {
			this.assertTrue(true, 
				eden( 'To be or not to be that is the question').endsWith('question'), 
				this.TEST42);
		};

		public.testEquals = function() {
			this.assertTrue(true, eden('brown fox').equals('brown fox'), this.TEST43);
		};

		public.testHmac = function() {
			this.assertSame('6455fdb217cfe086953a844dabac0491b05d91d2', 
				eden('test').hmac('1234', 'sha1', 'hex').get(), this.TEST51);
		};

		public.testHtmlEntities = function() {
			this.assertSame('4 &lt; 6 &amp; 5', eden('4 < 6 & 5').htmlEntities(), this.TEST7);
		};
		
		public.testHtmlEntityDecode = function() {
			this.assertSame('4 < 6 & 5', eden('4 &lt; 6 &amp; 5').htmlEntityDecode(), this.TEST8);
		};

		public.testIsEmpty = function() {
			this.assertTrue(true, eden("").isEmpty(), this.TEST44);
		};
		
		public.testIndexOf = function() {
			this.assertSame(7, eden('You cant find me').indexOf('t'), this.TEST9);
		};
		
		public.testIsJson = function() {
			this.assertTrue(eden('{"test1":4}').isJson(), this.TEST10);
			this.assertFalse(eden('{test1:4}').isJson(), this.TEST11);
		};
		
		public.testJsonToObject = function() {
			this.assertSame(4, eden('{"test1":4}').jsonToHash().get().test1, this.TEST12);
		};
		
		public.testLastIndexOf = function() {
			this.assertSame(11, eden('You cant find me').lastIndexOf('n'), this.TEST13);
		};
		
		public.testLcFirst = function() {
			this.assertSame(
				'tHIS IS SPARTA', 
				eden('THIS IS SPARTA').lcFirst().get(), 
				this.TEST14);
		};
		
		public.testNl2br = function() {
			this.assertSame(
				'THIS<br />IS<br />SPARTA', 
				eden("THIS\nIS\nSPARTA").nl2br().get(), 
				this.TEST15);
		};
		
		public.testMatch = function() {
			this.assertSame(
				'ain,ain,ain', 
				eden('The rain in SPAIN stays mainly in the plain').match(/ain/g).get(), 
				this.TEST16);
		};
		
		public.testMd5 = function() {
			this.assertSame(
				'098f6bcd4621d373cade4e832627b4f6', 
				eden('test').md5().get(), 
				this.TEST17);
		};
		
		public.testPathToArray = function() {
			this.assertSame(4, 
				eden('/some/path/to/file').pathToArray().get().length, 
				this.TEST18);
		};
		
		public.testPathToQuery = function() {
			this.assertSame(4, 
				eden('/some/path/to/file?test1=4').pathToQuery().get().test1, 
				this.TEST19);
		};
		
		public.testQueryToObject = function() {
			this.assertSame(6, 
				eden('test1=4&test2=6').queryToHash().get().test2, 
				this.TEST20);
		};
		
		public.testReplace = function() {
			this.assertSame('Thas as Sparta', 
				eden('This is $parta')
				.replace('i', 'a')
				.replace('$', 'S').get(), 
				this.TEST21);
		};
		
		public.testSha1 = function() {
			this.assertSame(
				'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 
				eden('test').sha1().get(), 
				this.TEST22);
		};

		public.testSize = function() {
			this.assertSame(5, eden('qwert').size(), this.TEST46);
		};
		
		public.testSearch = function() {
			this.assertSame(7, eden('You cant find me').search('t'), this.TEST23);
		};
		
		public.testSlice = function() {
			this.assertSame(
				'n SPA', 
				eden('The rain in SPAIN stays mainly in the plain').slice(10, 15).get(), 
				this.TEST24);
		};
		
		public.testSplit = function() {
			this.assertCount(4, 
				eden('The rain in SPAIN stays mainly in the plain').split('ain').get(), 
				this.TEST25);
		};

		public.testStartsWith = function() {
			this.assertTrue(true, eden('Hello').startsWith('He'), this.TEST45);
		};
		
		public.testStripSlashes = function() {
			this.assertSame("I can't wait", eden("I can\\'t wait").stripSlashes(), this.TEST26);
		};

		public.testStrToUpper = function() {
			this.assertSame('THIS MUST BE IN UPPERCASE', eden('this must be in uppercase').strToUpper().get(), this.TEST50);
		};
		
		public.testSubstr = function() {
			this.assertSame(
				'n SPA', 
				eden('The rain in SPAIN stays mainly in the plain').substr(10, 5).get(), 
				this.TEST27);
		};
		
		public.testSubstring = function() {
			this.assertSame(
				'ain i', 
				eden('The rain in SPAIN stays mainly in the plain').substring(10, 5).get(), 
				this.TEST28);
		};
		
		public.testStripTags = function() {
			this.assertSame(
				'THISISSPARTA', 
				eden("THIS<br />IS<br />SPARTA").stripTags().get(), 
				this.TEST29);
		};
		
		public.testSummarize = function() {
			this.assertSame(
				'The rain in SPAIN', 
				eden('The rain in SPAIN stays mainly in the plain').summarize(4).get(), 
				this.TEST30);
		};
		
		public.testTitlize = function() {
			this.assertSame('This Is Sparta', eden('this-is-sparta').titlize(), this.TEST31);
		};
		
		public.testToLowerCase = function() {
			this.assertSame('this is sparta', eden('This Is Sparta').toLowerCase().get(), this.TEST32);
		};
		
		public.testToHash = function() {
			this.assertSame(6, 
				eden('test1=4&test2=6').toHash().get().test2, 
				this.TEST33);
			
			this.assertSame(4, eden('{"test1":4}').toHash().get().test1, this.TEST34);
		};
		
		public.testToPath = function() {
			this.assertSame('/some/path/to/file', 
				eden('some/path//to/file/').toPath().get(), 
				this.TEST35);
		};
		
		public.testToUpperCase = function() {
			this.assertSame('THIS IS SPARTA', eden('This Is Sparta').toUpperCase().get(), this.TEST36);
		};
		
		public.testTrim = function() {
			this.assertSame('This Is Sparta', eden('   This Is Sparta  ').trim().get(), this.TEST37);
		};
		
		public.testUcFirst = function() {
			this.assertSame('This is sparta', eden('this is sparta').ucFirst().get(), this.TEST38);
		};
		
		public.testUcWords = function() {
			this.assertSame('This Is Sparta', eden('this is sparta').ucWords().get(), this.TEST39);
		};
		
		public.testUncamelize = function() {
			this.assertSame('this-is-sparta', eden('thisIsSparta').uncamelize(), this.TEST40);
		};

		public.testUrlDecode = function() {
			this.assertSame('my test.asp?name=ståle&car=saab', 
				eden('my%20test.asp?name=st%C3%A5le&car=saab').urlDecode().get(), 
				this.TEST47);
		};

		public.testUtf8Encode = function() {
			this.assertSame('Kevin van Zonneveld', 
				eden('Kevin van Zonneveld').utf8Encode().get(), 
				this.TEST48);
		};
		
		public.testHas = function() {
			this.assertTrue(eden('thisIsSparta').has('isIs'), this.TEST52);
		};
		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'string');
}();