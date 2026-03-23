// globeRenderer.js - 3D глобус с атаками

class GlobeRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.width = 900;
        this.height = 500;
        this.projection = null;
        this.path = null;
        this.svg = null;
        this.g = null;
        this.tooltip = null;
        
        // Данные стран - соответствуют dataHandler.js
        this.countries = [
            { id: "US", name: "🇺🇸 США", lat: 39.8, lon: -98.5 },
            { id: "CN", name: "🇨🇳 Китай", lat: 35.9, lon: 104.2 },
            { id: "RU", name: "🇷🇺 Россия", lat: 61.5, lon: 105.3 },
            { id: "DE", name: "🇩🇪 Германия", lat: 51.2, lon: 10.4 },
            { id: "GB", name: "🇬🇧 Великобритания", lat: 54.8, lon: -4.6 },
            { id: "FR", name: "🇫🇷 Франция", lat: 46.2, lon: 2.2 },
            { id: "JP", name: "🇯🇵 Япония", lat: 36.2, lon: 138.3 },
            { id: "IN", name: "🇮🇳 Индия", lat: 20.6, lon: 78.9 },
            { id: "BR", name: "🇧🇷 Бразилия", lat: -14.2, lon: -51.9 },
            { id: "AU", name: "🇦🇺 Австралия", lat: -25.3, lon: 133.8 },
            { id: "CA", name: "🇨🇦 Канада", lat: 56.1, lon: -106.3 },
            { id: "KR", name: "🇰🇷 Южная Корея", lat: 35.9, lon: 127.8 },
            { id: "IT", name: "🇮🇹 Италия", lat: 41.9, lon: 12.6 },
            { id: "ES", name: "🇪🇸 Испания", lat: 40.5, lon: -3.7 },
            { id: "NL", name: "🇳🇱 Нидерланды", lat: 52.1, lon: 5.3 },
            { id: "PL", name: "🇵🇱 Польша", lat: 51.9, lon: 19.1 },
            { id: "UA", name: "🇺🇦 Украина", lat: 48.4, lon: 31.1 },
            { id: "TR", name: "🇹🇷 Турция", lat: 38.9, lon: 35.2 },
            { id: "VN", name: "🇻🇳 Вьетнам", lat: 14.0, lon: 108.2 },
            { id: "ID", name: "🇮🇩 Индонезия", lat: -0.7, lon: 113.9 },
            { id: "TH", name: "🇹🇭 Таиланд", lat: 15.8, lon: 100.9 },
            { id: "SG", name: "🇸🇬 Сингапур", lat: 1.3, lon: 103.8 },
            { id: "IL", name: "🇮🇱 Израиль", lat: 31.0, lon: 35.1 },
            { id: "IR", name: "🇮🇷 Иран", lat: 32.4, lon: 53.6 },
            { id: "MX", name: "🇲🇽 Мексика", lat: 23.6, lon: -102.5 },
            { id: "ZA", name: "🇿🇦 ЮАР", lat: -30.5, lon: 22.9 },
            { id: "NG", name: "🇳🇬 Нигерия", lat: 9.0, lon: 8.6 },
            { id: "EG", name: "🇪🇬 Египет", lat: 26.8, lon: 30.8 }
        ];
        
        this.attackColors = {
            ddos: '#ef4444',
            phishing: '#f59e0b',
            malware: '#8b5cf6',
            scanning: '#10b981',
            bruteforce: '#ec4899',
            sqlInjection: '#06b6d4',
            xss: '#f97316',
            mitm: '#84cc16'
        };
    }

    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Контейнер карты не найден:', this.containerId);
            return;
        }
        
        // Получаем размеры контейнера
        const containerRect = container.getBoundingClientRect();
        this.width = containerRect.width || 900;
        this.height = containerRect.height || 500;
        
        // Создаем SVG контейнер
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .style('display', 'block')
            .style('position', 'absolute')
            .style('top', '0')
            .style('left', '0');
        
        // Основная группа
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.width/2}, ${this.height/2})`);
        
        // Проекция
        this.projection = d3.geoOrthographic()
            .scale(180)
            .translate([this.width/2, this.height/2])
            .clipAngle(90);
        
        this.path = d3.geoPath().projection(this.projection);
        
        // Рисуем глобус
        this.drawGlobe();
        
        // Создаём tooltip
        this.createTooltip();
        
        // Добавляем вращение
        this.addDragBehavior();
        
        console.log('Глобус инициализирован');
    }

    drawGlobe() {
        // Океан
        this.g.append('circle')
            .attr('r', 180)
            .attr('fill', 'rgba(15, 23, 42, 0.95)')
            .attr('stroke', 'rgba(59, 130, 246, 0.5)')
            .attr('stroke-width', 2);
        
        // Graticule (сетка)
        const graticule = d3.geoGraticule();
        this.g.append('path')
            .datum(graticule)
            .attr('class', 'graticule')
            .attr('d', this.path)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(59, 130, 246, 0.2)')
            .attr('stroke-width', 0.5);
        
        // Рисуем страны
        this.updateCountries();
    }

    updateCountries() {
        this.g.selectAll('.country-point').remove();
        this.g.selectAll('.country-label').remove();
        
        this.countries.forEach(country => {
            const coords = this.projection([country.lon, country.lat]);
            if (coords && this.isVisible(coords[0], coords[1])) {
                // Точка
                this.g.append('circle')
                    .attr('class', 'country-point')
                    .attr('cx', coords[0])
                    .attr('cy', coords[1])
                    .attr('r', 5)
                    .attr('fill', 'rgba(59, 130, 246, 0.9)')
                    .attr('stroke', 'rgba(255, 255, 255, 0.5)')
                    .attr('stroke-width', 1);
                
                // Подпись (только название страны)
                const nameOnly = country.name.split(' ')[1] || country.name;
                this.g.append('text')
                    .attr('class', 'country-label')
                    .attr('x', coords[0])
                    .attr('y', coords[1] - 12)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'rgba(255, 255, 255, 0.9)')
                    .attr('font-size', '10px')
                    .attr('font-weight', '500')
                    .style('pointer-events', 'none')
                    .text(nameOnly);
            }
        });
    }

    isVisible(x, y) {
        const dx = x - this.width/2;
        const dy = y - this.height/2;
        return Math.sqrt(dx*dx + dy*dy) < 180;
    }

    addDragBehavior() {
        let v0, r0, q0;
        
        this.svg.call(d3.drag()
            .on('start', (event) => {
                const [x, y] = d3.pointer(event, this.svg.node());
                v0 = versor.cartesian(this.projection.invert([x, y]));
                r0 = this.projection.rotate();
                q0 = versor(r0);
            })
            .on('drag', (event) => {
                const [x, y] = d3.pointer(event, this.svg.node());
                const v1 = versor.cartesian(this.projection.rotate(r0).invert([x, y]));
                const q1 = versor.multiply(q0, versor.delta(v0, v1));
                this.projection.rotate(versor.rotation(q1));
                this.updateView();
            }));
    }

    updateView() {
        const graticule = d3.geoGraticule();
        this.g.select('.graticule').attr('d', this.path);
        this.updateCountries();
        this.g.selectAll('.attack-group').remove();
        
        // Перерисовываем атаки если dataHandler доступен
        if (typeof dataHandler !== 'undefined' && dataHandler.attacks) {
            const attacks = dataHandler.filterAttacks({
                attackType: 'all',
                severity: 'all',
                targetSector: 'all'
            });
            this.drawAttacks(attacks);
        }
    }

    createTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'attack-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'rgba(15, 23, 42, 0.95)')
            .style('border', '1px solid rgba(59, 130, 246, 0.5)')
            .style('border-radius', '12px')
            .style('padding', '16px')
            .style('color', '#f8fafc')
            .style('font-size', '14px')
            .style('max-width', '280px')
            .style('z-index', '3000')
            .style('box-shadow', '0 10px 25px rgba(0, 0, 0, 0.3)')
            .style('pointer-events', 'none');
    }

    showTooltip(event, attack) {
        const sourceName = this.getCountryName(attack.sourceCountry);
        const targetName = this.getCountryName(attack.targetCountry);
        const attackTypeName = this.getAttackTypeName(attack.attackType);
        const severityName = this.getSeverityName(attack.severity);
        const color = this.attackColors[attack.attackType] || '#ef4444';
        
        this.tooltip
            .style('visibility', 'visible')
            .html(`
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <span style="font-weight: 600; font-size: 16px; color: ${color};">${attackTypeName}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="color: #94a3b8; font-size: 12px;">🔴 Источник:</span><br>
                    <strong>${sourceName}</strong>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="color: #94a3b8; font-size: 12px;">🎯 Цель:</span><br>
                    <strong>${targetName}</strong>
                </div>
                <div>
                    <span style="color: #94a3b8; font-size: 12px;">⚠️ Опасность:</span><br>
                    <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${severityName}</span>
                </div>
            `)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    hideTooltip() {
        this.tooltip.style('visibility', 'hidden');
    }

    getCountryName(id) {
        const country = this.countries.find(c => c.id === id);
        return country ? country.name : id;
    }

    getAttackTypeName(type) {
        const names = {
            ddos: '🔴 DDoS-атака',
            phishing: '🎣 Фишинг',
            malware: '🦠 Вредоносное ПО',
            scanning: '🔍 Сканирование',
            bruteforce: '🔨 Брутфорс',
            sqlInjection: '💉 SQL-инъекция',
            xss: '⚡ XSS',
            mitm: '👤 MitM'
        };
        return names[type] || type;
    }

    getSeverityName(severity) {
        const names = {
            low: 'Низкий',
            medium: 'Средний',
            high: 'Высокий',
            critical: 'Критический'
        };
        return names[severity] || severity;
    }

    drawAttacks(attacks) {
        attacks.forEach(attack => this.drawAttack(attack));
    }

    drawAttack(attack) {
        const source = this.countries.find(c => c.id === attack.sourceCountry);
        const target = this.countries.find(c => c.id === attack.targetCountry);
        
        if (!source || !target) return;
        
        const c1 = this.projection([source.lon, source.lat]);
        const c2 = this.projection([target.lon, target.lat]);
        
        if (!c1 || !c2 || !this.isVisible(c1[0], c1[1]) || !this.isVisible(c2[0], c2[1])) return;
        
        const [x1, y1] = c1;
        const [x2, y2] = c2;
        
        // Рисуем дугу
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 60;
        
        const line = d3.line().curve(d3.curveBasis);
        const pathData = line([[x1, y1], [midX, midY], [x2, y2]]);
        
        const color = this.attackColors[attack.attackType] || '#ef4444';
        
        const group = this.g.append('g').attr('class', 'attack-group').style('cursor', 'pointer');
        
        const attackPath = group.append('path')
            .attr('d', pathData)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('opacity', 0.8);
        
        const sourcePoint = group.append('circle')
            .attr('cx', x1).attr('cy', y1).attr('r', 5).attr('fill', color);
        
        const targetPoint = group.append('circle')
            .attr('cx', x2).attr('cy', y2).attr('r', 5).attr('fill', color);
        
        group.on('click', () => {
            document.dispatchEvent(new CustomEvent('showAttackDetails', { detail: attack }));
        });
        
        group.on('mouseover', (event) => {
            attackPath.attr('stroke-width', 4).attr('opacity', 1);
            sourcePoint.attr('r', 7);
            targetPoint.attr('r', 7);
            this.showTooltip(event, attack);
        });
        
        group.on('mousemove', (event) => {
            this.tooltip
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        });
        
        group.on('mouseout', () => {
            attackPath.attr('stroke-width', 2).attr('opacity', 0.8);
            sourcePoint.attr('r', 5);
            targetPoint.attr('r', 5);
            this.hideTooltip();
        });
    }

    zoomIn() {
        const s = this.projection.scale();
        this.projection.scale(Math.min(s + 30, 350));
        this.updateView();
    }

    zoomOut() {
        const s = this.projection.scale();
        this.projection.scale(Math.max(s - 30, 100));
        this.updateView();
    }

    resetView() {
        this.projection.scale(180);
        this.projection.rotate([0, 0]);
        this.updateView();
    }
}

// Versor для вращения 3D
const versor = {
    cartesian: function(e) {
        const lambda = e[0] * Math.PI / 180;
        const phi = e[1] * Math.PI / 180;
        return [Math.cos(lambda) * Math.cos(phi), Math.sin(lambda) * Math.cos(phi), Math.sin(phi)];
    },
    delta: function(v0, v1) {
        const w = [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
        return [w[0], w[1], w[2], Math.acos(Math.max(-1, Math.min(1, v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2])))];
    },
    multiply: function(q0, q1) {
        return [
            q0[0] * q1[3] + q0[3] * q1[0] + q0[1] * q1[2] - q0[2] * q1[1],
            q0[1] * q1[3] + q0[3] * q1[1] + q0[2] * q1[0] - q0[0] * q1[2],
            q0[2] * q1[3] + q0[3] * q1[2] + q0[0] * q1[1] - q0[1] * q1[0],
            q0[3] * q1[3] - q0[0] * q1[0] - q0[1] * q1[1] - q0[2] * q1[2]
        ];
    },
    rotation: function(q) {
        return [180 * Math.atan2(q[0], q[3]) / Math.PI, 180 * Math.asin(Math.max(-1, Math.min(1, q[1]))) / Math.PI, 180 * Math.atan2(q[2], q[3]) / Math.PI];
    }
};

