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

// GET /api/products - Listar produtos com filtros
router.get('/', (req, res) => {
  const { categoria, minPreco, maxPreco, search } = req.query;
  let filtered = [...products];

  if (categoria) filtered = filtered.filter(p => p.categoria === categoria);
  if (minPreco) filtered = filtered.filter(p => p.preco >= parseFloat(minPreco));
  if (maxPreco) filtered = filtered.filter(p => p.preco <= parseFloat(maxPreco));
  if (search) filtered = filtered.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));

  res.json({ success: true, products: filtered, total: filtered.length });
});

// GET /api/products/:id - Buscar produto específico
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) return res.status(404).json({ success: false, error: 'Produto não encontrado' });

  res.json({ success: true, product });
});

// GET /api/products/tipos/copos - Listar tipos de copos
router.get('/tipos/copos', (req, res) => {
  res.json({ success: true, tipos: tiposCopos });
});

// GET /api/products/featured/list - Produtos em destaque
router.get('/featured/list', (req, res) => {
  const featured = products.filter(p => p.preco >= 200);
  res.json({ success: true, products: featured });
});

module.exports = router;
