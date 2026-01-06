// dataHandler.js - обработка и генерация данных об атаках

class DataHandler {
    constructor() {
        this.attacks = [];
        this.countries = {};
        this.lastUpdate = null;
        this.isPlaying = true;
        this.animationInterval = null;
        
        // Определения атак для модальных окон
        this.attackDefinitions = {
            ddos: {
                title: "DDoS-атака",
                explanation: "Злоумышленники пытаются «обрушить» сайты или сервисы, перегружая их огромным количеством ложных запросов. Это как толпа, которая одновременно пытается войти в одну дверь магазина — законные покупатели не могут попасть внутрь.",
                technical: "Атака ведется с помощью «ботнета» — сети зараженных компьютеров (ботов) по всему миру. Каждый бот по команде начинает слать запросы к цели. Остановить сложно, потому что запросы идут с тысяч разных адресов.",
                protection: [
                    "Не кликайте на подозрительные ссылки — ваш компьютер могут сделать частью ботнета",
                    "Используйте антивирус и регулярно обновляйте программы",
                    "Если сайт не работает — возможно, он под атакой. Подождите немного"
                ]
            },
            phishing: {
                title: "Фишинговая атака",
                explanation: "Мошенники рассылают поддельные письма или сообщения, которые выглядят как от известных компаний. Цель — заставить вас ввести свои логины, пароли или данные банковской карты.",
                technical: "Создается точная копия сайта банка или соцсети. Ссылка ведет на этот фейковый сайт, где все введенные данные попадают к злоумышленникам.",
                protection: [
                    "Проверяйте адрес сайта в строке браузера",
                    "Не переходите по ссылкам в подозрительных письмах",
                    "Включайте двухфакторную аутентификацию везде, где это возможно"
                ]
            },
            malware: {
                title: "Распространение вредоносного ПО",
                explanation: "Злоумышленники пытаются установить на ваш компьютер вирусы, трояны или шпионские программы. Эти программы могут ворять данные, показывать рекламу или использовать ваш компьютер для майнинга криптовалюты.",
                technical: "Вредоносное ПО часто скрывается в пиратских программах, взломанных играх или вложениях к письмам. После запуска оно устанавливается в систему и начинает свою работу.",
                protection: [
                    "Устанавливайте программы только с официальных сайтов",
                    "Не открывайте вложения от незнакомых отправителей",
                    "Регулярно делайте резервные копии важных файлов"
                ]
            },
            scanning: {
                title: "🔍 Сканирование уязвимостей",
                icon: "🔍",
                explanation: "Злоумышленники автоматически проверяют тысячи компьютеров на наличие известных уязвимостей. Это как вор, который проверяет все двери в доме — ищет, какая не заперта.",
                technical: "Используются специальные программы-сканеры, которые проверяют стандартные порты и сервисы. Найдя уязвимость, злоумышленник может использовать её для взлома.",
                protection: [
                    "Всегда устанавливайте обновления безопасности",
                    "Используйте брандмауэр",
                    "Отключайте неиспользуемые сетевые сервисы"
                ]
            },
            bruteforce: {
                title: "🔨 Подбор паролей",
                icon: "🔨",
                explanation: "Автоматический перебор всех возможных паролей для взлома учетной записи. Хакеры используют программы, которые пробуют тысячи паролей в секунду.",
                technical: "Часто используются словари популярных паролей и базы утекших паролей. Эффективно против простых и распространенных паролей.",
                protection: [
                    "Используйте длинные сложные пароли (минимум 12 символов)",
                    "Не используйте один пароль на разных сайтах",
                    "Включите двухфакторную аутентификацию"
                ]
            },
            sqlInjection: {
                title: "💉 SQL-инъекция",
                icon: "💉",
                explanation: "Атака на базы данных веб-сайтов. Злоумышленник вводит специальный код в поля ввода, чтобы получить доступ к данным или удалить их.",
                technical: "Если сайт не фильтрует ввод пользователя, злоумышленник может выполнить произвольные SQL-запросы к базе данных.",
                protection: [
                    "Для разработчиков: используйте подготовленные запросы (prepared statements)",
                    "Не храните лишние данные в базе",
                    "Регулярно обновляйте СУБД"
                ]
            },
            xss: {
                title: "⚡ XSS-атака",
                icon: "⚡",
                explanation: "Межсайтовый скриптинг. Злоумышленник внедряет вредоносный JavaScript код на страницу, который выполняется у других пользователей.",
                technical: "Когда пользователь посещает зараженную страницу, скрипт может украсть его cookies, перенаправить на фишинговый сайт или выполнить действия от его имени.",
                protection: [
                    "Для разработчиков: экранируйте пользовательский ввод",
                    "Используйте Content Security Policy",
                    "Не доверяйте никакому JavaScript коду на странице"
                ]
            },
            mitm: {
                title: "👤 Атака «человек посередине»",
                icon: "👤",
                explanation: "Злоумышленник незаметно перехватывает и читает весь трафик между вами и сервером. Может изменять данные в процессе передачи.",
                technical: "Часто реализуется через поддельные точки доступа Wi-Fi или взломанные роутеры.",
                protection: [
                    "Используйте VPN в публичных сетях",
                    "Проверяйте наличие HTTPS на сайтах",
                    "Не вводите важные данные в незащищенных сетях"
                ]
            }
        };
        
        // Координаты стран (упрощенные) - расширенный список
        this.countryCoordinates = {
            // Основные игроки
            'US': { lat: 39.8, lon: -98.5, name: '🇺🇸 США' },
            'CN': { lat: 35.9, lon: 104.2, name: '🇨🇳 Китай' },
            'RU': { lat: 61.5, lon: 105.3, name: '🇷🇺 Россия' },
            'DE': { lat: 51.2, lon: 10.4, name: '🇩🇪 Германия' },
            'GB': { lat: 54.8, lon: -4.6, name: '🇬🇧 Великобритания' },
            'FR': { lat: 46.2, lon: 2.2, name: '🇫🇷 Франция' },
            'JP': { lat: 36.2, lon: 138.3, name: '🇯🇵 Япония' },
            'IN': { lat: 20.6, lon: 78.9, name: '🇮🇳 Индия' },
            'BR': { lat: -14.2, lon: -51.9, name: '🇧🇷 Бразилия' },
            'AU': { lat: -25.3, lon: 133.8, name: '🇦🇺 Австралия' },
            'CA': { lat: 56.1, lon: -106.3, name: '🇨🇦 Канада' },
            'KR': { lat: 35.9, lon: 127.8, name: '🇰🇷 Южная Корея' },
            'IT': { lat: 41.9, lon: 12.6, name: '🇮🇹 Италия' },
            'ES': { lat: 40.5, lon: -3.7, name: '🇪🇸 Испания' },
            'NL': { lat: 52.1, lon: 5.3, name: '🇳🇱 Нидерланды' },
            // Европа
            'PL': { lat: 51.9, lon: 19.1, name: '🇵🇱 Польша' },
            'SE': { lat: 60.1, lon: 18.6, name: '🇸🇪 Швеция' },
            'CH': { lat: 46.8, lon: 8.2, name: '🇨🇭 Швейцария' },
            'UA': { lat: 48.4, lon: 31.1, name: '🇺🇦 Украина' },
            'TR': { lat: 38.9, lon: 35.2, name: '🇹🇷 Турция' },
            // Азия
            'VN': { lat: 14.0, lon: 108.2, name: '🇻🇳 Вьетнам' },
            'ID': { lat: -0.7, lon: 113.9, name: '🇮🇩 Индонезия' },
            'TH': { lat: 15.8, lon: 100.9, name: '🇹🇭 Таиланд' },
            'SG': { lat: 1.3, lon: 103.8, name: '🇸🇬 Сингапур' },
            'HK': { lat: 22.3, lon: 114.1, name: '🇭🇰 Гонконг' },
            // Ближний Восток
            'IL': { lat: 31.0, lon: 35.1, name: '🇮🇱 Израиль' },
            'IR': { lat: 32.4, lon: 53.6, name: '🇮🇷 Иран' },
            // Латинская Америка
            'MX': { lat: 23.6, lon: -102.5, name: '🇲🇽 Мексика' },
            'AR': { lat: -38.4, lon: -63.6, name: '🇦🇷 Аргентина' },
            // Африка
            'ZA': { lat: -30.5, lon: 22.9, name: '🇿🇦 ЮАР' },
            'NG': { lat: 9.0, lon: 8.6, name: '🇳🇬 Нигерия' },
            'EG': { lat: 26.8, lon: 30.8, name: '🇪🇬 Египет' }
        };
        
        // Секторы экономики
        this.sectors = ['finance', 'healthcare', 'government', 'education', 'energy', 'telecom'];
        this.sectorNames = {
            finance: 'Финансы',
            healthcare: 'Здравоохранение',
            government: 'Госструктуры',
            education: 'Образование',
            energy: 'Энергетика',
            telecom: 'Телекоммуникации'
        };
        
        // Типы атак - расширенный список
        this.attackTypes = ['ddos', 'phishing', 'malware', 'scanning', 'bruteforce', 'sqlInjection', 'xss', 'mitm'];
        this.attackTypeNames = {
            ddos: '🔴 DDoS',
            phishing: '🎣 Фишинг',
            malware: '🦠 Вредоносное ПО',
            scanning: '🔍 Сканирование',
            bruteforce: '🔨 Подбор паролей',
            sqlInjection: '💉 SQL-инъекция',
            xss: '⚡ XSS',
            mitm: '👤 MitM'
        };
        
        // Уровни опасности
        this.severityLevels = ['low', 'medium', 'high', 'critical'];
        this.severityNames = {
            low: '🟢 Низкий',
            medium: '🟡 Средний',
            high: '🟠 Высокий',
            critical: '🔴 Критический'
        };
    }

