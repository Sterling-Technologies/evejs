define(function() {
	return function() {
		var $ = jQuery;
		var url = window.location.pathname;
		var id  = this.Controller().getUrlSegment(3);
		{{#if from.many}}
		//case for -> a {{to.schema.name}} having many {{from.schema.name}}
		//add a tab to view many {{from.schema.name}}
		
		//create a tab
		var body = Handlebars.compile('<li class="{{name}}-tab\{\{#when ' 
		+ 'url \'startsWith\' \'/{{name}}/{{from.schema.name}}/\'\}\} active\{\{/when\}\}">\
			<a href="/{{name}}/{{from.schema.name}}/\{\{id\}\}">\
				<i class="blue icon-{{from.schema.icon}} bigger-125"></i>\
				{{from.schema.plural}}\
			</a>\
		</li>')({ id: id, url: url });
		
		$('section.{{to.schema.name}}-update ul.nav-tabs').append(body);
		{{/if}}
		{{#if to.many}}
		//case for -> a {{from.schema.name}} having many {{to.schema.name}}
		//add a tab to view many {{to.schema.name}}
		
		//create a tab
		var body = Handlebars.compile('<li class="{{name}}-tab\{\{#when ' 
		+ 'url \'startsWith\' \'/{{name}}/{{to.schema.name}}/\'\}\} active\{\{/when\}\}">\
			<a href="/{{name}}/{{to.schema.name}}/\{\{id\}\}">\
				<i class="blue icon-{{to.schema.icon}} bigger-125"></i>\
				{{to.schema.plural}}\
			</a>\
		</li>')({ id: id, url: url });
		
		$('section.{{from.schema.name}}-update ul.nav-tabs').append(body);
		{{/if}}
	};
});