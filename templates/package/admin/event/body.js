define(function() {
	return function() {
		var url = window.location.pathname;
		var id  = this.Controller().getUrlSegment(3);
	
		// if tab is already rendered
		if(jQuery('section.{{name}}-update ul.nav-tabs li.{{name}}-update-tab').length !== 0) {
			// just do nothing
			return;
		}
	
		require(['text!' + this.path('{{name}}/template') + '/tabs.html'], function(html) {
			html = Handlebars.compile(html)({ id : id, url : url });
			jQuery('section.{{name}}-update ul.nav.nav-tabs').prepend(html);
		});
	};
});