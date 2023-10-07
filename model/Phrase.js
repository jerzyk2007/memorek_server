const mongoose = require('mongoose');
const { Schema } = mongoose;

const phraseSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Phrase", phraseSchema);