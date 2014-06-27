module.exports = {
    slug    : { type: String, required: true, },
    title   : { type: String, required: true },
    detail  : { type: String, required: true, field: 'wysiwyg' },

    revision: [{
        title   : { type: String },
        detail  : { type: String, field: 'wysiwyg'},
        created : { type: Date }
    }],

    test     : {
        title   : { type: String },
        street  : { type: String },
        city    : { type: String }
    },
        
    status      : { type: String, enum: ['draft', 'review', 'published', 'other'] },
    visibility  : { type: String, enum: ['public', 'private'] },
    active      : { type: Boolean, default: true },
    published   : { type: Date, default: Date.now },
    created     : { type: Date, default: Date.now },
    updated     : { type: Date, default: Date.now },

    color       : { type: String, field: 'color' },
    datetime    : { type: String, field: 'datetime'  },
    textarea    : { type: String, field: 'textarea' },
    text        : { type: String, field: 'text'  },
    autocomplete: { type: String, field: 'autocomplete'  },
    checkbox    : { type: String, field: 'checkbox', enum:['food', 'drinks'] }
};