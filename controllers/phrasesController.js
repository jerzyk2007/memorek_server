
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
    let testQuestions = [];
    try {
        const collection = mongoose.connection.db.collection(collections);
        const count = await collection.countDocuments({});
        const maxAnswers = 4; // Ilość odpowiedzi na każde pytanie

        while (testQuestions.length < 3) {
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


// const getTestPhrases = async (req, res) => {
//     const { collections } = req.params;
//     let testQuestions = [];
//     try {
//         const collection = mongoose.connection.db.collection(collections);
//         const count = await collection.countDocuments({});
//         const maxAnswers = 4; // Ilość odpowiedzi na każde pytanie

//         while (testQuestions.length < 3) {
//             const drawIdQuestion = Math.floor(Math.random() * count);
//             const drawQuestionElement = await collection.find({}).skip(drawIdQuestion).limit(1).toArray();
//             const isUniqueQuestion = !testQuestions.some(item => item.question === drawQuestionElement[0].question);
//             console.log('ok');
//             if (isUniqueQuestion) {
//                 const correctAnswer = drawQuestionElement[0].answer;
//                 const answers = [correctAnswer];

//                 while (answers.length < maxAnswers) {
//                     const drawIdAnswer = Math.floor(Math.random() * count);
//                     const drawAnswerElement = await collection.find({}).skip(drawIdAnswer).limit(1).toArray();
//                     const answer = drawAnswerElement[0].answer;

//                     if (answers.indexOf(answer) === -1) {
//                         answers.push(answer);
//                     }
//                 }

//                 testQuestions.push({
//                     question: drawQuestionElement[0].question,
//                     answers: answers
//                 });
//             }
//         }

//         res.json(testQuestions);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// };




// const getTestPhrases = async (req, res) => {
//     const { collections } = req.params;
//     let drawQuestion = [];
//     let drawAnswers = [];
//     try {
//         const collection = mongoose.connection.db.collection(collections);
//         const count = await collection.countDocuments({});
//         do {
//             const drawIdQuestion = Math.floor(Math.random() * count);
//             const drawQuestionElement = await collection.find({}).skip(drawIdQuestion).limit(1).toArray();
//             const isUniqueQuestion = !drawQuestion.some(item => {
//                 return item.question === drawQuestionElement[0].question;
//             });
//             if (isUniqueQuestion) {
//                 drawQuestion = [...drawQuestion, drawQuestionElement[0]];
//                 drawAnswers = [...drawAnswers, drawQuestionElement[0].answer];
//             }
//             do {
//                 if (drawAnswers.length < 3) {
//                     const drawIdAnswer = Math.floor(Math.random() * count);
//                     const drawAnswerElement = await collection.find({}).skip(drawIdAnswer).limit(1).toArray();
//                     const isUniqueAnswer = drawAnswers.find(item => item === drawAnswerElement[0].answer);
//                     if (!isUniqueAnswer) {
//                         drawAnswers = [...drawAnswers, drawAnswerElement[0].answer];
//                     }
//                 }
//                 // else if (drawAnswers === 3) {
//                 //     console.log(drawAnswers.length);
//                 // }

//             }
//             while (drawAnswers.length < 2);



//         } while (drawQuestion.length < 3);

//         console.log(drawAnswers);
//         // console.log(drawQuestion);
//         testQuestions = [...drawQuestion];
//         res.json(testQuestions);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// };



module.exports = {
    getLearnPhrases,
    getTestPhrases
};