module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.data 		= {};
		public.callback 	= $.noop;
		
		/* Private Properties
		-------------------------------*/
		var _pattern = new RegExp('{([@$])([A-Za-z0-9:_]+)}|'
			+ '{([A-Za-z:_][A-Za-z0-9:_]*)(\s*,([\\s'
			+ '\\S]+?))?(/}|}([\\s\\S]*?){/\\3})', 'gm'); 
	
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
		 * Sets the lazy callback
		 *
		 * @param function
		 * @return this
		 */
		public.setCallback = function(callback) {
			this.callback = callback;
			return this;
		};
		
		/**
		 * Sets the data hash
		 *
		 * @param string|object
		 * @param mixed
		 * @return this
		 */
		public.setData = function(key, value) {
			if($.hash.isHash(key)) {
				this.data = key;
				return this;
			}
			
			this.data[key] = value;
			
			return this;
		};
		
		/**
		 * Renders the template considering lazy loaded
		 * binded data
		 *
		 * @param string
		 * @param function
		 * @return string
		 */
		public.render = function(template, callback) {
			var file = $.load('file', template);
			
			if(file.isFile()) {
				template = file.getContent();
			}
			
			return template.replace(_pattern, $.alter(_parser, this));
		};
		
		/* Private Methods
		-------------------------------*/
		var _parser = function() {
			var matches 	= $.args();
			var parser		= arguments.callee;
			
			//if prefix
			if(matches[1] == '$' || matches[1] == '@') {
				//if data doesn't exist
				if(!this.data[matches[2]]) {
					//check the callback
					return this.callback(matches[2], matches[1]) || '';
				}
				
				//return the existing data
				return this.data[matches[2]];
			}
			
			if(!matches[5]) {
				matches[5] = '';
			}
			
			//if suffix
			if(matches[6] == '/}') {
				//parse args
				var args = matches[5]
					.trim()
					.replace(/\s+/, ' ')
					.replace(/\,/, '')
					.replace(/\s/, '&');
				
				args = $.string.queryToHash(args);
				
				//if data doesn't exist
				if(!this.data[matches[3]]) {
					//check the callback
					return this.callback(matches[3], '$', args) || '';
				}
				
				return this.data[matches[3]];
			}
			
			if(matches[7]) {
				//parse args
				var args = matches[5]
					.trim()
					.replace(/\s+/, ' ')
					.replace(/\,/, '')
					.replace(/\s/, '&');
				
				args = $.string.queryToHash(args);
				
				if(!this.data[matches[3]]) {
					return this.callback(matches[3], '$', args) || '';
				}
				
				//if the bindings are an object
				if($.hash.isHash(this.data[matches[3]])) {
					//call the template
					return $.load('template')
						.setData(this.data[matches[3]])
						.setCallback(this.callback)
						.render(matches[7]);
				}
				
				//if binds are an array
				if($.array.isArray(this.data[matches[3]])) {
					var rows = [];
					//loop	
					$.__load(this.data[matches[3]]).each(function(i, row) {
						rows.push($.load('template')
						.setData(row)
						.setCallback(this.callback)
						.render(matches[7]));
					}, this);
				
					return rows.join('');
				}
			}
		};
	});
};