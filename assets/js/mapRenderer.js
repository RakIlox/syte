// mapRenderer.js - 2D карта мира с атаками и анимациями

class MapRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.width = 1200;
        this.height = 600;
        this.scale = 150;
        this.projection = null;
        this.path = null;
        this.svg = null;
        this.g = null;
        this.zoom = null;
        this.tooltip = null;
        this.legendGroup = null;
        
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
        
        // Состояние фильтров - какие типы скрыты
        this.hiddenTypes = new Set();
    }

    // Инициализация карты
    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Контейнер карты не найден:', this.containerId);
            return;
        }
        
        // Принудительно устанавливаем размеры контейнера
        container.style.width = '100%';
        container.style.height = '600px';
        container.style.minHeight = '600px';
        container.style.display = 'block';
        
        // Получаем размеры
        const rect = container.getBoundingClientRect();
        this.width = Math.max(rect.width, 800);
        this.height = Math.max(rect.height, 500);
        
        console.log('Размеры карты:', this.width, 'x', this.height);
        
        // Создаём SVG вручную
        this.createSVG(container);
        
        // Создаём проекцию
        this.setupProjection();
        
        // Настраиваем зум
        this.setupZoom();
        
        // Создаём tooltip
        this.createTooltip();
        
        // Создаём легенду
        this.createLegend();
        
        // Загружаем карту мира
        await this.loadWorldMap();
    }

    // Создание SVG элемента
    createSVG(container) {
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Создаём SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', '0 0 ' + this.width + ' ' + this.height);
        this.svg.style.display = 'block';
        
        // Создаём единую группу для карты И атак (чтобы всё масштабировалось вместе)
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.g.setAttribute('class', 'map-group');
        
        // Создаём группу для легенды (отдельно, чтобы не масштабировалась)
        this.legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.legendGroup.setAttribute('class', 'legend-group');
        
        // Добавляем в DOM - сначала основная группа, потом легенда
        container.appendChild(this.svg);
        this.svg.appendChild(this.g);
        this.svg.appendChild(this.legendGroup);
        
        console.log('SVG создан');
    }

    // Настройка проекции
    setupProjection() {
        this.projection = d3.geoMercator()
            .scale(this.scale * (this.width / 1200))
            .translate([this.width / 2, this.height / 1.6]);
        
        this.path = d3.geoPath().projection(this.projection);
    }

    // Настройка зума
    setupZoom() {
        if (!this.svg) return;
        
        var self = this;
        this.zoom = d3.zoom()
            .scaleExtent([0.8, 8])
            .on('zoom', function(event) {
                if (self.g) {
                    self.g.setAttribute('transform', 
                        'translate(' + event.transform.x + ',' + event.transform.y + ') scale(' + event.transform.k + ')');
                }
            });
        
        d3.select(this.svg).call(this.zoom);
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
            .style('max-width', '320px')
            .style('z-index', '3000')
            .style('box-shadow', '0 10px 25px rgba(0, 0, 0, 0.3)')
            .style('pointer-events', 'none')
            .style('backdrop-filter', 'blur(10px)');
    }

    // Переключение фильтра типа атаки
    toggleFilter(attackType) {
        if (this.hiddenTypes.has(attackType)) {
            this.hiddenTypes.delete(attackType);
            return true; // Показать
        } else {
            this.hiddenTypes.add(attackType);
            return false; // Скрыть
        }
    }
    
    // Проверка скрыт ли тип атаки
    isTypeHidden(attackType) {
        return this.hiddenTypes.has(attackType);
    }
    
    // Показать все типы атак
    showAllTypes() {
        this.hiddenTypes.clear();
    }
    
    // Получить список видимых типов атак
    getVisibleTypes() {
        const allTypes = Object.keys(this.attackIcons);
        return allTypes.filter(type => !this.hiddenTypes.has(type));
    }

    // Создание интерактивной легенды
    createLegend() {
        const legendItems = Object.entries(this.attackIcons);
        const legendWidth = 130;
        const legendHeight = 270;
        const legendY = this.height - legendHeight - 15;
        const legendX = 15;
        
        // Фон легенды
        const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        legendBg.setAttribute('x', legendX);
        legendBg.setAttribute('y', legendY);
        legendBg.setAttribute('width', legendWidth);
        legendBg.setAttribute('height', legendHeight);
        legendBg.setAttribute('rx', 10);
        legendBg.setAttribute('fill', 'rgba(15, 23, 42, 0.92)');
        legendBg.setAttribute('stroke', 'rgba(59, 130, 246, 0.4)');
        legendBg.setAttribute('stroke-width', '1');
        
        this.legendGroup.appendChild(legendBg);
        
        // Заголовок легенды - по центру
        const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        legendTitle.setAttribute('x', legendX + legendWidth / 2);
        legendTitle.setAttribute('y', legendY + 25);
        legendTitle.setAttribute('fill', '#f8fafc');
        legendTitle.setAttribute('font-size', '11px');
        legendTitle.setAttribute('font-weight', '600');
        legendTitle.setAttribute('text-anchor', 'middle');
        legendTitle.textContent = 'Типы атак';
        this.legendGroup.appendChild(legendTitle);
        
        // Элементы легенды
        const self = this;
        legendItems.forEach(([type, icon], index) => {
            const itemY = legendY + 55 + index * 25;
            const centerX = legendX + legendWidth / 2;
            
            const itemGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            itemGroup.setAttribute('class', 'legend-item');
            itemGroup.setAttribute('data-type', type);
            itemGroup.style.cursor = 'pointer';
            
            // Иконка (слева от центра)
            const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            iconText.setAttribute('x', centerX - 60);
            iconText.setAttribute('y', itemY);
            iconText.setAttribute('font-size', '12px');
            iconText.textContent = icon;
            iconText.setAttribute('id', 'legend-icon-' + type);
            itemGroup.appendChild(iconText);
            
            // Название (справа от центра)
            const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            nameText.setAttribute('x', centerX - 40);
            nameText.setAttribute('y', itemY + 3);
            nameText.setAttribute('fill', '#94a3b8');
            nameText.setAttribute('font-size', '10px');
            nameText.textContent = this.getAttackTypeName(type);
            nameText.setAttribute('id', 'legend-name-' + type);
            itemGroup.appendChild(nameText);
            
            // Цветовая метка (справа)
            const colorRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            colorRect.setAttribute('x', centerX + 55);
            colorRect.setAttribute('y', itemY - 4);
            colorRect.setAttribute('width', '7');
            colorRect.setAttribute('height', '7');
            colorRect.setAttribute('rx', '2');
            colorRect.setAttribute('fill', this.attackColors[type]);
            colorRect.setAttribute('id', 'legend-color-' + type);
            itemGroup.appendChild(colorRect);
            
            // Hover эффект
            itemGroup.addEventListener('mouseenter', function() {
                if (!self.hiddenTypes.has(type)) {
                    iconText.setAttribute('fill', '#fff');
                    nameText.setAttribute('fill', '#fff');
                }
                legendBg.setAttribute('fill', 'rgba(15, 23, 42, 0.95)');
            });
            
            itemGroup.addEventListener('mouseleave', function() {
                if (!self.hiddenTypes.has(type)) {
                    iconText.setAttribute('fill', 'inherit');
                    nameText.setAttribute('fill', '#94a3b8');
                }
                legendBg.setAttribute('fill', 'rgba(15, 23, 42, 0.92)');
            });
            
            // Клик - переключение фильтра
            itemGroup.addEventListener('click', function() {
                // Переключаем состояние
                if (self.hiddenTypes.has(type)) {
                    self.hiddenTypes.delete(type);
                } else {
                    self.hiddenTypes.add(type);
                }
                
                // Обновляем визуальное состояние
                if (self.hiddenTypes.has(type)) {
                    // Зачеркиваем
                    iconText.setAttribute('fill', '#475569');
                    iconText.setAttribute('opacity', '0.5');
                    nameText.setAttribute('fill', '#475569');
                    nameText.setAttribute('text-decoration', 'line-through');
                    nameText.setAttribute('opacity', '0.5');
                    colorRect.setAttribute('opacity', '0.3');
                } else {
                    // Возвращаем в нормальное состояние
                    iconText.setAttribute('fill', 'inherit');
                    iconText.setAttribute('opacity', '1');
                    nameText.setAttribute('fill', '#94a3b8');
                    nameText.setAttribute('text-decoration', 'none');
                    nameText.setAttribute('opacity', '1');
                    colorRect.setAttribute('opacity', '1');
                }
                
                // Обновляем карту - показываем/скрываем атаки
                self.updateAttacksVisibility();
                
                // Показываем уведомление
                const action = self.hiddenTypes.has(type) ? 'скрыты' : 'показаны';
                const message = self.getAttackTypeName(type) + ' атаки ' + action;
                document.dispatchEvent(new CustomEvent('showNotification', {
                    detail: { message: message, type: 'info' }
                }));
            });
            
            this.legendGroup.appendChild(itemGroup);
        });
    }
    
    // Обновление видимости атак на карте
    updateAttacksVisibility() {
        if (!this.g) return;
        
        const attackGroups = this.g.querySelectorAll('.attack-group');
        attackGroups.forEach(group => {
            const attackType = group.getAttribute('data-attack-type');
            if (this.hiddenTypes.has(attackType)) {
                group.style.display = 'none';
            } else {
                group.style.display = '';
            }
        });
    }

    // Получение названия типа атаки
    getAttackTypeName(type) {
        const names = {
            ddos: 'DDoS',
            phishing: 'Фишинг',
            malware: 'Вредоносное ПО',
            scanning: 'Сканирование',
            bruteforce: 'Подбор паролей',
            sqlInjection: 'SQL-инъекция',
            xss: 'XSS',
            mitm: 'MitM'
        };
        return names[type] || type;
    }

    // Показать tooltip
    showTooltip(event, attack) {
        var sourceName = dataHandler.countryCoordinates[attack.sourceCountry] ? dataHandler.countryCoordinates[attack.sourceCountry].name : attack.sourceCountry;
        var targetName = dataHandler.countryCoordinates[attack.targetCountry] ? dataHandler.countryCoordinates[attack.targetCountry].name : attack.targetCountry;
        var attackTypeName = dataHandler.attackTypeNames[attack.attackType] || attack.attackType;
        var severityName = dataHandler.severityNames[attack.severity] || attack.severity;
        var sectorName = dataHandler.sectorNames[attack.sector] || attack.sector;
        
        var icon = this.attackIcons[attack.attackType] || '⚠️';
        var color = this.attackColors[attack.attackType] || '#ef4444';
        
        this.tooltip
            .style('visibility', 'visible')
            .html(
                '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">' +
                '<span style="font-size: 24px;">' + icon + '</span>' +
                '<div><span style="font-weight: 600; font-size: 16px; color: ' + color + ';">' + attackTypeName + '</span>' +
                '<br><span style="font-size: 11px; color: #94a3b8;">' + dataHandler.attackDefinitions[attack.attackType]?.shortDesc + '</span></div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">' +
                '<div><span style="color: #94a3b8; font-size: 11px;">🔴 Источник:</span><br><strong>' + sourceName + '</strong></div>' +
                '<div><span style="color: #94a3b8; font-size: 11px;">🎯 Цель:</span><br><strong>' + targetName + '</strong></div>' +
                '</div>' +
                '<div style="margin-bottom: 8px;">' +
                '<span style="color: #94a3b8; font-size: 11px;">🏭 Сектор:</span><br><strong>' + sectorName + '</strong></div>' +
                '<div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">' +
                '<div><span style="color: #94a3b8; font-size: 11px;">⚠️ Опасность:</span><br>' +
                '<span style="background: ' + color + '; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">' + severityName + '</span></div>' +
                '<span style="font-size: 10px; color: #64748b;">👆 Кликните для деталей</span>' +
                '</div>'
            )
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    // Скрыть tooltip
    hideTooltip() {
        this.tooltip.style('visibility', 'hidden');
    }

    // Загрузка карты мира из файла
    async loadWorldMap() {
        try {
            var world = await d3.json('assets/data/world-map.json');
            
            if (!world || !world.objects) {
                throw new Error('Неверный формат данных карты');
            }
            
            var countries = topojson.feature(world, world.objects.countries);
            
            this.drawCountries(countries.features);
            
            console.log('Карта мира загружена');
                
        } catch (error) {
            console.error('Ошибка загрузки карты:', error);
            this.drawBackground();
        }
    }

    // Рисование стран
    drawCountries(countries) {
        if (!this.g || !this.path) return;
        
        var self = this;
        countries.forEach(function(feature) {
            var pathData = self.path(feature);
            if (pathData) {
                var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathData);
                path.setAttribute('fill', 'rgba(59, 130, 246, 0.15)');
                path.setAttribute('stroke', 'rgba(59, 130, 246, 0.4)');
                path.setAttribute('stroke-width', '0.5');
                path.style.cursor = 'pointer';
                path.style.transition = 'fill 0.3s ease, stroke 0.3s ease';
                
                path.addEventListener('mouseenter', function() {
                    path.setAttribute('fill', 'rgba(59, 130, 246, 0.35)');
                    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)');
                });
                
                path.addEventListener('mouseleave', function() {
                    path.setAttribute('fill', 'rgba(59, 130, 246, 0.15)');
                    path.setAttribute('stroke', 'rgba(59, 130, 246, 0.4)');
                });
                
                self.g.appendChild(path);
            }
        });
    }

    // Рисование фона
    drawBackground() {
        if (!this.g) return;
        
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.width);
        rect.setAttribute('height', this.height);
        rect.setAttribute('fill', 'rgba(15, 23, 42, 0.95)');
        this.g.insertBefore(rect, this.g.firstChild);
    }

    // Отрисовка атаки с анимацией
    drawAttack(attack) {
        var source = dataHandler.getCountryCoordinates(attack.sourceCountry);
        var target = dataHandler.getCountryCoordinates(attack.targetCountry);
        
        if (!source || !target || !this.projection) return null;
        
        var coords1 = this.projection([source.lon, source.lat]);
        var coords2 = this.projection([target.lon, target.lat]);
        
        if (coords1[0] === null || coords1[1] === null || coords2[0] === null || coords2[1] === null) return null;
        
        var x1 = coords1[0], y1 = coords1[1];
        var x2 = coords2[0], y2 = coords2[1];
        var color = this.attackColors[attack.attackType] || '#ef4444';
        
        // Создаем группу для атаки
        var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'attack-group');
        group.setAttribute('data-attack-type', attack.attackType);
        group.style.cursor = 'pointer';
        
        // Вычисляем кривизну дуги
        var midX = (x1 + x2) / 2;
        var midY = (y1 + y2) / 2;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var offset = Math.min(distance / 4, 80);
        var perpX = -dy / distance * offset;
        var perpY = dx / distance * offset;
        
        // Создаем путь атаки (изогнутая линия)
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + (midX + perpX) + ',' + (midY + perpY) + ' ' + x2 + ',' + y2);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '6,3');
        path.setAttribute('opacity', '0.6');
        
        // Добавляем анимацию в документ если ещё нет
        if (!document.getElementById('attack-animation-style')) {
            var style = document.createElement('style');
            style.id = 'attack-animation-style';
            style.textContent = `
                @keyframes attackFlow {
                    0% { stroke-dashoffset: 100; opacity: 0.3; }
                    50% { opacity: 0.8; }
                    100% { stroke-dashoffset: -100; opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Анимация движения по линии - только на стрелке
        path.style.animation = 'attackFlow 3s linear infinite';
        
        // Маркер источника (статичный, без анимации)
        var sourcePoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sourcePoint.setAttribute('cx', x1);
        sourcePoint.setAttribute('cy', y1);
        sourcePoint.setAttribute('r', '5');
        sourcePoint.setAttribute('fill', color);
        sourcePoint.setAttribute('opacity', '0.9');
        
        // Маркер цели (статичный, без анимации)
        var targetPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        targetPoint.setAttribute('cx', x2);
        targetPoint.setAttribute('cy', y2);
        targetPoint.setAttribute('r', '7');
        targetPoint.setAttribute('fill', color);
        targetPoint.setAttribute('opacity', '1');
        targetPoint.style.filter = 'drop-shadow(0 0 6px ' + color + ')';
        
        // Добавляем элементы в группу
        group.appendChild(path);
        group.appendChild(sourcePoint);
        group.appendChild(targetPoint);
        
        var self = this;
        
        // Hover эффекты
        group.addEventListener('mouseenter', function(e) {
            path.setAttribute('stroke-width', '3');
            path.setAttribute('opacity', '1');
            sourcePoint.setAttribute('r', '7');
            targetPoint.setAttribute('r', '9');
            targetPoint.setAttribute('opacity', '1');
            self.showTooltip(e, attack);
        });
        
        group.addEventListener('mousemove', function(e) {
            self.tooltip.style('left', (e.pageX + 15) + 'px');
            self.tooltip.style('top', (e.pageY - 10) + 'px');
        });
        
        group.addEventListener('mouseleave', function() {
            path.setAttribute('stroke-width', '2');
            path.setAttribute('opacity', '0.6');
            sourcePoint.setAttribute('r', '5');
            targetPoint.setAttribute('r', '7');
            targetPoint.setAttribute('opacity', '1');
            self.hideTooltip();
        });
        
        group.addEventListener('click', function() {
            document.dispatchEvent(new CustomEvent('showAttackDetails', {
                detail: attack
            }));
        });
        
        // Добавляем в основную группу (которая масштабируется вместе с картой)
        if (self.g) {
            self.g.appendChild(group);
        }
        
        return group;
    }

    // Очистка всех атак
    clearAttacks() {
        // Очищаем из основной группы (которая масштабируется)
        if (this.g) {
            // Удаляем только элементы атак (не страны)
            const children = this.g.querySelectorAll('.attack-group');
            children.forEach(child => child.remove());
        }
    }

    // Добавление одной атаки на карту
    addAttack(attack) {
        this.drawAttack(attack);
    }

    // Отрисовка всех атак
    drawAttacks(attacks) {
        this.clearAttacks();
        
        if (!attacks || !Array.isArray(attacks)) return;
        
        var self = this;
        attacks.forEach(function(attack) {
            self.drawAttack(attack);
        });
    }

    // Управление зумом
    zoomIn() {
        if (!this.svg || !this.zoom) return;
        d3.select(this.svg)
            .transition()
            .duration(300)
            .call(this.zoom.scaleBy, 1.3);
    }

    zoomOut() {
        if (!this.svg || !this.zoom) return;
        d3.select(this.svg)
            .transition()
            .duration(300)
            .call(this.zoom.scaleBy, 0.7);
    }

    resetView() {
        if (!this.svg || !this.zoom) return;
        d3.select(this.svg)
            .transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);
    }
}

// Создаем глобальный экземпляр
var mapRenderer = null;

