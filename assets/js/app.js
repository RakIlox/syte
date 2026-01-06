// app.js - основной файл приложения

class CyberThreatApp {
    constructor() {
        this.dataHandler = dataHandler;
        this.mapRenderer = null;
        this.uiManager = null;
        this.isInitialized = false;
    }

    // Инициализация приложения
    async init() {
        try {
            // Инициализируем обработчик данных
            await this.dataHandler.init();
            
            // Инициализируем карту (рисуется один раз)
            this.mapRenderer = new MapRenderer('world-map');
            await this.mapRenderer.init();
            
            // Делаем глобально доступным
            window.mapRenderer = this.mapRenderer;
            
            // Рисуем атаки на карте один раз
            const initialAttacks = this.dataHandler.getMapData();
            this.mapRenderer.drawAttacks(initialAttacks);
            
            // Инициализируем UI менеджер
            this.uiManager = new UIManager();
            this.uiManager.init();
            
            // Делаем глобально доступным
            window.uiManager = this.uiManager;
            
            // Слушаем обновление статистики (в реальном времени)
            this.bindStatsUpdates();
            
            this.isInitialized = true;
            console.log('Приложение инициализировано успешно');
            
        } catch (error) {
            console.error('Ошибка инициализации:', error);
        }
    }

    // Обновление статистики в реальном времени
    bindStatsUpdates() {
        // Слушаем событие newAttack для обновления статистики
        document.addEventListener('newAttack', (event) => {
            this.updateStatsDisplay();
        });
        
        // Первичное отображение статистики
        this.updateStatsDisplay();
    }

    // Обновление отображения статистики
    updateStatsDisplay() {
        const stats = this.dataHandler.getStats();
        
        // Обновляем счётчики
        const totalEl = document.getElementById('total-attacks');
        const activeEl = document.getElementById('active-now');
        const topCountryEl = document.getElementById('top-country');
        const topTypeEl = document.getElementById('top-type');
        
        if (totalEl) totalEl.textContent = stats.total;
        if (activeEl) activeEl.textContent = stats.active;
        if (topCountryEl) topCountryEl.textContent = stats.topCountry;
        if (topTypeEl) topTypeEl.textContent = stats.topType;
        
        // Обновляем время
        const timeEl = document.getElementById('last-update');
        if (timeEl) {
            timeEl.textContent = this.dataHandler.updateLastUpdateTime();
        }
    }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const app = new CyberThreatApp();
    
    try {
        await app.init();
    } catch (error) {
        console.error('Критическая ошибка:', error);
    }
});

