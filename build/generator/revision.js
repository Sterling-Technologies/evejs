module.exports = {
	findandrevision: ["var _findAndRevision = function(where, set, callback) {\n\
		this.getDetail(where._id, function(error, row) {\n\
			set['$push'] = { revision: row };\n\
			this.store.findOneAndUpdate(where, set, callback);\n\
		}.bind(this), true);\n\
	};", ''],
	
	update: ['_findAndRevision.call(this, ', 'this.store.findOneAndUpdate('],
	
	tab: ['<li class="{SLUG}-revision-tab{{#when url \'startsWith\' \'/{SLUG}/revision\'}} active{{/when}}">\n\
	<a href="/sample/revision/{{id}}">\n\
		<i class="purple icon-signin bigger-125"></i>\n\
		Revisions \n\
	</a>\n\
</li>', ''],
	route: ['case window.location.pathname.indexOf(\'/sample/revision\') === 0:\n\
			route.action = \'revision\';\n\
			break;', '']
};