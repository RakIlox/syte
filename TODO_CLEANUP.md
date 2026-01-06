# Website Cleanup Tasks

## Completed ✓
- [x] Delete assets/data/threats.json (unused - data in dataHandler.js)
- [x] Delete assets/data/articles.json (unused - data in article.html)
- [x] Fix duplicate CSS link in glossary.html
- [x] Add search input field to glossary.html for glossary.js functionality
- [x] Add XSS term to glossary
- [x] Add SQL-injection term to glossary
- [x] Remove console.log statements from app.js, mapRenderer.js, dataHandler.js
- [x] Remove window.debug and window.debugProgress debug functions
- [x] Add missing CSS styles for test modal (test-modal-overlay, test-modal, test-option, etc.)
- [x] Add btn-success styles for test completion button
- [x] Fix test modal: added z-index: 10000, added id="test-footer" to footer element

## Summary
Removed 2 unused JSON files that were never loaded by any page.
Fixed HTML issues in glossary.html that prevented the search functionality from working.
Added new cybersecurity terms: XSS, SQL-injection (MitM was already present).
Cleaned up debug code (console.log statements and debug functions).
Fixed test modal display issue - added missing CSS styles and fixed missing id.

## Notes
- glossary.js has built-in data as fallback (glossaryData array)
- threats.json and articles.json were redundant - data is hardcoded in JS files
- New terms include detailed explanations with examples and protection methods
- Debug functions removed: window.debug, window.debugProgress
- Console.log removed from: app.js, mapRenderer.js, dataHandler.js
- Test modal styles added to main.css (z-index 10000, proper positioning)
- Fixed missing id="test-footer" in testModal.js

