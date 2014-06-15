$.extend({
	sequence: function() {
		var _args = function() {
			return Array.prototype.slice.apply(arguments.callee.caller.arguments);
		};
		
		var _alter = function(callback, scope) {
			//get arguments
			var self = this, args = _args();
			
			//take the callback and the scope
			//out of the arguments
			callback 	= args.shift(),
			scope 		= args.shift();
			
			//we are returning a function
			return function() {
				//get the active arguments
				var i, original = _args();
				
				//add the extra arguments to the
				//original list of arguments
				for(i = 0; i < args.length; i++) {
					original.push(args[i]);
				}
				
				//now call the intended function with bounded arguments
				return callback.apply(scope || this, original);
			};
		};
		
		var _next = function() {
			if(!this.stack.length) {
				this.working 	= false;
				this.args 		= _args();
				return;
			}
			
			var args = this.stack.shift(), extra = _args();
			
			var callback = args.shift();
			
			for(var i = 0; i < extra.length; i++) {
				args.push(extra[i]);
			}
			
			args.push(_alter(arguments.callee, this));
			
			//async call
			callback.apply(this.scope, args);
		};
		
		return {
			stack	: [], 
			working	: false, 
			args	: [],
			scope	: {},
			
			setScope: function(scope) {
				this.scope = scope;
				return this;
			},
			
			then	: function(callback) {
				this.stack.push(_args());
				
				if(!this.working) {
					this.working = true;
					_next.apply(this, this.args);
				}
				
				return this;
			}
		};
	}
});