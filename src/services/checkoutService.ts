// Interface de Item do Carrinho
export interface CartItem {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

// Interface de Endereço
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// Interface de Pagamento
export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

// Interface de Pedido
export interface Order {
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

// Interface de Resposta do Checkout
export interface CheckoutResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}

// Simula delay de rede
const simulateNetworkDelay = (ms: number = 800) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Gerar ID único para pedido
function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Armazenamento de pedidos (simulando banco de dados)
const orders: Order[] = [];

// Serviço de Checkout Mockado
export const checkoutService = {
  // Processar pedido
  async processOrder(order: Order): Promise<CheckoutResponse> {
    await simulateNetworkDelay();

    try {
      // Validações
      if (!order.items || order.items.length === 0) {
        return { success: false, error: 'Carrinho vazio. Adicione itens antes de finalizar.' };
      }

      if (!order.address || !order.address.street) {
        return { success: false, error: 'Endereço de entrega não informado.' };
      }

      if (!order.paymentMethod || !order.paymentMethod.type) {
        return { success: false, error: 'Método de pagamento não informado.' };
      }

      // Gerar ID do pedido
      const orderId = generateOrderId();

      // Criar pedido completo
      const newOrder: Order = {
        ...order,
        id: orderId,
        status: 'pending',
        createdAt: new Date()
      };

      // Salvar pedido
      orders.push(newOrder);

      // Salvar no localStorage
      localStorage.setItem('lastOrderId', orderId);
      localStorage.setItem(`order_${orderId}`, JSON.stringify(newOrder));

      // Limpar carrinho após pedido bem-sucedido
      localStorage.removeItem('cart');

      return {
        success: true,
        orderId: orderId,
        message: 'Pedido realizado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao processar pedido. Tente novamente.'
      };
    }
  },

  // Calcular totais do carrinho
  calculateTotals(items: CartItem[], promoCode?: string): {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Frete grátis acima de R$ 200
    const shipping = subtotal >= 200 ? 0 : 15.00;
    
    // Imposto de 4%
    const tax = subtotal * 0.04;
    
    // Desconto por código promocional
    let discount = 0;
    if (promoCode) {
      if (promoCode.toUpperCase() === 'EUQUERO10') {
        discount = subtotal * 0.10; // 10% de desconto
      } else if (promoCode.toUpperCase() === 'PRIMEIRACOMPRA') {
        discount = subtotal * 0.15; // 15% de desconto
      }
    }
    
    const total = subtotal + shipping + tax - discount;
    
    return { subtotal, shipping, tax, discount, total };
  },

  // Validar código promocional
  async validatePromoCode(code: string): Promise<{ valid: boolean; discount: number; message: string }> {
    await simulateNetworkDelay(300);

    const upperCode = code.toUpperCase();

    if (upperCode === 'EUQUERO10') {
      return {
        valid: true,
        discount: 10,
        message: '10% de desconto aplicado!'
      };
    }

    if (upperCode === 'PRIMEIRACOMPRA') {
      return {
        valid: true,
        discount: 15,
        message: '15% de desconto aplicado!'
      };
    }

    return {
      valid: false,
      discount: 0,
      message: 'Código promocional inválido.'
    };
  },

  // Buscar pedido por ID
  async getOrder(orderId: string): Promise<Order | null> {
    await simulateNetworkDelay(300);

    const orderData = localStorage.getItem(`order_${orderId}`);
    if (orderData) {
      return JSON.parse(orderData);
    }

    return null;
  },

  // Listar todos os pedidos do usuário
  async getUserOrders(): Promise<Order[]> {
    await simulateNetworkDelay(500);

    const userOrders: Order[] = [];
    
    // Buscar todos os pedidos do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('order_')) {
        const orderData = localStorage.getItem(key);
        if (orderData) {
          userOrders.push(JSON.parse(orderData));
        }
      }
    }

    // Ordenar por data (mais recente primeiro)
    return userOrders.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }
};

// Interface de resposta ao adicionar item
export interface AddToCartResponse {
  success: boolean;
  message?: string;
  cartTotal?: number;
  error?: string;
}

// Serviço de Carrinho
export const cartService = {
  // Obter itens do carrinho
  getCart(): CartItem[] {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  },

  // Adicionar item ao carrinho (com chamada ao backend mockado)
  async addItem(item: CartItem): Promise<AddToCartResponse> {
    await simulateNetworkDelay(300);

    try {
      const cart = this.getCart();
      const existingItemIndex = cart.findIndex(i => i.id === item.id);

      if (existingItemIndex >= 0) {
        // Item já existe, aumentar quantidade
        cart[existingItemIndex].quantity += item.quantity;
      } else {
        // Novo item
        cart.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      const totalItems = this.getTotalItems();

      return {
        success: true,
        message: `${item.name} adicionado ao carrinho!`,
        cartTotal: totalItems
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao adicionar item ao carrinho.'
      };
    }
  },

  // Adicionar item de forma síncrona (para compatibilidade)
  addItemSync(item: CartItem): void {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(i => i.id === item.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  },

  // Remover item do carrinho
  removeItem(itemId: number): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  },

  // Atualizar quantidade de um item
  updateQuantity(itemId: number, quantity: number): void {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(i => i.id === itemId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  },

  // Limpar carrinho
  clearCart(): void {
    localStorage.removeItem('cart');
  },

  // Obter quantidade total de itens
  getTotalItems(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};
