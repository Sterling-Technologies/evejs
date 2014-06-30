module.exports = function(controller, stream) {
	if(!stream) {
		//trigger an error
		controller.trigger('file-create-error', 'No file/s detected.');
		return;
	}
	
	var files = [], sequence = controller.eden.load('sequence');
	 
	stream
	//when we have an incoming file
	.on('file-start', function(name, mime) {
		var orm 		= require('mongoose'),
			database 	= orm.connection.db,
			gridStore	= orm.mongo.GridStore,
			objectId	= orm.mongo.ObjectID;
			
		//queue sequence
		sequence.then(function(next) {
			var id = new objectId();
			//setup the gridstore	
			(new gridStore(
				database, id, name, 
				'w+', { root: 'file' })
			).open(function(error, store) {
				//if there are errors
				if(error) {
					//trigger an error
					controller.trigger('file-create-error', error);
					return;
				}
				
				//manually set the mime 
				store.contentType = mime;
				//it is now okay to move on
				next(id, store); 
			});
		});
	})
	//when we receive chunks of that file
	.on('file-data', function(chunk) {
		//queue sequence
		sequence.then(function(chunk, id, store, next) {
			//write to the store
			store.write(chunk, function(error, store) {
				//if there are errors
				if(error) {
					//trigger an error
					controller.trigger('file-create-error', error);
					return;
				}
				
				//it is now okay to move on
				next(id, store);
			});
		//make sure to capture the chunk
		//variable for the callback
		}.bind(null, chunk));
	}) 
	//when the file is done sending
	.on('file-end', function() {
		//queue sequence
		sequence.then(function(id, store, next) {
			//push files
			files.push({
				_id		: id,
				name	: store.filename,
				mime	: store.contentType });
			
			//we are good to close the store
			store.close();
			next();
		});
	})
	//when we are done getting everything
	.on('complete', function(query) {
		//queue sequence
		sequence.then(function(next) {
			//trigger that we are good
			controller.trigger('file-create-success', files);
			next();
		});
	})
	//let's start it up
	.start();
};