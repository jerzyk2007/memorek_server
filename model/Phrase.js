const mongoose = require('mongoose');
const { Schema } = mongoose;

const phraseSchema = new Schema({
    question: {
        type: String,
        required: true,
        maxlength: 150
    },
    answer: {
        type: String,
        required: true,
        maxlength: 150
    },
});

module.exports = mongoose.model("Phrase", phraseSchema);