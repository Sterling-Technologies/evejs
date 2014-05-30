module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		var _translations = {};
		
		/* Loader
		-------------------------------*/
		public.__load = function() {
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
		 * Loads the translations into memory
		 *
		 * @param object
		 * @return this
		 */
		public.set = function(translations) {
			_translations = translations;
			return this;
		};
		
		/**
		 * Returns the translated string 
		 * or the entire translation table
		 *
		 * @param string
		 * @return string|object
		 */
		public.get = function(string) {
			if(!string) {
				return _translations;
			}
			
			return this._(string);
		};
		
		/**
		 * Returns the translated string 
		 *
		 * @param string
		 * @return string|object
		 */
		public._ = function(string) {
			return _translations[string] || string;
		};
		
		/* Private Methods
		-------------------------------*/
	});
};