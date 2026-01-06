// mapRenderer.js - 2D карта мира с атаками

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
        
        // Создаём группу для карты
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.g.setAttribute('class', 'map-group');
        
        // Добавляем в DOM
        container.appendChild(this.svg);
        this.svg.appendChild(this.g);
        
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
            .style('max-width', '280px')
            .style('z-index', '3000')
            .style('box-shadow', '0 10px 25px rgba(0, 0, 0, 0.3)')
            .style('pointer-events', 'none');
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
                '<span style="font-weight: 600; font-size: 16px; color: ' + color + ';">' + attackTypeName + '</span>' +
                '</div>' +
                '<div style="margin-bottom: 8px;">' +
                '<span style="color: #94a3b8; font-size: 12px;">🔴 Источник:</span><br><strong>' + sourceName + '</strong></div>' +
                '<div style="margin-bottom: 8px;">' +
                '<span style="color: #94a3b8; font-size: 12px;">🎯 Цель:</span><br><strong>' + targetName + '</strong></div>' +
                '<div style="margin-bottom: 8px;">' +
                '<span style="color: #94a3b8; font-size: 12px;">🏭 Сектор:</span><br><strong>' + sectorName + '</strong></div>' +
                '<div><span style="color: #94a3b8; font-size: 12px;">⚠️ Опасность:</span><br>' +
                '<span style="background: ' + color + '; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">' + severityName + '</span></div>' +
                '<div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #94a3b8; text-align: center;">Кликните для подробностей</div>'
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
                path.setAttribute('fill', 'rgba(59, 130, 246, 0.3)');
                path.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
                path.setAttribute('stroke-width', '0.5');
                path.style.cursor = 'pointer';
                
                path.addEventListener('mouseenter', function() {
                    path.setAttribute('fill', 'rgba(59, 130, 246, 0.5)');
                    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)');
                });
                
                path.addEventListener('mouseleave', function() {
                    path.setAttribute('fill', 'rgba(59, 130, 246, 0.3)');
                    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
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

    // Отрисовка атаки
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
        
        var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'attack-group');
        group.style.cursor = 'pointer';
        
        var midX = (x1 + x2) / 2;
        var midY = (y1 + y2) / 2;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var offset = Math.min(distance / 4, 50);
        var perpX = -dy / distance * offset;
        var perpY = dx / distance * offset;
        
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + (midX + perpX) + ',' + (midY + perpY) + ' ' + x2 + ',' + y2);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '5,3');
        path.setAttribute('opacity', '0.6');
        
        var sourcePoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sourcePoint.setAttribute('cx', x1);
        sourcePoint.setAttribute('cy', y1);
        sourcePoint.setAttribute('r', '4');
        sourcePoint.setAttribute('fill', color);
        sourcePoint.setAttribute('opacity', '0.8');
        
        var targetPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        targetPoint.setAttribute('cx', x2);
        targetPoint.setAttribute('cy', y2);
        targetPoint.setAttribute('r', '6');
        targetPoint.setAttribute('fill', color);
        targetPoint.setAttribute('opacity', '0.9');
        
        group.appendChild(path);
        group.appendChild(sourcePoint);
        group.appendChild(targetPoint);
        
        var self = this;
        
        group.addEventListener('mouseenter', function(e) {
            path.setAttribute('stroke-width', '4');
            path.setAttribute('opacity', '1');
            sourcePoint.setAttribute('r', '6');
            targetPoint.setAttribute('r', '8');
            self.showTooltip(e, attack);
        });
        
        group.addEventListener('mousemove', function(e) {
            self.tooltip.style('left', (e.pageX + 15) + 'px');
            self.tooltip.style('top', (e.pageY - 10) + 'px');
        });
        
        group.addEventListener('mouseleave', function() {
            path.setAttribute('stroke-width', '2');
            path.setAttribute('opacity', '0.6');
            sourcePoint.setAttribute('r', '4');
            targetPoint.setAttribute('r', '6');
            self.hideTooltip();
        });
        
        group.addEventListener('click', function() {
            document.dispatchEvent(new CustomEvent('showAttackDetails', {
                detail: attack
            }));
        });
        
        if (this.g) {
            this.g.appendChild(group);
        }
        
        return group;
    }

    // Очистка всех атак
    clearAttacks() {
        if (!this.g) return;
        
        var attacks = this.g.querySelectorAll('.attack-group');
        attacks.forEach(function(el) { el.remove(); });
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

