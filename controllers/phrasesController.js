
// const Phrase = require('../model/Phrase');
const mongoose = require('mongoose');

const getLearnPhrases = async (req, res) => {
    const { collections } = req.params;

    if (collections) {
        try {
            const collection = mongoose.connection.db.collection(collections);
            const collectionsName = await collection.find({}).toArray();
            res.json(collectionsName);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({ error: "Invalid collection's name" });
    }
};


const getTestPhrases = async (req, res) => {
    const { collections } = req.params;
    let questionsLength = 15;
    let testQuestions = [];
    try {
        const collection = mongoose.connection.db.collection(collections);
        const count = await collection.countDocuments({});
        if (questionsLength > count) {
            questionsLength = count;
        }
        const maxAnswers = 4; // Ilość odpowiedzi na każde pytanie

        while (testQuestions.length < questionsLength) {
            const drawIdQuestion = Math.floor(Math.random() * count);
            const drawQuestionElement = await collection.find({}).skip(drawIdQuestion).limit(1).toArray();
            const isUniqueQuestion = !testQuestions.some(item => item.question === drawQuestionElement[0].question);

            if (isUniqueQuestion) {
                const correctAnswer = drawQuestionElement[0].answer;
                const answers = [];

                // Losowanie pozycji poprawnej odpowiedzi
                const correctPosition = Math.floor(Math.random() * maxAnswers);

                for (let i = 0; i < maxAnswers; i++) {
                    if (i === correctPosition) {
                        answers.push(correctAnswer);
                    } else {
                        let answer;
                        do {
                            const drawIdAnswer = Math.floor(Math.random() * count);
                            const drawAnswerElement = await collection.find({}).skip(drawIdAnswer).limit(1).toArray();
                            answer = drawAnswerElement[0].answer;
                        } while (answers.includes(answer) || answer === correctAnswer);

                        answers.push(answer);
                    }
                }

                testQuestions.push({
                    question: drawQuestionElement[0].question,
                    answers: answers,
                    correct: correctPosition
                });
            }
        }
        res.json(testQuestions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    getLearnPhrases,
    getTestPhrases
};