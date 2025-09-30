# 🚀 Инструкция по развертыванию Feedback System

## 📋 Быстрый старт

### 1. Клонирование и установка
```bash
# Клонируйте репозиторий
git clone <repository-url>
cd feedback-system

# Установите все зависимости
npm run setup
```

### 2. Настройка базы данных
```bash
# Создайте базу данных MySQL
mysql -u root -p
CREATE DATABASE feedback_system;

# Выполните SQL скрипт
mysql -u root -p feedback_system < database/create_feedbacks_table.sql
```

### 3. Настройка переменных окружения
Создайте файл `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=feedback_system
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Запуск приложения

**Терминал 1 (Backend):**
```bash
npm run backend
```

**Терминал 2 (Frontend):**
```bash
npm run dev
```

### 5. Проверка работы
- Frontend: http://localhost:5173/
- Backend: http://localhost:3001/health

## 🔧 Альтернативные способы запуска

### Способ 1: Ручной запуск
```bash
# Backend
cd backend
npm install
node server.js

# Frontend (в новом терминале)
npm install
npm run dev
```

### Способ 2: Docker (если настроен)
```bash
docker-compose up
```

## 🐛 Решение проблем

### Проблема: "Cannot find module"
```bash
# Удалите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install
```

### Проблема: "Port already in use"
```bash
# Найдите процесс на порту 3001
netstat -ano | findstr :3001
# Убейте процесс
taskkill /PID <process_id> /F
```

### Проблема: "Database connection failed"
- Проверьте, что MySQL запущен
- Проверьте настройки в .env файле
- Убедитесь, что база данных создана

## 📊 Мониторинг

### Проверка состояния API
```bash
curl http://localhost:3001/health
```

### Логи сервера
```bash
# Backend логи выводятся в консоль
# Frontend логи в браузере (F12 -> Console)
```

## 🔒 Безопасность

### Для продакшена:
1. Измените JWT_SECRET на сложный ключ
2. Настройте HTTPS
3. Ограничьте CORS_ORIGIN
4. Используйте переменные окружения для паролей БД

## 📈 Производительность

### Рекомендации:
- Используйте PM2 для продакшена
- Настройте Nginx как reverse proxy
- Включите кэширование
- Мониторьте использование памяти

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли
2. Убедитесь, что все порты свободны
3. Проверьте подключение к базе данных
4. Обратитесь к разработчику
