define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data		= {};

	/* Private Properties
	-------------------------------*/
	var $ 		   = jQuery;
	var selectFlag = false;

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
			.then(_createPost)
			.then(_process);

		return this;
	};

	/* Private Methods
	------------------------------*/
	var selectBox = function() {
		//build the request url
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
	var _createPost = function(next) {
		selectFlag = false;
		
		// listen if the document is ready
		controller.listen('post-create-ready', function() {
			// check if the select box for category have been rendered already
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
	 * Will process the data for creating a new post
	 * this will create the link
	 */
	 var _process = function(next) {
	 	// listen for post update
		controller.once('post-created', function(e, res) {
			var url 	= controller.getServerUrl() + '/categorypost/create/';
			$.post(url, res, function(response) {
				// category-post link created
			}.bind(this));
		
			// unlisten to the event to prevent the multiple listening and form sending
			controller.unlisten('post-created');
			next();
		});

	 }


	return c;	
});