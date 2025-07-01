const express = require('express');
const router = express.Router();
const { importMavericks, addMaverick, getUnassignedMavericks, getMaverickProfile, getTodayPlan, getMaverickLearningPath } = require('../controllers/maverickController');

router.post('/import-mavericks', importMavericks);
router.post('/add-maverick', addMaverick);
router.get('/unassigned', getUnassignedMavericks);
router.get('/me', getMaverickProfile);
router.get('/:id/today', getTodayPlan);
router.get('/:id/learning-path', getMaverickLearningPath)

module.exports = router;
