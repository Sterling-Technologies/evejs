module.exports = function($) {
	var c = this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		var _fs 			= require('fs');
		var _readSequence 	= $.load('sequence');
		var _readCache 		= {};
		
		/* Loader
		-------------------------------*/
		public.__load = function(path) {
			return new this(path);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(path) {
			//Argument Test
			$.load('argument').test(1, 'string');
			
			this.path = path;
			this.stat = null;
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Copy folder to path
		 *
		 * @param string
		 * @return this
		 */
		public.copy = function(destinationRoot, callback) {
			//Argument Test
			$.load('argument')
				.test(1, 'string')
				.test(2, 'function', 'undefined');
			
			//defaults
			var mode 	= 0755;//this.getPermissions();
			callback 	= callback 	|| $.noop;
			
			//if the folder does not exist
			if(!this.isFolder()) {
				callback('404 Folder not found.');
				//do nothing
				return this;
			}
			
			//we need to remember the source root
			var self = this, sourceRoot = this.path;
			
			//get all the source files	
			this.getFiles(null, true, function(files) {
				//use sequence
				var sequence = $.load('sequence');
				//loop through files
				for(var destination, i = 0; i < files.length; i++) {
					//determine the destination
					destination = destinationRoot + files[i].path.substr(sourceRoot.length);
					
					//queue sequence, bind variables
					sequence.then((function(to, file) {
						return function(next) {
							//copy to that destination
							file.copy(to, function() {
								next();
							});	
						};
					})(destination, files[i]));			
				}
			
				//get all the source folders
				self.getFolders(null, true, function(folders) {
					//loop through files
					for(var i = 0; i < folders.length; i++) {
						//change the folder path to the destination
						folders[i].path = destinationRoot + folders[i].path.substr(sourceRoot.length);
						
						//queue sequence, bind variables
						sequence.then((function(folder) {
							return function(next) {
								//make the directory
								folder.mkdir(mode, function() {
									next();
								});	
							};
						})(folders[i]));		
					}
					
					sequence.then(function(next) {
						callback();
						next();
					});
				});
			});
			
			return this;
		};
		
		/**
		 * Returns the files
		 *
		 * @return string
		 */
		public.getFiles = function(regex, recursive, callback) {
			//Argument Test
			$.load('argument')
				.test(1, 'regex', 'null', 'undefined')
				.test(2, 'bool', 'undefined')
				.test(3, 'function', 'undefined');
			
			//defaults
			regex 		= regex 	|| null;
			recursive 	= recursive || false;
			callback 	= callback 	|| $.noop;
			
			//if the folder does not exist
			if(!this.isFolder()) {
				callback([]);
				//do nothing
				return this;
			}
			
			var self = this, 
				files = [], 
				sequence = $.load('sequence');
			
			//now get everything inside the folder
			_readdir(this.path, function(error, items) {
				if(error) {
					throw error;
				}
				
				//loop through the items
				for(var isFolder, i = 0; i < items.length; i++) {
					try {
						isFolder = !_fs.lstatSync(self.path + '/' + items[i]).isFile();
					} catch(e) {
						continue;
					}
					
					//is it a directory?
					if(isFolder && !recursive) {
						continue;
					} 
					
					if(isFolder) {
						//recurse here.
						sequence.then((function(item) {
							return function(next) {
								c.load(self.path + '/' + item)
								.getFiles(regex, recursive, 
								function(subFiles) {
									//if theres something
									if(subFiles.length) {
										files = files.concat(subFiles);
									}
									
									next();
								});
							};
						})(items[i]));
						
						continue;
					}
					
					//at this point the item is a file
					
					//does it match the regex
					if(regex && !regex.test(items[i])) {
						//skip it
						continue;
					}	
					
					files.push($.load('file', self.path + '/' + items[i]));
				}
				
				//lastly queue up the callback call
				sequence.then(function(next) {
					callback(files);
					next();
				});
			});
			
			return this;
		};
		
		/**
		 * Returns the folders in the path
		 *
		 * @return string
		 */
		public.getFolders = function(regex, recursive, callback) {
			//Argument Test
			$.load('argument')
				.test(1, 'regex', 'null', 'undefined')
				.test(2, 'bool', 'undefined')
				.test(3, 'function', 'undefined');
				
			//defaults
			regex 		= regex 	|| null;
			recursive 	= recursive || false;
			callback 	= callback 	|| $.noop;
			
			//if this is not a folder
			if(!this.isFolder()) {
				callback([]);
			}
			
			var self = this, 
				folders = [], 
				sequence = $.load('sequence');
				
			//now get everything inside the folder
			_readdir(this.path, function(error, items) {
				if(error) {
					throw error;
				}
				
				//loop through the items
				for(var isFolder, i = 0; i < items.length; i++) {
					try {
						isFolder = !_fs.lstatSync(self.path + '/' + items[i]).isFile();
					} catch(e) {
						continue;
					}
					
					//if this is not a folder 
					if(!isFolder) {
						//skip it
						continue;
					} 
					
					//at this point, it is a folder
					
					//should we recurse?
					if(recursive) {
						//recurse here.
						sequence.then((function(item) {
							return function(next) {
								c.load(self.path + '/' + item)
								.getFolders(regex, recursive, 
								function(subFolders) {
									//if theres something
									if(subFolders.length) {
										folders = folders.concat(subFolders);
									}
									
									next();
								});
							};
						})(items[i]));
					}
					
					//does it match the regex
					if(regex && !regex.test(items[i])) {
						//skip it
						continue;
					}	
					
					folders.push($.load('folder', self.path + '/' + items[i]));
				}
				
				//lastly queue up the callback call
				sequence.then(function(next) {
					callback(folders);
					next();
				});
			});
			
			return this;
		};
		
		/**
		 * Returns just the file name
		 *
		 * @return string
		 */
		public.getName = function() {
			return this.path.split('/').pop();
		};
		
		/**
		 * Returns the folder path
		 *
		 * @return string
		 */
		public.getParent = function(index) {
			//Argument Test
			$.load('argument').test(1, 'int', 'undefined');
			
			index = index || 0;
			
			var i = 0, pathArray = this.path.split('/');
			
			do {
				pathArray.pop();
				i++;
			} while(i < index);
			
			return pathArray.join('/');
		};
		
		/**
		 * Returns numeric permissions
		 *
		 * @return number
		 */
		public.getPermissions = function() {
			try {
				return parseInt((_getStat.call(this).mode & parseInt ("777", 8)).toString(8));
				
			} catch(e) {}
			
			return 0;
		};
		
		/**
		 * Returns the last updated time in unix format
		 *
		 * @return number
		 */
		public.getTime = function() {
			try {
				return _getStat.call(this).mtime.getTime();
			} catch(e) {}
			
			return 0;
		};
		
		/**
		 * Returns true if the path is a real folder in the system
		 *
		 * @return bool
		 */
		public.isFolder = function() {
			try {
				return _getStat.call(this).isDirectory();
			} catch (e) {}
			
			return false;
		};
		
		/**
		 * Create folder with the specified path
		 *
		 * @param callback
		 * @return this
		 */
		public.mkdir = function(mode, callback) {
			//Argument Test
			$.load('argument')
				.test(1, 'int', 'null', 'undefined')
				.test(2, 'function', 'undefined');
			
			if(typeof mode == 'function') {
				callback = mode;
				mode = 0755;
			}
			
			mode 		= mode || 0755;
			callback 	= callback || $.noop;
			
			//is this a folder already ?
			if(this.isFolder()) {
				//call the callback if applicable
				callback && callback();
				
				//do nothing more
				return this;
			}
			
			var self = this;
				
			//try to make the directory
			_fs.mkdir(this.path, mode, function(error) {
				//if the error is that the parent does not exist
				if(error && error.errno == 34) {
					//make the directory parent
					//NOTE: should recursively traverse backwards
					c.load(self.getParent()).mkdir(mode, function(error) {
						//the parent directory should be made
						//now make the directory
						_fs.mkdir(self.path, mode, callback);
					});
					
					return;
				}
				
				//the directory was made
				//so call the call back
				callback(error);
			});
			
			return this;
		};
		
		/**
		 * Removes the folder
		 *
		 * @return this
		 */
		public.remove = function(callback) {
			//Argument Test
			$.load('argument').test(1, 'function', 'undefined');
			
			//defaults
			callback = callback || $.noop;
			
			//if the folder does not exist
			if(!this.isFolder()) {
				callback();
				//do nothing
				return this;
			}
			
			var self = this;
			
			//remove all files
			this.getFiles(null, false, function(files) {
				//use sequence
				var sequence = $.load('sequence');
				//loop through files
				for(var i = 0; i < files.length; i++) {
					//queue to remove
					sequence.then((function(file){
						return function(next) {
							file.remove(function() {
								next();
							});
						};
					})(files[i]));
				}
				
				//next get folders
				self.getFolders(null, true, function(folders) {
					//sort folders by length
					//we do this as a pattern that the ones with the longest names
					//is guaranteed to be longer than their parents
					folders.sort(function(a, b) {
						return b.path.length - a.path.length;
					});
					
					//loop through folders
					for(var i = 0; i < folders.length; i++) {
						//queue to swquence
						sequence.then((function(folder) {
							return function(next) {
								_fs.rmdir(folder.path, function() {	
									next();
								});
							};
						})(folders[i]));
					}
					
					//now that all the files and folders are removed
					//lets remove this folder
					sequence.then(function(next) {
						_fs.rmdir(self.path, callback);
						next();
					});
					
				});
			});
			
			return this;
		};
		
		/**
		 * Empties the contents in the given folder
		 *
		 * @return this
		 */
		public.truncate = function(callback) {
			//Argument Test
			$.load('argument').test(1, 'function', 'undefined');
			
			//defaults
			callback = callback || $.noop;
			
			//if the folder does not exist
			if(!this.isFolder()) {
				callback('404 Folder not found.');
				//do nothing
				return this;
			}
			
			var self = this;
			
			//remove all files
			this.getFiles(null, true, function(files) {
				//use sequence
				var sequence = $.load('sequence');
				//loop through files
				for(var i = 0; i < files.length; i++) {
					//queue to remove
					sequence.then((function(file){
						return function(next) {
							file.remove(function() {
								next();
							});
						};
					})(files[i]));
				}
				
				//next get folders
				self.getFolders(null, true, function(folders) {
					//sort folders by length
					//we do this as a pattern that the ones with the longest names
					//is guaranteed to be longer than their parents
					folders.sort(function(a, b) {
						return b.path.length - a.path.length;
					});
					
					//loop through folders
					for(var i = 0; i < folders.length; i++) {
						//queue to swquence
						sequence.then((function(folder) {
							return function(next) {
								_fs.rmdir(folder.path, function() {	
									next();
								});
							};
						})(folders[i]));
					}
					
					//now that all the files and folders are removed
					//lets remove this folder
					sequence.then(function(next) {
						callback();
						next();
					});
					
				});
			});
			
			return this;
		};
		
		/* Private Methods
		-------------------------------*/
		var _getStat = function() {
			if(!this.stat) {
				this.stat = _fs.lstatSync(this.path);
			}
			
			return this.stat;
		};
		
		var _readdir = function(path, callback) {
			_readSequence.then(function(path, callback, next) {
				
				if(_readCache[path]) {
					callback(null, _readCache[path]);
					next();
					return;
				}
				
				_fs.readdir(path, function(error, items) {
					//don't cache if errors
					if(!error) {
						_readCache[path] = items;
					}
					
					items = items || [];
					callback(error, items);
					next();
				});
			}.bind(this, path, callback));
		};
	});
	
	return c;
};