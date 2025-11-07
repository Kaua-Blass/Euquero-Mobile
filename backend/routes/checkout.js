const express = require('express');
const router = express.Router();

// Banco de dados em memória para pedidos e carrinho
let orders = [];
let carts = {}; // { userId: { items: [], subtotal: 0, shipping: 0, taxes: 0, total: 0, itemCount: 0 } }

const authenticateToken = (req, res, next) => {
  req.userId = 'guest';
  next();
};

// Função auxiliar para atualizar subtotal, frete, impostos e total
const updateCartTotals = (cart) => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0; 
  const taxes = parseFloat((subtotal * 0.15).toFixed(2)); 
  const total = parseFloat((subtotal + shipping + taxes).toFixed(2));
  return { subtotal, shipping, taxes, total };
};

// Adicionar item ao carrinho
router.post('/add-to-cart', authenticateToken, (req, res) => {
  try {
    const { productId, productName, price, quantity = 1, image } = req.body;
    const userId = req.userId;

    if (!productId || !productName || !price) {
      return res.status(400).json({ success: false, error: 'Dados do produto incompletos' });
    }

    if (!carts[userId]) {
      carts[userId] = { items: [], subtotal: 0, shipping: 0, taxes: 0, total: 0, itemCount: 0 };
    }

    const existingItem = carts[userId].items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      carts[userId].items.push({ productId, productName, price, quantity, image: image || '/copo1.png' });
    }

    const { subtotal, shipping, taxes, total } = updateCartTotals(carts[userId]);
    carts[userId].subtotal = subtotal;
    carts[userId].shipping = shipping;
    carts[userId].taxes = taxes;
    carts[userId].total = total;
    carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ success: true, message: 'Produto adicionado ao carrinho', cart: carts[userId] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro ao adicionar produto ao carrinho' });
  }
});

// Obter carrinho
router.get('/cart', authenticateToken, (req, res) => {
  try {
    const cart = carts[req.userId] || { items: [], subtotal: 0, shipping: 0, taxes: 0, total: 0, itemCount: 0 };
    const { subtotal, shipping, taxes, total } = updateCartTotals(cart);
    cart.subtotal = subtotal;
    cart.shipping = shipping;
    cart.taxes = taxes;
    cart.total = total;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro ao buscar carrinho' });
  }
});

// Remover item do carrinho
router.delete('/cart/:productId', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const productId = parseInt(req.params.productId);

    if (!carts[userId]) {
      return res.status(404).json({ success: false, error: 'Carrinho não encontrado' });
    }

    carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);

    const { subtotal, shipping, taxes, total } = updateCartTotals(carts[userId]);
    carts[userId].subtotal = subtotal;
    carts[userId].shipping = shipping;
    carts[userId].taxes = taxes;
    carts[userId].total = total;
    carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ success: true, message: 'Item removido do carrinho', cart: carts[userId] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro ao remover item do carrinho' });
  }
});

// Processar pedido
router.post('/process', authenticateToken, (req, res) => {
  try {
    const { items, customerInfo, paymentMethod, deliveryAddress } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) return res.status(400).json({ success: false, error: 'Carrinho vazio' });
    if (!customerInfo || !customerInfo.name || !customerInfo.email) return res.status(400).json({ success: false, error: 'Informações do cliente incompletas' });
    if (!paymentMethod) return res.status(400).json({ success: false, error: 'Método de pagamento não informado' });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 0 : 0; 
    const taxes = parseFloat((subtotal * 0.15).toFixed(2));
    const total = parseFloat((subtotal + shipping + taxes).toFixed(2));

    const order = {
      id: orders.length + 1,
      userId,
      orderNumber: `PED${Date.now()}`,
      items,
      customerInfo,
      paymentMethod,
      deliveryAddress,
      subtotal,
      shipping,
      taxes,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    carts[userId] = { items: [], subtotal: 0, shipping: 0, taxes: 0, total: 0, itemCount: 0 };

    res.json({
      success: true,
      message: 'Pedido processado com sucesso',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        shipping: order.shipping,
        taxes: order.taxes,
        total: order.total,
        status: order.status,
        estimatedDelivery: '3-5 dias úteis'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro ao processar pedido' });
  }
});

module.exports = router;
