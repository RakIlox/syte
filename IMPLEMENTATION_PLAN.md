# Implementation Plan: Extended Attack Types and City-to-City Visualization

## Information Gathered

### Current System Architecture:
1. **dataHandler.js** - Manages attack data, country coordinates, attack definitions
2. **mapRenderer.js** - 2D world map with D3.js, shows attacks as curved lines between countries
3. **globeRenderer.js** - 3D globe with attack visualization
4. **world-map.json** - TopoJSON data for country boundaries

### Current Attack Types (8):
- DDoS, Phishing, Malware, Scanning, Bruteforce, SQL Injection, XSS, MitM

### Current Countries Supported (29):
US, CN, RU, DE, GB, FR, JP, IN, BR, AU, CA, KR, IT, ES, NL, PL, SE, CH, UA, TR, VN, ID, TH, SG, HK, IL, IR, MX, AR, ZA, NG, EG

---

## Plan: Add New Attack Types and City-to-City Visualization

### Phase 1: Data Structure Extensions

#### 1.1 Add New Attack Types (16 new types)
```
Supply Chain Attack (Атака на цепочку поставок) - 🏭
APT (Advanced Persistent Threat) - 🎯
Session Hijacking (Атака на сессию) - 🎫
ARP Spoofing - 🌐
Cryptography Attack (Padding Oracle) - 🔐
TOCTOU Vulnerability - ⏱️
Buffer Overflow - 💥
SSL Stripping - ⛓️
Clickjacking - 👆
IDS/IPS Evasion - 🛡️
Access Control Attack (Privilege Escalation) - 🚪
Logic Bomb - 💣
Cloud Attack - ☁️
IoT Attack - 📱
AI-based Attack - 🤖
Ransomware (Bonus) - 🔒
```

#### 1.2 Add City Coordinates (50+ major cities)
Major tech hubs: San Francisco, New York, London, Berlin, Tokyo, Singapore, etc.

### Phase 2: Code Changes

#### 2.1 dataHandler.js Updates:
- Add new attack type definitions with full details (explanation, how to recognize, real examples, protection)
- Add new colors and icons for each attack type
- Add city coordinates database
- Update attack generation logic to include new types
- Add city-to-city attack support

#### 2.2 mapRenderer.js Updates:
- Support both country and city coordinates
- Add new colors/legend items for extended attack types
- Update tooltip to show city names
- Add toggle for Country/City view mode

#### 2.3 globeRenderer.js Updates:
- Mirror changes from mapRenderer.js for 3D view

---

## File Changes Summary

### `assets/js/dataHandler.js`
- Add 16 new attack definitions (each with title, icon, shortDesc, explanation, technical details, howToRecognize, realExamples, statistics, protection)
- Add ~50 city coordinates with major tech hub cities
- Update attackTypes array
- Update attackColors object
- Update attackIcons object
- Add new filter logic for city data
- Add `isCityAttack` flag support

### `assets/js/mapRenderer.js`
- Add new colors for extended attack types
- Add legend items for new attack types
- Update tooltip for city display
- Add view mode toggle (Country/City)
- Update attack drawing to handle both country and city coordinates

### `assets/js/globeRenderer.js`
- Mirror mapRenderer.js changes for 3D globe

---

## Implementation Steps

### Step 1: Update dataHandler.js
- [ ] Add new attack type definitions
- [ ] Add city coordinates database
- [ ] Update attackTypes, attackColors, attackIcons
- [ ] Add city data structure

### Step 2: Update mapRenderer.js  
- [ ] Add new attack type colors/icons
- [ ] Update legend generation
- [ ] Add city coordinate support
- [ ] Add view mode toggle
- [ ] Update tooltips for cities

### Step 3: Update globeRenderer.js
- [ ] Mirror mapRenderer changes

### Step 4: Testing
- [ ] Verify all attack types render correctly
- [ ] Test city-to-city visualization
- [ ] Test legend filtering
- [ ] Test tooltips
- [ ] Test view mode toggle

---

## New Attack Types - Detailed Definitions

### 1. Supply Chain Attack (🏭)
- **Description**: Compromise of legitimate software during development or distribution
- **Example**: SolarWinds hack

### 2. APT (🎯)
- **Description**: Long-term targeted attack, often state-sponsored
- **Example**: Stuxnet, Fancy Bear attacks

### 3. Session Hijacking (🎫)
- **Description**: Stealing or guessing session ID for unauthorized access
- **Example**: Cookie theft attacks

### 4. ARP Spoofing (🌐)
- **Description**: Local network attack to redirect traffic through attacker
- **Example**: Man-in-the-middle on LAN

### 5. Cryptography Attack (🔐)
- **Description**: Exploiting weaknesses in cryptographic algorithms
- **Example**: Padding Oracle attacks

### 6. TOCTOU (⏱️)
- **Description**: Time-of-check to time-of-use race condition
- **Example**: File race conditions

### 7. Buffer Overflow (💥)
- **Description**: Writing data beyond buffer bounds to execute arbitrary code
- **Example**: Classic stack overflow

### 8. SSL Stripping (⛓️)
- **Description**: Forcing downgrade from HTTPS to HTTP
- **Example**: Downgrade attacks

### 9. Clickjacking (👆)
- **Description**: Tricking user into clicking hidden UI element
- **Example**: Overlay attacks

### 10. IDS/IPS Evasion (🛡️)
- **Description**: Techniques to hide malicious traffic from detection
- **Example**: Fragmentation, encoding

### 11. Access Control Attack (🚪)
- **Description**: Privilege escalation (vertical/horizontal)
- **Example**: Bypassing permissions

### 12. Logic Bomb (💣)
- **Description**: Malicious code activated by specific conditions
- **Example**: Time-triggered malware

### 13. Cloud Attack (☁️)
- **Description**: Misconfiguration or compromised cloud accounts
- **Example**: AWS S3 bucket exposure

### 14. IoT Attack (📱)
- **Description**: Exploiting weak smart device security
- **Example**: Botnet creation (Mirai)

### 15. AI-based Attack (🤖)
- **Description**: Using AI for automated attacks, deepfakes
- **Example**: AI-generated phishing

### 16. Ransomware (🔒)
- **Description**: Encrypting data for ransom
- **Example**: WannaCry, NotPetya

---

## City Database (50+ cities)

### North America (15)
San Francisco, New York, Los Angeles, Seattle, Austin, Boston, Chicago, Denver, Dallas, Atlanta, Miami, Toronto, Vancouver, Montreal, Mexico City

### Europe (15)
London, Berlin, Paris, Amsterdam, Stockholm, Zurich, Warsaw, Madrid, Milan, Munich, Frankfurt, Dublin, Lisbon, Vienna, Prague

### Asia (15)
Tokyo, Seoul, Singapore, Hong Kong, Beijing, Shanghai, Mumbai, Bangalore, Taipei, Sydney, Melbourne, Auckland, Bangkok, Kuala Lumpur, Jakarta

### Middle East (5)
Tel Aviv, Dubai, Riyadh, Istanbul, Tehran

---

*Plan created: Current Date*
*Status: Awaiting user approval*

