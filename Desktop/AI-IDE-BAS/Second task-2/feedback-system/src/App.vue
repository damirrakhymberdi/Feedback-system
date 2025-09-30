<script setup>
import { ref } from 'vue'
import apiService from './services/api.js'

const rating = ref(0)
const hoveredRating = ref(0)
const comment = ref('')
const mainContent = ref('')
const isSubmitted = ref(false)
const showCommentField = ref(false)
const showResetButton = ref(false)

const handleMouseEnter = (starIndex) => {
  hoveredRating.value = starIndex
}

const handleStarClick = (starIndex) => {
  rating.value = starIndex
  showCommentField.value = true
}

const submitFeedback = async () => {
  try {
    // Показываем индикатор загрузки
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
    }

    // Подготавливаем данные для отправки
    const feedbackData = {
      rating: rating.value,
      main_content: mainContent.value,
      comment: comment.value
    };

    console.log('Sending feedback:', feedbackData);

    // Отправляем данные на сервер
    const result = await apiService.submitFeedback(feedbackData);
    
    console.log('Feedback submitted successfully:', result);

    // Показываем сообщение об успешной отправке
    isSubmitted.value = true
    showCommentField.value = false
    
    // Через 1.5 секунды показываем кнопку "Начать новую задачу"
    setTimeout(() => {
      showResetButton.value = true
    }, 1500)

  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    // Показываем ошибку пользователю
    alert('Ошибка при отправке отзыва: ' + error.message);
    
    // Восстанавливаем кнопку
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    }
  }
}

const resetForm = () => {
  rating.value = 0
  hoveredRating.value = 0
  comment.value = ''
  mainContent.value = ''
  isSubmitted.value = false
  showCommentField.value = false
  showResetButton.value = false
}
</script>

<template>
  <div class="app">
    <!-- Animated background particles -->
    <div class="particles">
      <div 
        v-for="i in 20" 
        :key="i"
        class="particle"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: (5 + Math.random() * 10) + 's'
        }"
      ></div>
    </div>

    <div class="container">
      <!-- Title -->
      <h1 class="title">Оцените ответ ассистента</h1>

      <!-- Main Content -->
      <div class="main-content">
        <h2 class="content-title">
          <span class="pulse-dot"></span>
          Основной контент ответа ассистента
        </h2>
        <textarea 
          v-model="mainContent"
          placeholder="Здесь вы можете написать свой отзыв или комментарий..."
          class="main-textarea"
        ></textarea>
      </div>

      <!-- Rating Section -->
      <div v-if="!isSubmitted" class="rating-section">
        <div class="stars" @mouseleave="hoveredRating = 0">
          <span 
            v-for="star in 5" 
            :key="star"
            class="star"
            :class="{
              'active': star <= (hoveredRating || rating),
              'clicked': star <= rating
            }"
            @mouseenter="handleMouseEnter(star)"
            @click="handleStarClick(star)"
          >
            ★
          </span>
        </div>

        <div v-if="showCommentField" class="submit-section">
          <button @click="submitFeedback" class="submit-btn">
            <span class="btn-text">Отправить</span>
            <div class="btn-overlay"></div>
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="isSubmitted" class="success-message">
        <div class="success-content">
          <div class="checkmark-circle">
            <svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="success-text">Спасибо за отзыв!</p>
        </div>
      </div>

      <!-- Reset Button -->
      <div v-if="showResetButton" class="reset-section">
        <button @click="resetForm" class="reset-btn">
          <span class="reset-content">
            <svg class="reset-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Начать новую задачу
          </span>
          
          <!-- Wave effect -->
          <div class="wave-effect"></div>
          
          <!-- Pulse rings -->
          <div class="pulse-ring"></div>
          <div class="pulse-ring-slow"></div>
          
          <!-- Particles -->
          <div class="hover-particles">
            <div 
              v-for="i in 8" 
              :key="i"
              class="hover-particle"
              :style="{
                left: (20 + i * 10) + '%',
                animationDelay: (i * 0.1) + 's'
              }"
            ></div>
          </div>
          
          <!-- Glow -->
          <div class="glow-effect"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Container */
.app {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #78350f 50%, #78350f 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  opacity: 0.2;
  animation: float linear infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) translateX(0); 
  }
  50% { 
    transform: translateY(-100px) translateX(50px); 
  }
}

/* Container */
.container {
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 10;
}

