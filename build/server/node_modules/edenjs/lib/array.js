module.exports = function($) {
	return this.define(function(public) {
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
		 * Clones an array
		 * 
		 * @param array
		 * @return array
		 */
		public.clone = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			return data.slice(0);
		};
		
		/**
		 * Combines a list of keys and values into an object
		 *
		 * @param array
		 * @param array
		 * @return object
		 */
		public.combine = function(keys, values) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'array');
			
			var object = {};

			for(var i = 0; i < keys.length; i++) {
				if(values[i]) {
					object[keys[i]] = values[i];
				}
			}
			
			return object;
		};
				
		/**
		 * Concats arrays into one
		 *
		 * @param array[,array..]
		 * @return this
		 */
		public.concat = public.merge = function(data, list) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'array');
			
			var newArray = [], i, j, lists = $.args();
			
			for(i = 0; i < lists.length; i++) {
				if(typeof lists[i] != 'object') {
					newArray.push(lists[i]);
					continue;
				}
				
				for(j in arguments[i]) {
					newArray.push(lists[i][j]);
				}
			}
			
			return newArray;
		};
		
		/**
		 * Custom for each loop that handles 
		 * scopes and extra arguments
		 *
		 * @param array
		 * @param function
		 * @return bool
		 */
		public.each = function(data, callback) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'function');
			
			//now parse through each item
			for(var i = 0; i < data.length; i++) {
				//if the callback is false
				if(callback(i, data[i]) === false) {
					//stop the loop and return false
					return false;
				}
			}
			
			//the loop passed
			//return all good
			return true;
		};
		
		/**
		 * Returns true if the array has 
		 * given value
		 *
		 * @param array
		 * @param mixed
		 * @param bool
		 */
		public.has = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(1, 'mixed');
			
			return data.indexOf(value) !== -1;
		};
		
		/**
		 * Join array elements with a string
		 * 
		 * @param array
		 * @param string
		 * @return string
		 */
		public.implode = public.join = function(data, delimeter) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'string');
			
			return data.join(delimeter);
		}

		/**
		 * Check if data is array
		 * @param array
		 * @return bool
		 */

		public.isArray = function(data) {
			return data instanceof Array;
		};
		
		/**
		 * Returns true if empty
		 *
		 * @param array
		 * @return bool
		 */
		public.isEmpty = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			return data.length === 0;
		};
		
		/**
		 * Returns a list of keys
		 *
		 * @param array
		 * @return array
		 */
		public.keys = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			var keys = [], index;
			
			//now parse through each item
			for(index in data) {
				keys.push(index);
			}

			return keys;
		};
		
		/**
		 * Returns the last index of where in
		 * the array the value is found
		 *
		 * @param array
		 * @param mixed
		 * @return number
		 */
		public.lastIndexOf = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'mixed');
			
			return data.lastIndexOf(value);
		}
		
		/**
		 * Custom map loop that handles 
		 * scopes and extra arguments
		 *
		 * @param array
		 * @param function
		 * @param [mixed[,mixed..]]
		 * @return array
		 */
		public.map = function(data, callback) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'function');
			
			//now parse through each item
			this.each(data, function(key, value) {
				data[key] = callback(key, value);
			});
			
			return data;
		};
		
		/**
		 * Sorts array by natural sort
		 *
		 * @param object
		 * @return object
		 */
		public.natsort = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			return this.sort(data, function(a, b) {
				aValue = a + '';
				bValue = b + '';
				
				if(aValue < bValue) {
					return -1;
				} 
				
				if(aValue > bValue) {
					return 1;
				} 
				
				return 0;
			});
		};
				
		/**
		 * Pops array from the stack
		 *
		 * @param array
		 * @return mixed
		 */
		public.pop = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			data = this.clone(data);
			return data.pop();
		};
		
		/**
		 * Pushes array into the stack
		 *
		 * @param array
		 * @param mixed[,mixed..]
		 * @return array
		 */
		public.push = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'mixed');
			
			var args = $.args();
			
			data = args.shift();
			data = this.clone(data);
			
			for(var i = 0; i < args.length; i++) {
				data.push(args[i]);
			}
			
			return data;
		};
		
		/**
		 * Reverses the array
		 *
		 * @param array
		 * @return array
		 */
		public.reverse = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			data = this.clone(data);
			
			data.reverse();
			
			return data;
		};
		
		/**
		 * Picks from chosen slice and rconturns a new array
		 * @param array
		 * @param num
		 * @param [num]
		 * @return array
		 */
		public.slice = function(data) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'int')
				.test(3, 'int', 'undefined');
			
			var args = $.args();
			args.shift();
			return data.slice.apply(data, args);
		};
		
		/**
		 * Adds/removes items to/from an array, 
		 * and returns the removed item(s)
		 *
		 * @param array
		 * @param num
		 * @param num
		 * @param mixed[,mixed..]
		 * @return array
		 */
		public.splice = function(data) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'int')
				.test(3, 'int', 'undefined');
			
			var args = $.args();
			args.shift();
			return data.splice.apply(data, args);
		};
		
		/**
		 * Sorts an array
		 *
		 * @param array
		 * @param [function]
		 * @return array
		 */
		public.sort = function(data, method) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'function', 'undefined');
			
			data = this.clone(data);
			
			if(method && typeof method == 'function') {
				data.sort(method);
			} else {
				data.sort();
			}
			
			return data;
		};
		
		/**
		 * Returns the array size
		 *
		 * @param array
		 * @return number
		 */
		public.size = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			return data.length;
		};
		
		/**
		 * Converts array to query string
		 *
		 * @param string
		 * @param [string]
		 * @return string
		 */
		public.toQuery = function(data, prefix) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'string', 'undefined');
			
			var self = this, value, query = [] ;
			
			this.each(data, function(key, value) {
				if(prefix) {
					key = prefix + '[' + key + ']';
				}
				
				if(value instanceof Array) {
					value = self.toQuery(value, key);
					query.push(value);
					return;
				}

				if(typeof value == 'object') {
					value = $.load('hash').toQuery(value, key);
					query.push(value);
					return;
				}

				query.push(key + '=' + encodeURIComponent(value));
			}, this);

			return query.join('&');
		};
		
		/**
		 * Converts array to string
		 *
		 * @return string
		 */
		public.toString = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			return JSON.stringify(data);
		};
		
		/**
		 * Unshifts array into the stack
		 *
		 * @param array
		 * @param mixed[,mixed..]
		 * @return array
		 */
		public.unshift = function(data) {
			//Argument Testing
			$.load('argument')
				.test(1, 'array')
				.test(2, 'mixed');
			
			var args = $.args();
			data = args.shift();
			
			data = this.clone(data);
			
			for(var i = 0; i < args.length; i++) {
				data.unshift(args[i]);
			}
			
			return data;
		};
		
		/**
		 * Returns a list of values
		 *
		 * @param array
		 * @return array
		 */
		public.values = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'array');
			
			var values = [], index;
			
			//now parse through each item
			for(index in data) {
				values.push(data[index]);
			}
			
			return values;
		};
		
		/* Private Methods
		-------------------------------*/
	});
};