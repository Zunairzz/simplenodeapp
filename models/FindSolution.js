const mongoose = require('mongoose');

const findSolutionSchema = new mongoose.Schema({
    question: {type: String},
    answer: {type: String},
});

module.exports = mongoose.model('FindSolution', findSolutionSchema);
