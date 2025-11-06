# 🧪 Testes dos Endpoints da API

## Como Testar

Use o PowerShell ou qualquer cliente HTTP (Postman, Insomnia, etc.)

---

## 1️⃣ Testar Servidor (GET /)

```powershell
curl http://localhost:3000/
```

**Resposta esperada:**
```json
{
  "message": "Eu Quero API - Backend funcionando!",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "checkout": "/api/checkout",
    "products": "/api/products"
  }
}
```

---

## 2️⃣ Testar Login (POST /api/auth/login)

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"usuario@teste.com\",\"password\":\"123456\"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "name": "Usuário Teste",
  "email": "usuario@teste.com",
  "role": "user",
  "message": "Login realizado com sucesso"
}
```

---

## 3️⃣ Testar Produtos (GET /api/products)

```powershell
curl http://localhost:3000/api/products
```

**Resposta esperada:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "nome": "Copo térmico com tampa aço inox",
      "imagem": "/copo1.png",
      "preco": 249.90,
      "categoria": "termico",
      "estoque": 50,
      "descricao": "Copo térmico de alta qualidade com tampa em aço inox"
    },
    ...
  ],
  "total": 4
}
```

---

## 4️⃣ Testar Adicionar ao Carrinho (POST /api/checkout/add-to-cart)

```powershell
curl -X POST http://localhost:3000/api/checkout/add-to-cart `
  -H "Content-Type: application/json" `
  -d '{\"productId\":1,\"productName\":\"Copo térmico\",\"price\":249.90,\"quantity\":1}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Produto adicionado ao carrinho",
  "cart": {
    "items": [
      {
        "productId": 1,
        "productName": "Copo térmico",
        "price": 249.90,
        "quantity": 1,
        "image": "/copo1.png",
        "addedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 249.90,
    "itemCount": 1
  }
}
```

---

## 5️⃣ Testar Obter Carrinho (GET /api/checkout/cart)

```powershell
curl http://localhost:3000/api/checkout/cart
```

---

## 6️⃣ Testar Validar Cupom (POST /api/checkout/validate-promo)

```powershell
curl -X POST http://localhost:3000/api/checkout/validate-promo `
  -H "Content-Type: application/json" `
  -d '{\"promoCode\":\"DESCONTO10\",\"subtotal\":249.90}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "valid": true,
  "discount": 24.99,
  "message": "10% de desconto aplicado!"
}
```

---

## 7️⃣ Testar Processar Pedido (POST /api/checkout/process)

```powershell
curl -X POST http://localhost:3000/api/checkout/process `
  -H "Content-Type: application/json" `
  -d '{\"items\":[{\"productId\":1,\"productName\":\"Copo térmico\",\"price\":249.90,\"quantity\":1}],\"customerInfo\":{\"name\":\"João Silva\",\"email\":\"joao@email.com\",\"phone\":\"(11) 99999-9999\"},\"paymentMethod\":\"credit_card\",\"deliveryAddress\":{\"street\":\"Rua Exemplo\",\"number\":\"123\",\"city\":\"São Paulo\",\"state\":\"SP\",\"zipCode\":\"01234-567\"}}'
```

---

## ✅ Status dos Testes

Execute cada teste e marque:

- [ ] GET / - Servidor funcionando
- [ ] POST /api/auth/login - Login
- [ ] GET /api/products - Listar produtos
- [ ] POST /api/checkout/add-to-cart - Adicionar ao carrinho
- [ ] GET /api/checkout/cart - Obter carrinho
- [ ] POST /api/checkout/validate-promo - Validar cupom
- [ ] POST /api/checkout/process - Processar pedido

---

## 🔍 Verificar Logs

Ao executar os testes, verifique o terminal do backend para ver os logs:

```
2024-01-15T10:30:00.000Z - POST /api/auth/login
2024-01-15T10:30:05.000Z - GET /api/products
2024-01-15T10:30:10.000Z - POST /api/checkout/add-to-cart
```

---

## 🐛 Troubleshooting

### Erro: "curl não é reconhecido"

Use o PowerShell ou instale curl:
```powershell
# Alternativa: Use Invoke-WebRequest
Invoke-WebRequest -Uri http://localhost:3000/ -Method GET
```

### Erro: "Connection refused"

Verifique se o backend está rodando:
```bash
cd backend
npm run dev
```

### Erro 404

Verifique se a URL está correta e se a rota existe no backend.
