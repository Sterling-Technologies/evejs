module.exports = {
    name    : { type: String, required: true, },
    slug   : { type: String, required: true },
    detail  : { type: String, required: true, field: 'text' },

    created     : { type: Date, default: Date.now },
    updated     : { type: Date, default: Date.now },
    active      : { type: Boolean, default: true },
};