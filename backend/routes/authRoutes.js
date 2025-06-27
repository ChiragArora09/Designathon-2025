const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, getCurrentUser } = require("../controllers/authController")
const { verifyToken } = require("../middlewares/authMiddleware")

router.get("/me", getCurrentUser);
router.post('/login', loginUser);
router.post("/logout", logoutUser);

module.exports = router;