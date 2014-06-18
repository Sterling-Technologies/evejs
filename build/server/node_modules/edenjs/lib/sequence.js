module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.stack 	= [];
		public.working 	= false;
		public.args 	= [];
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function() {
			this.stack 		= [];
			this.args 		= [];
		};
		
		/* Public Methods
		-------------------------------*/
		public.setScope = function(scope) {
			this.scope = scope;
			return this;
		};
		public.then = function(callback) {
			//Argument Testing
			$.load('argument').test(1, 'function');
			
			this.stack.push(callback);
			
			if(!this.working) {
				this.working = true;
				_next.apply(this, this.args);
			}
			
			return this;
		};
		
		/* Private Methods
		-------------------------------*/
		var _next = function() {
			if(!this.stack.length) {
				this.working = false;
				this.args = $.args();
				return;
			}
			
			var callback = this.stack.shift(), args = $.args();
			
			args.push(arguments.callee.bind(this));
			
			//async call
			process.nextTick(function() {
				callback.apply(this.scope || callback, args);
			}.bind(this));
		};
	});
};