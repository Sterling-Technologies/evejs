define(function() {
	return function() {
		var url = window.location.pathname;
		var id  = this.Controller().getUrlSegment(3);
	
		// if tab is already rendered
		if(jQuery('section.user-update ul.nav-tabs li.user-update-tab').length !== 0) {
			// just do nothing
			return;
		}
	
		require(['text!' + this.path('user/template') + '/tabs.html'], function(html) {
			html = Handlebars.compile(html)({ id : id, url : url });
			jQuery('section.user-update ul.nav.nav-tabs').prepend(html);
		});
	};
});