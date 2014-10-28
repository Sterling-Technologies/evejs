define(function() {
	return function(e, request, action) {
		//case for -> a {{to.schema.name}} having many {{from.schema.name}}
		//add a tab to view many {{from.schema.name}}
		var $ = jQuery;
		
		//create a tab
		var body = Handlebars.compile('<li class="{{name}}-{{from.schema.name}}-tab\{\{#when ' 
		+ 'url \'startsWith\' \'/{{name}}/{{from.schema.name}}/\'\}\} active\{\{/when\}\}">\
			<a href="/{{name}}/{{from.schema.name}}/\{\{id\}\}">\
				<i class="blue icon-edit bigger-125"></i>\
				{{from.schema.plural}}\
			</a>\
		</li>')({ id: request.variables[0], url: request.path });
		
		$('section.{{to.schema.name}}-update ul.nav-tabs').append(body);
		
		this.trigger('{{name}}-response', request, action);
	};
});