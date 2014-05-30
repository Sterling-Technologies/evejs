module.exports = function($) {
	var definition = this.define(function(public) {
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
			
			if(!this.isArray(data)) {
				value = [];
			}
			
			return new this(data);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(data) {
			this.data = data || [];
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Combines a list of keys and values into an object
		 *
		 * @param array
		 * @return object
		 */
		public.combineWithKeys = function(keys) {
			var object = $.load('hash');
			
			keys = $.edenize(keys, ['array', 'hash']);
			
			keys.each(function(i, key, values) {
				if(values[i]) {
					object.set(key, values[i]);
				}
			}, keys, this.data);
			
			return object;
		};
		
		/**
		 * Combines a list of keys and values into an object
		 *
		 * @param array
		 * @return object
		 */
		public.combineWithValues = function(values) {
			var object = $.load('hash');
			
			this.each(function(i, key) {
				if(values[i]) {
					object.set(key, values[i]);
				}
			});
			
			return object;
		};
		
		/**
		 * Concats arrays into one
		 *
		 * @param array[,array..]
		 * @return this
		 */
		public.concat = function() {
			var i, j, data = $.args();
			
			for(i = 0; i < data.length; i++) {
				if(typeof data[i] != 'object') {
					this.data.push(data[i]);
					continue;
				}
				
				//if it's any type of eden
				if($.isEden(data[i]) 
				&& typeof data[i].get == 'function') {
					//make it natural
					data[i] = data[i].get();
				}
				
				for(j in arguments[i]) {
					this.data.push(arguments[i][j]);
				}
			}
			
			return this;
		};
		
		/**
		 * Custom for each loop that handles 
		 * scopes and extra arguments
		 *
		 * @param function
		 * @param [mixed[,mixed..]]
		 * @return bool
		 */
		public.each = function(callback) {
			//get the dynamic arguments
			var i, args = $.args();
			
			//alter the callback casing 
			//for scopes and extra arguments
			callback = $.alter.apply($, args);
			
			//now parse through each item
			for(i = 0; i < this.data.length; i++) {
				//if the callback is false
				if(callback.call(this, i, this.data[i]) === false) {
					//stop the loop and return false
					return false;
				}
			}
			
			//the loop passed
			//return all good
			return true;
		};
		
		/**
		 * Returns the raw array
		 *
		 * @return array
		 */
		public.get = function() {
			var raw = [];
			
			this.each(function(key, value) {
				raw[key] = value
			});
			
			return raw;
		};
		
		/**
		 * Get Type
		 *
		 * @return string
		 */
		public.getType = function() {
			return 'array';
		};
		
		/**
		 * Returns true if the array has 
		 * given value
		 *
		 * @param mixed
		 * @param bool
		 */
		public.has = function(value) {
			return this.data.indexOf(value) !== -1;
		};
		
		/**
		 * Returns the index of where in
		 * the array the value is found
		 *
		 * @param mixed
		 * @return number
		 */
		public.indexOf = function(value) {
			return this.data.indexOf(value);
		}
		
		/**
		 * Join array elements with a string
		 *
		 * @param string
		 * @param array
		 * @return string
		 */
		public.implode = public.join = function(delimeter) {
			return $.load('string', this.data.join(delimeter));
		}
		
		/**
		 * Returns true if empty
		 * 
		 * @return bool
		 */
		public.isEmpty = function() {
			return this.data.length === 0;
		};
		
		/**
		 * Returns a list of keys
		 *
		 * @return array
		 */
		public.keys = function() {
			var keys = definition.load();
			
			//now parse through each item
			this.each(function(key) {
				keys.push(key);
			});
			
			return keys;
		};
		
		/**
		 * Returns the last index of where in
		 * the array the value is found
		 *
		 * @param mixed
		 * @return number
		 */
		public.lastIndexOf = function(value) {
			return this.data.lastIndexOf(value);
		}
		
		/**
		 * Custom map loop that handles 
		 * scopes and extra arguments
		 *
		 * @param function
		 * @param [mixed[,mixed..]]
		 * @return this
		 */
		public.map = function(callback) {
			//get the dynamic arguments
			var self = this, args = $.args();
			
			//take the object out of the original arguments
			object = args.shift();
			
			//alter the callback casing 
			//for scopes and extra arguments
			callback = $.alter(callback, args);
			
			//now parse through each item
			this.each(function(key, value) {
				self.data[key] = callback.call(self, key, value);
			});
			
			return this;
		};
		
		/**
		 * Sorts array by natural sort
		 *
		 * @return this
		 */
		public.natsort = function() {
			this.data.sort(function(a, b) {
				a += '';
				b += '';
				
				if(a < b) {
					return -1;
				} 
				
				if(a > b) {
					return 1;
				} 
				
				return 0;
			});
			
			return this;
		};
		
		/**
		 * Pops array from the stack
		 *
		 * @return mixed
		 */
		public.pop = function() {
			return this.data.pop();
		};
		
		/**
		 * Pushes array into the stack
		 *
		 * @param mixed
		 * @return this
		 */
		public.push = function(value) {
			this.data.push(value);
			return this;
		};
		
		/**
		 * Reverses the array
		 *
		 * @return this
		 */
		public.reverse = function() {
			this.data.reverse();
			return this;
		};
		
		/**
		 * Picks from chosen slice and returns a new array
		 *
		 * @param num
		 * @param [num]
		 * @return Eden.Array
		 */
		public.slice = function() {
			var data = this.data.slice.apply(this.data, arguments);
			return definition.load(data);
		};
		
		/**
		 * Adds/removes items to/from an array, 
		 * and returns the removed item(s)
		 *
		 * @param num
		 * @param num
		 * @param [mixed[,mixed..]]
		 * @return Eden.Array
		 */
		public.splice = function() {
			var data = this.data.splice.apply(this.data, arguments);
			return definition.load(data);
		};
		
		/**
		 * Sorts an array
		 *
		 * @param [callback]
		 * @return this
		 */
		public.sort = function() {
			this.data.sort.apply(this.data, arguments);
			return this;
		};
		
		/**
		 * Returns the array size
		 *
		 * @return number
		 */
		public.size = function() {
			return this.data.length;
		};
		
		/**
		 * Converts array to query string
		 *
		 * @return string
		 */
		public.toQuery = function(prefix) {
			var value, query = [];
			
			this.each(function(key, value) {
				if(prefix) {
					key = prefix + '[' + key + ']';
				}
				
				var edenized = $.edenize(value, ['hash', 'array']);
				
				if(edenized) {
					query.push(edenized.toQuery(key).get());
					return;
				}
				
				query.push(key + '=' + encodeURIComponent(value));
			}, this);
			
			return $.load('string', query.join('&'));
		};
		
		/**
		 * Converts array to string
		 *
		 * @return string
		 */
		public.toString = function() {
			return JSON.stringify(this.get());
		};
		
		/**
		 * Unshifts array into the stack
		 *
		 * @param mixed
		 * @return this
		 */
		public.unshift = function(value) {
			this.data.unshift(value);
			return this;
		};
		
		/**
		 * Returns a list of values
		 *
		 * @return array
		 */
		public.values = function() {
			var values = definition.load();
			
			//now parse through each item
			this.each(function(key, value) {
				values.push(value);
			});
			
			return values;
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	definition.isArray = function(value) {
		return value instanceof Array;
	};
	
	definition.injectSuper = function() {
		$.array = { isArray: this.isArray };
		
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
			
			$.array[method] = wrapper(method);
		}
		
		return this;
	};
	
	return definition.injectSuper();
};