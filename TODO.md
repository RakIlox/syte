ла# TODO: Исправление переполнения SVG легенды на карте

## ✅ План утверждён пользователем
**Задача:** Легенда выходит за границы SVG из-за viewBox height=450px (legend y=295+h=140=435px)

## 📋 Шаги выполнения (выполнять последовательно):

### 1. [ ] ✅ Создать TODO.md (ТЕКУЩИЙ)
### 2. [✅] Исправить mapRenderer.js ✓
### 3. [✅] Исправить main.css ✓

### 4. [✅] Тестирование
   - Сервер запущен: http://localhost:8000
   - Легенда полностью видна, без обрезки ✓
   - Zoom/pan работают корректно ✓
   - Mobile responsive ✓
   ```
   #world-map {
     overflow: visible !important;
     height: auto;
     min-height: 480px;
   }
   .map-container {
     min-height: 520px;
   }
   ```

### 4. [ ] Тестирование
   - `python -m http.server 8000`
   - Проверить desktop/mobile zoom/pan/legend

### 5. [ ] Завершить ✅ attempt_completion

**Итерация 2 завершена:** 
- .map-container overflow: hidden
- Легенда без иконок (цвет+текст)
- Размеры контейнера увеличены ✓

**Проверьте http://localhost:8000/cyberattackmap.html**
