const mongoose = require('mongoose');
const Phrase = require('../model/Phrase');

const getLearnPhrases = async (req, res) => {
    const { type, collections } = req.params;
    if (collections) {
        try {
            const collection = mongoose.connection.db.collection(collections);
            const collectionsName = await collection.find({}).toArray();
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
    const { type, collections } = req.params;
    let questionsLength = 15;
    let testQuestions = [];
    try {
        const collection = mongoose.connection.db.collection(collections);
        const count = await collection.countDocuments({});
        if (questionsLength > count) {
            questionsLength = count;
        }
        const maxAnswers = 4;

        while (testQuestions.length < questionsLength) {
            const drawIdQuestion = Math.floor(Math.random() * count);
            const drawQuestionElement = await collection.find({}).skip(drawIdQuestion).limit(1).toArray();
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
                            const drawAnswerElement = await collection.find({}).skip(drawIdAnswer).limit(1).toArray();
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
                    if (phrase.question.includes(search) || phrase.answer.includes(search)) {
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

// 

const getChangePhrase = async (req, res) => {
    const { id, question, answer, collection } = req.body;
    if (!req?.params?.id || !question || !answer || !collection) {
        return res.status(400).json({ 'message': 'Invalid data.' });
    }

    try {
        const searchCollection = mongoose.connection.db.collection(collection);
        const result = await searchCollection.updateOne(
            { _id: id },
            { $set: { question, answer } }
        );
        console.log(result);

        if (result.modifiedCount === 1) {
            console.log('Dokument został zaktualizowany.');
            res.status(200).json({ 'message': 'Dokument został zaktualizowany.' });
        } else {
            console.log('Nie znaleziono dokumentu do aktualizacji.');
            res.status(404).json({ 'message': 'Nie znaleziono dokumentu do aktualizacji.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server Error' });
    }
};

module.exports = {
    getLearnPhrases,
    getTestPhrases,
    getSearchPhrases,
    getChangePhrase
};