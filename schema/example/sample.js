module.exports = {
	name		: 'sample',
	singular	: 'Sample',
	plural		: 'Samples',
	icon		: 'facebook',
	
	slug		: true,
	active		: true,
	created		: true,
	updated		: true,
	
	revision	: true,
	relation	: ['sample', 'sample2'],
	
	import		: true,
	export		: true,
	
	fields: {
		title: {
			label	: 'Title',
			type	: 'string',
			field	: 'text',
			holder	: 'Please enter a title',
			valid	: ['required', ['gt', 4]],
			search	: true
		},
		
		detail: {
			label	: 'Detail',
			type	: 'string',
			field	: 'text',
			holder	: 'Please enter a detail',
			valid	: [['lt', 7]],
			search	: true
		},
		
		email: {
			label	: 'Email',
			type	: 'string',
			field	: 'text',
			holder	: 'john@doe.com',
			valid	: 'email'
		},
		
		phone: {
			label	: 'Phone',
			type	: 'string',
			field	: ['mask', 'aaa-11-aaa'],
			holder	: '(415) 555-2424'
		},
		
		bio: {
			label	: 'Bio',
			type	: 'string',
			field	: 'textarea',
			holder	: 'Please enter some bio',
			valid	: 'required'
		},
		
		good: {
			label	: 'Good',
			type	: 'boolean',
			default	: true,
			field	: 'checkbox'
		},
		
		published: {
			label	: 'Published',
			type	: 'date',
			default	: 'now()',
			field	: 'date',
			holder	: '01/01/2014'
		},
		
		status: {
			label	: 'Status',
			type	: 'string',
			options	: [
				{ label: 'Draft'	, value: 'draft' },
				{ label: 'Review'	, value: 'review' },
				{ label: 'Published', value: 'published' },
				{ label: 'Other'	, value: 'other' }],
			field	: 'select'
		},
		
		meta: { 
			type		: 'array',
			singular	: 'Meta',
			plural		: 'Meta',
			icon		: 'twitter',
			
			slug		: true,
			active		: true,
			created		: true,
			updated		: true,
			
			fields: [{
				title: {
					label	: 'Title',
					type	: 'string',
					field	: 'text',
					holder	: 'Please enter a title',
					valid	: ['required', ['gt', 4]],
					search	: true
				},
				
				detail: {
					label	: 'Detail',
					type	: 'string',
					field	: 'text',
					holder	: 'Please enter a detail',
					valid	: [['lt', 7]],
					search	: true
				}	
			}],
		},
		
		file: {
			label	: 'File',
			type	: 'file',
			multiple: true,
			options	: ['image/jpg', 'image/gif']
		},
	}
};