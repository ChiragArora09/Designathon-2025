const express = require('express');
const router = express.Router();
const { createBatchesWithLearningPath, getAllBatches, getLearningPathForBatch } = require('../controllers/batchController')

router.post("/create-batches-learning-paths", async (req, res) => {
  try {
      const result = await createBatchesWithLearningPath(req.body.batches);
      res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to create batches with AI learning path." });
    }
});

router.get('/get-all', getAllBatches);
router.get('/:id/learning-path', getLearningPathForBatch);

module.exports = router;