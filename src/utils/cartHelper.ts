import { cartService, CartItem, AddToCartResponse } from '../services/checkoutService';
import { Produto } from '../data/produtosMock';

// Converter produto mock para item do carrinho (async com POST)
export async function addProductToCart(produto: Produto, quantity: number = 1): Promise<AddToCartResponse> {
  const cartItem: CartItem = {
    id: produto.id,
    name: produto.nome,
    brand: 'Stanley',
    image: produto.imagem,
    price: produto.preco,
    quantity: quantity,
    size: '473ml'
  };

  return await cartService.addItem(cartItem);
}

// Adicionar itens de exemplo ao carrinho (para teste)
export function addSampleItemsToCart(): void {
  const sampleItems: CartItem[] = [
    {
      id: 1,
      name: 'Copo Térmico Cerveja Sem Tampa',
      brand: 'Stanley',
      image: '/copo1.png',
      price: 174.99,
      quantity: 1,
      color: 'Vermelho',
      size: '473ml'
    },
    {
      id: 2,
      name: 'Garrafa Térmica',
      brand: 'Stanley',
      image: '/copo3.png',
      price: 329.99,
      quantity: 1,
      color: 'Green',
      size: '1.2L'
    }
  ];

  sampleItems.forEach(item => cartService.addItemSync(item));
}
