const express = require('express');
const { generateQuizQuestions, submitQuiz } = require('../controllers/quizController');
const router = express.Router();

router.post('/generate', generateQuizQuestions);
router.post('/submit', submitQuiz);

module.exports = router;