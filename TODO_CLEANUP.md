# Website Cleanup Tasks

## Completed ✓
- [x] Delete assets/data/threats.json (unused - data in dataHandler.js)
- [x] Delete assets/data/articles.json (unused - data in article.html)
- [x] Fix duplicate CSS link in glossary.html
- [x] Add search input field to glossary.html for glossary.js functionality
- [x] Add XSS term to glossary
- [x] Add SQL-injection term to glossary

## Summary
Removed 2 unused JSON files that were never loaded by any page.
Fixed HTML issues in glossary.html that prevented the search functionality from working.
Added new cybersecurity terms: XSS, SQL-injection (MitM was already present).

## Notes
- glossary.js has built-in data as fallback (glossaryData array)
- threats.json and articles.json were redundant - data is hardcoded in JS files
- New terms include detailed explanations with examples and protection methods

