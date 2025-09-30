const Joi = require('joi');

// Схема валидации для отзыва
const feedbackSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required()
        .messages({
            'number.base': 'Rating must be a number',
            'number.integer': 'Rating must be an integer',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating must be at most 5',
            'any.required': 'Rating is required'
        }),

    main_content: Joi.string().max(5000).optional().allow('')
        .messages({
            'string.max': 'Main content must not exceed 5000 characters'
        }),

    comment: Joi.string().max(1000).optional().allow('')
        .messages({
            'string.max': 'Comment must not exceed 1000 characters'
        })
});

// Middleware для валидации данных отзыва
const validateFeedback = (req, res, next) => {
    const { error, value } = feedbackSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors,
            code: 'VALIDATION_ERROR'
        });
    }

    req.validatedData = value;
    next();
};

// Middleware для проверки rate limiting
const createRateLimit = require('express-rate-limit');

const feedbackRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 10, // максимум 10 запросов за 15 минут
    message: {
        success: false,
        message: 'Too many feedback submissions, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    validateFeedback,
    feedbackRateLimit
};

