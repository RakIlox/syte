
// dataHandler.js - Оптимизированная обработка и генерация данных об атаках

class DataHandler {
    constructor() {
        this.attacks = [];
        this.countries = {};
        this.lastUpdate = null;
        this.isPlaying = true;
        this.animationInterval = null;
        
        // Оптимизация: уменьшенное количество начальных атак
        this.INITIAL_ATTACKS = 25;
        this.MAX_ATTACKS = 50;
        this.ANIMATION_INTERVAL = 30000;
        
        this.attackDefinitions = {
            ddos: { title: "🔴 DDoS-атака", icon: "🔴", shortDesc: "Отказ в обслуживании", color: "#ef4444", explanation: "Злоумышленники пытаются «обрушить» сайты.", howToRecognize: ["Сайт медленно загружается", "Много ошибок"], article: "what-is-ddos" },
            phishing: { title: "🎣 Фишинг", icon: "🎣", shortDesc: "Кража данных", color: "#f59e0b", explanation: "Мошенники рассылают поддельные письма.", article: "what-is-phishing" },
            malware: { title: "🦠 Вредоносное ПО", icon: "🦠", shortDesc: "Вирусы", color: "#8b5cf6", explanation: "Установка вирусов на компьютер.", article: "malware-guide" },
            scanning: { title: "🔍 Сканирование", icon: "🔍", shortDesc: "Разведка", color: "#10b981", explanation: "Поиск уязвимостей.", article: "network-security-monitoring" },
            bruteforce: { title: "🔨 Брутфорс", icon: "🔨", shortDesc: "Подбор паролей", color: "#ec4899", explanation: "Перебор паролей.", article: "how-passwords-work" },
            sqlInjection: { title: "💉 SQL-инъекция", icon: "💉", shortDesc: "База данных", color: "#06b6d4", explanation: "Атака на БД.", article: "vulnerability-assessment" },
            xss: { title: "⚡ XSS", icon: "⚡", shortDesc: "Скриптинг", color: "#f97316", explanation: "Внедрение кода.", article: "web-security" },
            mitm: { title: "👤 MitM", icon: "👤", shortDesc: "Перехват", color: "#84cc16", explanation: "Перехват трафика.", article: "wifi-security" },
            supplyChain: { title: "🏭 Цепочка", icon: "🏭", shortDesc: "Поставки", color: "#6366f1", explanation: "Через поставщиков.", article: "tools-frameworks" },
            apt: { title: "🎯 APT", icon: "🎯", shortDesc: "Угроза", color: "#0ea5e9", explanation: "Государственные атаки.", article: "advanced-threat-intelligence" },
            sessionHijacking: { title: "🎫 Сессия", icon: "🎫", shortDesc: "Перехват", color: "#f43f5e", explanation: "Кража сессии.", article: "social-engineering" },
            arpSpoofing: { title: "🌐 ARP", icon: "🌐", shortDesc: "Спуфинг", color: "#14b8a6", explanation: "Отравление ARP.", article: "network-security-monitoring" },
            cryptoAttack: { title: "🔐 Крипто", icon: "🔐", shortDesc: "Шифрование", color: "#eab308", explanation: "Взлом криптографии.", article: "crypto-security" },
            toctou: { title: "⏱️ TOCTOU", icon: "⏱️", shortDesc: "Время", color: "#a855f7", explanation: "Уязвимость времени.", article: "security-architecture" },
            bufferOverflow: { title: "💥 Буфер", icon: "💥", shortDesc: "Память", color: "#ef4444", explanation: "Переполнение.", article: "exploitation-techniques" },
            sslStripping: { title: "⛓️ SSL", icon: "⛓️", shortDesc: "Downgrade", color: "#64748b", explanation: "Понижение HTTPS.", article: "wifi-security" },
            clickjacking: { title: "👆 Клик", icon: "👆", shortDesc: "Обман", color: "#ec4899", explanation: "Перехват кликов.", article: "web-security" },
            idsEvasion: { title: "🛡️ IDS", icon: "🛡️", shortDesc: "Обход", color: "#0f172a", explanation: "Обход защиты.", article: "network-security-monitoring" },
            privilegeEscalation: { title: "🚪 Права", icon: "🚪", shortDesc: "Эскалация", color: "#dc2626", explanation: "Повышение прав.", article: "security-architecture" },
            logicBomb: { title: "💣 Бомба", icon: "💣", shortDesc: "Логика", color: "#b91c1c", explanation: "Код с условием.", article: "malware-guide" },
            cloudAttack: { title: "☁️ Облако", icon: "☁️", shortDesc: "Cloud", color: "#3b82f6", explanation: "Атака на облако.", article: "advanced-cloud-security" },
            iotAttack: { title: "📱 IoT", icon: "📱", shortDesc: "Устройства", color: "#8b5cf6", explanation: "Взлом IoT.", article: "iot-security" },
            aiAttack: { title: "🤖 AI", icon: "🤖", shortDesc: "ИИ", color: "#06b6d4", explanation: "Атака с ИИ.", article: "advanced-threat-intelligence" }
        };
        
        this.countryCoordinates = {
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
            'PL': { lat: 51.9, lon: 19.1, name: '🇵🇱 Польша' },
            'UA': { lat: 48.4, lon: 31.1, name: '🇺🇦 Украина' },
            'TR': { lat: 38.9, lon: 35.2, name: '🇹🇷 Турция' },
            'VN': { lat: 14.0, lon: 108.2, name: '🇻🇳 Вьетнам' },
            'ID': { lat: -0.7, lon: 113.9, name: '🇮🇩 Индонезия' },
            'TH': { lat: 15.8, lon: 100.9, name: '🇹🇭 Таиланд' },
            'SG': { lat: 1.3, lon: 103.8, name: '🇸🇬 Сингапур' },
            'IL': { lat: 31.0, lon: 35.1, name: '🇮🇱 Израиль' },
            'IR': { lat: 32.4, lon: 53.6, name: '🇮🇷 Иран' },
            'MX': { lat: 23.6, lon: -102.5, name: '🇲🇽 Мексика' },
            'ZA': { lat: -30.5, lon: 22.9, name: '🇿🇦 ЮАР' },
            'NG': { lat: 9.0, lon: 8.6, name: '🇳🇬 Нигерия' },
            'EG': { lat: 26.8, lon: 30.8, name: '🇪🇬 Египет' }
        };
        
        this.sectors = ['finance', 'healthcare', 'government', 'education', 'energy', 'telecom'];
        this.sectorNames = {
            finance: '💰 Финансы', healthcare: '🏥 Здравоохранение',
            government: '🏛️ Госструктуры', education: '🎓 Образование',
            energy: '⚡ Энергетика', telecom: '📡 Телеком'
        };
        
        this.attackTypes = ['ddos', 'phishing', 'malware', 'scanning', 'bruteforce', 'sqlInjection', 'xss', 'mitm', 'supplyChain', 'apt', 'sessionHijacking', 'arpSpoofing', 'cryptoAttack', 'toctou', 'bufferOverflow', 'sslStripping', 'clickjacking', 'idsEvasion', 'privilegeEscalation', 'logicBomb', 'cloudAttack', 'iotAttack', 'aiAttack'];
        this.attackTypeNames = {
            ddos: '🔴 DDoS', phishing: '🎣 Фишинг', malware: '🦠 ВПО', scanning: '🔍 Скан', bruteforce: '🔨 Брут', sqlInjection: '💉 SQL', xss: '⚡ XSS', mitm: '👤 MitM', supplyChain: '🏭 Цепь', apt: '🎯 APT', sessionHijacking: '🎫 Сессия', arpSpoofing: '🌐 ARP', cryptoAttack: '🔐 Крипто', toctou: '⏱️ TOCTOU', bufferOverflow: '💥 Буфер', sslStripping: '⛓️ SSL', clickjacking: '👆 Клик', idsEvasion: '🛡️ IDS', privilegeEscalation: '🚪 Права', logicBomb: '💣 Бомба', cloudAttack: '☁️ Облако', iotAttack: '📱 IoT', aiAttack: '🤖 AI' };
        
        this.severityLevels = ['low', 'medium', 'high', 'critical'];
        this.severityNames = { low: '🟢 Низкий', medium: '🟡 Средний', high: '🟠 Высокий', critical: '🔴 Критический' };
        this.severityColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

        this.cities = {
            'US-NYC': { lat: 40.7128, lon: -74.0060, name: 'Нью-Йорк', country: 'US' },
            'US-LAX': { lat: 34.0522, lon: -118.2437, name: 'Лос-Анджелес', country: 'US' },
            'US-CHI': { lat: 41.8781, lon: -87.6298, name: 'Чикаго', country: 'US' },
            'CN-BJS': { lat: 39.9042, lon: 116.4074, name: 'Пекин', country: 'CN' },
            'CN-SHA': { lat: 31.2304, lon: 121.4737, name: 'Шанхай', country: 'CN' },
            'RU-MOW': { lat: 55.7558, lon: 37.6173, name: 'Москва', country: 'RU' },
            'RU-SPB': { lat: 59.9343, lon: 30.3351, name: 'СПб', country: 'RU' },
            'DE-BER': { lat: 52.5200, lon: 13.4050, name: 'Берлин', country: 'DE' },
            'GB-LON': { lat: 51.5074, lon: -0.1278, name: 'Лондон', country: 'GB' },
            'FR-PAR': { lat: 48.8566, lon: 2.3522, name: 'Париж', country: 'FR' },
            'JP-TOK': { lat: 35.6762, lon: 139.6503, name: 'Токио', country: 'JP' },
            'IN-BOM': { lat: 19.0760, lon: 72.8777, name: 'Мумбаи', country: 'IN' },
            'AU-SYD': { lat: -33.8688, lon: 151.2093, name: 'Сидней', country: 'AU' }
        };
    }

