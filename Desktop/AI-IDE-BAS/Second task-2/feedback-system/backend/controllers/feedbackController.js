const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../config/database');

// Создание нового отзыва
const createFeedback = async (req, res) => {
    try {
        const { rating, main_content, comment } = req.validatedData;
        const userId = req.user?.id || 'anonymous';
        const sessionId = req.headers['x-session-id'] || uuidv4();
        const requestId = req.headers['x-request-id'] || uuidv4();
        const feedbackId = uuidv4();

        // Получаем IP адрес и User-Agent
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        // SQL запрос для вставки отзыва
        const insertQuery = `
      INSERT INTO feedbacks (
        id, user_id, session_id, request_id, rating, 
        main_content, comment, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            feedbackId,
            userId,
            sessionId,
            requestId,
            rating,
            main_content || null,
            comment || null,
            ipAddress,
            userAgent
        ];

        await executeQuery(insertQuery, values);

        // Логирование успешного создания отзыва
        console.log(`Feedback created: ${feedbackId} by user: ${userId}`);

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: {
                feedback_id: feedbackId,
                rating: rating,
                submitted_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error creating feedback:', error);

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
};

// Получение отзывов пользователя (опционально)
const getUserFeedbacks = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                code: 'AUTH_REQUIRED'
            });
        }

        const query = `
      SELECT id, rating, main_content, comment, created_at 
      FROM feedbacks 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `;

        const feedbacks = await executeQuery(query, [userId]);

        res.json({
            success: true,
            data: {
                feedbacks: feedbacks,
                total: feedbacks.length
            }
        });

    } catch (error) {
        console.error('Error fetching user feedbacks:', error);

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
};

// Получение статистики отзывов (для админов)
const getFeedbackStats = async (req, res) => {
    try {
        const statsQuery = `
      SELECT 
        COUNT(*) as total_feedbacks,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_count,
        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_count
      FROM feedbacks
    `;

        const stats = await executeQuery(statsQuery);

        res.json({
            success: true,
            data: stats[0]
        });

    } catch (error) {
        console.error('Error fetching feedback stats:', error);

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
};

module.exports = {
    createFeedback,
    getUserFeedbacks,
    getFeedbackStats
};