/* Title */
.title {
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  background: linear-gradient(90deg, #fde68a, #fb923c, #fbbf24);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-shift 3s ease infinite;
  letter-spacing: -0.5px;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Main Content */
.main-content {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid rgba(251, 146, 60, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
}

.main-content:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 60px rgba(251, 146, 60, 0.2);
}

.content-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #fde68a;
  display: flex;
  align-items: center;
  gap: 12px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.main-textarea {
  width: 100%;
  min-height: 150px;
  padding: 20px;
  background: rgba(2, 6, 23, 0.5);
  border: 2px solid #334155;
  border-radius: 16px;
  color: #e2e8f0;
  font-size: 18px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
}

.main-textarea::placeholder {
  color: #64748b;
}

.main-textarea:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
}

/* Rating Section */
.rating-section {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid rgba(249, 115, 22, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.stars {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.star {
  font-size: 64px;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.star.active,
.star.clicked,
.star:hover {
  color: #fb923c;
  text-shadow: 0 0 20px rgba(251, 146, 60, 0.6), 0 0 40px rgba(251, 146, 60, 0.4);
  filter: drop-shadow(0 0 10px #fb923c);
  transform: scale(1.25) rotate(12deg);
}

/* Submit Button */
.submit-section {
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.submit-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #f97316, #f59e0b);
  color: white;
  font-weight: 700;
  font-size: 18px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-text {
  position: relative;
  z-index: 10;
}

.btn-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.submit-btn:hover {
  transform: scale(1.05) translateY(-4px);
  box-shadow: 0 12px 32px rgba(251, 146, 60, 0.5);
}

.submit-btn:hover .btn-overlay {
  opacity: 1;
}

.submit-btn:active {
  transform: scale(0.95);
}

/* Success Message */
.success-message {
  background: linear-gradient(135deg, rgba(6, 78, 59, 0.9), rgba(19, 78, 74, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.success-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.checkmark-circle {
  width: 64px;
  height: 64px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: checkmark-pop 0.5s ease 0.2s forwards;
  transform: scale(0);
}

@keyframes checkmark-pop {
  0% {
    transform: scale(0) rotate(-45deg);
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.checkmark {
  width: 40px;
  height: 40px;
  color: white;
}

.success-text {
  font-size: 24px;
  font-weight: 700;
  color: #a7f3d0;
}

/* Reset Button */
.reset-section {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.reset-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #334155, #1e293b);
  color: #fde68a;
  font-weight: 700;
  font-size: 18px;
  border: 2px solid rgba(251, 146, 60, 0.3);
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
}

.reset-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.reset-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.7s ease;
}

.reset-btn:hover .reset-icon {
  transform: rotate(360deg);
}

.reset-btn:hover {
  transform: scale(1.1) translateY(-8px);
  border-color: #fbbf24;
  box-shadow: 0 16px 48px rgba(251, 146, 60, 0.5);
}

.reset-btn:active {
  transform: scale(0.95);
}

/* Wave Effect */
.wave-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(251, 146, 60, 0), rgba(251, 191, 36, 0.4), rgba(251, 146, 60, 0));
  transform: translateX(-100%);
  transition: transform 1s ease-out;
}

.reset-btn:hover .wave-effect {
  transform: translateX(100%);
}

/* Pulse Rings */
.pulse-ring {
  position: absolute;
  inset: 0;
  background: rgba(251, 146, 60, 0.3);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.reset-btn:hover .pulse-ring {
  opacity: 1;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.pulse-ring-slow {
  position: absolute;
  inset: 0;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.reset-btn:hover .pulse-ring-slow {
  opacity: 1;
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
}

/* Hover Particles */
.hover-particles {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.reset-btn:hover .hover-particles {
  opacity: 1;
}

.hover-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fde68a;
  border-radius: 50%;
  top: 50%;
  animation: particle-rise 0.8s ease-out infinite;
}

@keyframes particle-rise {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(0, -40px) scale(0);
    opacity: 0;
  }
}

/* Glow Effect */
.glow-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(249, 115, 22, 0), rgba(251, 191, 36, 0), rgba(249, 115, 22, 0));
  filter: blur(20px);
  transition: all 0.5s ease;
}

.reset-btn:hover .glow-effect {
  background: linear-gradient(90deg, rgba(249, 115, 22, 0), rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0));
}

/* Responsive */
@media (max-width: 640px) {
  .app {
    padding: 15px;
  }

  .title {
    font-size: 32px;
    margin-bottom: 32px;
  }

  .main-content,
  .rating-section {
    padding: 24px;
  }

  .star {
    font-size: 48px;
  }

  .content-title {
    font-size: 20px;
  }

  .main-textarea {
    font-size: 16px;
  }
}
</style>