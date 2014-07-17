controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('addressuser'				, controller.path('package') + '/core/addressuser')
		.path('addressuser/action'		, controller.path('package') + '/core/addressuser/action')
		.path('addressuser/template'	, controller.path('package') + '/core/addressuser/template');
})

//when the user update has been rendered
.listen('user-action-update-after', function() {
	//what is the id?
	var id = window.location.pathname.split('/')[3];
	//add on the tab
	require(['text!' + controller.path('addressuser/template') + '/tab.html'], function(html) {
		html = Handlebars.compile(html)({ id: id });
		
		jQuery('section.user-profile ul.nav-tabs').append(html);
	});
})

//when the user index is about to render
.listen('user-action-index-before', function(route) {
	//check path - /user/address
	//if the path does not start with /user/address
	if(window.location.pathname.indexOf('/user/address') !== 0) {
		//do nothing
		return;
	}
	
	//at this point the path is /user/address
	
	//hijack the route path
	route.path = controller.path('addressuser/action') + '/index.js';
	
	//event when the user address action is about to render
	controller.trigger('user-address-action-index-before', route);
})

//when the user index is about to render
.listen('user-action-index-after', function(route) {
	//check path - /user/address
	//if the path does not start with /user/address
	if(window.location.pathname.indexOf('/user/address') !== 0) {
		//do nothing
		return;
	}
	
	//at this point the path is /user/address
	
	//event when the user address action has rendered
	controller.trigger('user-address-action-index-after', route);
});