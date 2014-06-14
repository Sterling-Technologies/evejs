module.exports = function($) {
	return this.define(function(public) {
		/* Constants
		-------------------------------*/
		var INVALID_ARGUMENT = 'Argument {NUMBER} in {METHOD}() was expecting {EXPECTED}, however {ACTUAL} was given.';
		
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		var _stop = false;
		
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
		 * Tests arguments for valid data types
		 *
		 * @param *int
		 * @param *mixed
		 * @param *string[,string..]
		 * @return this
		 */
		public.test = function(index, types) {
			//if no test
			if(_stop) {
				return this;
			}
			
			//types are comma separated
			types = $.args();
			//shift out the index from types (it's not a type!)
			index = types.shift();
			//get the arguments of the function that called this method
			var args = Array.prototype.slice.apply(arguments.callee.caller.arguments);
			
			//run the virtual
			return this.virtual(args, index, types);
		};
		
		/**
		 * Turns argument testing off
		 * usually for optimizations 
		 * purposes
		 *
		 * @return this
		 */
		public.turnOff = function() {
			_stop = true;
			return this;
		};
		
		/**
		 * Turns argument testing on
		 * usually for debugging 
		 * purposes
		 *
		 * @return this
		 */
		public.turnOn = function() {
			_stop = false;
			return this;
		};
		
		/**
		 * Tests virtual arguments for valid data types
		 *
		 * @param *string method name
		 * @param *array arguments
		 * @param *int
		 * @param *string[,string..]
		 * @return this
		 */
		public.virtual = function(args, index, types) {
			//if no test
			if(_stop) {
				return this;
			}
			
			if(index < 1) {
				index = 1;
			}
			
			var error 	= new Error(), 
				stack	= error.stack.split("\n"),
				argument = args[index - 1];
			
			stack.shift();
			stack.shift();
			
			if(stack[0].trim().indexOf('at public.test') === 0) {
				stack.shift();
			}
			
			for(var i = 0; i < types.length; i++) {
				if(this.isValid(types[i], argument)) {
					return this;
				}
			}
			
			var method = stack[0].trim().split(' ')[1];
			var type = this.getDataType(argument);
			
			error.message = INVALID_ARGUMENT
				.replace('{NUMBER}', index)
				.replace('{METHOD}', method)
				.replace('{EXPECTED}', types.join(' or '))
				.replace('{ACTUAL}', type);
			
			stack.unshift(error.message);
			error.stack = stack.join("\n");
			
			throw error;
		};
		
		/**
		 * Validates an argument given the type.
		 *
		 * @param *string
		 * @param *mixed
		 * @return bool
		 */
		public.isValid = function(type, data) {
			if(typeof type == 'object') {
				return data instanceof type;
			}
			
			switch(type) {
				case 'bool': 
					return typeof data == 'boolean';
				case 'number':
					return typeof data == 'number';
				case 'int':
					return typeof data == 'number' && ('' + data).indexOf('.') == -1;
				case 'float':
					return typeof data == 'number' && ('' + data).indexOf('.') != -1;
				case 'email':
					return typeof data == 'string' && _isEmail(data);
				case 'url':
					return typeof data == 'string' && _isUrl(data);
				case 'html':
					return typeof data == 'string' && _isHtml(data);
				case 'cc':
					return typeof data == 'string' && _isCreditCard(data);
				case 'hex':
					return typeof data == 'string' && _isHex(data);
				case 'alphanum':
					return typeof data == 'string' && _alphaNum(data);
				case 'alphanumscore':
					return typeof data == 'string' && _alphaNumScore(data);
				case 'alphanumhyphen':
					return typeof data == 'string' && _alphaNumHyphen(data);
				case 'alphanumline':
					return typeof data == 'string' && _alphaNumLine(data);
				case 'null':
				case null:
					return data === null;
				case 'undef':
				case 'undefined':
					return data === undefined;
				case 'array':
					return data instanceof Array;
				case 'hash':
					return toString.call(data) === '[object Object]'
						&& data.constructor === Object 
						&& !data.nodeType 
						&& !data.setInterval;
				case 'numeric':
					return !isNaN(parseFloat(data)) && isFinite(data);
				case 'regex':
				case 'regexp':
					return data instanceof RegExp;
				case 'mixed': 
					return data != undefined; 
				default: 
					return typeof data == type;
			}
	
			return true;
		};
		
		/**
		 * Returns the data type of the argument
		 *
		 * @param *mixed
		 * @return string
		 */
		public.getDataType = function(data) {
			if(typeof data == 'string') {
				return "'" + data + "'";
			}
	
			if(data instanceof Array) {
				return 'Array';
			}
			
			if(data instanceof RegExp) {
				return 'RegExp';
			}
			
			if(data instanceof Date) {
				return 'Date';
			}
	
			if(typeof data == 'boolean') {
				return data ? 'true' : 'false';
			}
	
			if(typeof data == 'object') {
				return 'Object';
			}
	
			if(data === null) {
				return 'null';
			}
			
			if(data === undefined) {
				return 'undefined';
			}
	
			return typeof data;
		};

		
		/* Private Methods
		-------------------------------*/
		/**
		 * Validates a credit card argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _isCreditCard = function(value) {
			return (new RegExp('/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]'
			+ '{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-'
			+ '5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/', 'ig')).test(value);
		};
		
		/**
		 * Validates an email argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _isEmail = function(value) {
			return (new RegExp('/^(?:(?:(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|\x5c(?=[@,"\[\]'
			+ '\x5c\x00-\x20\x7f-\xff]))(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]'
			+ '\x5c\x00-\x20\x7f-\xff]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff])|\.(?=[^\.])){1,62'
			+ '}(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff])|'
			+ '[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]{1,2})|"(?:[^"]|(?<=\x5c)"){1,62}")@(?:(?!.{64})'
			+ '(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.?|[a-zA-Z0-9]\.?)+\.(?:xn--[a-zA-Z0-9]'
			+ '+|[a-zA-Z]{2,6})|\[(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])(?:\.(?:[0-1]?\d?\d|2[0-4]\d|25'
			+ '[0-5])){3}\])$/', 'ig')).test(value);
		};
			
		/**
		 * Validates a hex argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _isHex = function(value) {
			return (new RegExp("/^[0-9a-fA-F]{6}$/", 'ig')).test(value);
		};
	
		/**
		 * Validates an HTML argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _isHtml = function(value) {
			return (new RegExp("/<\/?\w+((\s+(\w|\w[\w-]*\w)(\s*=\s*"
			+ "(?:\".*?\"|'.*?'|[^'\">\s]+))?)+\s*|\s*)\/?>/i", 'ig')).test(value);
		}
	
		/**
		 * Validates a URL argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _isUrl = function(value) {
			return (new RegExp('/^(http|https|ftp):\/\/([A-Z0-9][A-Z0'
			+ '-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\/?/i', 'ig')).test(value);
		};
	
		/**
		 * Validates an alpha numeric argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _alphaNum = function(value) {
			return (new RegExp('/^[a-zA-Z0-9]+$/', 'ig')).test(value);
		};
	
		/**
		 * Validates an alpha numeric underscore argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _alphaNumScore = function(value) {
			return (new RegExp('/^[a-zA-Z0-9_]+$/', 'ig')).test(value);
		};
	
		/**
		 * Validates an alpha numeric hyphen argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _alphaNumHyphen = function(value) {
			return (new RegExp('/^[a-zA-Z0-9-]+$/', 'ig')).test(value);
		};
	
		/**
		 * Validates an alpha numeric hyphen underscore argument.
		 *
		 * @param *string
		 * @return bool
		 */
		var _alphaNumLine = function(value) {
			return (new RegExp('/^[a-zA-Z0-9-_]+$/', 'ig')).test(value);
		};
	});
};