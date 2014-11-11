module.exports = function() {
	this
	.path('file', __dirname)
	.path('file/action', __dirname + '/action')
	.path('file/event', __dirname + '/event')
	.path('file/upload', this.path('upload') + '/file');
	
	//get event path
	var events = this.package('file').path('event');
	
	//get files in the event folder
	this.Folder(events).getFiles(null, false, function(error, files) {
		//loop through files  
		for(var callback, i = 0; i < files.length; i++) {
			//accept only js
			if(files[i].getExtension() !== 'js') {
				continue;
			}
			
			//get callback
			callback = require(files[i].path);
			
			//only listen if it is a callback
			if(typeof callback !== 'function') {
				continue;
			}
			
			//now listen
			this.on(files[i].getBase(), callback);
		}
		
		//is it installed?
		this.package('file').search().setRange(1).getRow(function(error) {
			//if no table
			if(error && error.code === 'ER_NO_SUCH_TABLE') {
				console.log('\x1b[33m%s\x1b[0m', 'Installing file package ...');
				require('./install')(this.database().setup, function(error) {
					if(error) {
						console.log('\x1b[31m%s\x1b[0m', error);
						return;
					}
					
					console.log('\x1b[32m%s\x1b[0m', 'file package installed!');
				});
			} 
		}.bind(this));
	}.bind(this));
};