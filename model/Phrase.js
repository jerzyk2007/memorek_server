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
// const getModel = (collectionName) => mongoose.model(collectionName, phraseSchema);
// module.exports = getModel;
const getModel = (collectionName) => {
    const model = mongoose.models[collectionName] || mongoose.model(collectionName, phraseSchema, collectionName);
    return model;
};

module.exports = getModel;