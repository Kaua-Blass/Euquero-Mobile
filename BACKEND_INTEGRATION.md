# 🔗 Integração Frontend-Backend

Guia completo para conectar o frontend Ionic React ao backend Node.js/Express.

## 📋 Estrutura do Projeto

```
euquero_mobile/
├── backend/                    # Backend Node.js/Express
│   ├── routes/
│   │   ├── auth.js            # Rotas de autenticação
│   │   ├── checkout.js        # Rotas de checkout/carrinho
│   │   └── products.js        # Rotas de produtos
│   ├── server.js              # Servidor principal
│   ├── package.json
│   └── .env                   # Variáveis de ambiente
│
├── src/                       # Frontend Ionic React
│   ├── services/
│   │   ├── authService.ts     # Serviço de autenticação
│   │   └── checkoutService.ts # Serviço de checkout
│   └── pages/
│       ├── Ecommerce/
│       ├── SignIn/
│       └── Checkout/
```

---

## 🚀 Como Executar

### 1. Iniciar o Backend

```bash
# Terminal 1 - Backend
cd backend
npm run dev
```

O backend estará rodando em: **http://localhost:3000**

### 2. Iniciar o Frontend

```bash
# Terminal 2 - Frontend (na raiz do projeto)
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

---

## 🔧 Configuração do Frontend

### Atualizar `src/services/authService.ts`

Substitua o conteúdo atual por:

```typescript
// src/services/authService.ts
const API_URL = 'http://localhost:3000/api';

interface LoginResponse {
  success: boolean;
  token?: string;
  name?: string;
  email?: string;
  role?: string;
  message?: string;
  error?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.token) {
      // Salvar token no localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
    }

    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success && data.valid;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

export const getUserData = () => {
  return {
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
  };
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};
```

---

### Atualizar `src/services/checkoutService.ts`

Substitua o conteúdo atual por:

```typescript
// src/services/checkoutService.ts
import { getAuthToken } from './authService';

const API_URL = 'http://localhost:3000/api';

export interface AddToCartResponse {
  success: boolean;
  message?: string;
  cart?: {
    items: any[];
    total: number;
    itemCount: number;
  };
  error?: string;
}

export interface ProcessOrderResponse {
  success: boolean;
  message?: string;
  order?: {
    id: number;
    orderNumber: string;
    total: number;
    status: string;
    estimatedDelivery: string;
  };
  error?: string;
}

// Adicionar item ao carrinho
export const addItem = async (
  productId: number,
  productName: string,
  price: number,
  quantity: number = 1,
  image?: string
): Promise<AddToCartResponse> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/checkout/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        productId,
        productName,
        price,
        quantity,
        image,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

// Obter carrinho
export const getCart = async () => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/checkout/cart`, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    return {
      success: false,
      cart: { items: [], total: 0, itemCount: 0 },
    };
  }
};

// Remover item do carrinho
export const removeItem = async (productId: number) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/checkout/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao remover item:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

// Atualizar quantidade
export const updateQuantity = async (productId: number, quantity: number) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/checkout/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ quantity }),
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

// Processar pedido
export const processOrder = async (orderData: any): Promise<ProcessOrderResponse> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/checkout/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(orderData),
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

// Validar cupom
export const validatePromoCode = async (promoCode: string, subtotal: number) => {
  try {
    const response = await fetch(`${API_URL}/checkout/validate-promo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promoCode, subtotal }),
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

// Obter pedidos do usuário
export const getUserOrders = async () => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/checkout/orders`, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return {
      success: false,
      orders: [],
    };
  }
};

// Limpar carrinho
export const clearCart = async () => {
  // Implementar se necessário
  return { success: true };
};

// Total de itens
export const getTotalItems = async (): Promise<number> => {
  const cartData = await getCart();
  return cartData.cart?.itemCount || 0;
};
```

---

## 🧪 Testando a Integração

### 1. Testar Login

```bash
# No terminal, teste o endpoint de login:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"123456"}'
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

### 2. Testar Adicionar ao Carrinho

```bash
curl -X POST http://localhost:3000/api/checkout/add-to-cart \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "productName": "Copo térmico",
    "price": 249.90,
    "quantity": 1
  }'
```

### 3. Testar Produtos

```bash
curl http://localhost:3000/api/products
```

---

## 🔐 Credenciais de Teste

### Usuário Normal
- **Email:** usuario@teste.com
- **Senha:** 123456

### Administrador
- **Email:** admin@euquero.com
- **Senha:** admin123

---

## 📝 Checklist de Integração

- [ ] Backend rodando em http://localhost:3000
- [ ] Frontend rodando em http://localhost:5173
- [ ] authService.ts atualizado com chamadas reais
- [ ] checkoutService.ts atualizado com chamadas reais
- [ ] Testar login no frontend
- [ ] Testar adicionar ao carrinho
- [ ] Testar processar pedido
- [ ] Verificar console do navegador para erros
- [ ] Verificar console do backend para logs

---

## 🐛 Troubleshooting

### Erro de CORS

Se aparecer erro de CORS no console:
```
Access to fetch at 'http://localhost:3000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solução:** O backend já está configurado com CORS. Reinicie o servidor backend.

### Erro 404 Not Found

Verifique se:
1. O backend está rodando
2. A URL está correta (`http://localhost:3000/api`)
3. O endpoint existe nas rotas

### Token Inválido

Se receber "Token inválido ou expirado":
1. Faça logout
2. Faça login novamente
3. Verifique se o token está sendo salvo no localStorage

---

## 🚀 Próximos Passos

1. **Banco de Dados Real**
   - Implementar MongoDB ou PostgreSQL
   - Substituir arrays em memória por queries ao banco

2. **Segurança**
   - Implementar rate limiting
   - Adicionar validação de inputs
   - Configurar HTTPS em produção

3. **Features Adicionais**
   - Upload de imagens de produtos
   - Sistema de avaliações
   - Histórico de pedidos
   - Notificações push

---

## 📚 Documentação Adicional

- [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/)
- [Ionic React](https://ionicframework.com/docs/react)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
