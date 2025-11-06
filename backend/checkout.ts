import express, { Request, Response } from 'express';

const router = express.Router();

// Interface de Item do Pedido
interface OrderItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image?: string;
}

// Interface de Endereço
interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// Interface de Pagamento
interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto';
  cardNumber?: string;
  cardHolder?: string;
}

// Interface de Pedido
interface Order {
  id?: string;
  userId?: string;
  items: OrderItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
  status?: string;
  createdAt?: Date;
}

// Armazenamento em memória (em produção, use banco de dados)
const orders: Order[] = [];
const promoCodes: { [key: string]: number } = {
  'EUQUERO10': 10,
  'PRIMEIRACOMPRA': 15,
  'BLACKFRIDAY': 20
};

// Gerar ID único
function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// POST /api/checkout/process - Processar pedido
router.post('/process', (req: Request, res: Response) => {
  const orderData: Order = req.body;

  // Validações
  if (!orderData.items || orderData.items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Carrinho vazio. Adicione itens antes de finalizar.'
    });
  }

  if (!orderData.address || !orderData.address.street) {
    return res.status(400).json({
      success: false,
      error: 'Endereço de entrega não informado.'
    });
  }

  if (!orderData.paymentMethod || !orderData.paymentMethod.type) {
    return res.status(400).json({
      success: false,
      error: 'Método de pagamento não informado.'
    });
  }

  try {
    // Gerar ID do pedido
    const orderId = generateOrderId();

    // Criar pedido
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'pending',
      createdAt: new Date()
    };

    // Salvar pedido
    orders.push(newOrder);

    return res.status(200).json({
      success: true,
      orderId: orderId,
      message: 'Pedido realizado com sucesso!',
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar pedido.'
    });
  }
});

// POST /api/checkout/validate-promo - Validar código promocional
router.post('/validate-promo', (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      valid: false,
      message: 'Código promocional não informado.'
    });
  }

  const upperCode = code.toUpperCase();
  const discount = promoCodes[upperCode];

  if (discount) {
    return res.status(200).json({
      valid: true,
      discount: discount,
      message: `${discount}% de desconto aplicado!`
    });
  }

  return res.status(404).json({
    valid: false,
    discount: 0,
    message: 'Código promocional inválido.'
  });
});

// GET /api/checkout/order/:orderId - Buscar pedido por ID
router.get('/order/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = orders.find(o => o.id === orderId);

  if (order) {
    return res.status(200).json({
      success: true,
      order: order
    });
  }

  return res.status(404).json({
    success: false,
    error: 'Pedido não encontrado.'
  });
});

// GET /api/checkout/orders - Listar todos os pedidos do usuário
router.get('/orders', (req: Request, res: Response) => {
  // Em produção, filtrar por userId do token
  const userOrders = orders.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return res.status(200).json({
    success: true,
    orders: userOrders
  });
});

// POST /api/checkout/calculate - Calcular totais
router.post('/calculate', (req: Request, res: Response) => {
  const { items, promoCode } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      error: 'Nenhum item fornecido.'
    });
  }

  // Calcular subtotal
  const subtotal = items.reduce((sum: number, item: OrderItem) => 
    sum + (item.price * item.quantity), 0
  );

  // Calcular frete (grátis acima de R$ 200)
  const shipping = subtotal >= 200 ? 0 : 15.00;

  // Calcular imposto (4%)
  const tax = subtotal * 0.04;

  // Calcular desconto
  let discount = 0;
  if (promoCode) {
    const upperCode = promoCode.toUpperCase();
    const discountPercent = promoCodes[upperCode];
    if (discountPercent) {
      discount = subtotal * (discountPercent / 100);
    }
  }

  // Calcular total
  const total = subtotal + shipping + tax - discount;

  return res.status(200).json({
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    discount: discount.toFixed(2),
    total: total.toFixed(2)
  });
});

// POST /api/checkout/add-to-cart - Adicionar item ao carrinho
router.post('/add-to-cart', (req: Request, res: Response) => {
  const item: OrderItem = req.body;

  // Validações
  if (!item || !item.id) {
    return res.status(400).json({
      success: false,
      error: 'Item inválido.'
    });
  }

  if (!item.quantity || item.quantity <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Quantidade inválida.'
    });
  }

  try {
    // Simular adição ao carrinho
    // Em produção, isso seria salvo no banco de dados associado ao usuário

    return res.status(200).json({
      success: true,
      message: `${item.name} adicionado ao carrinho!`,
      cartTotal: item.quantity // Em produção, retornaria o total real do carrinho
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro ao adicionar item ao carrinho.'
    });
  }
});

export default router;
