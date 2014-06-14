!function($) {
	var eden = require('../lib/index.js');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
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
		public.testGet = function(next) {
			var tagalog = {
				'Good Bye'		: 'Pa Alam',
				'How are you?'	: 'Kumusta Ka?',
				'I am fine'		: 'Mabuti'};
			
			var translation = eden('i18n').set(tagalog).get('I am fine');

			this.assertSame('Mabuti', translation, 'Single Translation');
			
			var language = eden('i18n').set(tagalog).get();
			
			this.assertSame('Pa Alam', language['Good Bye'], 'Language Set');
			
			next();
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'i18n');
}();