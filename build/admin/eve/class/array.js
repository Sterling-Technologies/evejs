jQuery.eve.base.define(function() {
	this.Array = jQuery.classified(function() {
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
		 * Clones an array
		 * 
		 * @param array
		 * @return array
		 */
		this.clone = function(data) {
			return data.slice(0);
		};
		
		/**
		 * Combines a list of keys and values into an object
		 *
		 * @param array
		 * @param array
		 * @return object
		 */
		this.combine = function(keys, values) {
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
		this.concat = this.merge = function(data, list) {
			var newArray = [], i, j;
			
			for(i = 0; i < arguments.length; i++) {
				if(typeof arguments[i] != 'object') {
					newArray.push(arguments[i]);
					continue;
				}
				
				for(j in arguments[i]) {
					newArray.push(arguments[i][j]);
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
		this.each = function(data, callback) {
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
		this.has = function(data, value) {
			return data.indexOf(value) !== -1;
		};
		
		/**
		 * Join array elements with a string
		 * 
		 * @param array
		 * @param string
		 * @return string
		 */
		this.implode = this.join = function(data, delimeter) {
			return data.join(delimeter);
		}
	
		/**
		 * Check if data is array
		 * @param array
		 * @return bool
		 */
	
		this.isArray = function(data) {
			return data instanceof Array;
		};
		
		/**
		 * Returns true if empty
		 *
		 * @param array
		 * @return bool
		 */
		this.isEmpty = function(data) {
			return data.length === 0;
		};
		
		/**
		 * Returns a list of keys
		 *
		 * @param array
		 * @return array
		 */
		this.keys = function(data) {
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
		this.lastIndexOf = function(data, value) {
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
		this.map = function(data, callback) {
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
		this.natsort = function(data) {
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
		this.pop = function(data) {
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
		this.push = function(data, value) {
			var args = Array.prototype.slice.apply(arguments);
			
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
		this.reverse = function(data) {
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
		this.slice = function(data) {
			var args = Array.prototype.slice.apply(arguments);
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
		this.splice = function(data) {
			var args = Array.prototype.slice.apply(arguments);
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
		this.sort = function(data, method) {
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
		this.size = function(data) {
			return data.length;
		};
		
		/**
		 * Converts array to query string
		 *
		 * @param string
		 * @param [string]
		 * @return string
		 */
		this.toQuery = function(data, prefix) {
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
					value = jQuery.eve.base().Hash().toQuery(value, key);
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
		this.toString = function(data) {
			return JSON.stringify(data);
		};
		
		/**
		 * Unshifts array into the stack
		 *
		 * @param array
		 * @param mixed[,mixed..]
		 * @return array
		 */
		this.unshift = function(data) {
			var args = Array.prototype.slice.apply(arguments);
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
		this.values = function(data) {
			var values = [], index;
			
			//now parse through each item
			for(index in data) {
				values.push(data[index]);
			}
			
			return values;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});