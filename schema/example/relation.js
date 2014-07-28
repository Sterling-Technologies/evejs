module.exports = {
	slug		: 'sample',
	singular	: 'Sample',
	plural		: 'Samples',
	icon		: 'facebook',
	
	revision	: true,
	children	: true,
	slug		: true,
	active		: true,
	created		: true,
	updated		: true,
	
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
			default	: 'now',
			field	: 'date',
			holder	: '01/01/2014',
			valid	: [['regex', 'dd/dd/dddd']]
		},
		
		status: {
			label	: 'Status',
			type	: 'string',
			options	: ['draft', 'review', 'published', 'other'],
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