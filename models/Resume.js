const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please provide a name']},
    title: {type: String, required: [true, 'Please provide a title']},
    phoneNo: {type: String, required: [true, 'Please provide a phone number']},
    email: {type: String, required: [true, 'Please provide an email']},
    experience: {type: String, required: [true, 'Please provide experience']},
    resume: {
        url: {type: String, required: true},
        publicId: {type: String, required: true},
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps: true});

module.exports = mongoose.model('UserData', userDataSchema);