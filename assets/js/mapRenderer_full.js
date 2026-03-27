// Добавим недостающие методы showTooltip/hideTooltip
// В конец файла mapRenderer_full.js после класса

MapRenderer.prototype.showTooltip = function(event, attack) {
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
};

MapRenderer.prototype.hideTooltip = function() {
    this.tooltip.hide();
};

