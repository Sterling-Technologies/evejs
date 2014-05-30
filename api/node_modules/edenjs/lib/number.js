module.exports = function($) {
	var definition = this.define(function(public) {
		/* Constants
		-------------------------------*/
		var HTML_SPECIALCHARS 	= 100;
		var HTML_ENTITIES 		= 200;
		var ENT_NOQUOTES 		= 300;
		var ENT_COMPAT 			= 400;
		var ENT_QUOTES 			= 500;
			
		/* Public Properties
		-------------------------------*/
		public.data = null;
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(data) {
			//if it's any type of eden
			if($.isEden(data)) {
				//return it to prevent
				//recursiveness
				return data;
			}
			
			if(!this.isNumber(data)) {
				data = _getNumber(data);
				
				if(!this.isNumber(data)) {
					data = 0;
				}
			}
			
			return new this(data);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(data) {
			this.data = data || 0;
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Returns the absolute value
		 *
		 * @return this
		 */
		public.abs = public.absolute = function() {
			this.data = Math.abs(this.data);
			return this;
		};
		
		/**
		 * Returns the arccosine of x, in radians
		 *
		 * @return this
		 */
		public.acos = function() {
			this.data = Math.acos(this.data);
			return this;
		};
		
		/**
		 * Returns the arcsine of x, in radians
		 *
		 * @return this
		 */
		public.asin = function() {
			this.data = Math.asin(this.data);
			return this;
		};
		
		/**
		 * Returns the arctangent of x as a numeric value between -PI/2 and PI/2 radians
		 *
		 * @return this
		 */
		public.atan = function() {
			this.data = Math.atan(this.data);
			return this;
		};
		
		/**
		 * Test if value is between start and finish.
		 *
		 * @param number start lower bound
		 * @param number finish upper bound
		 * @return bool true if 'value' is is within 'start' and 'finish'
		 */
	 	public.between = function (start, finish, including) {
			start = _getNumber(start);
			
			if(!start) {
				return false;
			}
			
			finish = _getNumber(finish);
			
			if(!finish) {
				return false;
			}
			
			if(including) {
				return this.data >= start && this.data <= finish;
			}
			
			return this.data > start && this.data < finish;
		};
		
		/**
		 * Returns x, rounded upwards to the nearest integer
		 *
		 * @return this
		 */
		public.ceil = function() {
			this.data = Math.ceil(this.data);
			return this;
		};
		
		/**
		 * Returns the cosine of x (x is in radians)
		 *
		 * @return this
		 */
		public.cos = function() {
			this.data = Math.cos(this.data);
			return this;
		};
		
		/**
		 * Cubes data
		 *
		 * @return this
		 */
		public.cubed = function() {
			return this.pow(3);
		};
		
		/**
		 * Divides data by value
		 *
		 * @return this
		 */
		public.divided = function(value) {
			this.data /= value;
			return this;
		};
		
		/**
		 * Returns true if given value equals string
		 *
		 * @param mixed
		 * @param bool strict mode
		 * @return bool
		 */
		public.equals = public.eq = function(value, strict) {
			return strict? this.data === value: this.data == value;
		};
		
		/**
		 * Returns the value of Ex
		 *
		 * @return this
		 */
		public.exp = public.euler = function() {
			this.data = Math.exp(this.data);
			return this;
		};
		
		/**
		 * Returns x, rounded downwards to the nearest integer
		 *
		 * @return this
		 */
		public.floor = function() {
			this.data = Math.floor(this.data);
			return this;
		};
		
		/**
		 * Returns the value of a Number object
		 *
		 * @return number
		 */
		public.get = function() {
			return this.data;
		};
		
		/**
		 * Returns true if data is greater than value
		 * 
		 * @param number
		 * @param bool also equals
		 * @return bool
		 */
		public.greaterThan = public.gt = function(value, equals) {
			return equals ? this.data >= value: this.data > value;
		};
		
		/**
		 * Returns true if data is greater or equal to value
		 * 
		 * @param number
		 * @return bool
		 */
		public.greaterThanEquals = public.gte = function(value) {
			return this.gt(value, true);
		};
		
		/**
		 * Returns True if data is infinite
		 *
		 * @return bool
		 */
		public.isInfinite = function () {
			return this.data === Infinity || this.data === -Infinity;
		};
		
		/**
		 * Returns True if data is a float
		 *
		 * @return bool
		 */
		public.isFloat = function() {
			return this.data == this.data && !this.isInfinite() && this.data % 1 !== 0;
		};
		
		/**
		 * Returns True if data is an integer
		 *
		 * @return bool
		 */
		public.isInteger = public.isInt = function() {
			return this.data === this.data && this.data % 1 === 0;
		};
		
		/**
		 * Returns True if data is NaN
		 *
		 * @return bool
		 */
		public.isNaN = function() {
			return isNaN(this.data) || this.data !== this.data;
		}; 
		
		/**
		 * Returns true if data is less than value
		 * 
		 * @param number
		 * @param bool also equals
		 * @return bool
		 */
		public.lessThan = public.lt = function(value, equals) {
			return equals ? this.data <= value: this.data < value;
		};
		
		/**
		 * Returns true if data is less or equal to value
		 * 
		 * @param number
		 * @return bool
		 */
		public.lessThanEquals = public.lte = function(value) {
			return this.lt(value, true);
		};
		
		/**
		 * Returns the natural logarithm (base E) of x
		 *
		 * @return this
		 */
		public.log = function() {
			this.data = Math.log(this.data);
			return this;
		};
		
		/**
		 * Subtracts data by value
		 *
		 * @return this
		 */
		public.minus = function(value) {
			this.data -= value;
			return this;
		};
		
		/**
		 * Mods data by value
		 *
		 * @return this
		 */
		public.mod = public.modular = function(value) {
			this.data %= value;
			return this;
		};
		
		/**
		 * Adds data by value
		 *
		 * @return this
		 */
		public.plus = function(value) {
			value = _getNumber(value);
			
			if(value === false) {
				value = 0;
			}
			
			this.data += value;
			return this;
		};
		
		/**
		 * Returns the value of x to the power of y
		 *
		 * @return this
		 */
		public.pow = public.power = function(value) {
			this.data = Math.pow(this.data, value);
			return this;
		};
		
		/**
		 * Rounds x to the nearest integer
		 *
		 * @return this
		 */
		public.round = function() {
			this.data = Math.round(this.data);
			return this;
		};
		
		/**
		 * Returns the sine of x (x is in radians)
		 *
		 * @return this
		 */
		public.sin = function() {
			this.data = Math.sin(this.data);
			return this;
		};
		
		/**
		 * Squares value
		 *
		 * @return this
		 */
		public.squared = function() {
			return this.pow(2);
		};
		
		/**
		 * Returns the square root of x
		 *
		 * @return this
		 */
		public.sqrt = public.squareRoot = function() {
			this.data = Math.sqrt(this.data);
			return this;
		};
		
		/**
		 * Returns the tangent of an angle
		 *
		 * @return this
		 */
		public.tan = function() {
			this.data = Math.tan(this.data);
			return this;
		};
		
		/**
		 * Multiplies data by value
		 *
		 * @return this
		 */
		public.times = function(value) {
			this.data *= value;
			return this;
		};
		
		/**
		 * Returns the value of a Number object
		 *
		 * @return string
		 */
		public.toString = function() {
			return this.data.toString();
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
	
	definition.isNumber = function(value) {
		return '[object Number]' === toString.call(value);
	};
	
	definition.injectSuper = function() {
		$.number = { isNumber: this.isNumber };
		
		var wrapper = function(method) {
			return function() {
				var args 		= $.args(), 
					data 		= args.shift(),
					instance 	= definition.load(data),
					results 	= instance[method].apply(instance, args);
				
				if($.isEden(results)) {
					results = results.get();
				}
				
				return results;
			};
		};
		
		for(var method in this.prototype) {
			if(method.indexOf('__') === 0 || method === 'get'
			|| typeof definition.prototype[method] != 'function') {
				continue;
			}
			
			$.number[method] = wrapper(method);
		}
		
		return this;
	};
	
	return definition.injectSuper();
};