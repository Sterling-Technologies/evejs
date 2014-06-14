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
		public.TEST20 	= 'Keys';
		public.TEST21 	= 'Keys length';
		public.TEST22	= 'Concat';
		public.TEST23	= 'Unshift';
		public.TEST24	= 'Slice';
		public.TEST25	= 'Sort';
		public.TEST26	= 'Implode';
		public.TEST27	= 'Pop';
		public.TEST28	= 'Push';
		public.TEST29	= 'Reverse';
		public.TEST30	= 'Splice';

		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(next) {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function() {
			this.__parent.__construct();
		};
		
		/* Public Methods
		-------------------------------*/
		public.testCombine = function(next) {
			var keys = ['key2', 'key3','key1', 'key5'], values = [1, 2, 3, 4], 
			object = eden('array').combine(keys, values);
			
			this.assertSame(3, object.key1, this.TEST2);
			
			next();
		};
		
		public.testEach = function(next) {
			var list = [3, 4, 5, 6], self = this;
			eden('array').each(list, function(key, value) {
				self.assertHasKey(key, list, self.TEST7);
				self.assertSame(list[key], value, self.TEST8);
			});
			
			next();
		};
		
		public.testHas = function(next) {
			var list = [3, 4, 5, 6];
			this.assertTrue(eden('array').has(list, 3), this.TEST12);
			this.assertFalse(eden('array').has(list, 7), this.TEST13);
			
			next();
		};
		
		public.testIsEmpty = function(next) {
			var list = [3, 4, 5, 6];
			this.assertFalse(eden('array').isEmpty(list), this.TEST14);
			
			next();
		};
		
		public.testKeys = function(next) {
			var list = [3, 4, 5, 6], keys = eden('array').keys(list);
			this.assertSame(4, eden('array').size(keys), this.TEST16);
			
			next();
		};
		
		public.testMap = function(next) {
			var list = [3, 4, 5, 6];
			eden('array').map(list, function(key, value) {
				return value + 1;
			});
			
			this.assertSame(5, list[1], this.TEST17);
			
			next();
		};
		
		public.testToQuery = function(next) {
			var list = [2, 3, 4, 5];
			this.assertSame('0=2&1=3&2=4&3=5', eden('array').toQuery(list), this.TEST18);
			
			next();
		};
		
		public.testToString = function(next) {
			var list = [2,3,4,5];
			this.assertSame('[2,3,4,5]', eden('array').toString(list), this.TEST19);
			
			next();
		};
		
		public.testValues = function(next) {
			var list = [2, 3, 4, 5];
			eden('array').values(list);
			this.assertSame(4, eden('array').size(list), this.TEST21);
			
			next();
		};
		
		public.testConcat = function(next) {
			var list = [1,2,3,4], argument = [5, 6];
			object  = eden('array').concat(list, argument);
			this.assertSame('1,2,3,4,5,6', object, this.TEST22);
			
			next();
		};
		
		public.testUnshift = function(next) {
			var list = [1,2,3,4,5], newList = eden('array').unshift(list, 7, 6);
			this.assertSame(6, newList.shift(), this.TEST23);
			
			next();
		};
		
		public.testSlice = function(next) {
			var list = [1,2,3,4], argument = 2,
			result = eden('array').slice(list, argument);
			this.assertSame('3,4', result, this.TEST24);
			
			next();
		};
		
		public.testSplice = function(next) {
			var list = [1,2,3,4], argument = (2, 3)
			result = eden('array').splice(list, argument);
			console.log("public.testSplice  ",result);
			this.assertSame('4', result, this.TEST30);
			
			next();
		};
		
		public.testSort = function(next) {
			var list = ['c','b','a'], result = eden('array').sort(list);
			this.assertSame('a,b,c', result, this.TEST25);
			
			next();
		};
		
		public.testImplode = function(next) {
			var list = ['z','x','c'], delimeter = ('-')
			result = eden('array').implode(list, delimeter);
			this.assertSame('z-x-c', result, this.TEST26);
			
			next();
		};
		
		public.testPop = function(next) {
			var list = [1, 2, 3, 4], result = eden('array').pop(list);
			this.assertSame(4, result, this.TEST27);
			
			next();
		};
		
		public.testPush = function(next) {
			var list = [1, 2, 3, 4], argument = [5, 6],
			result = eden('array').push(list, argument);
			this.assertSame('1,2,3,4,5,6', result, this.TEST28);
			
			next();
		};
		
		public.testReverse = function(next) {
			var list = ['a','b','c'], result = eden('array').reverse(list);
			this.assertSame('c,b,a', result, this.TEST29);
			
			next();
		};


		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'array');
}();