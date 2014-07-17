define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data		= {};

	/* Private Properties
	-------------------------------*/
	var $ 		     = jQuery;
	var selectFlag   = false;
	var lastInserted = '';

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

	/**
	 * Build the widget box for this plugin
	 *
	 */
	var selectBox = function() {
		//build the request url
		var requestUrl = controller.getServerUrl() + '/user/list/';

		// create the initial selecbox
		var result = '<div class="widget-box panel-primary">';
		result += '<div class="widget-header header-color-grey"><h5>User<h5></div>';
		result += '<div class="widget-body"><div class="widget-main">';
		result += '<div>';
		result += '<div><h6>Assign to user</h6><div><select multiple name="_user" class="width-80 chosen-select" id="form-field-select-4" data-placeholder="Choose a user...">';

		var users;

		var getUsers = function() {
			// ajax request, get all category
			$.ajax({
		    	url: requestUrl,
		    	async: false,
		    	dataType: 'json',
		    	success: function(data) {
		    		users = data.results;
		    	}
		    });
		};

		getUsers();
		// create options by iterating through each category
		$.each(users, function(key, data) {
			result += '<option value="' + data._id + '">' + data.name + '</option>';
		});

		// concatenate the endings
		result += '</select>';
		result += '</div></div>';
		result += '</div>';
		result += '</div>';

		// return the result
		return result;
	};

	/**
	 * Create Post hack, check if the user is creating a post
	 * and listens if the form was submitted and successfully stored
	 */
	var _createPost = function(next) {
		// reset the flag for the selectbox
		selectFlag = false;
		
		// listen if the document is ready
		controller.listen('post-create-ready', function() {
			// check if the select box for category have been rendered already
			if(selectFlag == false) {
				// if not yet, select the correct location
				// and prepend the select box
				$('aside')
					.append(selectBox());
				
				// set the flag true to know if the selectbox is rendered
				selectFlag = true;
			}

			// for the select multiple list
			$(".chosen-select").chosen().change(function() {
				$('.search-choice span').each(function(key, data) { 
					var lastElem = $(this).text().split(' > ');
					$(this).text(lastElem[lastElem.length - 1]);
				});
			});
			//template for chosenjs
			var which = parseInt(2);
			if(which == 2) $('#form-field-select-4').addClass('tag-input-style');
			else $('#form-field-select-4').removeClass('tag-input-style');
			
		});

		next();
	};

	/**
	 * Will process the data for creating a new post
	 * this will create the link
	 */
	 var _process = function(next) {
	 	// listen for post update
		controller.listen('post-created', function(e, res) {
			var url 	= controller.getServerUrl() + '/postuser/create/';
			// build the post data to be pass on the api server
			var postData = { _post: res._post, _user: res.data._user };
			
			if(lastInserted !== postData._post) {
				$.post(url, postData, function(response) {
					lastInserted = postData._post;
					// category-post link created
					console.log(response);
				}.bind(this));
			}
			
			// unlisten to the event to prevent the multiple listening and form sending
			controller.unlisten('post-created');
			next();
		});

	 };


	return c;	
});