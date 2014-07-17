controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('addressuser'				, controller.path('package') + '/core/addressuser')
		.path('addressuser/action'		, controller.path('package') + '/core/addressuser/action')
		.path('addressuser/template'	, controller.path('package') + '/core/addressuser/template');

	controller.trigger('user-add-action', function() {
		return [
			{
				action : controller.path('addressuser/action') + '/create.js',
				path   : '/user/address/create'
			},
			{
				action : controller.path('addressuser/action') + '/index.js',
				path   : '/user/address'
			}
		];
	});
})
// when a request was made
.listen('request', function() {
	var location   = window.location.pathname;
	var navtabs    = $('ul.nav.nav-tabs');
	var addresstab = $('ul.nav.nav-tabs li.address-tab');
	var id 		   = location.split('/')[3];

	if(location.indexOf('/user/update') !== 0) {
		return;
	}

	if(addresstab.length === 0) {
		var tab = controller.path('addressuser/template') + '/tab.html';

		controller.listen('user-update-ready', function() {
			require(['text!' + tab], function(tab) {
			});
		});
	}
});