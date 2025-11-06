const express = require('express');
const router = express.Router();

// Banco de dados em memória para produtos
const products = [
  { 
    id: 1, 
    nome: "Copo térmico com tampa aço inox", 
    imagem: "/copo1.png", 
    preco: 249.90,
    categoria: "termico",
    estoque: 50,
    descricao: "Copo térmico de alta qualidade com tampa em aço inox"
  },
  { 
    id: 2, 
    nome: "Copo termico casca de ovo aço inox", 
    imagem: "/copo2.png", 
    preco: 179.89,
    categoria: "termico",
    estoque: 30,
    descricao: "Copo térmico com acabamento casca de ovo"
  },
  { 
    id: 3, 
    nome: "Garrafa termica aço inox", 
    imagem: "/copo3.png", 
    preco: 211.90,
    categoria: "garrafa",
    estoque: 25,
    descricao: "Garrafa térmica de 1L em aço inox"
  },
  { 
    id: 4, 
    nome: "Copo termico aço inox", 
    imagem: "/copo4.png", 
    preco: 139.90,
    categoria: "termico",
    estoque: 40,
    descricao: "Copo térmico básico em aço inox"
  }
];

const tiposCopos = [
  { id: 1, nome: "Everyday", imagem: "/tipo1.png", descricao: "Para o dia a dia" },
  { id: 2, nome: "Wine", imagem: "/tipo2.png", descricao: "Para vinhos" },
  { id: 3, nome: "Quencher", imagem: "/tipo3.png", descricao: "Grande capacidade" },
  { id: 4, nome: "Growler", imagem: "/tipo4.png", descricao: "Para bebidas geladas" }
];

// GET /api/products - Listar todos os produtos
router.get('/', (req, res) => {
  try {
    const { categoria, minPreco, maxPreco, search } = req.query;
    
    let filteredProducts = [...products];

    // Filtrar por categoria
    if (categoria) {
      filteredProducts = filteredProducts.filter(p => p.categoria === categoria);
    }

    // Filtrar por preço
    if (minPreco) {
      filteredProducts = filteredProducts.filter(p => p.preco >= parseFloat(minPreco));
    }
    if (maxPreco) {
      filteredProducts = filteredProducts.filter(p => p.preco <= parseFloat(maxPreco));
    }

    // Buscar por nome
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.nome.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      products: filteredProducts,
      total: filteredProducts.length
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos'
    });
  }
});

// GET /api/products/:id - Buscar produto específico
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produto'
    });
  }
});

// GET /api/products/tipos/copos - Listar tipos de copos
router.get('/tipos/copos', (req, res) => {
  try {
    res.json({
      success: true,
      tipos: tiposCopos
    });

  } catch (error) {
    console.error('Erro ao buscar tipos de copos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tipos de copos'
    });
  }
});

// GET /api/products/featured - Produtos em destaque
router.get('/featured/list', (req, res) => {
  try {
    // Retornar produtos com preço acima de 200
    const featuredProducts = products.filter(p => p.preco >= 200);

    res.json({
      success: true,
      products: featuredProducts
    });

  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos em destaque'
    });
  }
});

// POST /api/products - Adicionar novo produto (admin)
router.post('/', (req, res) => {
  try {
    const { nome, imagem, preco, categoria, estoque, descricao } = req.body;

    // Validações
    if (!nome || !preco) {
      return res.status(400).json({
        success: false,
        error: 'Nome e preço são obrigatórios'
      });
    }

    const newProduct = {
      id: products.length + 1,
      nome,
      imagem: imagem || '/copo1.png',
      preco: parseFloat(preco),
      categoria: categoria || 'termico',
      estoque: estoque || 0,
      descricao: descricao || ''
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Produto adicionado com sucesso',
      product: newProduct
    });

  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar produto'
    });
  }
});

// PUT /api/products/:id - Atualizar produto (admin)
router.put('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    const { nome, imagem, preco, categoria, estoque, descricao } = req.body;

    // Atualizar campos
    if (nome) products[productIndex].nome = nome;
    if (imagem) products[productIndex].imagem = imagem;
    if (preco) products[productIndex].preco = parseFloat(preco);
    if (categoria) products[productIndex].categoria = categoria;
    if (estoque !== undefined) products[productIndex].estoque = estoque;
    if (descricao) products[productIndex].descricao = descricao;

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      product: products[productIndex]
    });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar produto'
    });
  }
});

// DELETE /api/products/:id - Deletar produto (admin)
router.delete('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    products.splice(productIndex, 1);

    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover produto'
    });
  }
});

module.exports = router;
