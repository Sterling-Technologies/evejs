jQuery.extend({
	sequence: function() {
		var _args = function() {
			return Array.prototype.slice.apply(arguments.callee.caller.arguments);
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
			
			args.push(arguments.callee.bind(this));
			
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