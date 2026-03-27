// mapRenderer_fixed.js - ПОЛНАЯ РАБОЧАЯ ВЕРСИЯ БЕЗ ОШИБОК

class MapRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.width = 1000;
        this.height = 500;
        this.scale = 140;
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
        this.hiddenTypes = new Set();
        this._tooltipEl = null;
        
        this.attackColors = {
            ddos: '#ef4444', phishing: '#f59e0b', malware: '#8b5cf6', scanning: '#10b981',
            bruteforce: '#ec4899', sqlInjection: '#06b6d4', xss: '#f97316', mitm: '#84cc16',
            supplyChain: '#6366f1', apt: '#0ea5e9', sessionHijacking: '#f43f5e', arpSpoofing: '#14b8a6',
            cryptoAttack: '#eab308', toctou: '#a855f7', bufferOverflow: '#ef4444', sslStripping: '#64748b',
            clickjacking: '#ec4899', idsEvasion: '#0f172a', privilegeEscalation: '#dc2626', logicBomb: '#b91c1c',
            cloudAttack: '#3b82f6', iotAttack: '#8b5cf6', aiAttack: '#06b6d4'
        };
    }

    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) return console.error('Container not found');
        
        const updateSizes = () => {
            const rect = container.getBoundingClientRect();
            this.width = Math.max(rect.width, 900);
            this.height = Math.max(rect.height, 450);
            this.scale = 140 * (this.width / 1000);
            if (this.svg) {
                this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height + 120}`);
                this.setupProjection();
                this.setupZoom();
                this.legendGroup.innerHTML = '';
                this.createLegend();
            }
        };
        
        window.addEventListener('resize', updateSizes);
        
        if (typeof d3 === 'undefined') {
            this.showError(container, 'D3.js не загружен!');
            return;
        }
        
        container.style.minHeight = '480px';
        const rect = container.getBoundingClientRect();
        this.width = Math.max(rect.width, 900);
        this.height = Math.max(rect.height, 450);
        
        this.createSVG(container);
        this.setupProjection();
        this.setupZoom();
        this.createTooltip();
        this.createLegend();
        await this.loadWorldMap();
        
        this.isLoaded = true;
        console.log('✅ MapRenderer готов - viewBox:', this.width, 'x', this.height + 80);
    }

    showError(container, message) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:#94a3b8">
            <i class="fas fa-exclamation-triangle" style="font-size:4rem;color:#ef4444"></i>
            <h3>${message}</h3>
        </div>`;
    }

    createSVG(container) {
        container.innerHTML = '';
        
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height + 80}`);
        this.svg.style.display = 'block';
        
        // Filter for drop-shadow
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'drop-shadow');
        const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
        feDropShadow.setAttribute('dx', '0');
        feDropShadow.setAttribute('dy', '4');
        feDropShadow.setAttribute('stdDeviation', '8');
        feDropShadow.setAttribute('flood-color', 'rgba(0,0,0,0.4)');
        filter.appendChild(feDropShadow);
        defs.appendChild(filter);
        this.svg.appendChild(defs);
        
        this.countriesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.countriesGroup.setAttribute('class', 'countries-group');
        this.attacksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.attacksGroup.setAttribute('class', 'attacks-group');
        
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.g.setAttribute('class', 'map-group');
        this.g.appendChild(this.countriesGroup);
        this.g.appendChild(this.attacksGroup);
        
        this.legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.legendGroup.setAttribute('class', 'legend-group');
        this.legendGroup.style.pointerEvents = 'none';
        
        container.appendChild(this.svg);
        this.svg.appendChild(this.g);
        this.svg.appendChild(this.legendGroup);
    }

    setupProjection() {
        this.projection = d3.geoMercator().scale(this.scale).translate([this.width / 2, this.height / 2]);
        this.path = d3.geoPath().projection(this.projection);
    }

    setupZoom() {
        if (!this.svg) return;
        const self = this;
        this.zoom = d3.zoom()
            .scaleExtent([0.7, 5])
            .translateExtent([[0, -this.height/3], [this.width*1.4, this.height*1.4]])
            .on('zoom', event => self.g.setAttribute('transform', `translate(${event.transform.x},${event.transform.y})scale(${event.transform.k})`));
        d3.select(this.svg).call(this.zoom);
    }

    createTooltip() {
        if (this._tooltipEl) this._tooltipEl.remove();
        this._tooltipEl = document.createElement('div');
        this._tooltipEl.className = 'attack-tooltip';
        this._tooltipEl.style.cssText = 'position:absolute;visibility:hidden;background:rgba(15,23,42,0.95);border:1px solid rgba(59,130,246,0.5);border-radius:12px;padding:16px;color:#f8fafc;font-size:14px;max-width:320px;z-index:3000;pointer-events:none;box-shadow:0 10px 25px rgba(0,0,0,0.3);backdrop-filter:blur(10px);';
        document.body.appendChild(this._tooltipEl);
        
        this.tooltip = {
            show: (event, html) => {
                this._tooltipEl.innerHTML = html;
                this._tooltipEl.style.visibility = 'visible';
                this._tooltipEl.style.left = (event.pageX + 15) + 'px';
                this._tooltipEl.style.top = (event.pageY - 10) + 'px';
            },
            hide: () => this._tooltipEl.style.visibility = 'hidden',
            move: (x, y) => {
                this._tooltipEl.style.left = (x + 15) + 'px';
                this._tooltipEl.style.top = (y - 10) + 'px';
            }
        };
    }

    createLegend() {
        const legendWidth = this.width * 0.95, legendHeight = 160, legendY = this.height + 20, legendX = (this.width - legendWidth) / 2;
        
        const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        legendBg.setAttribute('x', legendX);
        legendBg.setAttribute('y', legendY);
        legendBg.setAttribute('width', legendWidth);
        legendBg.setAttribute('height', legendHeight);
        legendBg.setAttribute('rx', '12');
        legendBg.setAttribute('fill', 'rgba(15, 23, 42, 0.97)');
        legendBg.setAttribute('stroke', 'rgba(59, 130, 246, 0.6)');
        legendBg.setAttribute('stroke-width', '2');
        legendBg.setAttribute('filter', 'url(#drop-shadow)');
        this.legendGroup.appendChild(legendBg);
        
        const types = [['ddos','phishing','malware','scanning','bruteforce','sqlInjection','xss','mitm'], 
                       ['supplyChain','apt','sessionHijacking','arpSpoofing','cryptoAttack','toctou','bufferOverflow','sslStripping'], 
                       ['clickjacking','idsEvasion','privilegeEscalation','logicBomb','cloudAttack','iotAttack','aiAttack']];
                       
        types.forEach((row, rowIndex) => row.forEach((type, colIndex) => {
            const itemX = legendX + 40 + colIndex * 85, itemY = legendY + 35 + rowIndex * 50;
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'legend-item');
            g.dataset.type = type;
            g.style.cursor = 'pointer';
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', itemX);
            text.setAttribute('y', itemY + 5);
            text.setAttribute('fill', '#94a3b8');
            text.setAttribute('font-size', '12px');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = this.getAttackTypeName(type);
            g.appendChild(text);
            
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', itemX + 20);
            rect.setAttribute('y', itemY - 3);
            rect.setAttribute('width', '10');
            rect.setAttribute('height', '10');
            rect.setAttribute('rx', '2');
            rect.setAttribute('fill', this.attackColors[type]);
            g.appendChild(rect);
            
            g.addEventListener('mouseenter', () => { 
                text.setAttribute('fill', '#f8fafc'); 
                text.setAttribute('font-size', '13px'); 
            });
            g.addEventListener('mouseleave', () => { 
                text.setAttribute('fill', '#94a3b8'); 
                text.setAttribute('font-size', '12px'); 
            });
            g.addEventListener('click', () => this.toggleFilter(type));
            
            this.legendGroup.appendChild(g);
        }));
    }

    getAttackTypeName(type) {
        const names = { 
            ddos: 'DDoS', phishing: 'Фишинг', malware: 'Вредоносное ПО', scanning: 'Сканирование', 
            bruteforce: 'Подбор паролей', sqlInjection: 'SQL-инъекция', xss: 'XSS', mitm: 'MitM', 
            supplyChain: 'Цепочка поставок', apt: 'APT', sessionHijacking: 'Перехват сессии', 
            arpSpoofing: 'ARP-спуфинг', cryptoAttack: 'Крипто', toctou: 'TOCTOU', 
            bufferOverflow: 'Переполнение', sslStripping: 'SSL Strip', clickjacking: 'Clickjack', 
            idsEvasion: 'Обход IDS', privilegeEscalation: 'Эскалация', logicBomb: 'Лог.бомба', 
            cloudAttack: 'Облако', iotAttack: 'IoT', aiAttack: 'AI' 
        };
        return names[type] || type;
    }

    toggleFilter(type) {
        this.hiddenTypes.has(type) ? this.hiddenTypes.delete(type) : this.hiddenTypes.add(type);
        this.updateAttacksVisibility();
    }

    updateAttacksVisibility() {
        if (!this.attacksGroup) return;
        this.attacksGroup.querySelectorAll('.attack-group').forEach(group => {
            group.style.display = this.hiddenTypes.has(group.dataset.attackType) ? 'none' : '';
        });
    }

    async loadWorldMap() {
        try {
            const world = await d3.json('assets/data/world-map.json');
            const countries = topojson.feature(world, world.objects.countries);
            this.drawCountries(countries.features);
        } catch (error) {
            console.warn('Карта не загружена:', error);
            this.drawBackground();
        }
    }

    drawCountries(countries) {
        countries.forEach(feature => {
            if (!this.path(feature)) return;
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', this.path(feature));
            path.setAttribute('fill', 'rgba(59, 130, 246, 0.15)');
            path.setAttribute('stroke', 'rgba(59, 130, 246, 0.4)');
            path.style.cursor = 'pointer';
            path.style.transition = 'fill 0.3s ease';
            path.addEventListener('mouseenter', () => path.setAttribute('fill', 'rgba(59, 130, 246, 0.35)'));
            path.addEventListener('mouseleave', () => path.setAttribute('fill', 'rgba(59, 130, 246, 0.15)'));
            this.countriesGroup.appendChild(path);
        });
    }

    drawBackground() {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.width);
        rect.setAttribute('height', this.height + 80);
        rect.setAttribute('fill', 'rgba(15, 23, 42, 0.95)');
        this.countriesGroup.appendChild(rect);
    }

    showTooltip(event, attack) {
        if (typeof dataHandler === 'undefined') return;
        const sourceName = dataHandler.countryCoordinates[attack.sourceCountry]?.name || attack.sourceCountry;
        const targetName = dataHandler.countryCoordinates[attack.targetCountry]?.name || attack.targetCountry;
        const attackTypeName = dataHandler.attackTypeNames[attack.attackType] || attack.attackType;
        const severityName = dataHandler.severityNames[attack.severity] || attack.severity;
        const sectorName = dataHandler.sectorNames[attack.sector] || attack.sector;
        const color = this.attackColors[attack.attackType] || '#ef4444';
        
        const html = `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:10px;">
                <span style="font-size:24px;">⚡</span>
                <div><span style="font-weight:600;font-size:16px;color:${color};">${attackTypeName}</span></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                <div><span style="color:#94a3b8;font-size:11px;">🔴 Источник:</span><br><strong>${sourceName}</strong></div>
                <div><span style="color:#94a3b8;font-size:11px;">🎯 Цель:</span><br><strong>${targetName}</strong></div>
            </div>
            <div style="margin-bottom:8px;">
                <span style="color:#94a3b8;font-size:11px;">🏭 Сектор:</span><br><strong>${sectorName}</strong>
            </div>
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;">
                <div><span style="color:#94a3b8;font-size:11px;">⚠️ Опасность:</span><br>
                <span style="background:${color};color:white;padding:2px 8px;border-radius:10px;font-size:11px;">${severityName}</span></div>
            </div>`;
        
        this.tooltip.show(event, html);
    }

    hideTooltip() {
        this.tooltip.hide();
    }

    drawAttack(attack) {
        if (typeof dataHandler === 'undefined') return null;
        const source = dataHandler.getCountryCoordinates(attack.sourceCountry);
        const target = dataHandler.getCountryCoordinates(attack.targetCountry);
        
        if (!source || !target || !this.projection) return null;
        
        const coords1 = this.projection([source.lon, source.lat]);
        const coords2 = this.projection([target.lon, target.lat]);
        if (coords1[0] === null || coords2[0] === null) return null;
        
        const x1 = coords1[0], y1 = coords1[1], x2 = coords2[0], y2 = coords2[1];
        const color = this.attackColors[attack.attackType] || '#ef4444';
        

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'attack-group');
        group.setAttribute('data-attack-type', attack.attackType);
        group.style.cursor = 'pointer';

        
        const dx = x2 - x1, dy = y2 - y1, distance = Math.sqrt(dx * dx + dy * dy);
        const offset = Math.min(distance / 4, 80);
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
        const perpX = -dy / distance * offset, perpY = dx / distance * offset;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${x1},${y1} Q${midX + perpX},${midY + perpY} ${x2},${y2}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('stroke-dasharray', '8,4');
        path.style.opacity = '0.8';
        
        const sourcePoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sourcePoint.setAttribute('cx', x1);
        sourcePoint.setAttribute('cy', y1);
        sourcePoint.setAttribute('r', '6');
        sourcePoint.setAttribute('fill', color);
        sourcePoint.style.opacity = '0.9';
        
        const targetPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        targetPoint.setAttribute('cx', x2);
        targetPoint.setAttribute('cy', y2);
        targetPoint.setAttribute('r', '8');
        targetPoint.setAttribute('fill', color);
        targetPoint.style.opacity = '1';
        targetPoint.style.filter = `drop-shadow(0 0 8px ${color})`;
        
        group.appendChild(path);
        group.appendChild(sourcePoint);
        group.appendChild(targetPoint);
        
        group.addEventListener('mouseenter', e => {
            path.setAttribute('stroke-width', '4');
            path.style.opacity = '1';
            sourcePoint.setAttribute('r', '8');
            targetPoint.setAttribute('r', '10');
            this.showTooltip(e, attack);
        });
        
        group.addEventListener('mousemove', e => this.tooltip.move(e.pageX, e.pageY));
        group.addEventListener('mouseleave', () => {
            path.setAttribute('stroke-width', '2.5');
            path.style.opacity = '0.8';
            sourcePoint.setAttribute('r', '6');
            targetPoint.setAttribute('r', '8');
            this.hideTooltip();
        });
        
        group.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('showAttackDetails', { detail: attack }));
        });
        
        return group;
    }

    drawAttacks(attacks, options = {}) {
        this.clearAttacks();
        if (!attacks || !Array.isArray(attacks)) return;
        
        const filteredAttacks = attacks.filter(attack => !this.hiddenTypes.has(attack.attackType));
        
        const delay = options.delay || 100;
        const maxAtOnce = options.maxAtOnce || 5;
        let batchIndex = 0;
        
        const processBatch = () => {
            const start = batchIndex * maxAtOnce;
            const end = Math.min(start + maxAtOnce, filteredAttacks.length);
            
            const fragment = document.createDocumentFragment();
            for (let i = start; i < end; i++) {
                const attack = filteredAttacks[i];
                const group = this.drawAttack(attack);
                if (group) fragment.appendChild(group);
            }
            
            this.attacksGroup.appendChild(fragment);
            batchIndex++;
            
            if (end < filteredAttacks.length) {
                setTimeout(processBatch, delay);
            }
        };
        
        setTimeout(processBatch, 100);
        console.log('🚀 Нарисовано', filteredAttacks.length, 'атак');
    }

    clearAttacks() {
        if (this.attacksGroup) this.attacksGroup.innerHTML = '';
    }

    zoomIn() {
        d3.select(this.svg).transition().duration(300).call(this.zoom.scaleBy, 1.3);
    }

    zoomOut() {
        d3.select(this.svg).transition().duration(300).call(this.zoom.scaleBy, 0.7);
    }

    resetView() {
        d3.select(this.svg).transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);
    }
}

// Глобальный доступ
window.MapRenderer = MapRenderer;
console.log('MapRenderer загружен и готов!');

