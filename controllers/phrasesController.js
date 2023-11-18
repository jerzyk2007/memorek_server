const mongoose = require('mongoose');

const getLearnPhrases = async (req, res) => {
    const { type, collections } = req.params;
    if (collections) {
        try {
            const collection = mongoose.connection.db.collection(collections);
            const collectionsName = await collection.find({}).toArray();
            if (type === "normal") {
                res.json(collectionsName);
            } else if (type === "reverse") {
                const reverseCollections = collectionsName.map(item => ({ question: item.answer, answer: item.question }));
                res.json(reverseCollections);
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


module.exports = {
    getLearnPhrases,
    getTestPhrases
};