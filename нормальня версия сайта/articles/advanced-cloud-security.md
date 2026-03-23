# Cloud Security Architecture

## Введение

Облачная безопасность требует комплексного подхода к защите инфраструктуры, приложений и данных в облачных средах. Понимание архитектуры и лучших практик критично для современных специалистов ИБ.

## Cloud Security Posture Management (CSPM)

```yaml
# Проверка конфигурации AWS
# AWS Config Rules
aws configservice describe-config-rules | jq '.ConfigRules[].ConfigRuleName'

# Пример правила
{
  "ConfigRuleName": "s3-bucket-public-read-prohibited",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "S3_BUCKET_PUBLIC_READ_PROHIBITED"
  }
}

# CIS Benchmark Checks
# Проверка через Prowler
./proler.sh -c extra733

# ScoutSuite
python scoutsuite.py --provider aws
```

### Azure Security Center

```powershell
# Проверка безопасности Azure
Get-AzSecurityPricing | Format-Table Name, PricingTier

# Проверка политик
Get-AzPolicyAssignment | Where-Object {$_.Properties.DisplayName -like "*Security*"}

# Security alerts
Get-AzSecurityAlert | Select-Object AlertName, Severity
```

## Identity and Access Management

### AWS IAM

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyDeleteWithoutMFA",
      "Effect": "Deny",
      "Action": [
        "iam:DeleteAccessKey",
        "iam:DeleteLoginProfile",
        "iam:DeleteVirtualMFADevice"
      ],
      "Resource": "*",
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

### Just-In-Time (JIT) Access

```python
# Пример JIT implementation
import boto3
from datetime import datetime, timedelta

def request_access(user, role, duration_hours=4):
    """Запрос временного доступа"""
    sts = boto3.client('sts')
    
    # Создание временных credentials
    credentials = sts.assume_role(
        RoleArn=f"arn:aws:iam::{account_id}:role/{role}",
        RoleSessionName=user,
        DurationSeconds=duration_hours * 3600
    )
    
    # Логирование запроса
    log_access_request(user, role, duration_hours)
    
    return credentials

def enforce_mfa_for_privileged():
    """Применение MFA для привилегированных операций"""
    policy = {
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Deny",
            "Action": "*",
            "Resource": "*",
            "Condition": {
                "Bool": {"aws:MultiFactorAuthPresent": "false"}
            }
        }]
    }
    return policy
```

## Network Security

### VPC Design

```bash
# Создание защищённой VPC архитектуры
# Private subnets для приложений
# Public subnets для load balancers
# NAT Gateway для исходящего трафика

aws ec2 create-vpc --cidr-block 10.0.0.0/16

# VPC Peering с ограничениями
aws ec2 create-vpc-peering-connection \
    --vpc-id vpc-xxx \
    --peer-vpc-id vpc-yyy

# Security Groups - принцип минимальных привилегий
# Запрет всего по умолчанию
aws ec2 create-security-group \
    --group-name restrict-app \
    --vpc-id vpc-xxx \
    --description "Strict security group"
```

### Service Mesh Security

```yaml
# Istio mTLS configuration
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-strict
  namespace: default
spec:
  mtls:
    mode: STRICT
---
apiVersion: networking.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: deny-all
  namespace: default
spec:
  {}  # Deny all by default
---
apiVersion: networking.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-specific
  namespace: default
spec:
  selector:
    matchLabels:
      app: api-gateway
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/frontend"]
    to:
    - operation:
        paths: ["/api/v1/*"]
        methods: ["GET", "POST"]
```

## Data Protection

### Encryption at Rest

```bash
# AWS KMS
aws kms create-key \
    --description "Data encryption key" \
    --key-usage ENCRYPT_DECRYPT \
    --origin AWS_KMS

# Включение encryption для S3
aws s3api put-bucket-encryption \
    --bucket my-bucket \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "aws:kms",
                "KMSMasterKeyID": "arn:aws:kms:region:account:key/key-id"
            }
        }]
    }'

# Azure
Set-AzStorageContainerAcl -Name "container" -Permission Off
```

### Encryption in Transit

```yaml
# TLS Configuration для Kubernetes Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.3"
    nginx.ingress.kubernetes.io/ssl-ciphers: "TLS_AES_256_GCM_SHA384"
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: tls-cert
```

## Container and Kubernetes Security

### Pod Security Standards

```yaml
# Kubernetes Pod Security Standards
apiVersion: v1
kind: Namespace
metadata:
  name: restricted
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
# Runtime class для gVisor
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
---
# Пример deployment с ограничениями
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10000
        runAsGroup: 10000
        fsGroup: 10000
      containers:
      - name: app
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
```

### Image Security

```dockerfile
# Безопасный Dockerfile
FROM alpine:3.18 AS builder

# Не запускать от root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Сканирование образов
# Trivy
trivy image --exit-code 1 myapp:latest

# Clair
clair-scanner myapp:latest
```

## Logging and Monitoring

### CloudTrail Configuration

```bash
# AWS CloudTrail
aws cloudtrail create-trail \
    --name security-trail \
    --s3-bucket-name audit-logs-bucket \
    --is-multi-region-trail

# Включение логирования для всех регионов
aws cloudtrail update-trail \
    --name security-trail \
    --is-multi-region-trail

# Организационные логи
aws organizations enable-aws-service-access \
    --service-principal cloudtrail.amazonaws.com
```

### SIEM Integration

```python
# Отправка облачных логов в SIEM
import json
from datetime import datetime

def process_cloudtrail_event(event):
    """Обработка события CloudTrail"""
    return {
        "timestamp": event['eventTime'],
        "event_name": event['eventName'],
        "user": event.get('userIdentity', {}).get('arn'),
        "source_ip": event.get('sourceIPAddress'),
        "region": event['awsRegion'],
        "resources": event.get('resources', []),
        "raw_event": event
    }

def send_to_splunk(event):
    """Отправка в Splunk"""
    import requests
    url = "https://splunk.example.com:8088/services/collector/event"
    headers = {"Authorization": "Splunk YOUR_TOKEN"}
    
    data = {
        "sourcetype": "aws:cloudtrail",
        "event": process_cloudtrail_event(event)
    }
    
    requests.post(url, json=data, headers=headers, verify=False)
```

## Compliance and Governance

```yaml
# Terraform для создания compliance resources
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_config_delivery_channel" "s3" {
  name          = "config-delivery"
  s3_bucket_name = aws_s3_bucket.config.id
  sns_topic_arn = aws_sns_topic.config.arn

  snapshot_delivery_properties {
    delivery_frequency = "Six_Hours"
  }
}

resource "aws_config_configuration_recorder" "recorder" {
  name     = "config-recorder"
  role_arn = aws_iam_role.config.arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }
}
```

## Incident Response в Cloud

```markdown
## Cloud Incident Response Playbook

### Detection
1. GuardDuty alerts
2. CloudWatch anomalies
3. Security hub findings

### Analysis
```bash
# Исследование GuardDuty finding
aws guardduty get-findings \
    --detector-id detector-id \
    --finding-id finding-id \
    --output json
```

### Containment
```bash
# Блокирование скомпрометированного пользователя
aws iam create-virtual-mfa-device \
    --virtual-mfa-device-name "BLOCKED-$(date +%s)"

# Отзыв сессий
aws sts get-session-token
aws iam list-access-keys --user-name compromised-user
```

### Recovery
1. Удаление вредоносных ресурсов
2. Восстановление из Terraform state
3. Rotating всех credentials
```

