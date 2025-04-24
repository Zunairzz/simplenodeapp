const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please provide a name']},
    title: {type: String, required: [true, 'Please provide a title']},
    phoneNo: {type: String, required: [true, 'Please provide a phone number']},
    email: {type: String, required: [true, 'Please provide an email']},
    experience: {type: String, required: [true, 'Please provide experience']},
    resume: {
        url: {type: String, required: true},
        publicId: {type: String, required: true},
    },
});

module.exports = mongoose.model('ResumeData', resumeSchema);