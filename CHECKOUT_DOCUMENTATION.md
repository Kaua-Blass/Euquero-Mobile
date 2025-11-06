# Sistema de Checkout - Eu Quero Mobile

## 📋 Visão Geral

Sistema completo de checkout com backend mockado que simula um e-commerce real. Inclui gerenciamento de carrinho, cálculo de totais, validação de cupons e processamento de pedidos.

## 🛒 Funcionalidades Implementadas

### 1. Gerenciamento de Carrinho
- ✅ Adicionar produtos ao carrinho
- ✅ Remover produtos do carrinho
- ✅ Atualizar quantidade de produtos
- ✅ Limpar carrinho
- ✅ Persistência no localStorage

### 2. Cálculo de Totais
- ✅ Subtotal dos produtos
- ✅ Frete (grátis acima de R$ 200)
- ✅ Impostos (4% do subtotal)
- ✅ Desconto por cupom promocional
- ✅ Total final

### 3. Cupons Promocionais
- ✅ **EUQUERO10** - 10% de desconto
- ✅ **PRIMEIRACOMPRA** - 15% de desconto
- ✅ Validação de cupons
- ✅ Aplicação automática de desconto

### 4. Processamento de Pedidos
- ✅ Validação de dados
- ✅ Geração de ID único do pedido
- ✅ Salvamento no localStorage
- ✅ Confirmação com alert
- ✅ Feedback com toast notifications
- ✅ Redirecionamento após sucesso

## 🏗️ Arquitetura

### Frontend

#### Serviço de Checkout (`src/services/checkoutService.ts`)
```typescript
// Principais funções:
- processOrder(order: Order): Promise<CheckoutResponse>
- calculateTotals(items: CartItem[], promoCode?: string)
- validatePromoCode(code: string)
- getOrder(orderId: string)
- getUserOrders()
```

#### Serviço de Carrinho (`src/services/checkoutService.ts`)
```typescript
// Principais funções:
- getCart(): CartItem[]
- addItem(item: CartItem): void
- removeItem(itemId: number): void
- updateQuantity(itemId: number, quantity: number): void
- clearCart(): void
- getTotalItems(): number
```

#### Página de Checkout (`src/pages/Checkout/Checkout.tsx`)
- Exibição de itens do carrinho
- Resumo de valores
- Aplicação de cupons
- Confirmação de pedido
- Loading states
- Toast notifications

#### Helper de Carrinho (`src/utils/cartHelper.ts`)
- Conversão de produtos para itens do carrinho
- Função para adicionar itens de exemplo

### Backend Mock (`backend/checkout.ts`)

#### Endpoints Disponíveis:

1. **POST /api/checkout/process**
   - Processa um novo pedido
   - Valida dados obrigatórios
   - Gera ID único
   - Retorna confirmação

2. **POST /api/checkout/validate-promo**
   - Valida código promocional
   - Retorna percentual de desconto

3. **GET /api/checkout/order/:orderId**
   - Busca pedido por ID
   - Retorna dados completos do pedido

4. **GET /api/checkout/orders**
   - Lista todos os pedidos do usuário
   - Ordenados por data (mais recente primeiro)

5. **POST /api/checkout/calculate**
   - Calcula totais do carrinho
   - Aplica cupom se fornecido
   - Retorna breakdown de valores

## 💾 Estrutura de Dados

### CartItem
```typescript
{
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}
```

### Order
```typescript
{
  id?: string;
  userId?: string;
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
}
```

## 🧪 Como Testar

### 1. Adicionar Itens ao Carrinho

No console do navegador:
```javascript
// Importar helper
import { addSampleItemsToCart } from './src/utils/cartHelper';

// Adicionar itens de exemplo
addSampleItemsToCart();
```

Ou manualmente no localStorage:
```javascript
const sampleCart = [
  {
    id: 1,
    name: 'Copo Térmico',
    brand: 'Stanley',
    image: '/copo1.png',
    price: 174.99,
    quantity: 1,
    size: '473ml'
  }
];

localStorage.setItem('cart', JSON.stringify(sampleCart));
```

### 2. Testar Checkout Completo

1. Acesse: `http://localhost:5173/Checkout`
2. Verifique os itens no carrinho
3. Clique em "PROMOÇÕES" para aplicar cupom
4. Use um dos cupons válidos:
   - `EUQUERO10`
   - `PRIMEIRACOMPRA`
5. Clique em "Fazer pedido"
6. Confirme no alert
7. Observe o toast de sucesso com ID do pedido

