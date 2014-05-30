!function($) {
	var eden = require('eden');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
		public.TEST1 	= 'Absolute';
		public.TEST2 	= 'ACOS';
		public.TEST3 	= 'ASIN';
		public.TEST4 	= 'ATAN';
		public.TEST5 	= 'Between True';
		public.TEST6 	= 'Between False';
		public.TEST7 	= 'Ceil';
		public.TEST8 	= 'COS';
		public.TEST9 	= 'Cubed';
		public.TEST10 	= 'Divide';
		public.TEST11 	= 'Equals True';
		public.TEST12 	= 'Equals False';
		public.TEST13 	= 'Exp';
		public.TEST14 	= 'Floor';
		public.TEST15 	= 'Greater Than True';
		public.TEST16 	= 'Greater Than False';
		public.TEST17 	= 'Greater Than Equals True';
		public.TEST18 	= 'Greater Than Equals False';
		public.TEST19 	= 'Is Infinite True';
		public.TEST20 	= 'Is Infinite False';
		public.TEST21 	= 'Is Float True';
		public.TEST22 	= 'Is Float False';
		public.TEST23 	= 'Is Integer True';
		public.TEST24 	= 'Is Integer False';
		public.TEST25 	= 'Is NaN True';
		public.TEST26 	= 'Is NaN False';
		public.TEST27 	= 'Less Than True';
		public.TEST28 	= 'Less Than False';
		public.TEST29 	= 'Less Than Equals True';
		public.TEST30 	= 'Less Than Equals False';
		public.TEST31 	= 'Log';
		public.TEST32 	= 'Minus';
		public.TEST33 	= 'Mod';
		public.TEST34 	= 'Plus';
		public.TEST35 	= 'Power';
		public.TEST36 	= 'Round';
		public.TEST37 	= 'Sin';
		public.TEST38 	= 'Squared';
		public.TEST39 	= 'Square Root';
		public.TEST40 	= 'Tan';
		public.TEST41 	= 'Times';
		public.TEST42	= 'To String';
		
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
		public.testAbs = function() {
			this.assertEquals(8, eden(-8).abs().get(), this.TEST1);	
		};
		
		public.testAcos = function() {
			this.assertEquals(1.2661036727794992, eden(0.3).acos().get(), this.TEST2);	
		};
		
		public.testAsin = function() {
			this.assertEquals(0.3046926540153975, eden(0.3).asin().get(), this.TEST3);	
		};
		
		public.testAtan = function() {
			this.assertEquals(1.5707962121596615, eden(8723321.4).atan().get(), this.TEST4);	
		};
		
	 	public.testBetween = function () {
			this.assertTrue(eden(8).between(2, 12), this.TEST5);
			this.assertFalse(eden(8).between(9, 20), this.TEST6);	
		};
		
		public.testCeil = function() {
			this.assertEquals(5, eden(4.123).ceil().get(), this.TEST7);	
		};
		
		public.testCos = function() {
			this.assertEquals(-0.9899924966004454, eden(3).cos().get(), this.TEST8);	
		};
		
		public.testCubed = function() {
			this.assertEquals(27, eden(3).cubed().get(), this.TEST9);	
		};
		
		public.testDivided = function() {
			this.assertEquals(2, eden(6).divided(3).get(), this.TEST10);	
		};
		
		public.testEquals = function() {
			this.assertTrue(eden(8).equals('8'), this.TEST11);
			this.assertFalse(eden(8).equals('8', true), this.TEST12);	
		};
		
		public.testExp = function() {
			this.assertEquals(2.718281828459045, eden(1).exp().get(), this.TEST13);	
		};
		
		public.testFloor = function() {
			this.assertEquals(8, eden(8.89432).floor().get(), this.TEST14);	
		};
		
		public.testGreaterThan = function() {
			this.assertTrue(eden(8).gt(8, true), this.TEST15);
			this.assertFalse(eden(8).gt(8), this.TEST16);	
		};
		
		public.testGreaterThanEquals = function() {
			this.assertTrue(eden(8).gte(8), this.TEST17);
			this.assertFalse(eden(8).gte(9), this.TEST18);	
		};
		
		public.testIsInfinite = function () {
			this.assertTrue(eden(Infinity).isInfinite(), this.TEST19);
			this.assertFalse(eden(8).isInfinite(), this.TEST20);	
		};
		
		public.testIsFloat = function() {
			this.assertTrue(eden(8.45).isFloat(), this.TEST21);
			this.assertFalse(eden(8).isFloat(), this.TEST22);	
		};
		
		public.testIsInteger = function() {
			this.assertTrue(eden(8).isInt(), this.TEST23);
			this.assertFalse(eden(8.45).isInt(), this.TEST24);	
		};
		
		public.testIsNaN = function() {
			this.assertTrue(eden(8).times('Yes').isNaN(), this.TEST25);
			this.assertFalse(eden(8).isNaN(), this.TEST26);	
		};
		
		public.testLessThan = function() {
			this.assertTrue(eden(8).lt(8, true), this.TEST27);
			this.assertFalse(eden(8).lt(8), this.TEST28);	
		};
		
		public.testLessThanEquals = function() {
			this.assertTrue(eden(8).lte(8), this.TEST29);
			this.assertFalse(eden(8).lte(7), this.TEST30);	
		};
		
		public.testLog = function() {
			this.assertEquals(0.6931471805599453, eden(2).log().get(), this.TEST31);	
		};
		
		public.testMinus = function(value) {
			this.assertEquals(8, eden(12).minus(4).get(), this.TEST32);	
		};
		
		public.testMod = function() {
			this.assertEquals(2, eden(8).mod(3).get(), this.TEST33);	
		};
		
		public.testPlus = function(value) {
			this.assertEquals(12, eden(8).plus('4').get(), this.TEST34);	
		};
		
		public.testPow = function() {
			this.assertEquals(16, eden(2).pow(4).get(), this.TEST35);	
		};
		
		public.testRound = function() {
			this.assertEquals(9, eden(8.5).round().get(), this.TEST36);	
		};
		
		public.testSin = function() {
			this.assertEquals(0.1411200080598672, eden(3).sin().get(), this.TEST37);	
		};
		
		public.testSquared = function() {
			this.assertEquals(81, eden(9).squared().get(), this.TEST38);	
		};
		
		public.testSqrt = function() {
			this.assertEquals(3, eden(9).sqrt().get(), this.TEST39);	
		};
		
		public.testTan = function() {
			this.assertEquals(-1.995200412208242, eden(90).tan().get(), this.TEST40);	
		};
		
		public.testTimes = function() {
			this.assertEquals(32, eden(8).times(4).get(), this.TEST41);	
		};
		
		public.testToString = function() {
			this.assertEquals('15', eden(15).toString(), this.TEST42);
		};

		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'number');
}();