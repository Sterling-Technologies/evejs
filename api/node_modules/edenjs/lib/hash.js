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
			
			if(!this.isHash(data)) {
				data = {};
			}
			
			return new this(data);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(data) {
			this.data = data || {};
		};
		
		/* Public Methods
		-------------------------------*/
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
					continue;
				}
				
				//if it's any type of eden
				if($.isEden(data[i]) 
				&& typeof data[i].get == 'function') {
					//make it natural
					data[i] = data[i].get();
				}
				
				for(j in arguments[i]) {
					this.data[j] = arguments[i][j];
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
			var key, args = $.args();
			
			//alter the callback casing 
			//for scopes and extra arguments
			callback = $.alter.apply($, args);
			
			//now parse through each item
			for(key in this.data) {
				if(typeof this.data[key] == 'function') {
					continue;
				}
				
				//if the callback is false
				if(callback.call(this, key, this.data[key]) === false) {
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
			var i, raw = {};
			
			this.each(function(key, value) {
				raw[key] = value;
			});
			
			return raw;
		};
		
		/**
		 * Get Type
		 *
		 * @return string
		 */
		public.getType = function() {
			return 'hash';
		};
		
		/**
		 * Returns true if the array has 
		 * given value
		 *
		 * @param mixed
		 * @param bool
		 */
		public.has = function(value) {
			return !this.each(function(key, test) {
				return !(test === value);
			});
		};
		
		/**
		 * Returns the index of where in
		 * the array the value is found
		 *
		 * @param mixed
		 * @return number
		 */
		public.indexOf = function(value) {
			var index = false;
			
			this.each(function(key, val) {
				if(val == value) {
					index = key;
					return false;
				}
			});
			
			return index;
		}
		
		/**
		 * Join array elements with a string
		 *
		 * @param string
		 * @param array
		 * @return string
		 */
		public.implode = public.join = function(delimeter) {
			return $.load('string', this.values().join(delimeter));
		};
		
		/**
		 * Returns true if empty
		 * 
		 * @return bool
		 */
		public.isEmpty = function() {
			return this.size() === 0;
		};
		
		/**
		 * Returns a list of keys
		 *
		 * @return array
		 */
		public.keys = function() {
			var keys = $.load('array');
			
			//now parse through each item
			this.each(function(key) {
				keys.push(key);
			});
			
			return keys;
		};
		
		/**
		 * sorts hash by key
		 *
		 * @return this
		 */
		public.ksort = function() {
			return this.sort(function(a, b) {
				if(a.key < b.key) {
					return -1;
				}
				
				if(a.key > b.key) {
					return 1;
				}
				
				return 0;
			});
		};
		
		/**
		 * reverse sorts hash by key
		 *
		 * @return this
		 */
		public.krsort = function() {
			return this.sort(function(a, b) {
				if(a.key < b.key) {
					return 1;
				}
				
				if(a.key > b.key) {
					return -1;
				}
				
				return 0;
			});
		};
		
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
			this.each(function(key, row) {
				self.data[key] = callback.call(self, key, row);
			});
			
			return this;
		};
		
		/**
		 * Rearranges objects where keys are natural sorted
		 *
		 * @return this
		 */
		public.natksort = function() {
			var self = this, data = {};
			
			this.keys().natsort().each(function(key, value) {
				data[value] = self.data[value];
			});
			
			this.data = data;
			
			return this;
		};
		
		/**
		 * Sorts array by natural sort
		 *
		 * @return this
		 */
		public.natsort = function() {
			this.sort(function(a, b) {
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
		 * Reverse sorts a hash with respect to its keys
		 *
		 * @return this
		 */
		public.reverse = function() {
			return this.sort(function(a, b) {
				if(a.value < b.value) {
					return 1;
				}
				
				if(a.value > b.value) {
					return -1;
				}
				
				return 0;
			});
		};
		
		/**
		 * Pushes a key to value
		 *
		 * @param scalar
		 * @return this
		 */
		public.set = function(key, value) {
			this.data[key] = value;
			return this;
		};
		
		/**
		 * Returns the size of the object
		 *
		 * @return number
		 */
		public.size = function() {
			var length = 0;
			
			this.each(function() {
				length++;
			});
			
			return length;
		};
		
		/**
		 * Sorts a hash with respect to its keys
		 *
		 * @param [callback]
		 * @return this
		 */
		public.sort = function(callback) {
			var i, data = {}, sorted = [];
			this.each(function(k, v) {
				sorted.push({ key: k, value: v });
			});
			
			callback = callback || function(a, b) {
				if(a.value < b.value) {
					return -1;
				}
				
				if(a.value > b.value) {
					return 1;
				}
				
				return 0;
			};
			
			sorted.sort(callback);
			
			for(i = 0; i < sorted.length; i++) {
				data[sorted[i].key] = sorted[i].value;
			}
			
			this.data = data;
			
			return this;
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
		 * Returns a list of values
		 *
		 * @return array
		 */
		public.values = function() {
			var values = $.load('array');
			
			//now parse through each item
			this.each(function(key, value) {
				values.push(value);
			});
			
			return values;
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	definition.isHash = function(value) {
		return toString.call(value) === '[object Object]'
			&& value.constructor === Object 
			&& !value.nodeType 
			&& !value.setInterval;
	};
	
	definition.injectSuper = function() {
		$.hash = { isHash: this.isHash };
		
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
			
			$.hash[method] = wrapper(method);
		}
		
		return this;
	};
	
	return definition.injectSuper();
};