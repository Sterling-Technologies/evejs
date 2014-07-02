define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Files';
	public.header 		= 'Files';
	public.subheader 	= 'Repository';
	public.crumbs 		= [{ icon: 'file', label: 'Files' }];
	public.data 		= {};
	
	public.start		= 0;
	public.page 		= 1;
	public.range 		= 25;
	
	public.template 	= controller.path('file/template') + '/index.html';
	
	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};
	
	/* Construct
	-------------------------------*/
	public.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
	
	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(_setData)
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		//use a batch call
		var batch = [], query = $.getUrlQuery();
		
		//1. get the list
		batch.push({ url: _getListRequest.call(this, query) });
		
		//2. get the pusblished count
		batch.push({ url: _getActiveCountRequest.call(this, query) });
		
		//4. get the trash count
		batch.push({ url: _getTrashCountRequest.call(this, query) });
		
		//5. get all count
		batch.push({ url: _getAllCountRequest.call(this, query) });

		$.post(
			controller.getServerUrl() + '/file/batch', 
			JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
				var uploadDate = new Date(response.batch[0].results[i].uploadDate);
				var format 	   = $.timeToDate(uploadDate.getTime(), true, true);
                var size 	   = response.batch[0].results[i].length;

                if(size == 0) {
                	size = '0 B';
                } else {
                	var sizes 	  = ['B', 'KB', 'MB', 'GB'];
                	var index  	  = Math.floor(Math.log(size) / Math.log(1024));
                	size = (size / Math.pow(1024, index)).toPrecision(3) + ' ' + sizes[index];
                }

                //add it to row
				rows.push({
					id      	: response.batch[0].results[i]._id,
					filename    : response.batch[0].results[i].filename,
					mime   		: response.batch[0].results[i].contentType,
					size 		: size,
					active		: response.batch[0].results[i].metadata.active,
					created		: format });
            }
			
			var showing = query.mode || 'active';
			showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
			
			//1. List
			//2. Active Count
			//3. Trash Count
			//4. All Count
			this.data = {
				showing 	: showing,
				rows		: rows,
				mode		: query.mode || 'active',
				keyword		: query.keyword || null,
				active		: response.batch[1].results,
				trash		: response.batch[2].results,
				all			: response.batch[3].results,
				range		: this.range };
            
			next();
		}.bind(this));
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);
			
			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);
			
			next();
		}.bind(this));
	};
	
	var _listen = function(next) {
		//listen to remove restore
		$('section.file-list a.remove, section.file-list a.restore').click(function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
		});
		
		$('section.file-list tbody input[type="checkbox"]').click(function() {
			setTimeout(function() {	
				var allChecked = true;
				jQuery('tbody input[type="checkbox"]').each(function() {
					if(!this.checked) {
						allChecked = false;
					}
				});
				
				jQuery('th .checkall')[0].checked = allChecked;
			}, 1);
		});
		
		$('section.file-list a.upload-trigger').click(function() {
			$('section.file-list input.field-upload:first').click(); 	
		});
		
		$('section.file-list input.field-upload').change(function(e) {
			var files = e.target.files;
			
			for(var i = 0; i < files.length; i++) {
				// Wrap into closure, to
				// make sure that this will
				// process properly inside loop
				// because it's asynchronous :)
				(function(files, i) {
					var form = new FormData();
	        		
	        		form.append('file-' + i, files[i]);
	        		
					var ajax = new XMLHttpRequest();
					
					// Inject current file that is uploading
					ajax.upload.file = files[i];

					// Progress listerner.
					ajax.upload.addEventListener('progress', function (e) {
						var percentComplete = 0;
						if (e.lengthComputable) {
							percentComplete = Math.round(e.loaded * 100 / e.total);
						}

						// File name
						var name = ajax.upload.file.name;

						//TODO: Add to gritter
						//message: percentComplete.toString() + '%'
						controller.notify('Upload Progress (' + name + ')', 
							'Uploaded: ' + percentComplete.toString() + '%', 'info');
					}, false);
					
					//on load
					ajax.upload.addEventListener('loadend', function (e) {
					 	var name = ajax.upload.file.name;

					 	// On upload end, notify success message
						controller.notify('Success (' + name + ')', 
							'File: ' + name + ' has been successfully uploaded', 'success');
					}, false);
					
					//on error
					ajax.upload.addEventListener('error', function (e) {
						//TODO: Show error message
						//ex. There was an error attempting to upload the file.
						controller.notify('Error Uploading File(s)',
							'An error occured while uploading file(s)', 'error');
					}, false);
						
					// On cancel.
					ajax.upload.addEventListener('abort', function (e) {
						//TODO: Show abort message
						//The upload has been canceled by the user or the browser dropped the connection.
						controller.notify('Upload Aborted',
							'Upload was aborted, please check internet connection', 'error');
					}, false);
					
					// On ajax transfer done
					ajax.addEventListener('readystatechange', function() {
						if(this.readyState === 4) {
							controller.redirect('/file');
						}
					});

					ajax.open('POST', controller.getServerUrl() + '/file/create');
					
	        		ajax.send(form);
	        	})(files, i);
			}
		});
		
		next();
	};
	
	var _getListRequest = function(request) {
		var query = {};
		
		query.filter 	= request.filter 	|| {};
		query.range		= request.range 	|| this.range;
		query.start 	= request.start 	|| this.start;
		
		if(request.page) {
			query.start = (request.page - 1) * this.range;
		}
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		switch(request.mode || 'active') {
			case 'all':
				query.filter['metadata.active'] = -1;
				break;
			case 'active':
				query.filter['metadata.active'] = 1;
				break;
			case 'trash':
				query.filter['metadata.active'] = 0;
				break;
		}
		
		return '/file/list?' + $.hashToQuery(query);
	};
	
	var _getAllCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter['metadata.active'] = -1;
		
		return '/file/list?' + $.hashToQuery(query);
	};
	
	var _getActiveCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
	
		query.count = 1;
		query.filter['metadata.active'] = 1;
		
		return '/file/list?' + $.hashToQuery(query);
	};
	
	var _getTrashCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter['metadata.active'] = 0;
		
		return '/file/list?' + $.hashToQuery(query);
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 
});