# Проектирование защищённой архитектуры

## Принципы безопасной архитектуры

```markdown
## Фундаментальные принципы

1. **Defense in Depth** — множественные слои защиты
2. **Least Privilege** — минимальные привилегии
3. **Zero Trust** — никому не доверяй по умолчанию
4. **Fail Secure** — безопасный режим отказа
5. **Separation of Duties** — разделение обязанностей
6. **Economy of Mechanism** — простота механизмов
```

## Модель Zero Trust

```yaml
# Zero Trust Architecture
components:
  identity:
    - MFA для всех пользователей
    - Continuous authentication
    - Adaptive access control
    
  device:
    - Device health verification
    - Endpoint compliance
    - Device inventory
    
  network:
    - Micro-segmentation
    - Software-defined perimeter
    - Encrypted traffic
    
  data:
    - Data classification
    - Encryption at rest and transit
    - DLP controls
```

## Сетевая сегментация

```bash
# VLAN архитектура
vlan 10    # Management
vlan 20    # DMZ
vlan 30    # Application servers
vlan 40    # Database servers  
vlan 50    # User workstations
vlan 60    # Guest network

# Firewall rules между сегментами
# DMZ -> Internet: allow HTTP/HTTPS
# App -> DB: allow only app ports
# Workstations -> DMZ: allow only required
# Management -> All: restricted access
```

## Архитектурные паттерны

```markdown
## Безопасные паттерны

### 1. Perimeter Pattern
```
Internet -> WAF -> DMZ -> App -> DB
```

### 2. Hub-and-Spoke
```
Hub (Security Gateway)
  ├── Spoke 1: Production
  ├── Spoke 2: Development
  └── Spoke 3: Testing
```

### 3. Microservices Security
```
API Gateway -> Service Mesh (mTLS) -> Individual Services
```

## Security Controls

| Слой | Контроли |
|------|----------|
| Perimeter | WAF, DDoS protection, CDN |
| Network | Firewall, IDS/IPS, Segmentation |
| Host | EDR, HIDS, Hardening |
| Application | SAST, DAST, WAF |
| Data | Encryption, DLP, Access Control |

