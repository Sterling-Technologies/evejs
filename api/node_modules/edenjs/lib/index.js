module.exports = function() {
	var c = function() {}, public = c.prototype;
	
	/* Properties
	-------------------------------*/
	var _cache	= {};
        var _crypto	= require('crypto');
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		if(!this.__instance) {
			this.__instance = new c();
			this.__instance.get('string');
			this.__instance.get('number');
			this.__instance.get('array');
			this.__instance.get('hash');
			this.__instance.get('time');
		}
		
		if(arguments.length == 0) {
			return this.__instance;
		}
		
		if(arguments.length == 1) {
			var edenized = this.__instance.edenize(arguments[0]);
		
			if(edenized) {
				return edenized;
			}
		}
		
		return this.__instance.load.apply(this.__instance, arguments);
	};
	
	/* Construct
	-------------------------------*/
	/* Utility Methods
	-------------------------------*/
	/**
	 * No operation
	 *
	 * @return void
	 */
	public.noop = function() {};
	
	/**
	 * Alters a function to bind 
	 * a scope and add extra arguments
	 *
	 * @param function*
	 * @param object* scope
	 * @param [mixed[,mixed..]]
	 * @return function
	 */
	public.alter = function(callback, scope) {
		//get arguments
		var self = this, args = this.args();
		
		//take the callback and the scope
		//out of the arguments
		callback 	= args.shift(),
		scope 		= args.shift();
		
		//we are returning a function
		return function() {
			//get the active arguments
			var i, original = self.args();
			
			//add the extra arguments to the
			//original list of arguments
			for(i = 0; i < args.length; i++) {
				original.push(args[i]);
			}
			
			//now call the intended function with bounded arguments
			return callback.apply(scope || this, original);
		};
	};
	
	/**
	 * Returns an array form of arguments
	 *
	 * @return array
	 */
	public.args = function() {
		return Array.prototype.slice.apply(arguments.callee.caller.arguments);
	};
	
	/**
	 * All edens have load methods
	 *
	 * @param mixed
	 * @return bool 
	 */
	public.isEden = function(value) {
		return value && typeof value.__load == 'function';
	};
	
	/**
	 * Attemps to edenize a value
	 * false will be returned if fail
	 *
	 * @param mixed
	 * @param array
	 * @return mixed
	 */
	public.edenize = function(value, types) {
		var i, type;
		types = types || [];
		
		//if it's any type of eden
		if(this.isEden(value)) {
			// and there's no type
			// or there's a getType
			// and type is in the valid type
			if(types.length === 0 
			|| (typeof value.getType == 'function'
			&& types.indexOf(value.getType()) !== -1)) {
				//return it
				return value;
			}
			
			return false;
		}
		
		//if array is a valid type
		if(types.length === 0 || types.indexOf('array') !== -1) {
			type = this.get('array');
			//if value is an array
			if(type.isArray(value)) {
				//edenize it
				return type.load(arguments[0]);
			}
		}
		
		//if hash is a valid type
		if(types.length === 0 || types.indexOf('hash') !== -1) {
			type = this.get('hash');
			//if value is an array
			if(type.isHash(value)) {
				//edenize it
				return type.load(arguments[0]);
			}
		}
		
		//if string is a valid type
		if(types.length === 0 || types.indexOf('string') !== -1) {
			type = this.get('string');
			//if value is an array
			if(type.isString(value)) {
				//edenize it
				return type.load(arguments[0]);
			}
		}
		
		//if number is a valid type
		if(types.length === 0 || types.indexOf('number') !== -1) {
			type = this.get('number');
			//if value is an array
			if(type.isNumber(value)) {
				//edenize it
				return type.load(arguments[0]);
			}
		}
		
		//we failed :(
		return false;
	};
	
	/**
	 * Returns a base 51 unique id
	 *
	 * @param string
	 * @return string
	 */
	public.uid = function(offset) {
		var getChar = function(number) {
			number = number.toString();

			var bytes 	= [];
			var base	= 51;
			var chars	= 'abcdefghijklmnopqrstuvxyz'+
						  'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

			bytes.push(chars[Math.floor(parseInt(number) / base)] || '');
			for(var prev, byte, i = number.length - 1; i >= 0; i -= 2) {
				prev = number[i-1] || '0';
				byte = prev+number[i];
				bytes.push(chars[Math.floor(byte / base)]);
				bytes.push(chars[(byte % base)]);
			}

			return bytes.join('');
		};

		offset = offset || '';

		if(typeof offset == 'string') {
			offset = getChar(offset);
		}

		if(offset && (''+offset).length > 0) {
			offset += 'w';
		}

		return 	offset +  getChar((new Date()).getTime()) + 'w' +
				getChar(Math.floor(Math.random() * 1000));
	};	
        
	/**
	* Generates a version 4 or 5 UUID.
	* 
	* @param mixed
	* @return string
	*/
	public.uuid = function(str) {
		var buffer;
		var version;

		if (str === undefined) {
			version = 0x40; // version 4
			buffer = _crypto.randomBytes(16); // crypto random bytes
		} else if (typeof str !== 'string') {
			throw new TypeError('First argument needs to be a string or undefined.');
		} else {
			version = 0x50; // version 5

			// digest the selected hash algorithm
			var hashAlgorithm = _crypto.createHash('sha1');
			buffer = hashAlgorithm.update(str).digest();
		}

		// read the buffers as 8-bit signed integer
		var data = [];
		for (var idx = 0; idx < 16; idx++) {
			data.push(buffer.readInt8(idx));
		}

		data[6] &= 0x0f; // clear version
		data[6] |= version; // set the version
		data[8] &= 0x3f; // clear variant
		data[8] |= -0x80; // set to IETF variant (8, 9, A or B)

		// creates a empty buffers
		var msb = new Buffer(8);
		var lsb = new Buffer(8);

		// alternate algorithm using hex pushing rather than binary shifting
		for (var idx = 0; idx < 8; idx++) {
			for (var sIdx = idx; sIdx > 0; sIdx--) {
				msb[8 - (sIdx + 1)] = msb[8 - sIdx];
			}

			msb[7] = data[idx] & 0xff;
		}

		for (var idx = 8; idx < 16; idx++) {
			for (var sIdx = idx; sIdx > 8; sIdx--) {
				lsb[16 - (sIdx + 1)] = lsb[16 - sIdx];
			}

			lsb[7] = data[idx] & 0xff;
		}

		// UUID Pattern:
		// xxxxxxxx-xxxx-xxxx-yyyy-yyyyyyyyyyyy
		// where x = most sigbits and y = least sigbits
		var uuid = '';
		uuid += msb.toString('hex', 0, 4);
		uuid += '-';
		uuid += msb.toString('hex', 4, 6);
		uuid += '-';
		uuid += msb.toString('hex', 6, 8);
		uuid += '-';
		uuid += lsb.toString('hex', 0, 2);
		uuid += '-';
		uuid += lsb.toString('hex', 2, 8);

		return uuid;
	};
	
	/* Class Methods
	-------------------------------*/
	/**
	 * Loads a file and calls it passing arguments
	 *
	 * @param [mixed[,mixed..]]
	 * @return object
	 */
	public.load = function() {
		//get arguments
		var args = this.args();
		
		//remove the key from the arguments
		var key = args.shift();
		
		var definition = this.get(key);
		
		//if there is a loader
		if(typeof definition.load == 'function') {
			//call that loader
			return definition.load.apply(definition, args);
		}
		
		//call that function
		return definition.apply(definition, args);
	};
	
	/**
	 * Loads a file
	 *
	 * @param string
	 * @return function
	 */
	public.get = function(key) {
		//if there is no cache with key set
		if(!_cache[key]) {
			//get the file, *it should be a function
			_cache[key] = require('./'+key+'.js').call(this, this);
		}
		
		return _cache[key];
	};
	
	/**
	 * Returns an inherited class definition
	 *
	 * @param object|function[,object|function..]
	 * @return function
	 */
	public.define = function() {
		var i, key, source, public, 
			self 		= this, 
			define 		= arguments.callee,
			parents 	= {}, 
			hasParents	= false,
			destination = function() {
				//if there is a constructor
				if(toString.call(this.__construct) === '[object Function]') {
					//call it blindly passing the arguments
					this.__construct.apply(this, arguments);
				}
			};
		
		//loop through the arguments
		for(i = 0; i < arguments.length; i++) {
			source = arguments[i];
			
			//if source is a function
			if(typeof source == 'function') {
				//if the source has empty prototype
				//it means that it is not a class 
				//and should be called
				//Note: constructor is always apart of a prototype object
				if(Object.getOwnPropertyNames(source.prototype).length <= 1) {
					//call it
					public = {};
					source = source(public);
					if(!source) {
						source = public;
					}
				//just give the prototype
				} else {
					source = Object.create(source.prototype);
				}
			}
			
			//if source is not an object
			if(typeof source != 'object') {
				//skip it
				continue;
			}
			
			//send source to destination
			for(key in source) {
				//if the source is a function and the destination is a function
				if(toString.call(source[key]) === '[object Function]'
				&& toString.call(destination.prototype[key]) === '[object Function]') {
					//remember the parent
					parents[key] = destination.prototype[key];
					hasParents = true;
				}
				
				destination.prototype[key] = source[key];
			}
		}
		
		//if there is a loader
		if(toString.call(destination.prototype.__load) === '[object Function]') {
			//set the loader
			destination.load = destination.prototype.__load;
		}
		
		destination.extend = function() {
			//make args into an array
			var args = Array.prototype.slice.apply(arguments);
			
			//unshift in the prototype
			args.unshift(this.prototype);
			
			//generate the class
			return define.apply(self, args);
		};
		
		//if it doesn't have parents
		if(!hasParents) {
			//there's no need to alter functions
			return destination;
		}
		
		//parse destination
		for(key in destination.prototype) {
			//if it's not a function
			if(toString.call(destination.prototype[key]) !== '[object Function]') {
				continue;
			}
			
			//We do it this way to capture closure variables that 
			//changes inside of a loop. Inside of the alter callback
			//we do not want to reference variables outside of the closure
			destination.prototype[key] = function(callback) {
				return function() {
					//remember the scope
					var self = this;
					
					//make the magic parent variable an object
					this.__parent = {};
					
					//again we need to set the parents up
					//everytime we call this method
					for(key in parents) {
						//the new callback simply applies
						//the original scope
						this.__parent[key] = function() {
							return parents[key].apply(self, arguments);
						};	
					}
					
					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					results = callback.apply(this, arguments);
					
					//remove parent
					delete this.__parent;
					
					return results;
				};
			} (destination.prototype[key]);
		}
		
		//and let it go
		return destination;
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load; 
}();