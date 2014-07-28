module.exports = {
	bulk : [			"<select name=\"action\" style=\"width:auto;\" class=\"form-control\">\n\
                            <option value=\"\" selected=\"selected\">Bulk Actions</option>\n\
                            <option value=\"remove\">Remove</option>\n\
                            <option value=\"restore\">Restore</option>\n\
                        </select>\n\
                        <button class=\"btn-primary btn-sm btn\">Apply</button>",
	
						"<select name=\"action\" style=\"width:auto;\" class=\"form-control\">\n\
                            <option value=\"\" selected=\"selected\">Bulk Actions</option>\n\
                            <option value=\"remove\">Remove</option>\n\
                        </select>\n\
                        <button class=\"btn-primary btn-sm btn\">Apply</button>"],
						
	showing	: [	'Showing {{#if keyword}}Results for &quot;{{keyword}}&quot; in {{/if}}{{showing}}',
				'Showing {{#if keyword}}Results for &quot;{{keyword}}&quot; {{/if}}'],
	
	buttons : [				"<a class=\"btn btn-sm{{#when mode '==' 'active'}} btn-light{{/when}}\" \n\
                            href=\"/{SLUG}?mode=active{{#if keyword}}&keyword={{keyword}}{{/if}}\">Active &nbsp;\n\
                            <span class=\"badge badge-grey\">{{active}}</span></a> \n\
                            \n\
                            <a class=\"btn btn-sm{{#when mode '==' 'trash'}} btn-light{{/when}}\" \n\
                            href=\"/{SLUG}?mode=trash{{#if keyword}}&keyword={{keyword}}{{/if}}\">Trash &nbsp;\n\
                            <span class=\"badge badge-grey\">{{trash}}</span></a>",
							
			 				''],
	
	actions : [				"{{#when active '==' 'Yes'}}\n\
                            <a title=\"Edit\" href=\"/{SLUG}/update/{{_id}}\">\n\
                            <i class=\"icon-edit\"></i></a> &nbsp; \n\
                            <a title=\"Remove\" href=\"/{SLUG}/remove/{{_id}}\"\n\
                            class=\"text-danger remove\"><i class=\"icon-remove\" value=\"{{_id}}\"></i></a>\n\
                            {{/when}}\n\
                            {{#when active '==' 'No'}}\n\
                            <a title=\"Restore\" href=\"/{SLUG}/restore/{{_id}}\" class=\"text-success restore\">\n\
                            <i class=\"icon-external-link\"></i></a>\n\
                            {{/when}}",
							
							"<a title=\"Edit\" href=\"/{SLUG}/update/{{_id}}\">\n\
                            <i class=\"icon-edit\"></i></a> &nbsp; \n\
                            <a title=\"Remove\" href=\"/{SLUG}/remove/{{_id}}\"\n\
                            class=\"text-danger remove\"><i class=\"icon-remove\" value=\"{{_id}}\"></i></a>"],
							
	pagination : [
		"{{#when mode '==' 'active'}}\n\
        <ul class=\"pagination\">\n\
            {{#pagination active range}}\n\
            <li{{#if active}} class=\"active\"{{/if}}><a href=\"?{{query}}\">{{page}}</a></li>\n\
            {{/pagination}}\n\
        </ul>\n\
        {{/when}}\n\
        \n\
        {{#when mode '==' 'trash'}}\n\
        <ul class=\"pagination\">\n\
            {{#pagination trash range}}\n\
            <li{{#if active}} class=\"active\"{{/if}}><a href=\"?{{query}}\">{{page}}</a></li>\n\
            {{/pagination}}\n\
        </ul>\n\
        {{/when}}",
		
		"<ul class=\"pagination\">\n\
            {{#pagination active range}}\n\
            <li{{#if active}} class=\"active\"{{/if}}><a href=\"?{{query}}\">{{page}}</a></li>\n\
            {{/pagination}}\n\
        </ul>"],
	
	batch : [ 
		"//4. get the trash count\n\
		batch.push({ url: _getTrashCountRequest.call(this, query) });",
		
		''],
	
	data : ['trash	: response.batch[2].results,', ''],
							
	trash : [
	"var _getTrashCountRequest = function(request) {\n\
		var query = {};\n\
		\n\
		query.filter = request.filter || {};\n\
		\n\
		if(request.keyword) {\n\
			query.keyword = request.keyword;\n\
		}\n\
		\n\
		query.count = 1;\n\
		query.filter.active = 0;\n\
		\n\
		return '/{SLUG}/list?' + $.hashToQuery(query);\n\
	};", ''],
	
	store : ["this.store.findOneAndUpdate(\n\
			{_id: id, active: true },\n\
			{ $set: { active: false } }, callback);",
			
			'this.store.findOneAndRemove({ _id: id }, callback);']
};