    // Инициализация данных
    async init() {
        await this.generateInitialData();
        this.startAnimation();
        this.updateLastUpdateTime();
        return this.attacks;
    }

    // Генерация начальных данных
    generateInitialData() {
        this.attacks = [];
        const count = 15; // Начальное количество атак
        
        const countries = Object.keys(this.countryCoordinates);
        
        for (let i = 0; i < count; i++) {
            const sourceCountry = countries[Math.floor(Math.random() * countries.length)];
            let targetCountry;
            
            // Убедимся, что цель не совпадает с источником
            do {
                targetCountry = countries[Math.floor(Math.random() * countries.length)];
            } while (targetCountry === sourceCountry);
            
            const attackType = this.attackTypes[Math.floor(Math.random() * this.attackTypes.length)];
            const severity = this.severityLevels[Math.floor(Math.random() * this.severityLevels.length)];
            const sector = this.sectors[Math.floor(Math.random() * this.sectors.length)];
            
            this.attacks.push({
                id: `attack_${Date.now()}_${i}`,
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                sourceCountry,
                targetCountry,
                attackType,
                severity,
                sector,
                description: `${this.attackTypeNames[attackType]} атака из ${this.countryCoordinates[sourceCountry].name} в ${this.countryCoordinates[targetCountry].name}`,
                active: Math.random() > 0.3 // 70% атак активны
            });
        }
    }

