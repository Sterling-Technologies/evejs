define(function() {
	return function(e, request, action) {
		//case for -> a {{from.schema.name}} having many {{to.schema.name}}
		//add a tab to view many {{to.schema.name}}
		var $ = jQuery;
		
		//create a tab
		var body = Handlebars.compile('<li class="{{name}}-{{to.schema.name}}-tab\{\{#when ' 
		+ 'url \'startsWith\' \'/{{name}}/{{to.schema.name}}/\'\}\} active\{\{/when\}\}">\
			<a href="/{{name}}/{{to.schema.name}}/\{\{id\}\}">\
				<i class="blue icon-{{to.schema.name}} bigger-125"></i>\
				{{to.schema.plural}}\
			</a>\
		</li>')({ id: request.variables[0], url: request.path });
		
		$('section.{{from.schema.name}}-update ul.nav-tabs').append(body);
		
		this.trigger('{{name}}-response', request, action);
	};
});