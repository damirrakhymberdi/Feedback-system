// API service for feedback system
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Получение токена из localStorage
    getAuthToken() {
        return localStorage.getItem('auth_token');
    }

    // Создание заголовков для запроса
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // Добавляем уникальные идентификаторы
        const sessionId = this.getOrCreateSessionId();
        const requestId = this.generateRequestId();

        headers['X-Session-ID'] = sessionId;
        headers['X-Request-ID'] = requestId;

        return headers;
    }

    // Получение или создание session ID
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = this.generateRequestId();
            localStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    // Генерация уникального ID
    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Отправка отзыва
    async submitFeedback(feedbackData) {
        try {
            const response = await fetch(`${this.baseURL}/api/feedback`, {
                method: 'POST',
                headers: this.getHeaders(false), // Не требуем обязательной авторизации
                body: JSON.stringify(feedbackData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit feedback');
            }

            return result;
        } catch (error) {
            console.error('Error submitting feedback:', error);
            throw error;
        }
    }

    // Получение отзывов пользователя
    async getUserFeedbacks() {
        try {
            const response = await fetch(`${this.baseURL}/api/feedback/user`, {
                method: 'GET',
                headers: this.getHeaders(true) // Требуем авторизации
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch feedbacks');
            }

            return result;
        } catch (error) {
            console.error('Error fetching user feedbacks:', error);
            throw error;
        }
    }

    // Получение статистики отзывов
    async getFeedbackStats() {
        try {
            const response = await fetch(`${this.baseURL}/api/feedback/stats`, {
                method: 'GET',
                headers: this.getHeaders(true) // Требуем авторизации
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch stats');
            }

            return result;
        } catch (error) {
            console.error('Error fetching feedback stats:', error);
            throw error;
        }
    }

    // Проверка здоровья API
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API health check failed:', error);
            return { success: false, message: 'API is not available' };
        }
    }
}

// Создаем единственный экземпляр сервиса
const apiService = new ApiService();

export default apiService;

