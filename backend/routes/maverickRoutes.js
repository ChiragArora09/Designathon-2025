const express = require('express');
const router = express.Router();
const { importMavericks, addMaverick, getUnassignedMavericks } = require('../controllers/maverickController');

router.post('/import-mavericks', importMavericks);
router.post('/add-maverick', addMaverick);
router.get('/unassigned', getUnassignedMavericks);

module.exports = router;
