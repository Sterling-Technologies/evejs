module.exports = function() {
	var c = function() {}, public = c.prototype;
	
	/* Properties
	-------------------------------*/
	var _cache	= {};
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		if(!this.__instance) {
			this.__instance = new c();
		}
		
		if(arguments.length == 0) {
			return this.__instance;
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
	 * Returns an array form of arguments
	 *
	 * @return array
	 */
	public.args = function() {
		return Array.prototype.slice.apply(arguments.callee.caller.arguments);
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