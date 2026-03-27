// mapRenderer.js - Оптимизированная 2D карта мира с атаками и анимациями

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
        this.isLoaded = false;
        this.countriesGroup = null;
        this.attacksGroup = null;
        
        // Цвета для типов атак (23 типа)
        this.attackColors = {
            ddos: '#ef4444',
            phishing: '#f59e0b',
            malware: '#8b5cf6',
            scanning: '#10b981',
            bruteforce: '#ec4899',
            sqlInjection: '#06b6d4',
            xss: '#f97316',
            mitm: '#84cc16',
            supplyChain: '#6366f1',
            apt: '#0ea5e9',
            sessionHijacking: '#f43f5e',
            arpSpoofing: '#14b8a6',
            cryptoAttack: '#eab308',
            toctou: '#a855f7',
            bufferOverflow: '#ef4444',
            sslStripping: '#64748b',
            clickjacking: '#ec4899',
            idsEvasion: '#0f172a',
            privilegeEscalation: '#dc2626',
            logicBomb: '#b91c1c',
            cloudAttack: '#3b82f6',
            iotAttack: '#8b5cf6',
            aiAttack: '#06b6d4'
        };
        
        // Иконки для типов атак
        this.attackIcons = {
            ddos: '🔴',
            phishing: '🎣',
            malware: '🦠',
            scanning: '🔍',
            bruteforce: '🔨',
            sqlInjection: '💉',
            xss: '⚡',
            mitm: '👤',
            supplyChain: '🏭',
            apt: '🎯',
            sessionHijacking: '🎫',
            arpSpoofing: '🌐',
            cryptoAttack: '🔐',
            toctou: '⏱️',
            bufferOverflow: '💥',
            sslStripping: '⛓️',
            clickjacking: '👆',
            idsEvasion: '🛡️',
            privilegeEscalation: '🚪',
            logicBomb: '💣',
            cloudAttack: '☁️',
            iotAttack: '📱',
            aiAttack: '🤖'
        };
        
        // Состояние фильтров
        this.hiddenTypes = new Set();
        
        // Оптимизация: статические DOM elements для tooltip
        this._tooltipEl = null;
    }

    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Контейнер карты не найден:', this.containerId);
            return;
        }
        
        // Проверяем загрузку d3.js
        if (typeof d3 === 'undefined') {
            console.error('D3.js не загружен!');
            this.showError(container, 'Ошибка загрузки D3.js. Проверьте подключение к интернету.');
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
        
        this.isLoaded = true;
        console.log('Карта готова к отображению атак');
    }

    showError(container, message) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #94a3b8; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
                <h3 style="margin: 0 0 10px;">Ошибка загрузки</h3>
                <p>${message}</p>
            </div>
        `;
    }

    isReady() {
        return this.isLoaded && this.svg !== null && this.g !== null;
    }

    // Оптимизация: использование documentFragment не нужен для SVG,
    // но используем batch создание элементов
    createSVG(container) {
        container.innerHTML = '';
        
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', '0 0 ' + this.width + ' ' + this.height);
        this.svg.style.display = 'block';
        
        // Группа для стран (оптимизация: отдельная группа для стран)
        this.countriesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.countriesGroup.setAttribute('class', 'countries-group');
        
        // Группа для атак (оптимизация: отдельная группа для атак)
        this.attacksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.attacksGroup.setAttribute('class', 'attacks-group');
        
        // Основная группа для карты
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.g.setAttribute('class', 'map-group');
        this.g.appendChild(this.countriesGroup);
        this.g.appendChild(this.attacksGroup);
        
        // Группа для легенды
        this.legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.legendGroup.setAttribute('class', 'legend-group');
        
        container.appendChild(this.svg);
        this.svg.appendChild(this.g);
        this.svg.appendChild(this.legendGroup);
        
        console.log('SVG создан');
    }

    setupProjection() {
        this.projection = d3.geoMercator()
            .scale(this.scale * (this.width / 1200))
            .translate([this.width / 2, this.height / 1.6]);
        
        this.path = d3.geoPath().projection(this.projection);
    }

    setupZoom() {
        if (!this.svg) return;
        
        var self = this;
        this.zoom = d3.zoom()
            .scaleExtent([1, 4]) /* ✅ ОГРАНИЧЕН ЗУМ */
            .translateExtent([[0, 0], [this.width, this.height]]) /* ✅ ЖЁСТКИЕ ГРАНИЦЫ - НЕЛЬЗЯ УЙТИ */
            .extent([[0, 0], [this.width, this.height]])
            .constrainExtent(([x0, y0], w, h, [x1, y1], k) => [  /* ✅ АБСОЛЮТНОЕ ОГРАНИЧЕНИЕ */
                [Math.max(0, Math.min(this.width * k, x0)), Math.max(0, Math.min(this.height * k, y0))],
                [Math.max(0, Math.min(this.width * k, x1)), Math.max(0, Math.min(this.height * k, y1))]
            ])
            .on('zoom', function(event) {
                if (self.g) {
                    self.g.setAttribute('transform', 
                        'translate(' + event.transform.x + ',' + event.transform.y + ') scale(' + event.transform.k + ')');
                }
            });
        
        d3.select(this.svg).call(this.zoom);
    }

    createTooltip() {
        // Оптимизация: создаём tooltip только если его нет
        if (this._tooltipEl) {
            this._tooltipEl.remove();
        }
        
        this._tooltipEl = document.createElement('div');
        this._tooltipEl.className = 'attack-tooltip';
        this._tooltipEl.style.cssText = 'position: absolute; visibility: hidden; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(59, 130, 246, 0.5); border-radius: 12px; padding: 16px; color: #f8fafc; font-size: 14px; max-width: 320px; z-index: 3000; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); pointer-events: none; backdrop-filter: blur(10px);';
        
        document.body.appendChild(this._tooltipEl);
        
        this.tooltip = {
            show: (event, html) => {
                this._tooltipEl.innerHTML = html;
                this._tooltipEl.style.visibility = 'visible';
                this._tooltipEl.style.left = (event.pageX + 15) + 'px';
                this._tooltipEl.style.top = (event.pageY - 10) + 'px';
            },
            hide: () => {
                this._tooltipEl.style.visibility = 'hidden';
            },
            move: (x, y) => {
                this._tooltipEl.style.left = (x + 15) + 'px';
                this._tooltipEl.style.top = (y - 10) + 'px';
            },
            html: (content) => {
                this._tooltipEl.innerHTML = content;
            }
        };
    }

    toggleFilter(attackType) {
        if (this.hiddenTypes.has(attackType)) {
            this.hiddenTypes.delete(attackType);
            return true;
        } else {
            this.hiddenTypes.add(attackType);
            return false;
        }
    }
    
    isTypeHidden(attackType) {
        return this.hiddenTypes.has(attackType);
    }
    
    showAllTypes() {
        this.hiddenTypes.clear();
    }
    
    getVisibleTypes() {
        const allTypes = Object.keys(this.attackIcons);
        return allTypes.filter(type => !this.hiddenTypes.has(type));
    }

    createLegend() {
        const legendItems = Object.entries(this.attackIcons);
        const legendWidth = 145;
        const legendHeight = 620;
        const legendY = this.height - legendHeight - 15;
        const legendX = 15;
        
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
        
        const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        legendTitle.setAttribute('x', legendX + legendWidth / 2);
        legendTitle.setAttribute('y', legendY + 25);
        legendTitle.setAttribute('fill', '#f8fafc');
        legendTitle.setAttribute('font-size', '11px');
        legendTitle.setAttribute('font-weight', '600');
        legendTitle.setAttribute('text-anchor', 'middle');
        legendTitle.textContent = 'Типы атак';
        this.legendGroup.appendChild(legendTitle);
        
        const self = this;
        legendItems.forEach(([type, icon], index) => {
            const itemY = legendY + 55 + index * 25;
            const centerX = legendX + legendWidth / 2;
            
            const itemGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            itemGroup.setAttribute('class', 'legend-item');
            itemGroup.setAttribute('data-type', type);
            itemGroup.style.cursor = 'pointer';
            
            const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            iconText.setAttribute('x', centerX - 60);
            iconText.setAttribute('y', itemY);
            iconText.setAttribute('font-size', '12px');
            iconText.textContent = icon;
            iconText.setAttribute('id', 'legend-icon-' + type);
            itemGroup.appendChild(iconText);
            
            const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            nameText.setAttribute('x', centerX - 40);
            nameText.setAttribute('y', itemY + 3);
            nameText.setAttribute('fill', '#94a3b8');
            nameText.setAttribute('font-size', '10px');
            nameText.textContent = this.getAttackTypeName(type);
            nameText.setAttribute('id', 'legend-name-' + type);
            itemGroup.appendChild(nameText);
            
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
            
            itemGroup.addEventListener('click', function() {
                if (self.hiddenTypes.has(type)) {
                    self.hiddenTypes.delete(type);
                } else {
                    self.hiddenTypes.add(type);
                }
                
                if (self.hiddenTypes.has(type)) {
                    iconText.setAttribute('fill', '#475569');
                    iconText.setAttribute('opacity', '0.5');
                    nameText.setAttribute('fill', '#475569');
                    nameText.setAttribute('text-decoration', 'line-through');
                    nameText.setAttribute('opacity', '0.5');
                    colorRect.setAttribute('opacity', '0.3');
                } else {
                    iconText.setAttribute('fill', 'inherit');
                    iconText.setAttribute('opacity', '1');
                    nameText.setAttribute('fill', '#94a3b8');
                    nameText.setAttribute('text-decoration', 'none');
                    nameText.setAttribute('opacity', '1');
                    colorRect.setAttribute('opacity', '1');
                }
                
                self.updateAttacksVisibility();
                
                const action = self.hiddenTypes.has(type) ? 'скрыты' : 'показаны';
                const message = self.getAttackTypeName(type) + ' атаки ' + action;
                document.dispatchEvent(new CustomEvent('showNotification', {
                    detail: { message: message, type: 'info' }
                }));
            });
            
            this.legendGroup.appendChild(itemGroup);
        });
    }
    
    updateAttacksVisibility() {
        if (!this.attacksGroup) return;
        
        const attackGroups = this.attacksGroup.querySelectorAll('.attack-group');
        attackGroups.forEach(group => {
            const attackType = group.getAttribute('data-attack-type');
            group.style.display = this.hiddenTypes.has(attackType) ? 'none' : '';
        });
    }

    getAttackTypeName(type) {
        const names = {
            ddos: 'DDoS',
            phishing: 'Фишинг',
            malware: 'Вредоносное ПО',
            scanning: 'Сканирование',
            bruteforce: 'Подбор паролей',
            sqlInjection: 'SQL-инъекция',
            xss: 'XSS',
            mitm: 'MitM',
            supplyChain: 'Цепочка поставок',
            apt: 'APT',
            sessionHijacking: 'Перехват сессии',
            arpSpoofing: 'ARP-спуфинг',
            cryptoAttack: 'Криптография',
            toctou: 'TOCTOU',
            bufferOverflow: 'Переполнение',
            sslStripping: 'SSL Stripping',
            clickjacking: 'Кликджекинг',
            idsEvasion: 'Обход IDS',
            privilegeEscalation: 'Эскалация прав',
            logicBomb: 'Логическая бомба',
            cloudAttack: 'Облако',
            iotAttack: 'IoT',
            aiAttack: 'AI-атака'
        };
        return names[type] || type;
    }

    showTooltip(event, attack) {
        var sourceName = dataHandler.countryCoordinates[attack.sourceCountry]?.name || attack.sourceCountry;
        var targetName = dataHandler.countryCoordinates[attack.targetCountry]?.name || attack.targetCountry;
        var attackTypeName = dataHandler.attackTypeNames[attack.attackType] || attack.attackType;
        var severityName = dataHandler.severityNames[attack.severity] || attack.severity;
        var sectorName = dataHandler.sectorNames[attack.sector] || attack.sector;
        
        var icon = this.attackIcons[attack.attackType] || '⚠️';
        var color = this.attackColors[attack.attackType] || '#ef4444';
        
        const html = 
            '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">' +
            '<span style="font-size: 24px;">' + icon + '</span>' +
            '<div><span style="font-weight: 600; font-size: 16px; color: ' + color + ';">' + attackTypeName + '</span>' +
            '<br><span style="font-size: 11px; color: #94a3b8;">' + (dataHandler.attackDefinitions[attack.attackType]?.shortDesc || '') + '</span></div>' +
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
            '</div>';
        
        this.tooltip.show(event, html);
    }

    hideTooltip() {
        this.tooltip.hide();
    }

    async loadWorldMap() {
        try {
            if (typeof topojson === 'undefined') {
                console.warn('TopoJSON не загружен, используем упрощённую карту');
                this.drawBackground();
                return;
            }
            
            var self = this;
            var world = await d3.json('assets/data/world-map.json');
            
            if (!world || !world.objects) {
                console.warn('Неверный формат данных карты, используем фон');
                this.drawBackground();
                return;
            }
            
            var countries = topojson.feature(world, world.objects.countries);
            
            // Оптимизация: используем requestAnimationFrame для рендеринга
            requestAnimationFrame(() => {
                self.drawCountries(countries.features);
            });
            
            console.log('Карта мира загружена');
                
        } catch (error) {
            console.error('Ошибка загрузки карты:', error);
            this.drawBackground();
        }
    }

    drawCountries(countries) {
        if (!this.countriesGroup || !this.path) return;
        
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
                
                self.countriesGroup.appendChild(path);
            }
        });
    }

    drawBackground() {
        if (!this.countriesGroup) return;
        
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.width);
        rect.setAttribute('height', this.height);
        rect.setAttribute('fill', 'rgba(15, 23, 42, 0.95)');
        this.countriesGroup.insertBefore(rect, this.countriesGroup.firstChild);
    }

    drawAttack(attack) {
        // Проверяем загрузку dataHandler
        if (typeof dataHandler === 'undefined') {
            console.warn('DataHandler не загружен, атака не отображена');
            return null;
        }
        
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
        
        // Создаем путь атаки (оптимизировано: без CSS animation на SVG)
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + (midX + perpX) + ',' + (midY + perpY) + ' ' + x2 + ',' + y2);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '6,3');
        path.setAttribute('opacity', '0.6');
        
        // Маркер источника
        var sourcePoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sourcePoint.setAttribute('cx', x1);
        sourcePoint.setAttribute('cy', y1);
        sourcePoint.setAttribute('r', '5');
        sourcePoint.setAttribute('fill', color);
        sourcePoint.setAttribute('opacity', '0.9');
        
        // Маркер цели
        var targetPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        targetPoint.setAttribute('cx', x2);
        targetPoint.setAttribute('cy', y2);
        targetPoint.setAttribute('r', '7');
        targetPoint.setAttribute('fill', color);
        targetPoint.setAttribute('opacity', '1');
        targetPoint.style.filter = 'drop-shadow(0 0 6px ' + color + ')';
        
        group.appendChild(path);
        group.appendChild(sourcePoint);
        group.appendChild(targetPoint);
        
        var self = this;
        
        group.addEventListener('mouseenter', function(e) {
            path.setAttribute('stroke-width', '3');
            path.setAttribute('opacity', '1');
            sourcePoint.setAttribute('r', '7');
            targetPoint.setAttribute('r', '9');
            self.showTooltip(e, attack);
        });
        
        group.addEventListener('mousemove', function(e) {
            self.tooltip.move(e.pageX, e.pageY);
        });
        
        group.addEventListener('mouseleave', function() {
            path.setAttribute('stroke-width', '2');
            path.setAttribute('opacity', '0.6');
            sourcePoint.setAttribute('r', '5');
            targetPoint.setAttribute('r', '7');
            self.hideTooltip();
        });
        
        group.addEventListener('click', function() {
            document.dispatchEvent(new CustomEvent('showAttackDetails', {
                detail: attack
            }));
        });
        
        return group;
    }

    // Оптимизация: пакетное добавление атак (ускоренная загрузка)
    drawAttacks(attacks, options = {}) {
        this.clearAttacks();
        
        if (!attacks || !Array.isArray(attacks)) return;
        
        // Проверяем, что attacksGroup существует
        if (!this.attacksGroup) {
            console.warn('attacksGroup не инициализирован, пропуск отрисовки атак');
            return;
        }
        
        var self = this;
        // Уменьшена задержка для быстрой загрузки
        var delay = options.delay || 10;
        // Увеличено количество атак за раз
        var maxAtOnce = options.maxAtOnce || 10;
        // Увеличено общее количество батчей
        var maxBatches = options.maxBatches || 50;
        
        // Фильтруем по типам
        var filteredAttacks = attacks.filter(attack => !this.hiddenTypes.has(attack.attackType));
        
        // Разбиваем на батчи
        var batchIndex = 0;
        
        function processBatch() {
            var start = batchIndex * maxAtOnce;
            var end = Math.min(start + maxAtOnce, filteredAttacks.length);
            
            // Используем document fragment для batch insert
            var fragment = document.createDocumentFragment();
            
            for (var i = start; i < end; i++) {
                var attack = filteredAttacks[i];
                var group = self.drawAttack(attack);
                if (group) {
                    // Быстрое появление без сложной анимации
                    fragment.appendChild(group);
                }
            }
            
            // Дополнительная проверка перед добавлением
            if (self.attacksGroup) {
                self.attacksGroup.appendChild(fragment);
            }
            
            batchIndex++;
            
            // Уменьшено условие для более быстрой загрузки всех атак
            if (end < filteredAttacks.length && batchIndex < maxBatches) {
                setTimeout(processBatch, delay);
            }
        }
        
        // Запускаем с небольшой задержкой чтобы дать карте отрисоваться
        setTimeout(processBatch, 100);
    }

    clearAttacks() {
        if (this.attacksGroup) {
            this.attacksGroup.innerHTML = '';
        }
    }

    addAttack(attack) {
        // Проверяем существование attacksGroup
        if (!this.attacksGroup) {
            console.warn('addAttack: attacksGroup не инициализирован');
            return null;
        }
        
        var group = this.drawAttack(attack);
        if (group && this.attacksGroup) {
            this.attacksGroup.appendChild(group);
        }
        return group;
    }

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

