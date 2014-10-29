/**
 * Fojo - Form Object submission with a JS Object
 *
 * @version 0.0.3
 * @author Christian Blanquera <cblanquera@openovate.com>
 * @website https://github.com/cblanquera/fojo
 * @license MIT
 */
(function() {
	var fojo = function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this._data = {};
		this._url = '';
		this._method = 'POST';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/**
		 * Global event listener for the server
		 *
		 * @return this
		 */
		this.on = function(event, callback) {
			$(window).on(event, callback);
			return this;
		};
	
		/**
		 * Global event listener for the server once
		 *
		 * @return this
		 */
		this.once = function(event, callback) {
			$(window).one(event, callback);
			return this;
		};
	
		/**
		 * Stops listening to a specific event
		 *
		 * @return this
		 */
		this.off = function(event, handler) {
			if(handler) {
				$(window).unbind(event, handler);
				return this;
			}
	
			$(window).unbind(event);
			return this;
		};
		
		/**
		 * Sends this off to the server
		 *
		 * @return this
		 */
		this.send = function() {
			var i, form = new FormData();
			
			for(var name in this._data) {
				if(this._data.hasOwnProperty(name)) {
					if(this._data[name] instanceof FileList) {
						for(i = 0; i < this._data[name].length; i++) {
							form.append(name + '[' + i + ']', this._data[name][i]);
						}
						
						continue;
					}
					
					if(typeof this._data[name] === 'undefined'
					|| this._data[name] === null) {
						form.append(name, '');
						continue;
					}
					
					form.append(name, this._data[name]);
				}
			}
			
			// Need to use jquery ajax
			// so that auth can catch
			// up request, and append access
			// token into it
			$.ajax({
				url 	: this._url,
				type 	: this._method,
				// custom xhr
				xhr 	: __xhr.bind(this),
				// form data
				data  		: form,
				// disable cache
				cache 		: false,
				// do not set content type
				contentType : false,
				// do not proccess data
				processData : false,
				// on error
				error: function(xhr, status, message) {
					this.trigger('error', [message]);
				}.bind(this),
				// on success
				success : function(response) {
					this.trigger('response', [response]);
				}.bind(this) });
			
			this.trigger('start');
			
			return this;
		};
		
		/**
		 * Sets the data to be sent
		 *
		 * @param object the data
		 * @param bool is it already flattened data?
		 * @return this
		 */
		this.setData = function(data, flattened) {
			if(typeof data === 'object') {
				if(flattened) {
					this._data = data;
					return this;
				}
				
				//flatten it
				this._data = __collapse(data);
				return this;
			}
			
			if(typeof data === 'string') {
				this._data[data] = flattened;
			}
			
			return this;
		};
		
		/**
		 * Sets the request method
		 *
		 * @param string
		 * @return this
		 */
		this.setMethod = function(method) {
			this._method = method.toUpperCase();
			return this;
		};
		
		/**
		 * Sets the url to where to send this
		 *
		 * @param string
		 * @return this
		 */
		this.setUrl = function(url) {
			this._url = url;
			return this;
		};
		
		/**
		 * Global event trigger for the server
		 *
		 * @return this
		 */
		this.trigger = function() {
			$(window).trigger.apply($(window), arguments);
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
		/** 
		 * Custom XHR
		 *
		 * @return void
		 */
		var __xhr = function() {
			var self = this, jqxhr = $.ajaxSettings.xhr();

			if(jqxhr.upload) {
				// On Progress
				jqxhr.upload.addEventListener('progress', function(e) {
					var percentComplete = 0;
					if (e.lengthComputable) {
						percentComplete = Math.round(e.loaded * 100 / e.total);
					}
					
					self.trigger('progress', [percentComplete.toString()]);
				}, false);

				//on error
				jqxhr.upload.addEventListener('error', function () {
					//ex. There was an error attempting to upload the file.
					self.trigger('error', ['An error occured while submitting the form']);
				}, false);
					
				// On cancel.
				jqxhr.upload.addEventListener('abort', function () {
					//TODO: Show abort message
					//The upload has been canceled by the user or the browser dropped the connection.
					self.trigger('abort', ['Submission aborted, please check internet connection']);
				}, false);

				return jqxhr;
			}
		};
		
		/** 
		 * Flattens data for update
		 *
		 * @param object nested object
		 * @return object
		 */
		var __collapse = function(data) {
			var result = {}, recurse = function(data, property) {
				
				if (Object(data) !== data) {
					result[property] = data;
					return;
				}  
				
				if (Array.isArray(data)) {
					if (data.length == 0) {
						result[property] = [];
						return;
					}
					
					for(var i = 0;  i < data.length; i++) {
						 recurse(data[i], property ? property + '][' + i : ''+i);
					}
					
					return;
				} 
				
				if(__isNative(data)) {
					result[property] = data;
					return;
				}
				
				var isEmpty = true;
				
				for (var key in data) {
					isEmpty = false;
					recurse(data[key], property ? property + '][' + key : key);
				}
				
				if (isEmpty) {
					result[property] = {};
				}
			};
			
			recurse(data, '');
			
			return result;
		};
		
		/**
		 * Detects if value is native
		 *
		 * @param mixed
		 * @return bool
		 */
		var __isNative = function(value) {
			//do the easy ones first
			if(value === Date
			|| value === RegExp
			|| value === Math
			|| value === Array
			|| value === Function
			|| value === JSON
			|| value === String
			|| value === Boolean
			|| value === Number
			|| value instanceof Date
			|| value instanceof RegExp
			|| value instanceof Array
			|| value instanceof String
			|| value instanceof Boolean
			|| value instanceof Number) {
				return true;
			}
			
			if((/\{\s*\[native code\]\s*\}/).test('' + value)) {
				return true;
			}
			
			//see: http://davidwalsh.name/detect-native-function
			// Used to resolve the internal `[[Class]]` of values
			var toString = Object.prototype.toString;
			
			// Used to resolve the decompiled source of functions
			var fnToString = Function.prototype.toString;
			
			// Used to detect host constructors (Safari > 4; really typed array specific)
			var reHostCtor = /^\[object .+?Constructor\]$/;
			
			// Compile a regexp using a common native method as a template.
			// We chose `Object#toString` because there's a good chance it is not being mucked with.
			var reNative = RegExp('^' +
			// Coerce `Object#toString` to a string
			String(toString)
				// Escape any special regexp characters
				.replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
				// Replace mentions of `toString` with `.*?` to keep the template generic.
				// Replace thing like `for ...` to support environments like Rhino which add extra info
				// such as method arity.
				.replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
			
			var type = typeof value;
			return type === 'function'
				// Use `Function#toString` to bypass the value's own `toString` method
				// and avoid being faked out.
				? reNative.test(fnToString.call(value))
				// Fallback to a host object check because some environments will represent
				// things like typed arrays as DOM methods which may not conform to the
				// normal native pattern.
				: (value && type === 'object' && reHostCtor.test(toString.call(value))) || false;
		};
	};
	
	/* Adaptor
	-------------------------------*/
	//if AMD
	if(typeof define === 'function') {
		define(['jquery', 'classified'], function(jQuery, classified) {
			return function() {
				return classified(fojo)();
			};
		});
	//how about jQuery?
	} else if(typeof jQuery === 'function' && typeof jQuery.extend === 'function') {
		jQuery.extend({
			fojo: function() {
				return this.classified(fojo)();
			}
		});
	//ok fine lets put it in windows.
	} else if(typeof window === 'object') {
		window.fojo = function() {
			return window.classified(fojo)();
		};
	}
})();