    async init() {
        await this.generateInitialData();
        this.startAnimation();
        this.updateLastUpdateTime();
        return this.attacks;
    }

    generateInitialData() {
        this.attacks = [];
        const countries = Object.keys(this.countryCoordinates);
        for (let i = 0; i < this.INITIAL_ATTACKS; i++) {
            const sourceCountry = countries[Math.floor(Math.random() * countries.length)];
            let targetCountry;
            do { targetCountry = countries[Math.floor(Math.random() * countries.length)]; } while (targetCountry === sourceCountry);
            
            const attackType = this.attackTypes[Math.floor(Math.random() * this.attackTypes.length)];
            const severity = this.severityLevels[Math.floor(Math.random() * this.severityLevels.length)];
            const sector = this.sectors[Math.floor(Math.random() * this.sectors.length)];
            
            this.attacks.push({
                id: `attack_${Date.now()}_${i}`,
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                sourceCountry, targetCountry, attackType, severity, sector,
                description: `${this.attackTypeNames[attackType]} из ${this.countryCoordinates[sourceCountry].name}`,
                active: Math.random() > 0.3
            });
        }
    }

    addNewAttack() {
        if (!this.isPlaying) return;
        const countries = Object.keys(this.countryCoordinates);
        const sourceCountry = countries[Math.floor(Math.random() * countries.length)];
        let targetCountry;
        do { targetCountry = countries[Math.floor(Math.random() * countries.length)]; } while (targetCountry === sourceCountry);
        
        const attackType = this.attackTypes[Math.floor(Math.random() * this.attackTypes.length)];
        const severity = this.severityLevels[Math.floor(Math.random() * this.severityLevels.length)];
        const sector = this.sectors[Math.floor(Math.random() * this.sectors.length)];
        
        const newAttack = {
            id: `attack_${Date.now()}`,
            timestamp: new Date().toISOString(),
            sourceCountry, targetCountry, attackType, severity, sector,
            description: `${this.attackTypeNames[attackType]} из ${this.countryCoordinates[sourceCountry].name}`,
            active: true
        };
        
        this.attacks.push(newAttack);
        if (this.attacks.length > this.MAX_ATTACKS) this.attacks = this.attacks.slice(-this.MAX_ATTACKS);
        this.updateLastUpdateTime();
        return newAttack;
    }

