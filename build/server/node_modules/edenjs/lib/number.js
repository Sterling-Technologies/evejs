module.exports = function($) {
	return this.define(function(public) {
		/* Constants
		-------------------------------*/
		var HTML_SPECIALCHARS 	= 100;
		var HTML_ENTITIES 		= 200;
		var ENT_NOQUOTES 		= 300;
		var ENT_COMPAT 			= 400;
		var ENT_QUOTES 			= 500;
			
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			if(!this.__instance) {
                this.__instance = new this();
            }
            
            return this.__instance;
		};
		
		/* Construct
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		/**
		 * Returns the absolute value
         *
		 * @param number
		 * @return number
		 */
		public.abs = public.absolute = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.abs(data);
		};
		
		/**
		 * Returns the arccosine of x, in radians
         * 
		 * @param number
		 * @return number
		 */
		public.acos = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.acos(data);
		};
		
		/**
		 * Returns the arcsine of x, in radians
         * 
		 * @param number
		 * @return number
		 */
		public.asin = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.asin(data);
		};
		
		/**
		 * Returns the arctangent of x as a numeric value between -PI/2 and PI/2 radians
         * 
		 * @param number
		 * @return number
		 */
		public.atan = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.atan(data);
		};
		
		/**
		 * Test if value is between start and finish.
         *
		 * @param number
		 * @param number start lower bound
		 * @param number finish upper bound
		 * @return bool true if 'value' is is within 'start' and 'finish'
		 */
	 	public.between = function (data, start, finish, including) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric')
				.test(3, 'numeric');
			
			data  = _getNumber(data);
			start = _getNumber(start);
			
			if(!start) {
				return false;
			}
			
			finish = _getNumber(finish);
			
			if(!finish) {
				return false;
			}
			
			if(including) {
				return data >= start && data <= finish;
			}
			
			return data > start && data < finish;
		};
		
		/**
		 * Returns x, rounded upwards to the nearest integer
         *
		 * @param number
		 * @return number
		 */
		public.ceil = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.ceil(data);			 
		};
		
		/**
		 * Returns the cosine of x (x is in radians)
         * 
		 * @param number
		 * @return number
		 */
		public.cos = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.cos(data);
		};
		
		/**
		 * Cubes data
         * 
		 * @param number
		 * @return this
		 */
		public.cubed = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return this.pow(data, 3);
		};
		
		/**
		 * Divides data by value
         * 
		 * @param number 
         * @param number 
		 * @return number
		 */
		public.divided = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data = _getNumber(data);
			return data /= value;
		};
		
		/**
		 * Returns true if given value equals string
		 *
		 * @param number
         * @param mixed
		 * @param number, bool strict mode
		 * @return bool
		 */
		public.equals = public.eq = function(data, value, strict) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'mixed')
				.test(3, 'bool', 'undefined');
			
			data = _getNumber(data);
			return strict? data === value: data == value;
		};
		
		/**
		 * Returns the value of Ex
         *
		 * @param number
		 * @return number
		 */
		public.exp = public.euler = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.exp(data);
		};
		
		/**
		 * Returns x, rounded downwards to the nearest integer
         *
		 * @param number
		 * @return number
		 */
		public.floor = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.floor(data);
		};
		
		/**
		 * Returns true if data is greater than value
		 * 
         * @param number
		 * @param number
		 * @param bool also equals
		 * @return bool
		 */
		public.greaterThan = public.gt = function(data, value, equals) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric')
				.test(3, 'bool', 'undefined');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return equals ? data >= value: data > value;
		};
		
		/**
		 * Returns true if data is greater or equal to value
		 * 
         * @param number
		 * @param number
		 * @return bool
		 */
		public.greaterThanEquals = public.gte = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return this.gt(data, value, true);
		};
		
		/**
		 * Returns True if data is infinite
		 *
         * @param number
		 * @return bool
		 */
		public.isInfinite = function (data) {
			return data === Infinity || data === -Infinity;
		};
		
		/**
		 * Returns True if data is a float
		 * 
         * @param number
		 * @return bool
		 */
		public.isFloat = function(data) {
			return data == data && !this.isInfinite(data) && data % 1 !== 0;
		};
		
		/**
		 * Returns True if data is an integer
		 *
         * @param number
		 * @return bool
		 */
		public.isInteger = public.isInt = function(data) {
			return data === data && data % 1 === 0;
		};
		
		/**
		 * Returns True if data is NaN
		 *
         * @param number
		 * @return bool
		 */
		public.isNaN = function(data) {
			return isNaN(data) || data !== data;
		}; 
		
		/**
		 * Returns true if data is less than value
		 * 
         * @param number
		 * @param number
		 * @param bool also equals
		 * @return bool
		 */
		public.lessThan = public.lt = function(data, value, equals) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric')
				.test(3, 'bool', 'undefined');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return equals ? data <= value: data < value;
		};
		
		/**
		 * Returns true if data is less or equal to value
		 * 
         * @param number
		 * @param number
		 * @return bool
		 */
		public.lessThanEquals = public.lte = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return this.lt(data, value, true);
		};
		
		/**
		 * Returns the natural logarithm (base E) of x
		 *
         * @param number
		 * @return number
		 */
		public.log = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data 	= _getNumber(data);
			
			return Math.log(data);
		};
		
		/**
		 * Subtracts data by value
		 *
         * @param number
         * @param number
		 * @return number
		 */
		public.minus = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return data -= value;
		};
		
		/**
		 * Mods data by value
		 *
         * @param number
         * @param number
		 * @return number
		 */
		public.mod = public.modular = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return data %= value;
		};
		
		/**
		 * Adds data by value
         * 
		 * @param number
         * @param number
		 * @return number
		 */
		public.plus = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			if(value === false) {
				value = 0;
			}
			
			return data += value;
		};
		
		/**
		 * Returns the value of x to the power of y
         *
         * @param number
		 * @param number
		 * @return number
		 */
		public.pow = public.power = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return Math.pow(data, value);
		};
		
		/**
		 * Rounds x to the nearest integer
         * 
		 * @param number
		 * @return number
		 */
		public.round = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			return Math.round(data);
		};
		
		/**
		 * Returns the sine of x (x is in radians)
		 *
         * @param number
		 * @return number
		 */
		public.sin = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			
			return Math.sin(data);
		};
		
		/**
		 * Squares value
		 * 
         * @param number
		 * @return number
		 */
		public.squared = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			
			return this.pow(data, 2);
		};
		
		/**
		 * Returns the square root of x
		 *
         * @param number
		 * @return number
		 */
		public.sqrt = public.squareRoot = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			
			return Math.sqrt(data);			
		};
		
		/**
		 * Returns the tangent of an angle
		 *
         * @param number
		 * @return number
		 */
		public.tan = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			
			return Math.tan(data);
		};
		
		/**
		 * Multiplies data by value
		 *
         * @param number
         * @param number
		 * @return number
		 */
		public.times = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'numeric')
				.test(2, 'numeric');
			
			data 	= _getNumber(data);
			value 	= _getNumber(value);
			
			return data *= value;
		};
		
		/**
		 * Returns the string value of a Number object
		 *
         * @param number
		 * @return string
		 */
		public.toString = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'numeric');
			
			data = _getNumber(data);
			
			return data.toString();
		};
		
		/* Private Methods
		-------------------------------*/
		var _getNumber = function(value) {
			if(typeof value == 'number' || '[object Number]' === toString.call(value)) {
				return value;
			}
			
			//if it is numeric
			if(!isNaN(parseFloat(value)) && isFinite(value)) {
				if((value+'').indexOf('.') !== -1) {
					return parseFloat(value);
				}
				
				return parseInt(value);
			}

			return false;
		};
	});
};