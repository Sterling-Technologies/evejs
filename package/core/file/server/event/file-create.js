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
			var id   = new objectId(), meta = { active : true };

			//setup the gridstore	
			(new gridStore(
				database, id, name, 
				'w+', { root: 'file', metadata : meta })
			).open(function(error, store) {
				//if there are errors
				if(error) {
					//trigger an error
					return controller.trigger('file-create-error', error);
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
					return controller.trigger('file-create-error', error);
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
			//we are good to close the store
			//this will actually save the
			//file / record to mongo
			store.close(function(error, data) {
				//if there is an error
				if(error) {
					return controller.trigger('file-create-error', error);
				}

				//push the newly created file(s)
				files.push(data);
				next(files);
			});
		});
	})
	//when we are done getting everything
	.on('complete', function(query) {
		//queue sequence
		sequence.then(function(files, next) {
			//trigger that we are good
			controller.trigger('file-create-success', files);
			next();
		});
	})
	//let's start it up
	.start();
};