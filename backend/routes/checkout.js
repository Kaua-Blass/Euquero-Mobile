const express = require('express');
const router = express.Router();

// Banco de dados em memória para pedidos e carrinho
let orders = [];
let carts = {}; // { userId: { items: [], total: 0 } }

// Middleware para verificar autenticação (simplificado)
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    // Para desenvolvimento, permite sem token
    req.userId = 'guest';
    return next();
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    req.userId = 'guest';
    next();
  }
};

// POST /api/checkout/add-to-cart - Adicionar item ao carrinho
router.post('/add-to-cart', authenticateToken, (req, res) => {
  try {
    const { productId, productName, price, quantity = 1, image } = req.body;
    const userId = req.userId;

    // Validações
    if (!productId || !productName || !price) {
      return res.status(400).json({
        success: false,
        error: 'Dados do produto incompletos'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade deve ser maior que zero'
      });
    }

    // Inicializar carrinho se não existir
    if (!carts[userId]) {
      carts[userId] = {
        items: [],
        total: 0,
        itemCount: 0
      };
    }

    // Verificar se produto já está no carrinho
    const existingItemIndex = carts[userId].items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Atualizar quantidade
      carts[userId].items[existingItemIndex].quantity += quantity;
    } else {
      // Adicionar novo item
      carts[userId].items.push({
        productId,
        productName,
        price,
        quantity,
        image: image || '/copo1.png',
        addedAt: new Date().toISOString()
      });
    }

    // Recalcular totais
    carts[userId].itemCount = carts[userId].items.reduce(
      (sum, item) => sum + item.quantity, 
      0
    );
    carts[userId].total = carts[userId].items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    res.json({
      success: true,
      message: 'Produto adicionado ao carrinho',
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar produto ao carrinho'
    });
  }
});

// GET /api/checkout/cart - Obter carrinho
router.get('/cart', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const cart = carts[userId] || { items: [], total: 0, itemCount: 0 };

    res.json({
      success: true,
      cart: cart
    });

  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar carrinho'
    });
  }
});

// DELETE /api/checkout/cart/:productId - Remover item do carrinho
router.delete('/cart/:productId', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    if (!carts[userId]) {
      return res.status(404).json({
        success: false,
        error: 'Carrinho não encontrado'
      });
    }

    // Remover item
    carts[userId].items = carts[userId].items.filter(
      item => item.productId !== parseInt(productId)
    );

    // Recalcular totais
    carts[userId].itemCount = carts[userId].items.reduce(
      (sum, item) => sum + item.quantity, 
      0
    );
    carts[userId].total = carts[userId].items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    res.json({
      success: true,
      message: 'Item removido do carrinho',
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Erro ao remover item:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover item do carrinho'
    });
  }
});

// PUT /api/checkout/cart/:productId - Atualizar quantidade
router.put('/cart/:productId', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!carts[userId]) {
      return res.status(404).json({
        success: false,
        error: 'Carrinho não encontrado'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade deve ser maior que zero'
      });
    }

    // Atualizar quantidade
    const itemIndex = carts[userId].items.findIndex(
      item => item.productId === parseInt(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item não encontrado no carrinho'
      });
    }

    carts[userId].items[itemIndex].quantity = quantity;

    // Recalcular totais
    carts[userId].itemCount = carts[userId].items.reduce(
      (sum, item) => sum + item.quantity, 
      0
    );
    carts[userId].total = carts[userId].items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    res.json({
      success: true,
      message: 'Quantidade atualizada',
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar quantidade'
    });
  }
});

// POST /api/checkout/process - Processar pedido (simplificado)
router.post('/process', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { 
      items, 
      customerInfo, 
      paymentMethod, 
      deliveryAddress
    } = req.body;

    // Validações
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Carrinho vazio'
      });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({
        success: false,
        error: 'Informações do cliente incompletas'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Método de pagamento não informado'
      });
    }

    // Calcular total simples
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Criar pedido
    const order = {
      id: orders.length + 1,
      userId: userId,
      orderNumber: `PED${Date.now()}`,
      items: items,
      customerInfo: customerInfo,
      paymentMethod: paymentMethod,
      deliveryAddress: deliveryAddress,
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(order);

    // Limpar carrinho
    if (carts[userId]) {
      carts[userId] = { items: [], total: 0, itemCount: 0 };
    }

    res.json({
      success: true,
      message: 'Pedido processado com sucesso',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        estimatedDelivery: '3-5 dias úteis'
      }
    });

  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar pedido'
    });
  }
});

// GET /api/checkout/orders - Listar pedidos do usuário
router.get('/orders', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const userOrders = orders.filter(order => order.userId === userId);

    res.json({
      success: true,
      orders: userOrders
    });

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedidos'
    });
  }
});

// GET /api/checkout/orders/:id - Buscar pedido específico
router.get('/orders/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const orderId = parseInt(req.params.id);

    const order = orders.find(o => o.id === orderId && o.userId === userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedido'
    });
  }
});

module.exports = router;
