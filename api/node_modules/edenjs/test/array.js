!function($) {
	var eden = require('eden');
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
			this.list = eden([1,2,3,4]);
		};
		
		/* Public Methods
		-------------------------------*/
		public.testCombineWithKeys = function() {
			var object = this.list.combineWithKeys([10, 11, 12, 13, 14]);
			this.assertSame(2, object.get()[11], this.TEST1);
			this.assertSame(4, object.size(), this.TEST2);
		};
	
		public.testCombineWithValues = function() {
			var object = this.list.combineWithValues([10, 11, 12, 13, 14]);
			this.assertSame(11, object.get()[2], this.TEST3);
			this.assertSame(4, object.size(), this.TEST4);
		};
		
		public.testEach = function() {
			var list = this.list, scope = { foo: 'bar' };
			this.list.each(function(key, value, extra, unit) {
				unit.assertSame('another', extra, unit.TEST5);
				unit.assertSame('bar', this.foo, unit.TEST6);
				unit.assertHasKey(key, list.get(), unit.TEST7);
				unit.assertSame(list.get()[key], value, unit.TEST8);
			}, scope, 'another', this);
		};
		
		public.testGet = function() {
			var list = this.list.get();
			this.assertCount(4, list, this.TEST9);
			this.assertSame(3, list[2], this.TEST10);
		};
		
		public.testGetType = function() {
			this.assertSame('array', this.list.getType(), this.TEST11);
		};
		
		public.testHas = function() {
			this.assertTrue(this.list.has(3), this.TEST12);
			this.assertFalse(this.list.has(5), this.TEST13);
		};
		
		public.testIsEmpty = function() {
			this.assertFalse(this.list.isEmpty(), this.TEST14);
		};
		
		public.testKeys = function() {
			var keys = this.list.keys();
			this.assertSame(1, keys.get()[1], this.TEST15);
			this.assertSame(4, keys.size(), this.TEST16);
		};
		
		public.testMap = function() {
			this.list.map(function(key, value) {
				return value + 1;
			});
			
			this.assertSame(3, this.list.get()[1], this.TEST17);
		};
		
		public.testToQuery = function(prefix) {
			this.assertSame('0=2&1=3&2=4&3=5', this.list.toQuery(), this.TEST18);
		};
		
		public.testToString = function() {
			this.assertSame('[2,3,4,5]', this.list.toString(), this.TEST19);
		};
		
		public.testValues = function() {
			var values = this.list.values();
			this.assertSame(3, values.get()[1], this.TEST20);
			this.assertSame(4, values.size(), this.TEST21);
		};
		
		
		public.testConcat = function() {
			this.list.concat([1,2,3,4]);
			this.assertCount(8,this.list.get(), this.TEST22);
		};

		public.testUnshift = function() {
			this.list.unshift([1,2,3,4,5]);
			this.assertCount(9,this.list.get(), this.TEST23);
		};

		public.testSlice = function() {
			var result = eden([1,2,3,4]).slice(2).get();
			this.assertSame('3,4', result, this.TEST24);
		};

		public.testSort = function() {
			var result = eden(['a','c','b']).sort().get();
			this.assertSame('a,b,c', result, this.TEST25);
		};

		public.testImplode = function() {
			var result = eden(['z','x','c']).implode('-').get();
			this.assertSame('z-x-c', result, this.TEST26);
		};

		public.testPop = function() {
			var result = eden([1,2,3,4]).pop();
			this.assertSame(4, result, this.TEST27);
		};

		public.testPush = function() {
			var result = eden([1,2,3,4]).push('5,6').get();
			this.assertSame('1,2,3,4,5,6', result, this.TEST28);
		};


		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'array');
}();