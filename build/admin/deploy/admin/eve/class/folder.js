jQuery.eve.base.define(function() {
	var Folder = this.Folder = jQuery.classified(function() {
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
		 * Returns the files
		 *
		 * @return string
		 */
		this.getFiles = function(regex, recursive, callback) {
			//defaults
			regex 		= regex 	|| null;
			recursive 	= recursive || false;
			callback 	= callback 	|| jQuery.noop;
			
			//if the folder does not exist
			if(!this.isFolder()) {
				callback('Folder does not exist', null);
				//do nothing
				return this;
			}
			
			//get files
			for(var files = [], file, i = 0; i < jQuery.eve.map.length; i++) {
				//if it does not start with the path
				if(jQuery.eve.map[i].indexOf(this.path) !== 0) {
					//skip it
					continue;
				}
				
				//if not recursive and this is not the last path
				if(!recursive && jQuery.eve.map[i].replace(this.path + '/', '').indexOf('/') !== -1) {
					//skip it
					continue;
				}
				
				//get the file name
				file = jQuery.eve.map[i].split('/').pop();
				
				//does it match the regex
				if(regex && !regex.test(file)) {
					continue;
				}
				
				files.push(jQuery.eve.base().File(jQuery.eve.map[i]));
			}
			
			callback(null, files);
			
			return this;
		};
		
		/**
		 * Returns the folders in the path
		 *
		 * @return string
		 */
		this.getFolders = function(regex, recursive, callback) {
			//defaults
			regex 		= regex 	|| null;
			recursive 	= recursive || false;
			callback 	= callback 	|| jQuery.noop;
			
			//if the folder does not exist
			if(!this.isFolder()) {
				callback('Folder does not exist', null);
				//do nothing
				return this;
			}
			
			this.getFiles(null, recursive, function(error, files) {
				for(var folders = [], folder, i = 0; i < files.length; i++) {
					folder = files[i].getParent().split('/').pop();
					
					//does it match the regex
					if(regex && !regex.test(folder)) {
						continue;
					}
					
					//if it is already in the folders list
					if(folders.indexOf(files[i].getParent()) !== -1) {
						continue;
					}
					
					folders.push(Folder(files[i].getParent()));
				}
				
				callback(null, folders);
			});
			
			return this;
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
		 * Returns the folder path
		 *
		 * @return string
		 */
		this.getParent = function(index) {
			//Argument Test
			this.argument().test(1, 'int', 'undefined');
			
			index = index || 0;
			
			var i = 0, pathArray = this.path.split('/');
			
			do {
				pathArray.pop();
				i++;
			} while(i < index);
			
			return pathArray.join('/');
		};
		
		/**
		 * Returns true if the path is a real folder in the system
		 *
		 * @return bool
		 */
		this.isFolder = function() {
			for(var i = 0; i < jQuery.eve.map.length; i++) {
				if(jQuery.eve.map[i].indexOf(this.path) === 0) {
					return true;
				}
			}
			
			return false;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	});
});