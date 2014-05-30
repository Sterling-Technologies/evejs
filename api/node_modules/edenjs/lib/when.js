module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.condition = true;
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(condition) {
			return new this(condition);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(condition) {
			if(typeof condition == 'function') {
				condition = condition();
			}
			
			this.condition = !!condition;
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Cases for both conditions to be true
		 *
		 * @return this
		 */
		public.and = function(condition) {
			if(typeof condition == 'function') {
				condition = condition();
			}
			
			this.condition = this.condition && !!condition;
			return this;
		};
		
		/**
		 * Returns the condition
		 *
		 * @return bool
		 */
		public.get = function() {
			return this.condition;
		};
		
		/**
		 * Cases for one condition to be true
		 *
		 * @return this
		 */
		public.or = function(condition) {
			if(typeof condition == 'function') {
				condition = condition();
			}
			
			this.condition = this.condition || !!condition;
			return this;
		};
		
		/**
		 * Link up with sequence
		 *
		 * @return Eden.sequence
		 */
		public.sequence = function(callback) {
			return $.load('sequence').then(callback);
		};
		
		/**
		 * if condition is true then execute callback
		 *
		 * @return mixed
		 */
		public.then = function(callback, andReturn) {
			if(this.condition && andReturn) {
				return callback();
			}
			
			if(this.condition) {
				callback();
				return this;
			}
			
			if(!!andReturn) {
				return false;
			}
			
			return this;
		};
		
		/* Private Methods
		-------------------------------*/
	});
};