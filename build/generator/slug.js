module.exports = {
	getslug: ["var _getNextSlug = function(slug, callback, id) {\n\
		//turn it into a slug\n\
		slug = slug.toString().toLowerCase()\n\
		  .replace(/\\s+/g, '-')        // Replace spaces with -\n\
		  .replace(/[^\\w\\-]+/g, '')   // Remove all non-word chars\n\
		  .replace(/\\-\\-+/g, '-')      // Replace multiple - with single -\n\
		  .replace(/^-+/, '')          // Trim - from start of text\n\
		  .replace(/-+$$/, '');         // Trim - from end of text\n\
		//get all slugs that start with argument\n\
		//'^something\\-cool(\\-[0-9]+){0,1}$$'\n\
		var regex = new RegExp('^' + slug.replace(/\\-/g, '\\\\-') + '(\\\\-[0-9]+){0,1}$$', 'g');\n\
		this.find({ slug: regex }).lean().exec(function(error, list) {\n\
			list = list || [];\n\
			\n\
			for(var number, count = -1, i = 0; i < list.length; i++) {\n\
				//if the id is given and found\n\
				//if the slug prefix is the same\n\
				//as the prescribed one\n\
				if(list[i]._id.toString() === id \n\
				&& list[i].slug.indexOf(slug) === 0) {\n\
					//call the callback\n\
					callback(list[i].slug);\n\
					//that's it\n\
					return;	\n\
				}\n\
				\n\
				//FROM: somthing-cool-2 TO: -2\n\
				//FROM: something-cool TO ''\n\
				number = list[i].slug.substr(slug.length);\n\
				//there should be a hyphen at the start now\n\
				if(number.indexOf('-') !== 0) {\n\
					//it's 0 anyways\n\
					number = '-0';\n\
				}\n\
				\n\
				// now remove the hyphen so we can \n\
				// make it into an integer\n\
				number = parseInt(number.substr(1));\n\
				\n\
				//all that just for this...\n\
				if(number > count) {\n\
					count = number;\n\
				}\n\
			}\n\
			\n\
			if(count >= 0) {\n\
				callback(slug + '-' + (count + 1));\n\
				return;\n\
			}\n\
			\n\
			callback(slug);\n\
		});\n\
	};", ''],
	
	insert: ['//case for slug\n\
		_getNextSlug.call(this, data.title, function(slug) {\n\
			data.slug = slug;\n\
			this.model(data).save(callback);\n\
		}.bind(this));', 
		
		'this.model(data).save(callback);'],
	
	update: ['//case for slug\n\
		_getNextSlug.call(this, data.title, function(slug) {\n\
			data.slug = slug;\n\
			{USE_UPDATED_UPDATE}\n\
			{USE_REVISION_UPDATE}\n\
				{USE_ACTIVE_UPDATE}\n\
				{ $set: data }, callback);\n\
		}.bind(this), id);', 
		
		'{USE_UPDATED_UPDATE}\n\
		{USE_REVISION_UPDATE}\n\
			{USE_ACTIVE_UPDATE}\n\
			{ $set: data }, callback);']
};