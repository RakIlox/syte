# Криптографические основы безопасности

## Введение

Криптография — фундаментальный инструмент обеспечения конфиденциальности, целостности и аутентичности данных.

## Типы криптографии

```markdown
## Симметричное шифрование

| Алгоритм | Размер ключа | Применение |
|----------|--------------|------------|
| AES | 128/192/256 bit | Шифрование данных |
| ChaCha20 | 256 bit | Потоковое шифрование |
| 3DES | 168 bit | Legacy системы |

## Асимметричное шифрование

| Алгоритм | Применение |
|----------|------------|
| RSA 2048+ | Шифрование, подписи |
| ECDSA | Цифровые подписи |
| EdDSA | Современные подписи |
| Diffie-Hellman | Обмен ключами |

## Хеширование

| Алгоритм | Применение |
|----------|------------|
| SHA-256 | Целостность |
| SHA-3 | Современные применения |
| Bcrypt/Argon2 | Хеширование паролей |
| HMAC | Message authentication |
```

## TLS/SSL

```bash
# Проверка TLS конфигурации
openssl s_client -connect example.com:443 -servername example.com

# Проверка сертификата
openssl x509 -in cert.pem -text -noout

# Проверка цепочки
openssl verify -CAfile chain.pem cert.pem

# Тестирование cipher suites
sslscan example.com:443
```

## Certificate Management

```yaml
# Certificate transparency
# Проверка через CT logs
ct logs обеспечивают публичный аудит сертификатов

# PKI hierarchy
Root CA -> Intermediate CA -> End-entity Certificate
```

## Key Management

```python
class KeyManagement:
    def __init__(self):
        self.hsm = HSMConnection()
        self.kms = AWSKMS()
        
    def generate_key(self, key_type):
        """Генерация ключа"""
        if key_type == 'symmetric':
            return self.hsm.generate_aes_key(256)
        else:
            return self.hsm.generate_rsa_key(4096)
            
    def rotate_key(self, key_id):
        """Ротация ключа"""
        new_key = self.generate_key(self.get_key_type(key_id))
        self.rekey_data(new_key, key_id)
        self.archive_key(key_id)
```

## Quantum-Safe Cryptography

```markdown
## Post-Quantum угрозы

### Уязвимые алгоритмы
- RSA (все размеры)
- ECDSA, ECDH
- Diffie-Hellman

### Устойчивые алгоритмы (NIST PQC)
- CRYSTALS-Kyber (шифрование)
- CRYSTALS-Dilithium (подписи)
- SPHINCS+ (подписи)
```

## Best Practices

1. Используйте TLS 1.3 где возможно
2. Внедряйте certificate pinning
3. Используйте HSM для ключей
4. Регулярно обновляйте алгоритмы
5. Планируйте переход на PQC