### 3. Testar Cupons Promocionais

```javascript
// No console do navegador
import { checkoutService } from './src/services/checkoutService';

// Testar cupom válido
const result = await checkoutService.validatePromoCode('EUQUERO10');
console.log(result); // { valid: true, discount: 10, message: '10% de desconto aplicado!' }

// Testar cupom inválido
const result2 = await checkoutService.validatePromoCode('INVALIDO');
console.log(result2); // { valid: false, discount: 0, message: 'Código promocional inválido.' }
```

### 4. Verificar Pedidos Salvos

```javascript
// Buscar último pedido
const lastOrderId = localStorage.getItem('lastOrderId');
const order = await checkoutService.getOrder(lastOrderId);
console.log(order);

// Listar todos os pedidos
const orders = await checkoutService.getUserOrders();
console.log(orders);
```

## 📊 Regras de Negócio

### Frete
- **Grátis:** Compras acima de R$ 200,00
- **Pago:** R$ 15,00 para compras abaixo de R$ 200,00

### Impostos
- **Taxa fixa:** 4% sobre o subtotal

### Cupons
| Código | Desconto | Descrição |
|--------|----------|-----------|
| EUQUERO10 | 10% | Cupom padrão |
| PRIMEIRACOMPRA | 15% | Primeira compra |

### Validações
- ✅ Carrinho não pode estar vazio
- ✅ Endereço de entrega obrigatório
- ✅ Método de pagamento obrigatório
- ✅ Valores devem ser positivos

## 🔄 Fluxo de Checkout

```
1. Usuário adiciona produtos ao carrinho
   ↓
2. Navega para página de Checkout
   ↓
3. Revisa itens e totais
   ↓
4. (Opcional) Aplica cupom promocional
   ↓
5. Clica em "Fazer pedido"
   ↓
6. Confirma no alert
   ↓
7. Sistema processa pedido:
   - Valida dados
   - Gera ID único
   - Salva no localStorage
   - Limpa carrinho
   ↓
8. Exibe toast de sucesso
   ↓
9. Redireciona para Ecommerce após 2 segundos
```

## 🚀 Próximos Passos (Implementação Futura)

### Backend Real
1. Substituir localStorage por banco de dados
2. Implementar autenticação JWT
3. Criar endpoints REST reais
4. Adicionar validações server-side
5. Implementar webhooks de pagamento

### Frontend
1. Adicionar página de histórico de pedidos
2. Implementar rastreamento de pedidos
3. Adicionar mais métodos de pagamento
4. Criar formulário de endereço
5. Implementar busca de CEP

### Integrações
1. Gateway de pagamento (Stripe, PagSeguro)
2. API de frete (Correios, Melhor Envio)
3. Sistema de notificações (email, SMS)
4. Analytics e tracking

## 📝 Exemplo de Uso Completo

```typescript
import { cartService, checkoutService } from './services/checkoutService';
import { addProductToCart } from './utils/cartHelper';

// 1. Adicionar produto ao carrinho
const produto = {
  id: 1,
  nome: 'Copo Térmico',
  imagem: '/copo1.png',
  preco: 174.99
};
addProductToCart(produto, 2); // quantidade: 2

// 2. Obter carrinho
const cart = cartService.getCart();
console.log('Itens no carrinho:', cart);

// 3. Calcular totais
const totals = checkoutService.calculateTotals(cart, 'EUQUERO10');
console.log('Totais:', totals);

// 4. Processar pedido
const order = {
  items: cart,
  address: {
    street: 'Rua Exemplo',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  },
  paymentMethod: {
    type: 'credit_card',
    cardNumber: '**** 1234'
  },
  ...totals
};

const response = await checkoutService.processOrder(order);
if (response.success) {
  console.log('Pedido criado:', response.orderId);
}
```

## 🛡️ Segurança

**Nota:** Este é um sistema mockado para desenvolvimento. Em produção:

1. ✅ Validar todos os dados no backend
2. ✅ Usar HTTPS
3. ✅ Implementar rate limiting
4. ✅ Sanitizar inputs
5. ✅ Usar tokens seguros
6. ✅ Criptografar dados sensíveis
7. ✅ Implementar CSRF protection
8. ✅ Validar cupons no servidor

## 📚 Referências

- [Ionic React](https://ionicframework.com/docs/react)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [E-commerce Best Practices](https://www.shopify.com/blog/ecommerce-checkout-best-practices)
