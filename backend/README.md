# Eu Quero - Backend API

Backend REST API para o aplicativo Eu Quero Mobile (E-commerce de copos térmicos).

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **CORS** - Permitir requisições do frontend

## 📦 Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do diretório backend:

```env
PORT=3000
JWT_SECRET=euquero_secret_key_2024_change_in_production
NODE_ENV=development
```

## 🏃 Executar

### Modo Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação (`/api/auth`)

#### POST `/api/auth/login`
Login de usuário

**Request:**
```json
{
  "email": "usuario@teste.com",
  "password": "123456"
}
```

**Response:**
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

#### POST `/api/auth/register`
Registro de novo usuário

**Request:**
```json
{
  "email": "novo@usuario.com",
  "password": "senha123",
  "name": "Novo Usuário"
}
```

#### GET `/api/auth/validate`
Validar token JWT

**Headers:**
```
Authorization: Bearer {token}
```

---

### Produtos (`/api/products`)

#### GET `/api/products`
Listar todos os produtos

**Query Parameters:**
- `categoria` - Filtrar por categoria
- `minPreco` - Preço mínimo
- `maxPreco` - Preço máximo
- `search` - Buscar por nome

**Response:**
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
      "descricao": "Copo térmico de alta qualidade"
    }
  ],
  "total": 4
}
```

#### GET `/api/products/:id`
Buscar produto específico

#### GET `/api/products/tipos/copos`
Listar tipos de copos

#### GET `/api/products/featured/list`
Produtos em destaque

#### POST `/api/products`
Adicionar novo produto (admin)

#### PUT `/api/products/:id`
Atualizar produto (admin)

#### DELETE `/api/products/:id`
Deletar produto (admin)

---

### Checkout (`/api/checkout`)

#### POST `/api/checkout/add-to-cart`
Adicionar item ao carrinho

**Request:**
```json
{
  "productId": 1,
  "productName": "Copo térmico",
  "price": 249.90,
  "quantity": 1,
  "image": "/copo1.png"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Produto adicionado ao carrinho",
  "cart": {
    "items": [...],
    "total": 249.90,
    "itemCount": 1
  }
}
```

#### GET `/api/checkout/cart`
Obter carrinho do usuário

#### DELETE `/api/checkout/cart/:productId`
Remover item do carrinho

#### PUT `/api/checkout/cart/:productId`
Atualizar quantidade do item

**Request:**
```json
{
  "quantity": 2
}
```

#### POST `/api/checkout/process`
Processar pedido

**Request:**
```json
{
  "items": [...],
  "customerInfo": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999"
  },
  "paymentMethod": "credit_card",
  "deliveryAddress": {
    "street": "Rua Exemplo",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "promoCode": "DESCONTO10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pedido processado com sucesso",
  "order": {
    "id": 1,
    "orderNumber": "PED1234567890",
    "total": 249.90,
    "status": "pending",
    "estimatedDelivery": "3-5 dias úteis"
  }
}
```

#### GET `/api/checkout/orders`
Listar pedidos do usuário

#### GET `/api/checkout/orders/:id`
Buscar pedido específico

#### POST `/api/checkout/validate-promo`
Validar cupom de desconto

**Request:**
```json
{
  "promoCode": "DESCONTO10",
  "subtotal": 249.90
}
```

---

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer {seu_token_jwt}
```

## 👥 Usuários de Teste

### Usuário Normal
- **Email:** usuario@teste.com
- **Senha:** 123456

### Administrador
- **Email:** admin@euquero.com
- **Senha:** admin123

## 🎟️ Cupons de Desconto

- **DESCONTO10** - 10% de desconto
- **PRIMEIRACOMPRA** - 15% de desconto
- **FRETEGRATIS** - Frete grátis

## 📝 Notas

- Este backend usa armazenamento em memória (arrays). Em produção, use um banco de dados real (MongoDB, PostgreSQL, etc.)
- As senhas devem ser hasheadas com bcrypt em produção
- Configure HTTPS em produção
- Adicione rate limiting para prevenir abuso
- Implemente logs adequados
- Configure variáveis de ambiente seguras

## 🔄 Integração com Frontend

O frontend Ionic React deve fazer requisições para:
```
http://localhost:3000/api
```

Atualize os services do frontend para usar as URLs reais:

```typescript
// src/services/authService.ts
const API_URL = 'http://localhost:3000/api';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

## 📄 Licença

MIT