    getMapData() { return this.attacks.filter(a => a.active); }
    
    getStats() {
        const activeAttacks = this.attacks.filter(a => a.active);
        const attackCountByType = {}, attackCountByCountry = {};
        activeAttacks.forEach(attack => {
            attackCountByType[attack.attackType] = (attackCountByType[attack.attackType] || 0) + 1;
            attackCountByCountry[attack.sourceCountry] = (attackCountByCountry[attack.sourceCountry] || 0) + 1;
        });
        let topType = '--', maxType = 0; Object.entries(attackCountByType).forEach(([t, c]) => { if (c > maxType) { maxType = c; topType = this.attackTypeNames[t]; }});
        let topCountry = '--', maxCountry = 0; Object.entries(attackCountByCountry).forEach(([c, n]) => { if (n > maxCountry) { maxCountry = n; topCountry = this.countryCoordinates[c]?.name || c; }});
        return { total: this.attacks.length, active: activeAttacks.length, topCountry, topType };
    }

    filterAttacks(filters) {
        return this.attacks.filter(a => {
            if (!a.active) return false;
            if (filters.attackType !== 'all' && a.attackType !== filters.attackType) return false;
            if (filters.severity !== 'all' && a.severity !== filters.severity) return false;
            if (filters.targetSector !== 'all' && a.sector !== filters.targetSector) return false;
            return true;
        });
    }

    getAttackDetails(attack) {
        const def = this.attackDefinitions[attack.attackType] || this.attackDefinitions.ddos;
        return {
            title: def.title, icon: def.icon, shortDesc: def.shortDesc, color: def.color,
            source: this.countryCoordinates[attack.sourceCountry]?.name, sourceCode: attack.sourceCountry,
            target: this.countryCoordinates[attack.targetCountry]?.name, targetCode: attack.targetCountry,
            sector: this.sectorNames[attack.sector], sectorKey: attack.sector,
            severity: this.severityNames[attack.severity], severityKey: attack.severity,
            severityColor: this.severityColors[attack.severity], severityClass: `severity-${attack.severity}`,
            article: def.article
        };
    }

    startAnimation() {
        if (this.animationInterval) clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            if (this.isPlaying) {
                const newAttack = this.addNewAttack();
                if (newAttack) document.dispatchEvent(new CustomEvent('newAttack', { detail: newAttack }));
            }
        }, this.ANIMATION_INTERVAL);
    }

    toggleAnimation() { this.isPlaying = !this.isPlaying; return this.isPlaying; }
    updateLastUpdateTime() { this.lastUpdate = new Date(); return this.lastUpdate.toLocaleTimeString('ru-RU'); }
    getCountryCoordinates(c) { return this.countryCoordinates[c] || { lat: 0, lon: 0, name: c }; }
    getCityCoordinates(c) { return this.cities[c] || { lat: 0, lon: 0, name: c, country: 'XX' }; }
}

const dataHandler = new DataHandler();

