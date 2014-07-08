define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data		= {};

	/* Private Properties
	-------------------------------*/
	var $ 			= jQuery;
	var selectFlag 	= false;

	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};

	/* Construct
	-------------------------------*/
	public.__construct = function() {
		this.data = {};
	};

	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(_updatePost)
			.then(_process);

		return this;
	};

	/* Private Methods
	------------------------------*/
	var selectBox = function() {
		var requestUrl = controller.getServerUrl() + '/category/list/';
		// create the initial selecbox
		var result = '<div><h6>Category</h6><div><select class="form-control" name="category">';
		var categories;

		var getCat = function() {
			// ajax request, get all category
			$.ajax({
		    	url: requestUrl,
		    	async: false,
		    	dataType: 'json',
		    	success: function(data) {
		    		categories = data.results;
		    	}
		    });
		};

		getCat();

		// create options by iterating through each category
		$.each(categories, function(key, data) {
			result += '<option value="' + data._id + '">' + data.name + '</option>';
		});

		// concatenate the endings
		result += '</select></div></div>';

		// return the result
		return result;
	};

	/**
	 * Create Post hack, check if the user is creating a post
	 * and listens if the form was submitted and successfully stored
	 */
	var _updatePost = function(next) {
		selectFlag = false;
		//var postData		= {};

		// listen if the document is ready
		controller.listen('post-update-ready', function() {
			// check if the checkbox for category have been rendered already
			if(selectFlag == false) {
				// if not yet, select the correct location
				// and prepend the select box
				$('.widget-body div.widget-main')
					.children().eq(3)
					.prepend(selectBox());
				
				// set the flag true to know if the selectbox is rendered
				selectFlag = true;
			}

		});

		next();
	};

	/**
	 * Will process the data that will be updated
	 */
	 var _process = function(next) {
	 	var update_id 		=  window.location.pathname.split('/')[3];
	 	
	 	// listen for post update
		controller.once('post-updated', function(e, data) {
			var url 	= controller.getServerUrl() + '/categorypost/update/'+update_id;
				
			var postData = { _category: data, _post: update_id };
			$.post(url, postData, function(response) {
				console.log(postData);
			}.bind(this));

			controller.unlisten('post-updated', this);
			next();
		});
	 };


	return c;	
});