const express = require('express');
const router = express.Router();
const { createFeedback, getUserFeedbacks, getFeedbackStats } = require('../controllers/feedbackController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateFeedback, feedbackRateLimit } = require('../middleware/validation');

// POST /api/feedback - Создание нового отзыва
router.post('/',
    optionalAuth, // Опциональная авторизация
    feedbackRateLimit, // Rate limiting
    validateFeedback, // Валидация данных
    createFeedback
);

// GET /api/feedback/user - Получение отзывов пользователя (требует авторизации)
router.get('/user',
    authenticateToken, // Обязательная авторизация
    getUserFeedbacks
);

// GET /api/feedback/stats - Получение статистики отзывов (требует авторизации)
router.get('/stats',
    authenticateToken, // Обязательная авторизация
    getFeedbackStats
);

module.exports = router;

