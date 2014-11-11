jQuery.eve.base.define(function() {
	this.File = jQuery.classified(function() {
		/* Require
		-------------------------------*/
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this.path = null;
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		this.___construct = function(path) {
			this.path = path;
		};
		
		/* Public.Methods
		-------------------------------*/
		/**
		 * Returns the base name of the file
		 *
		 * @return string
		 */
		this.getBase = function() {
			return this.getName().split('.')[0];
		};
		
		/**
		 * Returns file content
		 *
		 * @param function
		 * @return this
		 */
		this.getContent = function(callback) {
			callback = callback || jQuery.noop;
			
			if(!this.isFile()) {
				callback('404 File ' + this.path + ' not found.', null);
				return this;
			}
			
			require(['text!' + this.path], function(content) {
				callback(null, content);
			});
			
			return this;
		};
		
		/**
		 * Returns JSON data in file
		 *
		 * @param function
		 * @return this
		 */
		this.getData = function(callback) {
			callback = callback || jQuery.noop;
			
			if(!this.isFile()) {
				callback('404 Folder ' + this.path + ' not found.', null);
				return this;
			}
			
			this.getContent(function(error, content) {
				//if there are errors
				if(error) {
					callback(error);
					return;
				}
				
				callback(null, JSON.parse(content));
			});
			
			return this;
		};
		
		/**
		 * Returns the file extension
		 *
		 * @return string
		 */
		this.getExtension = function() {
			return this.getName().split('.')[1];
		};
		
		/**
		 * Returns file mime type
		 *
		 * @return string
		 */
		this.getMime = function() {
			var extension = this.getExtension() || 'exe';
			
			return __mimeTypes[this.getExtension()] 
			? __mimeTypes[this.getExtension()] 
			: 'application/octet-stream';
		};
		
		/**
		 * Returns the folder path
		 *
		 * @return string
		 */
		this.getParent = function(index) {
			index = index || 0;
			
			var i = 0, pathArray = this.path.split('/');
			
			do {
				pathArray.pop();
				i++;
			} while(i < index);
			
			return pathArray.join('/');
		};
		
		/**
		 * Returns just the file name
		 *
		 * @return string
		 */
		this.getName = function() {
			return this.path.split('/').pop();
		};
		
		/**
		 * Returns true if the file is a real file in the system
		 *
		 * @return bool
		 */
		this.isFile = function() {
			return jQuery.eve.map.indexOf(this.path) !== -1;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	});
});