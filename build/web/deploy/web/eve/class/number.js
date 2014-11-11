jQuery.eve.base.define(function() {
	this.Number = jQuery.classified(function() {
		/* Require
		-------------------------------*/
		/* Constants
		-------------------------------*/
		/* Public Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		/**
		 * Returns the absolute value
		 *
		 * @param number
		 * @return number
		 */
		this.abs = this.absolute = function(data) {
			data = this.__getNumber(data);
			return Math.abs(data);
		};
		
		/**
		 * Returns the arccosine of x, in radians
		 * 
		 * @param number
		 * @return number
		 */
		this.acos = function(data) {
			data = this.__getNumber(data);
			return Math.acos(data);
		};
		
		/**
		 * Returns the arcsine of x, in radians
		 * 
		 * @param number
		 * @return number
		 */
		this.asin = function(data) {
			data = this.__getNumber(data);
			return Math.asin(data);
		};
		
		/**
		 * Returns the arctangent of x as a numeric value between -PI/2 and PI/2 radians
		 * 
		 * @param number
		 * @return number
		 */
		this.atan = function(data) {
			data = this.__getNumber(data);
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
		this.between = function (data, start, finish, including) {
			data  = this.__getNumber(data);
			start = this.__getNumber(start);
			
			if(!start) {
				return false;
			}
			
			finish = this.__getNumber(finish);
			
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
		this.ceil = function(data) {
			data = this.__getNumber(data);
			return Math.ceil(data);			 
		};
		
		/**
		 * Returns the cosine of x (x is in radians)
		 * 
		 * @param number
		 * @return number
		 */
		this.cos = function(data) {
			data = this.__getNumber(data);
			return Math.cos(data);
		};
		
		/**
		 * Cubes data
		 * 
		 * @param number
		 * @return this
		 */
		this.cubed = function(data) {
			data = this.__getNumber(data);
			return this.pow(data, 3);
		};
		
		/**
		 * Divides data by value
		 * 
		 * @param number 
		 * @param number 
		 * @return number
		 */
		this.divided = function(data, value) {
			data = this.__getNumber(data);
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
		this.equals = this.eq = function(data, value, strict) {
			data = this.__getNumber(data);
			return strict? data === value: data == value;
		};
		
		/**
		 * Returns the value of Ex
		 *
		 * @param number
		 * @return number
		 */
		this.exp = this.euler = function(data) {
			data = this.__getNumber(data);
			return Math.exp(data);
		};
		
		/**
		 * Returns x, rounded downwards to the nearest integer
		 *
		 * @param number
		 * @return number
		 */
		this.floor = function(data) {
			data = this.__getNumber(data);
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
		this.greaterThan = this.gt = function(data, value, equals) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return equals ? data >= value: data > value;
		};
		
		/**
		 * Returns true if data is greater or equal to value
		 * 
		 * @param number
		 * @param number
		 * @return bool
		 */
		this.greaterThanEquals = this.gte = function(data, value) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return this.gt(data, value, true);
		};
		
		/**
		 * Returns True if data is infinite
		 *
		 * @param number
		 * @return bool
		 */
		this.isInfinite = function (data) {
			return data === Infinity || data === -Infinity;
		};
		
		/**
		 * Returns True if data is a float
		 * 
		 * @param number
		 * @return bool
		 */
		this.isFloat = function(data) {
			return data == data && !this.isInfinite(data) && data % 1 !== 0;
		};
		
		/**
		 * Returns True if data is an integer
		 *
		 * @param number
		 * @return bool
		 */
		this.isInteger = this.isInt = function(data) {
			return data === data && data % 1 === 0;
		};
		
		/**
		 * Returns True if data is NaN
		 *
		 * @param number
		 * @return bool
		 */
		this.isNaN = function(data) {
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
		this.lessThan = this.lt = function(data, value, equals) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return equals ? data <= value: data < value;
		};
		
		/**
		 * Returns true if data is less or equal to value
		 * 
		 * @param number
		 * @param number
		 * @return bool
		 */
		this.lessThanEquals = this.lte = function(data, value) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return this.lt(data, value, true);
		};
		
		/**
		 * Returns the natural logarithm (base E) of x
		 *
		 * @param number
		 * @return number
		 */
		this.log = function(data) {
			data 	= this.__getNumber(data);
			
			return Math.log(data);
		};
		
		/**
		 * Subtracts data by value
		 *
		 * @param number
		 * @param number
		 * @return number
		 */
		this.minus = function(data, value) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return data -= value;
		};
		
		/**
		 * Mods data by value
		 *
		 * @param number
		 * @param number
		 * @return number
		 */
		this.mod = this.modular = function(data, value) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return data %= value;
		};
		
		/**
		 * Adds data by value
		 * 
		 * @param number
		 * @param number
		 * @return number
		 */
		this.plus = function(data, value) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
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
		this.pow = this.power = function(data, value) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return Math.pow(data, value);
		};
		
		/**
		 * Rounds x to the nearest integer
		 * 
		 * @param number
		 * @return number
		 */
		this.round = function(data) {
			data = this.__getNumber(data);
			return Math.round(data);
		};
		
		/**
		 * Returns the sine of x (x is in radians)
		 *
		 * @param number
		 * @return number
		 */
		this.sin = function(data) {
			data = this.__getNumber(data);
			
			return Math.sin(data);
		};
		
		/**
		 * Squares value
		 * 
		 * @param number
		 * @return number
		 */
		this.squared = function(data) {
			data = this.__getNumber(data);
			
			return this.pow(data, 2);
		};
		
		/**
		 * Returns the square root of x
		 *
		 * @param number
		 * @return number
		 */
		this.sqrt = this.squareRoot = function(data) {
			data = this.__getNumber(data);
			
			return Math.sqrt(data);			
		};
		
		/**
		 * Returns the tangent of an angle
		 *
		 * @param number
		 * @return number
		 */
		this.tan = function(data) {
			data = this.__getNumber(data);
			
			return Math.tan(data);
		};
		
		/**
		 * Multiplies data by value
		 *
		 * @param number
		 * @param number
		 * @return number
		 */
		this.times = function(data, value) {
			data 	= this.__getNumber(data);
			value 	= this.__getNumber(value);
			
			return data *= value;
		};
		
		/**
		 * Returns the string value of a Number object
		 *
		 * @param number
		 * @return string
		 */
		this.toString = function(data) {
			data = this.__getNumber(data);
			
			return data.toString();
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
		this.__getNumber = function(value) {
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
	}).singleton();
});