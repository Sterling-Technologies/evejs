!function($) {
	var eden = require('../lib/index.js');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
		public.TEST1 	= 'Combine with Keys';
		public.TEST2 	= 'Combine with Keys Length';
		public.TEST3 	= 'Combine with Values';
		public.TEST4 	= 'Combine with Values Length';
		public.TEST5 	= 'Each extra argument';
		public.TEST6 	= 'Each scope override';
		public.TEST7 	= 'Each key';
		public.TEST8 	= 'Each value';
		public.TEST9 	= 'Get length';
		public.TEST10 	= 'Get key';
		public.TEST11 	= 'Get type';
		public.TEST12 	= 'Has true';
		public.TEST13 	= 'Has false';
		public.TEST14 	= 'Empty';
		public.TEST15 	= 'Keys';
		public.TEST16 	= 'Keys length';
		public.TEST17 	= 'Map';
		public.TEST18 	= 'To Query';
		public.TEST19 	= 'To String';
		public.TEST20 	= 'Values';
		public.TEST21 	= 'Values length';
		public.TEST22	= 'Implode';
		public.TEST23	= 'Ksort';
		public.TEST24	= 'natksort';
		public.TEST25	= 'Set';
		public.TEST26	= 'Size';
		public.TEST27	= 'Sort';
	
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
			this.__parent.__construct();
		};
		
		/* Public Methods
		-------------------------------*/
		public.testEach = function(next) {
			var self = this, hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			
			eden('hash').each(hash, function(key, value) {
				self.assertHasKey(key, hash, self.TEST7);
				self.assertSame(hash[key], value, self.TEST8);
			});
			
			next();
		};
		
		public.testHas = function(next) {
			var hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			
			this.assertTrue(eden('hash').has(hash, 6), this.TEST12);
			this.assertFalse(eden('hash').has(hash, 8), this.TEST13);
			
			next();
		};
		
		public.testIsEmpty = function(next) {
			var hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			this.assertFalse(eden('hash').isEmpty(hash), this.TEST14);
			
			next();
		};
		
		public.testKeys = function(next) {
			var hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			var keys = eden('hash').keys(hash);
			this.assertSame('test2', keys[1], this.TEST15);
			this.assertCount(4, keys, this.TEST16);
			
			next();
		};
		
		public.testMap = function(next) {
			var hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			eden('hash').map(hash, function(key, value) {
				if(typeof value != 'number') {
					return value;
				}
				
				return value + 1;
			});
			
			this.assertSame(8, hash.test2, this.TEST17);
			
			next();
		};
		
		public.testToQuery = function(next) {
			var hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			this.assertSame(
			'test1=6&test2=7&test3=9&test4[0]=1&test4[1]=2&test4[2]=3&test4[3]=4&test4[4]=5', 
			eden('hash').toQuery(hash), this.TEST18);
			
			next();
		};
		
		public.testToString = function(next) {
			var hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			this.assertSame(
			'{"test1":6,"test2":7,"test3":9,"test4":[1,2,3,4,5]}', 
			eden('hash').toString(hash), this.TEST19);
			
			next();
		};
		
		public.testValues = function(next) {
			var hash = {test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]};
			var values = eden('hash').values(hash);
			this.assertSame(7, values[1], this.TEST20);
			this.assertCount(4, values, this.TEST21);
			
			next();
		};
		
		public.testImplode = function(next) {
			var result = eden('hash').implode({test1:4,test2:6}, '-');
			this.assertSame('4-6', result, this.TEST22);
			
			next();
		};
		
		public.testKsort = function(next) {
			var result = eden('hash').ksort({test3:9,test2:7,test1:6});
			result = eden('hash').implode(result, '-');
			var test = eden('hash').implode({test1:6,test2:7, test3:9}, '-');
			this.assertSame(test, result, this.TEST23);
			
			next();
		};
		
		public.testNatksort = function(next) {
			var result = eden('hash').natksort({test2:9,test1:7});
			result = eden('hash').implode(result, '-');
			var test = eden('hash').implode({test1:7, test2:9}, '-');
			this.assertSame(test, result, this.TEST24);
			
			next();
		};
		
		public.testSize = function(next) {
			var result = eden('hash').size({test1:1,test:2});
			this.assertSame('2', result, this.TEST26);
			
			next();
		};
		
		public.testSort = function(next) {
			var result = eden('hash').sort({test3:3,test2:2,test1:1});
			result = eden('hash').implode(result, '-');
			var test = eden('hash').implode({test1:1,test2:2,test3:3}, '-');
			this.assertSame(test, result, this.TEST27);
			
			next();
		};

		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'hash');
}();