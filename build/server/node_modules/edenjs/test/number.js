!function($) {
	var eden = require('../lib/index.js');
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
		public.testAbs = function(next) {
			this.assertEquals(8, eden('number').abs(-8), this.TEST1);
			
			next();
		};
		
		public.testAcos = function(next) {
			this.assertEquals(1.266103672779499, eden('number').acos(0.3), this.TEST2);
			
			next();
		};
		
		public.testAsin = function(next) {
			this.assertEquals(0.30469265401539747, eden('number').asin(0.3), this.TEST3);
			
			next();
		};
		
		public.testAtan = function(next) {
			this.assertEquals(1.5707962121596615, eden('number').atan(8723321.4), this.TEST4);
			
			next();
		};
		
		public.testBetween = function (next) {
			this.assertTrue(eden('number').between(8, 2, 12), this.TEST5);
			this.assertFalse(eden('number').between(8, 9, 20), this.TEST6);
			
			next();
		};
		
		public.testCeil = function(next) {
			this.assertEquals(5, eden('number').ceil(4.123), this.TEST7);
			
			next();
		};
		
		public.testCos = function(next) {
			this.assertEquals(-0.9899924966004454, eden('number').cos(3), this.TEST8);
			
			next();
		};
		
		public.testCubed = function(next) {
			this.assertEquals(27, eden('number').cubed(3), this.TEST9);
			
			next();
		};
		
		public.testDivided = function(next) {
			this.assertEquals(2, eden('number').divided(6, 3), this.TEST10);
			
			next();
		};
		
		public.testEquals = function(next) {
			this.assertTrue(eden('number').equals(8, '8'), this.TEST11);
			this.assertFalse(eden('number').equals(8, '8', true), this.TEST12);
			
			next();
		};
		
		public.testExp = function(next) {
			this.assertEquals(2.718281828459045, eden('number').exp(1), this.TEST13);
			
			next();
		};
		
		public.testFloor = function(next) {
			this.assertEquals(8, eden('number').floor(8.89432), this.TEST14);
			
			next();
		};
		
		public.testGreaterThan = function(next) {
			this.assertTrue(eden('number').gt(8, 8, true), this.TEST15);
			this.assertFalse(eden('number').gt(8, 8), this.TEST16);
			
			next();
		};
		
		public.testGreaterThanEquals = function(next) {
			this.assertTrue(eden('number').gte(8, 8), this.TEST17);
			this.assertFalse(eden('number').gte(8, 9), this.TEST18);
			
			next();
		};
		
		public.testIsInfinite = function (next) {
			this.assertTrue(eden('number').isInfinite(Infinity), this.TEST19);
			this.assertFalse(eden('number').isInfinite(8), this.TEST20);
			
			next();
		};
		
		public.testIsFloat = function(next) {
			this.assertTrue(eden('number').isFloat(8.45), this.TEST21);
			this.assertFalse(eden('number').isFloat(8), this.TEST22);
			
			next();
		};
		
		public.testIsInteger = function(next) {
			this.assertTrue(eden('number').isInt(8), this.TEST23);
			this.assertFalse(eden('number').isInt(8.45), this.TEST24);
			
			next();
		};
		
		public.testIsNaN = function(next) {
            this.assertTrue(eden('number').isNaN('Yes'), this.TEST25);
            this.assertFalse(eden('number').isNaN(8), this.TEST26);
			
			next();
		};
		
		public.testLessThan = function(next) {
			this.assertTrue(eden('number').lt(8, 8, true), this.TEST27);
			this.assertFalse(eden('number').lt(8, 8), this.TEST28);
			
			next();
		};
		
		public.testLessThanEquals = function(next) {
			this.assertTrue(eden('number').lte(8, 8), this.TEST29);
			this.assertFalse(eden('number').lte(8, 7), this.TEST30);
			
			next();
		};
		
		public.testLog = function(next) {
			this.assertEquals(0.6931471805599453, eden('number').log(2), this.TEST31);
			
			next();
		};
		
		public.testMinus = function(next) {
			this.assertEquals(8, eden('number').minus(12, 4), this.TEST32);
			
			next();
		};
		
		public.testMod = function(next) {
			this.assertEquals(2, eden('number').mod(8, 3), this.TEST33);
			
			next();
		};
		
		public.testPlus = function(next) {
			this.assertEquals(12, eden('number').plus(8, 4), this.TEST34);
			
			next();
		};
		
		public.testPow = function(next) {
			this.assertEquals(16, eden('number').pow(2, 4), this.TEST35);
			
			next();
		};
		
		public.testRound = function(next) {
			this.assertEquals(9, eden('number').round(8.5), this.TEST36);
			
			next();
		};
		
		public.testSin = function(next) {
			this.assertEquals(0.1411200080598672, eden('number').sin(3), this.TEST37);
			
			next();
		};
		
		public.testSquared = function(next) {
			this.assertEquals(81, eden('number').squared(9), this.TEST38);
			
			next();
		};
		
		public.testSqrt = function(next) {
			this.assertEquals(3, eden('number').sqrt(9), this.TEST39);
			
			next();
		};
		
		public.testTan = function(next) {
			this.assertEquals(-1.995200412208242, eden('number').tan(90), this.TEST40);
			
			next();
		};
		
		public.testTimes = function(next) {
			this.assertEquals(32, eden('number').times(8, 4), this.TEST41);
			
			next();
		};
		
		public.testToString = function(next) {
			this.assertEquals('15', eden('number').toString(15), this.TEST42);
			
			next();
		};

		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'number');
}();