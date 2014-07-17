define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data		= {};

	/* Private Properties
	-------------------------------*/
	var $ 			   = jQuery;
	var selectFlag 	   = false;
	var lastUser	   = [];
	var parentName	   = '';

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
			.then(_getUser)
			.then(_updatePost)
			.then(_process);

		return this;
	};

	/* Private Methods
	------------------------------*/
	var _getUser = function(next) {
		var update_id 		=  window.location.pathname.split('/')[3];

		// build the request url to be use on ajax
		var requestUrl = controller.getServerUrl() + '/postuser/detail/' + update_id;

		// ajax request, get all category
		$.getJSON(requestUrl, function(data) {
			// get the results
			lastUser = data.results;
			next();
		});

	};

	var selectBox = function() {
		//build the request url
		var requestUrl = controller.getServerUrl() + '/user/list/';
		var users = {};

		// ajax request, get all category
		$.ajax({
	    	url 		: requestUrl,
	    	async 		: false,
	    	dataType 	: 'json',
	    	success 	: function(data) {
	    		users = data.results;
	    	}
	    });

		// generate post user template
		var result = _getPostUserTemplate(users);

		// return the result
		return result;
	};

	var _updatePost = function(next) {
		// reset the flag for the selectbox
		selectFlag = false;

		// listen if the document is ready
		controller.listen('post-update-ready', function() {
			// check if the checkbox for category have been rendered already
			if(selectFlag == false) {
				// if not yet, select the correct location
				// and prepend the select box
				$('aside')
					.append(selectBox());

				lastCategories = [];
				
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
			// template for chosenjs
			var which = parseInt(2);
			if(which == 2) $('#form-field-select-4').addClass('tag-input-style');
			else $('#form-field-select-4').removeClass('tag-input-style');

		});

		next();
	};

	var _process = function(next) {
	 	var update_id 		=  window.location.pathname.split('/')[3];
	 	
	 	// listen for post update
		controller.once('post-updated', function(e, res) {
			// build the request url
			var url 	= controller.getServerUrl() + '/postuser/update/'+update_id;
				
			var postData = { _user: res._user, _post: update_id };

			$.post(url, postData, function(response) {
				//updated success
			}.bind(this));

			// unlisten to the event to prevent multiple event listening
			controller.unlisten('post-updated', this);
			next();
		});
	};

	var _getPostUserTemplate = function(users) {
	 	// create the initial selecbox
		var result = '<div class="widget-box panel-primary">' +
					 '<div class="widget-header header-color-grey"><h5>User</h5></div>' +
					 '<div class="widget-body"><div class="widget-main">' +
					 '<div><div><h6>Assign to user</h6>' +
					 '<div><select multiple name="_user" class="width-80 chosen-select" id="form-field-select-4" data-placeholder="Choose a user...">';

		// create options by iterating through each category
		$.each(users, function(key, data) {
			var id = '', selected = '';

			// check the last assigned user into this post
			if(('_id' in lastUser) && lastUser._id !== null && lastUser._id == data._id) {
				id 		 = data._id;
				selected = 'selected';
			} else {
				id = data._id;
			}

			result += '<option class="' + id + '"' + selected + ' value="' + id + '">' +
					  data.name + '</option>';
		});

		// concatenate the endings
		result += '</select></div></div></div></div>';

		return result;
	};

	return c;	
});