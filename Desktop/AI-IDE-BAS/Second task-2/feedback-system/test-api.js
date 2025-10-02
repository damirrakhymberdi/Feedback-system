// Тестовый скрипт для проверки API feedback system
const http = require('http');

const API_BASE = 'http://localhost:3001';

// Функция для выполнения HTTP запросов
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const jsonBody = JSON.parse(body);
                    resolve({ status: res.statusCode, data: jsonBody });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Тест 1: Health Check
async function testHealthCheck() {
    console.log('\n🔍 Тест 1: Health Check');
    console.log('='.repeat(50));

    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/health',
            method: 'GET'
        });

        console.log(`Статус: ${result.status}`);
        console.log('Ответ:', JSON.stringify(result.data, null, 2));

        if (result.status === 200 && result.data.success) {
            console.log('✅ Health check прошел успешно!');
            return true;
        } else {
            console.log('❌ Health check не прошел!');
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка при health check:', error.message);
        return false;
    }
}

// Тест 2: Создание отзыва (валидные данные)
async function testCreateFeedbackValid() {
    console.log('\n🔍 Тест 2: Создание отзыва (валидные данные)');
    console.log('='.repeat(50));

    const feedbackData = {
        rating: 5,
        main_content: 'Отличный ответ ассистента! Очень помог с задачей.',
        comment: 'Спасибо за помощь!'
    };

    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/api/feedback',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': 'test-session-123',
                'X-Request-ID': 'test-request-456'
            }
        }, feedbackData);

        console.log(`Статус: ${result.status}`);
        console.log('Ответ:', JSON.stringify(result.data, null, 2));

        if (result.status === 201 && result.data.success) {
            console.log('✅ Создание отзыва прошло успешно!');
            return true;
        } else {
            console.log('❌ Создание отзыва не прошло!');
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка при создании отзыва:', error.message);
        return false;
    }
}

// Тест 3: Создание отзыва (невалидные данные)
async function testCreateFeedbackInvalid() {
    console.log('\n🔍 Тест 3: Создание отзыва (невалидные данные)');
    console.log('='.repeat(50));

    const invalidData = {
        rating: 6, // Невалидный рейтинг (должен быть 1-5)
        main_content: 'A'.repeat(6000), // Слишком длинный контент
        comment: 'B'.repeat(1500) // Слишком длинный комментарий
    };

    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/api/feedback',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, invalidData);

        console.log(`Статус: ${result.status}`);
        console.log('Ответ:', JSON.stringify(result.data, null, 2));

        if (result.status === 400 && result.data.success === false) {
            console.log('✅ Валидация работает корректно!');
            return true;
        } else {
            console.log('❌ Валидация не работает!');
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка при тестировании валидации:', error.message);
        return false;
    }
}

// Тест 4: Тест CORS
async function testCORS() {
    console.log('\n🔍 Тест 4: CORS Headers');
    console.log('='.repeat(50));

    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/health',
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });

        console.log(`Статус: ${result.status}`);
        console.log('Ответ:', JSON.stringify(result.data, null, 2));

        if (result.status === 200) {
            console.log('✅ CORS работает!');
            return true;
        } else {
            console.log('❌ CORS не работает!');
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка при тестировании CORS:', error.message);
        return false;
    }
}

// Тест 5: 404 Handler
async function test404Handler() {
    console.log('\n🔍 Тест 5: 404 Handler');
    console.log('='.repeat(50));

    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/nonexistent-endpoint',
            method: 'GET'
        });

        console.log(`Статус: ${result.status}`);
        console.log('Ответ:', JSON.stringify(result.data, null, 2));

        if (result.status === 404 && result.data.success === false) {
            console.log('✅ 404 Handler работает корректно!');
            return true;
        } else {
            console.log('❌ 404 Handler не работает!');
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка при тестировании 404:', error.message);
        return false;
    }
}

// Запуск всех тестов
async function runAllTests() {
    console.log('🚀 Начинаем тестирование Feedback System API');
    console.log('='.repeat(60));

    const results = [];

    results.push(await testHealthCheck());
    results.push(await testCreateFeedbackValid());
    results.push(await testCreateFeedbackInvalid());
    results.push(await testCORS());
    results.push(await test404Handler());

    console.log('\n📊 Результаты тестирования:');
    console.log('='.repeat(60));
    const passed = results.filter(r => r).length;
    const total = results.length;

    console.log(`✅ Пройдено: ${passed}/${total}`);
    console.log(`❌ Провалено: ${total - passed}/${total}`);

    if (passed === total) {
        console.log('\n🎉 Все тесты прошли успешно!');
    } else {
        console.log('\n⚠️  Некоторые тесты провалились!');
    }
}

// Запуск тестов
runAllTests().catch(console.error);


