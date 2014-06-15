module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(data) {
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
		 * Concats objects into one
		 *
		 * @param object[,object..]
		 * @return object
		 */
		public.concat = public.merge = function() {
			//Argument Testing
			$.load('argument')
				.test(1, 'object')
				.test(2, 'object');
			
			var newObject = {}, i, j, lists = $.args();
			
			for(i = 0; i < lists.length; i++) {
				//if it is not an array or object
				if(typeof lists[i] != 'object') {
					continue;
				}
				
				for(j in arguments[i]) {
					newObject[j] = lists[i][j];
				}
			}
			
			return newObject;
		};
		
		/**
		 * Custom for each loop that handles 
		 * scopes and extra arguments
		 *
		 * @param object
		 * @param function
		 * @return bool
		 */
		public.each = function(data, callback) {
			//Argument Testing
			$.load('argument')
				.test(1, 'object')
				.test(2, 'function');
			
			//now parse through each item
			for(var key in data) {
				//if the callback is false
				if(callback(key, data[key]) === false) {
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
		 * @param object
		 * @param mixed
		 * @param bool
		 */
		public.has = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'object')
				.test(2, 'mixed');
			
			return !this.each(data, function(key, test) {
				return !(test === value);
			});
		};
		
		/**
		 * Returns the index of where in
		 * the array the value is found
		 *
		 * @param object
		 * @param mixed
		 * @return number|false
		 */
		public.indexOf = function(data, value) {
			//Argument Testing
			$.load('argument')
				.test(1, 'object')
				.test(2, 'mixed');
			
			var index = false;
			
			this.each(data, function(key, val) {
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
		 * @param object
		 * @param string
		 * @return string
		 */
		public.implode = public.join = function(data, delimeter) {
			//Argument Testing
			$.load('argument')
				.test(1, 'object')
				.test(2, 'string');
				
			return this.values(data).join(delimeter);
		};
		
		/**
		 * Returns true if empty
		 * 
		 * @param object
		 * @return bool
		 */
		public.isEmpty = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			return this.size(data) === 0;
		};
		
		/**
		 * Returns true if given is hash
		 * 
		 * @param object
		 * @return bool
		 */
		public.isHash = function(data) {
			return toString.call(data) === '[object Object]'
				&& data.constructor === Object 
				&& !data.nodeType 
				&& !data.setInterval;
		};
		
		/**
		 * Returns a list of keys
		 *
		 * @param object
		 * @return array
		 */
		public.keys = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			var keys = [];
			
			//now parse through each item
			this.each(data, function(key) {
				keys.push(key);
			});
			
			return keys;
		};
		
		/**
		 * sorts hash by key
		 *
		 * @param object
		 * @return object
		 */
		public.ksort = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			return this.sort(data, function(a, b) {
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
		 * @param object
		 * @return object
		 */
		public.krsort = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			return this.sort(data, function(a, b) {
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
		 * @param object
		 * @param function
		 * @param [mixed[,mixed..]]
		 * @return object
		 */
		public.map = function(data, callback) {
			//Argument Testing
			$.load('argument')
				.test(1, 'object')
				.test(2, 'function');
			
			//now parse through each item
			this.each(data, function(key, value) {
				data[key] = callback(key, value);
			});
			
			return data;
		};
		
		/**
		 * Rearranges objects where keys are natural sorted
		 *
		 * @param object
		 * @return object
		 */
		public.natksort = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			var sorted = {}, keys = this.keys(data);
			
			keys = $.load('array').natsort(keys);
			
			$.load('array').each(keys, function(key, value) {
				sorted[value] = data[value];
			});
			
			return sorted;
		};
		
		/**
		 * Sorts array by natural sort
		 *
		 * @param object
		 * @return object
		 */
		public.natsort = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			return this.sort(data, function(a, b) {
				aValue = a.value + '';
				bValue = b.value + '';
				
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
		 * Reverse sorts a hash with respect to its keys
		 *
		 * @param object
		 * @return object
		 */
		public.reverse = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			return this.sort(data, function(a, b) {
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
		 * Returns the size of the object
		 *
		 * @param object
		 * @return number
		 */
		public.size = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			var length = 0;
			
			this.each(data, function() {
				length ++;
			});
			
			return length;
		};
		
		/**
		 * Sorts a hash with respect to its keys
		 *
		 * @param object
		 * @param [callback]
		 * @return object
		 */
		public.sort = function(data, callback) {
			$.load('argument')
				.test(1, 'object')
				.test(2, 'function', 'undefined');
			
			callback = callback || function(a, b) {
				if(a.value < b.value) {
					return -1;
				}
				
				if(a.value > b.value) {
					return 1;
				}
				
				return 0;
			};
			
			var i, newData = {}, sorted = [];
			this.each(data, function(k, v) {
				sorted.push({ key: k, value: v });
			});
			
			sorted.sort(callback);
			
			for(i = 0; i < sorted.length; i++) {
				newData[sorted[i].key] = sorted[i].value;
			}
			
			return newData;
		};
		
		/**
		 * Converts array to query string
		 *
		 * @param object
		 * @return string
		 */
		public.toQuery = function(data, prefix) {
			//Argument Testing
			$.load('argument')
				.test(1, 'object')
				.test(2, 'string', 'undefined');
			
			var value, query = [];
			
			this.each(data, function(key, value) {
				if(prefix) {
					key = prefix + '[' + key + ']';
				}
				
				if(value instanceof Array) {
					value = $.load('hash').toQuery(value, key);
					query.push(value);
					return;
				}

				if(typeof value == 'object') {
					value = self.toQuery(value, key);
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
		 * @param object
		 * @return string
		 */
		public.toString = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			return JSON.stringify(data);
		};
		
		/**
		 * Returns a list of values
		 *
		 * @param object
		 * @return array
		 */
		public.values = function(data) {
			//Argument Testing
			$.load('argument').test(1, 'object');
			
			var values = [];
			
			//now parse through each item
			this.each(data, function(key, value) {
				values.push(value);
			});
			
			return values;
		};
		
		/* Private Methods
		-------------------------------*/
	});
};