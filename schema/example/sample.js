module.exports = {
	slug		: 'sample',
	singular	: 'Sample',
	plural		: 'Samples',
	icon		: 'facebook',
	
	use_slug		: true,
	use_active		: true,
	use_created		: true,
	use_updated		: true,
	
	use_revision	: true,
	use_children	: true,
	
	use_import		: true,
	use_export		: true,
	
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
		
		meta: [{
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
		
		file: {
			label	: 'File',
			file	: 'multiple',
			options	: ['jpg', 'gif']
		},
		
		image: {
			label	: 'Image',
			type	: 'id',
			image	: true
		},
	}
};