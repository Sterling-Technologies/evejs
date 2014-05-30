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
			this.hash = eden({test1: 6, test2: 7, test3: 9, test4: [1,2,3,4,5]});
		};
		
		/* Public Methods
		-------------------------------*/
		public.testEach = function() {
			var hash = this.hash, scope = { foo: 'bar' };
			this.hash.each(function(key, value, extra, unit) {
				unit.assertSame('another', extra, unit.TEST5);
				unit.assertSame('bar', this.foo, unit.TEST6);
				unit.assertHasKey(key, hash.get(), unit.TEST7);
				unit.assertSame(hash.get()[key], value, unit.TEST8);
			}, scope, 'another', this);
		};
		
		public.testGet = function() {
			var hash = this.hash.get();
			this.assertSame(5, hash.test4.length, this.TEST9);
			this.assertSame(7, hash.test2, this.TEST10);
		};
		
		public.testGetType = function() {
			this.assertSame('hash', this.hash.getType(), this.TEST11);
		};
		
		public.testHas = function() {
			this.assertTrue(this.hash.has(6), this.TEST12);
			this.assertFalse(this.hash.has(8), this.TEST13);
		};
		
		public.testIsEmpty = function() {
			this.assertFalse(this.hash.isEmpty(), this.TEST14);
		};
		
		public.testKeys = function() {
			var keys = this.hash.keys();
			this.assertSame('test2', keys.get()[1], this.TEST15);
			this.assertCount(4, keys.get(), this.TEST16);
		};
		
		public.testMap = function() {
			this.hash.map(function(key, value) {
				if(typeof value != 'number') {
					return value;
				}
				
				return value + 1;
			});
			
			this.assertSame(8, this.hash.get().test2, this.TEST17);
		};
		
		public.testToQuery = function(prefix) {
			this.assertSame(
			'test1=7&test2=8&test3=10&test4[0]=1&test4[1]=2&test4[2]=3&test4[3]=4&test4[4]=5', 
			this.hash.toQuery(), this.TEST18);
		};
		
		public.testToString = function() {
			this.assertSame(
			'{"test1":7,"test2":8,"test3":10,"test4":[1,2,3,4,5]}', 
			this.hash.toString(), this.TEST19);
		};
		
		public.testValues = function() {
			var values = this.hash.values();
			this.assertSame(8, values.get()[1], this.TEST20);
			this.assertCount(4, values.get(), this.TEST21);
		};

		public.testImplode = function() {
			var result = eden({test1:4,test2:6}).implode('-').get();
			this.assertSame('4-6', result, this.TEST22);
		};

		public.testKsort = function() {
			var result = eden({test3:9,test2:7,test1:6}).ksort().get();
			result = eden(result).implode('-').get();
			var test = eden({test1:6,test2:7, test3:9}).implode('-').get();
			this.assertSame(test, result, this.TEST23);
		};

		public.testNatksort = function() {
			var result = eden({test2:9,test1:7}).natksort().get();
			result = eden(result).implode('-').get();
			var test = eden({test1:7, test2:9}).implode('-').get();
			this.assertSame(test, result, this.TEST24);
		}; 

		public.testSet = function() {
			var result = eden({}).set('test', '1').get();
			result = eden(result).implode('-').get();
			var test = eden({test:1}).implode('-').get();
			this.assertSame(test, result, this.TEST25);
		}

		public.testSize = function() {
			var result = eden({test1:1,test:2}).size();
			this.assertSame('2', result, this.TEST26);
		};

		public.testSort = function() {
			var result = eden({test3:3,test2:2,test1:1}).sort().get();
			result = eden(result).implode('-').get();
			var test = eden({test1:1,test2:2,test3:3}).implode('-').get();
			this.assertSame(test, result, this.TEST27);
		};

		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'hash');
}();