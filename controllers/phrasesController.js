const mongoose = require('mongoose');
const Phrase = require('../model/Phrase');

const getLearnPhrases = async (req, res) => {
    const { type, collection } = req.params;
    if (collection) {
        try {
            const findCollection = mongoose.connection.db.collection(collection);
            const collectionsName = await findCollection.find({}).toArray();
            if (type === "normal") {
                const newCollectionsName = collectionsName.map(({ _id, ...rest }) => rest);
                res.json(newCollectionsName);
            } else if (type === "reverse") {
                const reverseCollections = collectionsName.map(item => ({ question: item.answer, answer: item.question }));
                const newCollectionsName = reverseCollections.map(({ _id, ...rest }) => rest);
                res.json(newCollectionsName);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({ error: "Invalid collection's name" });
    }
};


const getTestPhrases = async (req, res) => {
    const { type, collection } = req.params;
    let questionsLength = 15;
    let testQuestions = [];
    try {
        const findCollection = mongoose.connection.db.collection(collection);
        const count = await findCollection.countDocuments({});
        if (count < 4) {
            return res.status(507).json({ 'message': `The collection ${collection} has ${count} elements, it must contain more than 4.` });
        }
        if (questionsLength > count) {
            questionsLength = count;
        }
        const maxAnswers = 4;

        while (testQuestions.length < questionsLength) {
            const drawIdQuestion = Math.floor(Math.random() * count);
            const drawQuestionElement = await findCollection.find({}).skip(drawIdQuestion).limit(1).toArray();
            let isUniqueQuestion;
            if (type === 'normal') {
                isUniqueQuestion = !testQuestions.some(item => item.question === drawQuestionElement[0].question);
            } else if (type === 'reverse') {
                isUniqueQuestion = !testQuestions.some(item => item.question === drawQuestionElement[0].answer);
            }
            if (isUniqueQuestion) {
                let correctAnswer;
                if (type === "normal") {
                    correctAnswer = drawQuestionElement[0].answer;
                }
                else if (type === "reverse") {
                    correctAnswer = drawQuestionElement[0].question;
                }
                const answers = [];
                const correctPosition = Math.floor(Math.random() * maxAnswers);
                for (let i = 0; i < maxAnswers; i++) {
                    if (i === correctPosition) {
                        answers.push(correctAnswer);
                    } else {
                        let answer;
                        do {
                            const drawIdAnswer = Math.floor(Math.random() * count);
                            const drawAnswerElement = await findCollection.find({}).skip(drawIdAnswer).limit(1).toArray();
                            if (type === 'normal') {
                                answer = drawAnswerElement[0].answer;
                            } else if (type === 'reverse') {
                                answer = drawAnswerElement[0].question;
                            }
                        } while (answers.includes(answer) || answer === correctAnswer);
                        answers.push(answer);
                    }
                }
                if (type === "normal") {
                    testQuestions.push({
                        question: drawQuestionElement[0].question,
                        answers: answers,
                        correct: correctPosition
                    });
                } else if (type === "reverse") {
                    testQuestions.push({
                        question: drawQuestionElement[0].answer,
                        answers: answers,
                        correct: correctPosition
                    });
                }
            }
        }
        res.json(testQuestions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getSearchPhrases = async (req, res) => {
    const { collections, search } = req.query;

    if (collections) {
        try {
            const results = [];

            for (const collectionName of collections) {
                const collection = mongoose.connection.db.collection(collectionName);
                const collectionsData = await collection.find({}).toArray();
                const findPhrases = collectionsData.map(phrase => {
                    if (phrase.question.toLowerCase().includes(search.toLowerCase()) || phrase.answer.toLowerCase().includes(search.toLowerCase())) {
                        return {
                            _id: phrase._id,
                            question: phrase.question,
                            answer: phrase.answer,
                            collection: collectionName
                        };

                    } else {
                        return {};
                    }
                });
                const filteredPhrases = findPhrases.filter(phrase => Object.keys(phrase).length !== 0);
                results.push(...filteredPhrases);
            }
            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: 'Server error' });
        }
    }
};

const changePhrase = async (req, res) => {
    const { id, question, answer, collection } = req.body;
    if (!id || !question || !answer || !collection) {
        return res.status(400).json({ 'message': 'Invalid data.' });
    }
    try {
        const PhraseModel = Phrase(collection);
        const findPhrase = await PhraseModel.findOne({ _id: id }).exec();
        if (findPhrase) {
            const result = await PhraseModel.updateOne(
                { _id: id },
                { $set: { question, answer } }
            );
        } else {
            return res.status(404).json({ 'message': 'Phrase not found.' });
        }
        res.status(201).json({ 'message': 'Phrase is changed' });



    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server Error' });
    }
};

const deletePhrase = async (req, res) => {
    const { id } = req.params;
    const { collection } = req.query;
    if (!id) {
        return res.status(400).json({ 'message': 'Invalid data.' });
    }
    try {
        const count = await mongoose.connection.db.collection(collection).countDocuments();
        const PhraseModel = Phrase(collection);
        const findPhrase = await PhraseModel.findOne({ _id: id }).exec();
        if (findPhrase) {
            await PhraseModel.deleteOne({ _id: id });
            if (count === 1) {
                await mongoose.connection.db.collection(collection).drop();
            }
            return res.status(200).json({ 'message': 'Phrase deleted.' });
        } else {
            return res.status(404).json({ 'message': 'Phrase not found.' });
        }
    }
    catch (err) {
        console.log(err);
    }
};

const addDataSingle = async (req, res) => {
    const { nameCollection, newPhrase } = req.body;
    const question = newPhrase.question;
    const answer = newPhrase.answer;
    try {
        const PhraseModel = Phrase(nameCollection);
        const count = await mongoose.connection.db.collection(nameCollection).countDocuments();
        if (count < 50) {
            const result = await PhraseModel.create({
                question, answer
            });
            res.status(201).json(`New phrase is added`);
        }
        else {
            res.status(507).json({ 'message': `Collections ${nameCollection} is full !!!` });
        }

    }
    catch (err) {
        console.log(err);
    }
};

module.exports = {
    getLearnPhrases,
    getTestPhrases,
    getSearchPhrases,
    changePhrase,
    deletePhrase,
    addDataSingle
};