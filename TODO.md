# Mobile Map Optimization & Infinite Field Fix
Current Working Directory: c:/Users/Admin/Desktop/нормальня версия сайта

## Task
Make map smaller for mobile devices and fix infinite field behind map (responsive .map-container height).

## Steps (Plan Breakdown)
- [ ] 1. Edit main.css: Update .map-container min-height to clamp(600px, 70vh, 1000px); strengthen mobile media queries for #world-map (reduce to 250px/200px).
- [ ] 2. Edit map.css: Reduce #world-map mobile heights (768px:300px, 480px:220px) and add clamp base.
- [ ] 3. Test on mobile viewports / live preview.
- [ ] 4. Mark complete.

## Progress
- ✅ Step 1: main.css edited (responsive container min-height clamp(), mobile map heights reduced: 250px@768px, 200px@480px, 160px@360px)
- ✅ Step 2: map.css edited (base clamp(250px,45vh,500px), 300px@768px, 220px@480px)

Next: Step 3 - Test / live preview.



