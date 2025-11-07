import React, { useState, useEffect } from 'react';
import { 
  IonPage,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonCard, 
  IonCardHeader, 
  IonCardTitle,
  IonBadge,
  IonToast,
} from '@ionic/react';
import { cart, logIn, personAddOutline, notifications, addCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Ecommerce.css';

const API_BASE_URL = 'http://localhost:3000/api';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  categoria: string;
  descricao: string;
}

interface TipoCopo {
  id: number;
  nome: string;
  imagem: string;
  descricao: string;
}

const Ecommerce: React.FC = () => {
  const history = useHistory();
  const [cartCount, setCartCount] = useState(0);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [tiposCopos, setTiposCopos] = useState<TipoCopo[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    fetchProducts();
    fetchTiposCopos();
    updateCartCount();
  }, []);

  // Buscar produtos do backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      if (data.success) setProdutos(data.products);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  // Buscar tipos de copos do backend
  const fetchTiposCopos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/tipos/copos`);
      const data = await res.json();
      if (data.success) setTiposCopos(data.tipos);
    } catch (err) {
      console.error('Erro ao buscar tipos de copos:', err);
    }
  };

  // Atualizar contagem do carrinho
  const updateCartCount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/checkout/cart`, {
        headers: { 'Authorization': `Bearer token-fake` }
      });
      const data = await res.json();
      if (data.success && data.cart) {
        setCartCount(data.cart.itemCount || 0);
      }
    } catch (err) {
      console.error('Erro ao atualizar contagem do carrinho:', err);
    }
  };

  const handleAddToCart = async (produto: Produto) => {
    try {
      const res = await fetch(`${API_BASE_URL}/checkout/add-to-cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer token-fake` 
        },
        body: JSON.stringify({
          productId: produto.id,
          productName: produto.nome,
          price: produto.preco,
          quantity: 1,
          image: produto.imagem
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Produto "${produto.nome}" adicionado ao carrinho!`);
        setToastColor('success');
        setShowToast(true);
        updateCartCount();
      } else {
        setToastMessage(data.error || 'Erro ao adicionar produto');
        setToastColor('danger');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      setToastMessage('Erro ao conectar com o servidor');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const handleCartClick = () => {
    history.push('/Checkout');
  };

  return (
    <IonPage>
      <IonContent>
        <div className="search-container">
          <IonSearchbar placeholder="Buscar" className="custom-searchbar"></IonSearchbar>
        </div>

        <div className="nav-buttons">
          <IonButton onClick={() => history.push('/SignIn')}>
            <IonIcon icon={logIn} />
            <span>Login</span>
          </IonButton>
          <IonButton>
            <IonIcon icon={personAddOutline} />
            <span>Cadastro</span>
          </IonButton>
          <IonButton onClick={handleCartClick} className="cart-button-with-badge">
            <IonIcon icon={cart} />
            <span>Carrinho</span>
            {cartCount > 0 && (
              <IonBadge color="danger" className="cart-badge">{cartCount}</IonBadge>
            )}
          </IonButton>
          <IonButton>
            <IonIcon icon={notifications} />
            <span>Notif</span>
          </IonButton>
        </div>

        {/* Cards de categorias */}
        <div className='card-container'>
          <IonCard>
            <img alt="COPOS" src="/copos.png" />
            <IonCardHeader>
              <IonCardTitle>COPOS</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <IonCard>
            <img alt="PERSONALIZAR" src="/personalizar.png" />
            <IonCardHeader>
              <IonCardTitle>PERSONALIZAR</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </div>

        {/* Swiper com tipos de copos */}
        <div className="swiper-container">
          <h2>Tipos de Copos</h2>
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={2.5}
            pagination={{ clickable: true }}
            className="products-swiper"
          >
            {tiposCopos.map(tipo => (
              <SwiperSlide key={tipo.id} className="slide-item">
                <img src={tipo.imagem} alt={tipo.nome} />
                <p className="slide-title">{tipo.nome}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Swiper com produtos */}
        <div className="swiper-container">
          <h2>Produtos</h2>
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={2.5}
            pagination={{ clickable: true }}
            className="products-swiper"
          >
            {produtos.map(produto => (
              <SwiperSlide key={produto.id} className="product-slide">
                <div className="product-card">
                  <img src={produto.imagem} alt={produto.nome} />
                  <div className="product-info">
                    <p className="product-name">{produto.nome}</p>
                    <p className="product-price">
                      {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <IonButton 
                      size="small" 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(produto)}
                    >
                      <IonIcon icon={addCircle} slot="start" />
                      Adicionar
                    </IonButton>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </IonContent>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        color={toastColor}
        position="bottom"
      />
    </IonPage>  
  );
};

export default Ecommerce;
