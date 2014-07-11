module.exports = {
	slug: 'sample',
	singular: 'Sample',
	plural: 'Samples',
	icon: 'facebook',
	fields: {
		title: {
			meta: { type: String, required: true },
			field: ['text'],
			placeholder: 'Please enter a title',
			valid: [['gt', 4]]
		},
		
		detail: {
			meta: { type: String, required: true },
			field: ['wysiwyg'],
			title: 'This is the title',
			placeholder: 'Please enter a detail',
			valid: [['lt', 7]]
		},
		
		email: {
			meta: String,
			field: ['text'],
			placeholder: 'john@doe.com',
			value: 'jerielmari@gmail.com',
			valid: [['email']]
		},
		
		phone: {
			meta: String,
			field: ['mask', 'aaa-11-aaa'],
			placeholder: '(415) 555-2424',
			valid: []
		},
		
		bio: {
			meta: { type: String, required: true },
			field: ['textarea', 'class="testinglang"'],
			placeholder: 'Please enter some bio',
			valid: []
		},
		
		active: {
			meta: { type: Boolean, default: true },
			field: ['checkbox']
		},
		
		published: {
			meta: { type: Date, default: Date.now },
			field: ['date'],
			placeholder: '01/01/2014',
			valid: [['date', 'dd/dd/dddd']]
		},
		
		status: {
			meta: { type: String, enum: ['draft', 'review', 'published', 'other'] },
			field: ['select']
		}
	}
};