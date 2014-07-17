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
	var tabFlag 	   = false;
	var lastCategories = [];
	var parentName	   = '';

	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};

	/* Construct
	-------------------------------*/
	public.__construct = function() {
		tabFlag == false;
		this.data = {};
	};

	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(_output)
			.then(_listen);

		return this;
	};

	/* Private Methods
	------------------------------*/

	/**
	 * Output the view for this package
	 */
	var _output = function(next) {
		// listen for the user update document ready
		controller.listen('user-update-ready', function() {
			// check if the tab is already appended or not
			if(tabFlag == false) {
				//if not, create the selectors
				var tabMenu = $('.user-profile ul.nav-tabs');
				var tabContent = $('.user-profile div.tab-content');

					// append the menu and content
					tabMenu.append('<li><a data-toggle="tab" href="#address"><i class="green icon-home bigger-125"></i>Address</a></li>');
					tabContent.append('<div class="tab-pane" id="address"></div>');

					// raise the flag so we know that the content for this
					// plugin is already appended/loaded to avoid duplicates
					tabFlag = true;

				// unlisten for the event to avoid leaks
				controller.unlisten('user-update-ready');
				next();
			}
		});
		
	};

	/**
	 * Listen for the click event to avoid refreshing on links
	 */
	var _listen = function(next) {
		controller.listen('user-update-ready', function() {
			$('body').on('click', '.user-profile ul.nav-tabs li a', function(e) {
				// avoid anchor actions
				e.preventDefault();
				console.log('you click me');
			});

			// reset the flag for content
			tabFlag = false;
			controller.unlisten('user-update-ready');
			next();
		});
	};

	/**
	 * Create the address form
	 */
	 var _createForm = function(next) {
	 	//TODO: Create the form
	 	next();
	 };


	return c;	
});