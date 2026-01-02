// mapRenderer.js - отрисовка карты и атак

class MapRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.width = 1200;
        this.height = 600;
        this.scale = 150;
        this.rotation = [0, 0, 0];
        this.projection = null;
        this.path = null;
        this.svg = null;
        this.g = null;
        this.zoom = null;
        this.tooltip = null;
        
        // Цвета для типов атак
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
        
        this.attackIcons = {
            ddos: '🔴',
            phishing: '🎣',
            malware: '🦠',
            scanning: '🔍',
            bruteforce: '🔨',
            sqlInjection: '💉',
            xss: '⚡',
            mitm: '👤'
        };
    }

    // Инициализация карты
    async init() {
        // Создаем SVG контейнер
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
        
        // Основная группа для всей карты
        this.g = this.svg.append('g');
        
        // Создаем проекцию
        this.projection = d3.geoMercator()
            .scale(this.scale)
            .translate([this.width / 2, this.height / 2]);
        
        this.path = d3.geoPath().projection(this.projection);
        
        // Добавляем зум
        this.zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
        
        // Создаем tooltip
        this.createTooltip();
        
        // Загружаем и отрисовываем карту мира
        await this.loadWorldMap();
        
        console.log('Карта инициализирована');
    }

    // Создание tooltip
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

    // Показать tooltip
    showTooltip(event, attack) {
        const sourceName = dataHandler.countryCoordinates[attack.sourceCountry]?.name || attack.sourceCountry;
        const targetName = dataHandler.countryCoordinates[attack.targetCountry]?.name || attack.targetCountry;
        const attackTypeName = dataHandler.attackTypeNames[attack.attackType] || attack.attackType;
        const severityName = dataHandler.severityNames[attack.severity] || attack.severity;
        const sectorName = dataHandler.sectorNames[attack.sector] || attack.sector;
        
        const icon = this.attackIcons[attack.attackType] || '⚠️';
        const color = this.attackColors[attack.attackType] || '#ef4444';
        
        this.tooltip
            .style('visibility', 'visible')
            .html(`
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <span style="font-size: 24px;">${icon}</span>
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
                <div style="margin-bottom: 8px;">
                    <span style="color: #94a3b8; font-size: 12px;">🏭 Сектор:</span><br>
                    <strong>${sectorName}</strong>
                </div>
                <div>
                    <span style="color: #94a3b8; font-size: 12px;">⚠️ Опасность:</span><br>
                    <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${severityName}</span>
                </div>
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #94a3b8; text-align: center;">
                    Кликните для подробностей
                </div>
            `)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    // Скрыть tooltip
    hideTooltip() {
        this.tooltip.style('visibility', 'hidden');
    }

    // Обновление позиции tooltip
    moveTooltip(event) {
        this.tooltip
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    // Загрузка карты мира
    async loadWorldMap() {
        try {
            // Используем упрощенную карту мира
            const world = await d3.json('https://unpkg.com/world-atlas@2/countries-110m.json');
            
            // Конвертируем TopoJSON в GeoJSON
            const countries = topojson.feature(world, world.objects.countries);
            
            // Рисуем страны
            this.g.selectAll('path.country')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', this.path)
                .attr('fill', 'rgba(30, 41, 59, 0.8)')
                .attr('stroke', 'rgba(255, 255, 255, 0.2)')
                .attr('stroke-width', 0.5)
                .on('mouseover', function() {
                    d3.select(this).attr('fill', 'rgba(59, 130, 246, 0.3)');
                })
                .on('mouseout', function() {
                    d3.select(this).attr('fill', 'rgba(30, 41, 59, 0.8)');
                });
                
        } catch (error) {
            console.error('Ошибка загрузки карты:', error);
            // Рисуем простой фон если карта не загрузилась
            this.g.append('rect')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('fill', 'rgba(30, 41, 59, 0.8)');
        }
    }

    // Отрисовка атаки
    drawAttack(attack) {
        const source = dataHandler.getCountryCoordinates(attack.sourceCountry);
        const target = dataHandler.getCountryCoordinates(attack.targetCountry);
        
        if (!source || !target) return null;
        
        // Конвертируем координаты в пиксели
        const [x1, y1] = this.projection([source.lon, source.lat]);
        const [x2, y2] = this.projection([target.lon, target.lat]);
        
        if (!x1 || !y1 || !x2 || !y2) return null;
        
        // Создаем кривую Безье для красивой стрелки
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // Смещение для кривизны
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const offset = Math.min(distance / 4, 50);
        
        // Перпендикулярное смещение
        const perpX = -dy / distance * offset;
        const perpY = dx / distance * offset;
        
        const curveMidX = midX + perpX;
        const curveMidY = midY + perpY;
        
        // Рисуем кривую линию атаки
        const line = d3.line()
            .curve(d3.curveBasis);
        
        const pathData = line([[x1, y1], [curveMidX, curveMidY], [x2, y2]]);
        
        // Создаем путь атаки
        const attackPath = this.g.append('path')
            .attr('class', 'attack-path')
            .attr('data-id', attack.id)
            .attr('d', pathData)
            .attr('fill', 'none')
            .attr('stroke', this.attackColors[attack.attackType] || '#ef4444')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,3')
            .attr('opacity', 0.8)
            .style('cursor', 'pointer');
        
        // Добавляем анимацию движения
        const pathLength = attackPath.node().getTotalLength();
        
        attackPath
            .attr('stroke-dasharray', pathLength + ' ' + pathLength)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0)
            .on('end', () => {
                // После анимации оставляем статичную линию
                attackPath
                    .attr('stroke-dasharray', 'none')
                    .attr('opacity', 0.6);
            });
        
        // Добавляем точку в начале (источник)
        const sourcePoint = this.g.append('circle')
            .attr('class', 'attack-source')
            .attr('cx', x1)
            .attr('cy', y1)
            .attr('r', 4)
            .attr('fill', this.attackColors[attack.attackType] || '#ef4444')
            .attr('opacity', 0.8);
        
        // Добавляем точку в конце (цель)
        const targetPoint = this.g.append('circle')
            .attr('class', 'attack-target')
            .attr('cx', x2)
            .attr('cy', y2)
            .attr('r', 6)
            .attr('fill', this.attackColors[attack.attackType] || '#ef4444')
            .attr('opacity', 0.9);
        
        // Создаем группу для hover эффектов
        const group = this.g.append('g').attr('class', 'attack-group');
        
        // Добавляем элементы в группу
        group.node().appendChild(attackPath.node());
        group.node().appendChild(sourcePoint.node());
        group.node().appendChild(targetPoint.node());
        
        // Обработчики событий для группы
        group.on('click', () => {
            document.dispatchEvent(new CustomEvent('showAttackDetails', {
                detail: attack
            }));
        });
        
        group.on('mouseover', (event) => {
            attackPath
                .attr('stroke-width', 4)
                .attr('opacity', 1);
            sourcePoint.attr('r', 6);
            targetPoint.attr('r', 8);
            this.showTooltip(event, attack);
        });
        
        group.on('mousemove', (event) => {
            this.moveTooltip(event);
        });
        
        group.on('mouseout', () => {
            attackPath
                .attr('stroke-width', 2)
                .attr('opacity', 0.6);
            sourcePoint.attr('r', 4);
            targetPoint.attr('r', 6);
            this.hideTooltip();
        });
        
        return attackPath;
    }

    // Очистка всех атак
    clearAttacks() {
        this.g.selectAll('.attack-path, .attack-source, .attack-target, .attack-group').remove();
    }

    // Отрисовка всех атак
    drawAttacks(attacks) {
        this.clearAttacks();
        
        attacks.forEach(attack => {
            this.drawAttack(attack);
        });
    }

    // Добавление одной атаки
    addAttack(attack) {
        return this.drawAttack(attack);
    }

    // Управление зумом
    zoomIn() {
        this.svg.transition().call(this.zoom.scaleBy, 1.5);
    }

    zoomOut() {
        this.svg.transition().call(this.zoom.scaleBy, 0.75);
    }

    resetView() {
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);
    }
}

// Создаем глобальный экземпляр
let mapRenderer = null;
