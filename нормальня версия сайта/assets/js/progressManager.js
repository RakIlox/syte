// progressManager.js - управление прогрессом обучения

class ProgressManager {
    constructor() {
        this.storageKey = 'cyberThreatProgress';
        this.viewedLessonsKey = 'viewedLessons';
        this.testResultsKey = 'testResults';
        this.quizAnswersKey = 'quizAnswers';
    }

    // Получить данные прогресса
    getProgress() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {
                viewedLessons: [],
                testResults: {},
                quizAnswers: {},
                lastUpdated: null
            };
        } catch (e) {
            console.warn('Ошибка чтения прогресса:', e);
            return {
                viewedLessons: [],
                testResults: {},
                quizAnswers: {},
                lastUpdated: null
            };
        }
    }

    // Сохранить прогресс
    saveProgress(progress) {
        try {
            progress.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
            return true;
        } catch (e) {
            console.warn('Ошибка сохранения прогресса:', e);
            return false;
        }
    }

    // Отметить урок как просмотренный
    markLessonViewed(lessonId) {
        const progress = this.getProgress();
        if (!progress.viewedLessons.includes(lessonId)) {
            progress.viewedLessons.push(lessonId);
            this.saveProgress(progress);
            console.log('Урок отмечен как просмотренный:', lessonId);
        }
        return progress.viewedLessons.length;
    }

    // Получить список просмотренных уроков
    getViewedLessons() {
        try {
            const data = localStorage.getItem(this.viewedLessonsKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // Сохранить результат теста
    saveTestResult(testId, score, totalQuestions, answers) {
        const progress = this.getProgress();
        progress.testResults[testId] = {
            score: score,
            total: totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            completedAt: new Date().toISOString(),
            answers: answers
        };
        this.saveProgress(progress);
        return progress.testResults[testId];
    }

    // Получить результат теста
    getTestResult(testId) {
        const progress = this.getProgress();
        return progress.testResults[testId] || null;
    }

    // Сохранить ответ на вопрос квиза
    saveQuizAnswer(lessonId, questionIndex, answerIndex, isCorrect) {
        const progress = this.getProgress();
        if (!progress.quizAnswers[lessonId]) {
            progress.quizAnswers[lessonId] = [];
        }
        progress.quizAnswers[lessonId][questionIndex] = {
            answer: answerIndex,
            correct: isCorrect,
            timestamp: new Date().toISOString()
        };
        this.saveProgress(progress);
    }

    // Получить ответы на квиз урока
    getQuizAnswers(lessonId) {
        const progress = this.getProgress();
        return progress.quizAnswers[lessonId] || [];
    }

    // Очистить весь прогресс
    clearAllProgress() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.viewedLessonsKey);
            localStorage.removeItem(this.testResultsKey);
            localStorage.removeItem(this.quizAnswersKey);
            console.log('Прогресс очищен');
            return true;
        } catch (e) {
            console.warn('Ошибка очистки прогресса:', e);
            return false;
        }
    }

    // Получить статистику прогресса
    getStats() {
        const progress = this.getProgress();
        const testResults = Object.values(progress.testResults);
        
        const totalTests = testResults.length;
        const totalTestScore = testResults.reduce((sum, r) => sum + r.percentage, 0);
        const avgTestScore = totalTests > 0 ? Math.round(totalTestScore / totalTests) : 0;
        
        return {
            viewedLessons: progress.viewedLessons.length,
            totalTests: totalTests,
            avgTestScore: avgTestScore,
            completedTests: testResults.filter(r => r.percentage >= 70).length
        };
    }
}

// Создаем глобальный экземпляр
const progressManager = new ProgressManager();

// Функция для обновления UI прогресса (вызывается из других скриптов)
function updateProgress() {
    const stats = progressManager.getStats();
    
    // Обновляем элементы если они существуют
    const viewedCount = document.getElementById('viewed-lessons-count');
    if (viewedCount) {
        viewedCount.textContent = stats.viewedLessons;
    }
    
    const testCount = document.getElementById('completed-tests-count');
    if (testCount) {
        testCount.textContent = stats.completedTests + '/' + stats.totalTests;
    }
    
    const avgScore = document.getElementById('avg-test-score');
    if (avgScore) {
        avgScore.textContent = stats.avgTestScore + '%';
    }
    
    console.log('Прогресс обновлён:', stats);
}

// Функция для отметки урока как просмотренного
function markLessonViewed(lessonId) {
    return progressManager.markLessonViewed(lessonId);
}

// Функция для получения статуса урока
function isLessonViewed(lessonId) {
    const viewedLessons = progressManager.getViewedLessons();
    return viewedLessons.includes(lessonId);
}

// Функция для сохранения результата теста
function saveTestResult(testId, score, totalQuestions, answers) {
    return progressManager.saveTestResult(testId, score, totalQuestions, answers);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем прогресс при загрузке
    updateProgress();
    
    // Слушаем изменения localStorage (для синхронизации между вкладками)
    window.addEventListener('storage', (e) => {
        if (e.key === progressManager.storageKey || 
            e.key === progressManager.viewedLessonsKey) {
            updateProgress();
        }
    });
});

