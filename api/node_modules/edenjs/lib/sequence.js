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
		/* Public Methods
		-------------------------------*/
		public.then = function(callback) {
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
			
			args.push($.alter(arguments.callee, this));
			
			//async call
			process.nextTick(function() {
				callback.apply(callback, args);
			});
		};
	});
};