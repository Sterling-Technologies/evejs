/**
 * Syncopate - Turn async to sync in JS
 *
 * @version 0.0.4
 * @author Christian Blanquera <cblanquera@openovate.com>
 * @website https://github.com/cblanquera/syncopate
 * @license MIT
 */
(function() {
	/* Definition
	-------------------------------*/
	var syncopate = function() {
		/* Constants
		-------------------------------*/
		/* Properties
		-------------------------------*/
		var methods 	= {},
			threads 	= {},
			stack		= [],
			args		= [],
			onNext 		= function() {},
			onThread 	= function() {},
			working		= false,
			scope		= methods;
		
		/* Public Methods
		-------------------------------*/
		/**
		 * API callback for connecting with larger systems.
		 * Callback will be called when next has been called.
		 * This is a sumple integration that works for client
		 * and Node without casing between the two event handlers.
		 *
		 * @param function
		 * @return this
		 */
		methods.onNext = function(callback) {
			onNext = callback;
			return this;
		};
		
		/**
		 * API callback for connecting with larger systems.
		 * Callback will be called when next has been called.
		 * This is a sumple integration that works for client
		 * and Node without casing between the two event handlers.
		 *
		 * @param function
		 * @return this
		 */
		methods.onThread = function(callback) {
			onThread = callback;
			return this;
		};
		
		/**
		 * Sets the scope for all then and thread callbacks
		 *
		 * @param object
		 * @return this
		 */
		methods.scope = function(object) {
			scope = object;
			return this;
		};
		
		/**
		 * Returns the stack 
		 *
		 * @return array
		 */
		methods.stack = function() {
			return stack;
		};
		
		/**
		 * Queues the next callback and 
		 * calls it if nothing is queued
		 *
		 * @param function
		 * @return this
		 */
		methods.then = function(callback) {
			//thread is the callback
			stack.push(callback);
			
			if(!working) {
				working = true;
				_next.apply(null, args);
			}
			
			return this;
		};
		
		/**
		 * Stores a callback for later usage
		 *
		 * @param function
		 * @return this
		 */
		methods.thread = function(name, callback) {
			threads[name] = callback;
			return this;
		};
		
		/**
		 * Returns the threads 
		 *
		 * @return array
		 */
		methods.threads = function() {
			return threads;
		};
		
		/* Private Methods
		-------------------------------*/
		var _next = function() {
			//if next was called in the callback
			//and there is no calback in the stack
			if(!stack.length) {
				//save it for now and wait for when they call then()
				working = false;
				args 	= Array.prototype.slice.apply(arguments);
				
				//it got called lets trigger
				onNext.call(scope, null, stack);
				return;
			}
			
			//next was called in the callback
			//we can just shift this out
			var callback 	= stack.shift(),
				args 		= Array.prototype.slice.apply(arguments),
				next 		= arguments.callee;
			
			args.push(next);
			
			var tick = typeof setImmediate === 'function' ? setImmediate : setTimeout;
			
			tick(function() {
				//do the callback
				callback.apply(scope, args);
			
				//it got called lets trigger
				onNext.call(scope, callback, stack);
			});		
		};
		
		_next.thread = function() {
			var args = Array.prototype.slice.apply(arguments);
			var thread = args.shift();
			
			args.push(_next);
			
			if(typeof threads[thread] === 'function') {
				var tick = typeof setImmediate === 'function' ? setImmediate : setTimeout;
				
				//async call
				tick(function() {
					//do the callback
					threads[thread].apply(scope, args);
				
					//it got called lets trigger
					onThread.call(scope, threads[thread], stack);
				});
			}
		};
		
		return methods;
	};
	
	/* Adaptor
	-------------------------------*/
	//if node
	if(typeof module === 'object' && module.exports) {
		module.exports = syncopate;
	//if AMD
	} else if(typeof define === 'function') {
		define(function() {
			return syncopate;
		});
	//how about jQuery?
	} else if(typeof jQuery === 'function' && typeof jQuery.extend === 'function') {
		jQuery.extend({ syncopate: syncopate });
	//ok fine lets put it in windows.
	} else if(typeof window === 'object') {
		window.syncopate = syncopate;
	}
})();