
const Phrase = require('../model/Phrase');

const dataJSON = require('../data/dictionary.json');


const getAllPhrases = async (req, res) => {
    const phrases = await Phrase.find();
    if (!phrases) return res.status(204).json({ message: "No phrases found" });
    res.json(phrases);
};

const createNewPhrases = async (req, res) => {
    if (!req?.body?.question || !req?.body?.answer) {
        return res.status(400).json({
            "message": "Question and answer are rquired"
        });
    }
    try {
        const result = await Phrase.create({
            question: req.body.question,
            answer: req.body.answer
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
};

const updatePhrase = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required' });
    }

    const phrase = await Phrase.findOne({ _id: req.body.id }).exec();
    if (!phrase) {
        return res.status(204).json({
            "message": `No phrase matches ID ${req.body.id} `
        });
    }
    if (req.body?.question) employee.question = req.body.question;
    if (req.body?.answer) employee.answer = req.body.answer;
    const result = await phrase.save();
    res.json(result);
};

const deletePhrase = async (req, res) => {
    if (!req?.body.id) return res.status(400).json({ 'message': 'Phrase ID required' });

    const phrase = await Phrase.findOne({ _id: req.body.id }).exec();
    if (!phrase) {
        return res.status(204).json({
            "message": `Phrase ID ${req.body.id} not found`
        });
    }
    const result = await Phrase.deleteOne({ _id: req.body.id });
    res.json(result);
};

const getPhrase = async (req, res) => {
    if (!req?.params.id) return res.status(400).json({ 'message': 'Employee ID required' });

    const phrase = await Phrase.findOne({ _id: req.params.id }).exec();
    if (!phrase) {
        return res.status(204).json({
            "message": `Phrase ID ${req.params.id} not found`
        });
    }
    res.json(employee);
};

const getSamplePhrase = async (req, res) => {
    // res.json({ 'message': "sample" });
    try {
        const result = await Phrase.aggregate([{ $sample: { size: 1 } }]);
        res.send(result);
    }
    catch (err) {
        console.error(err);
    }

};


module.exports = {
    getAllPhrases,
    createNewPhrases,
    updatePhrase,
    deletePhrase,
    getPhrase,
    getSamplePhrase
};