    // Добавление новой атаки
    addNewAttack() {
        if (!this.isPlaying) return;
        
        const countries = Object.keys(this.countryCoordinates);
        const sourceCountry = countries[Math.floor(Math.random() * countries.length)];
        let targetCountry;
        
        do {
            targetCountry = countries[Math.floor(Math.random() * countries.length)];
        } while (targetCountry === sourceCountry);
        
        const attackType = this.attackTypes[Math.floor(Math.random() * this.attackTypes.length)];
        const severity = this.severityLevels[Math.floor(Math.random() * this.severityLevels.length)];
        const sector = this.sectors[Math.floor(Math.random() * this.sectors.length)];
        
        const newAttack = {
            id: `attack_${Date.now()}`,
            timestamp: new Date().toISOString(),
            sourceCountry,
            targetCountry,
            attackType,
            severity,
            sector,
            description: `${this.attackTypeNames[attackType]} атака из ${this.countryCoordinates[sourceCountry].name} в ${this.countryCoordinates[targetCountry].name}`,
            active: true
        };
        
        this.attacks.push(newAttack);
        
        // Удаляем старые атаки (больше 50 не храним)
        if (this.attacks.length > 50) {
            this.attacks = this.attacks.slice(-50);
        }
        
        this.updateLastUpdateTime();
        return newAttack;
    }

