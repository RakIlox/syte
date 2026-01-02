/**
 * ProgressManager - Управление прогрессом обучения
 * Сохраняет в localStorage: просмотренные уроки, результаты тестов, прогресс глав
 */

class ProgressManager {
    constructor() {
        this.storageKey = 'cyberthreat_progress';
        this.defaultData = {
            chapters: {
                chapter1: {
                    lessonsViewed: [],
                    testPassed: false,
                    testScore: 0,
                    testAttempts: 0
                },
                chapter2: {
                    lessonsViewed: [],
                    testPassed: false,
                    testScore: 0,
                    testAttempts: 0
                },
                chapter3: {
                    lessonsViewed: [],
                    testPassed: false,
                    testScore: 0,
                    testAttempts: 0
                }
            },
            lastUpdated: null,
            totalLessonsViewed: 0
        };
        
        this.data = this.load();
    }

    // Загрузка данных из localStorage
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Объединяем с дефолтными данными для совместимости
                return this.mergeWithDefault(parsed);
            }
            return JSON.parse(JSON.stringify(this.defaultData));
        } catch (e) {
            console.error('Ошибка загрузки прогресса:', e);
            return JSON.parse(JSON.stringify(this.defaultData));
        }
    }

    // Объединение с дефолтными данными (для новых полей)
    mergeWithDefault(stored) {
        const defaultData = JSON.parse(JSON.stringify(this.defaultData));
        
        stored.chapters = stored.chapters || {};
        
        // Проверяем каждую главу
        Object.keys(defaultData.chapters).forEach(chapterId => {
            if (!stored.chapters[chapterId]) {
                stored.chapters[chapterId] = defaultData.chapters[chapterId];
            } else {
                // Объединяем поля главы
                stored.chapters[chapterId] = {
                    ...defaultData.chapters[chapterId],
                    ...stored.chapters[chapterId]
                };
            }
        });
        
        return stored;
    }

    // Сохранение данных в localStorage
    save() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Ошибка сохранения прогресса:', e);
        }
    }

    // Отметить урок как просмотренный
    markLessonViewed(lessonId, chapterId) {
        const chapter = this.data.chapters[chapterId];
        if (!chapter) return false;
        
        if (!chapter.lessonsViewed.includes(lessonId)) {
            chapter.lessonsViewed.push(lessonId);
            this.data.totalLessonsViewed++;
            this.save();
            return true; // Новый урок
        }
        return false; // Уже был просмотрен
    }

    // Получить количество просмотренных уроков в главе
    getLessonsViewedCount(chapterId) {
        const chapter = this.data.chapters[chapterId];
        return chapter ? chapter.lessonsViewed.length : 0;
    }

    // Проверить, все ли уроки просмотрены
    areAllLessonsViewed(chapterId, totalLessons) {
        const viewed = this.getLessonsViewedCount(chapterId);
        return viewed >= totalLessons;
    }

    // Проверить, открыт ли тест главы
    isTestAvailable(chapterId, totalLessons) {
        // Тест доступен если все уроки просмотрены И тест ещё не сдан
        const chapter = this.data.chapters[chapterId];
        if (!chapter) return false;
        
        return this.areAllLessonsViewed(chapterId, totalLessons) && !chapter.testPassed;
    }

    // Проверить, открыта ли следующая глава
    isNextChapterAvailable(currentChapterId) {
        // Предыдущая глава должна быть сдана
        const chapterNum = parseInt(currentChapterId.replace('chapter', ''));
        if (chapterNum <= 1) return true; // Глава 1 всегда открыта
        
        const prevChapterId = `chapter${chapterNum - 1}`;
        return this.data.chapters[prevChapterId]?.testPassed === true;
    }

    // Сохранить результат теста
    saveTestResult(chapterId, score, passed) {
        const chapter = this.data.chapters[chapterId];
        if (!chapter) return false;
        
        chapter.testScore = score;
        chapter.testPassed = passed;
        chapter.testAttempts++;
        this.save();
        
        return passed;
    }

    // Получить результаты теста главы
    getTestResult(chapterId) {
        const chapter = this.data.chapters[chapterId];
        return chapter ? {
            passed: chapter.testPassed,
            score: chapter.testScore,
            attempts: chapter.testAttempts
        } : null;
    }

    // Получить прогресс главы в процентах
    getChapterProgress(chapterId, totalLessons) {
        const viewed = this.getLessonsViewedCount(chapterId);
        return Math.round((viewed / totalLessons) * 100);
    }

    // Получить прогресс прохождения всей главы (уроки + тест)
    getFullChapterProgress(chapterId, totalLessons) {
        const chapter = this.data.chapters[chapterId];
        if (!chapter) return 0;
        
        // 80% - уроки, 20% - тест
        const lessonsProgress = (this.getLessonsViewedCount(chapterId) / totalLessons) * 80;
        const testProgress = chapter.testPassed ? 20 : 0;
        
        return Math.min(100, Math.round(lessonsProgress + testProgress));
    }

    // Сбросить прогресс главы (для тестирования)
    resetChapter(chapterId) {
        if (this.data.chapters[chapterId]) {
            this.data.chapters[chapterId] = JSON.parse(JSON.stringify(this.defaultData.chapters[chapterId]));
            this.save();
            return true;
        }
        return false;
    }

    // Сбросить весь прогресс
    resetAll() {
        this.data = JSON.parse(JSON.stringify(this.defaultData));
        this.save();
        return true;
    }

    // Получить все данные прогресса
    getAllData() {
        return this.data;
    }

    // Экспорт прогресса (для отладки)
    export() {
        return JSON.stringify(this.data, null, 2);
    }

    // Импорт прогресса
    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.data = this.mergeWithDefault(imported);
            this.save();
            return true;
        } catch (e) {
            console.error('Ошибка импорта:', e);
            return false;
        }
    }
}

// Создаём глобальный экземпляр
const progressManager = new ProgressManager();

// Функции для отладки в консоли
window.debugProgress = {
    get: () => progressManager.getAllData(),
    resetChapter: (id) => progressManager.resetChapter(id),
    resetAll: () => progressManager.resetAll(),
    export: () => progressManager.export(),
    import: (str) => progressManager.import(str)
};

