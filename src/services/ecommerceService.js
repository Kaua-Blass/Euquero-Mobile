const API_BASE_URL = 'http://localhost:3000/api';                                          

export const ecommerceService = {
  async getCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/cart`);
      const data = await response.json();
      return data; 
    } catch (error) {
      throw new Error('Erro ao buscar carrinho');
    }
  },

  async addToCart(productId, productName, price, quantity, image) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          price,
          quantity,
          image,
        }),
      });
      const data = await response.json();
      return data; 
    } catch (error) {
      throw new Error('Erro ao adicionar ao carrinho');
    }
  },

  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Erro ao buscar produtos');
    }
  },
  
};