    // Получение данных для карты
    getMapData() {
        return this.attacks.filter(attack => attack.active);
    }

    // Получение статистики
    getStats() {
        const activeAttacks = this.attacks.filter(a => a.active);
        const attackCountByType = {};
        const attackCountByCountry = {};
        
        activeAttacks.forEach(attack => {
            // Статистика по типам
            attackCountByType[attack.attackType] = (attackCountByType[attack.attackType] || 0) + 1;
            
            // Статистика по странам
            attackCountByCountry[attack.sourceCountry] = (attackCountByCountry[attack.sourceCountry] || 0) + 1;
        });
        
        // Находим самый частый тип атаки
        let topType = '--';
        let maxTypeCount = 0;
        Object.entries(attackCountByType).forEach(([type, count]) => {
            if (count > maxTypeCount) {
                maxTypeCount = count;
                topType = this.attackTypeNames[type];
            }
        });
        
        // Находим самую активную страну
        let topCountry = '--';
        let maxCountryCount = 0;
        Object.entries(attackCountByCountry).forEach(([country, count]) => {
            if (count > maxCountryCount) {
                maxCountryCount = count;
                topCountry = this.countryCoordinates[country]?.name || country;
            }
        });
        
        return {
            total: this.attacks.length,
            active: activeAttacks.length,
            topCountry,
            topType
        };
    }

    // Фильтрация атак
    filterAttacks(filters) {
        return this.attacks.filter(attack => {
            // Проверяем активность атаки
            if (!attack.active) return false;
            
            // Проверяем фильтр по типу атаки
            if (filters.attackType !== 'all' && attack.attackType !== filters.attackType) {
                return false;
            }
            
            // Проверяем фильтр по уровню опасности
            if (filters.severity !== 'all' && attack.severity !== filters.severity) {
                return false;
            }
            
            // Проверяем фильтр по сектору цели (исправлено: sector вместо targetSector)
            if (filters.targetSector !== 'all' && attack.sector !== filters.targetSector) {
                return false;
            }
            
            return true;
        });
    }

    // Получение информации об атаке для модального окна
    getAttackDetails(attack) {
        const definition = this.attackDefinitions[attack.attackType] || this.attackDefinitions.ddos;
        
        return {
            title: `${definition.title} из ${this.countryCoordinates[attack.sourceCountry]?.name || attack.sourceCountry} в ${this.countryCoordinates[attack.targetCountry]?.name || attack.targetCountry}`,
            source: this.countryCoordinates[attack.sourceCountry]?.name || attack.sourceCountry,
            target: this.countryCoordinates[attack.targetCountry]?.name || attack.targetCountry,
            sector: this.sectorNames[attack.sector] || attack.sector,
            severity: this.severityNames[attack.severity] || attack.severity,
            severityClass: `severity-${attack.severity}`,
            explanation: definition.explanation,
            technical: definition.technical,
            protection: definition.protection,
            article: attack.attackType
        };
    }

    // Запуск анимации (добавление новых атак)
    startAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        
        this.animationInterval = setInterval(() => {
            if (this.isPlaying) {
                this.addNewAttack();
                // Обновляем UI через события
                document.dispatchEvent(new CustomEvent('newAttack', {
                    detail: this.attacks[this.attacks.length - 1]
                }));
            }
        }, 20000); // Новая атака каждые 20 секунд
    }

    // Пауза/возобновление анимации
    toggleAnimation() {
        this.isPlaying = !this.isPlaying;
        return this.isPlaying;
    }

    // Обновление времени последнего обновления
    updateLastUpdateTime() {
        this.lastUpdate = new Date();
        return this.lastUpdate.toLocaleTimeString('ru-RU');
    }

    // Получение координат страны
    getCountryCoordinates(countryCode) {
        return this.countryCoordinates[countryCode] || { lat: 0, lon: 0, name: countryCode };
    }
}

// Создаем глобальный экземпляр
const dataHandler = new DataHandler();
