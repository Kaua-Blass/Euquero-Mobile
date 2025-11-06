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
import { produtosMock, Produto } from '../../data/produtosMock';
import { tiposCoposMock, tiposCopos } from '../../data/coposMock';
import './Ecommerce.css';
import { useHistory } from 'react-router-dom';

// Importar Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Ecommerce: React.FC = () => {
  const history = useHistory();
  const [cartCount, setCartCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    // Atualizar contador do carrinho ao carregar
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/checkout/cart');
      const data = await response.json();
      
      if (data.success && data.cart) {
        setCartCount(data.cart.itemCount || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
    }
  };

  const handleAddToCart = async (produto: Produto) => {
    try {
      const response = await fetch('http://localhost:3000/api/checkout/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: produto.id,
          productName: produto.nome,
          price: produto.preco,
          quantity: 1,
          image: produto.imagem
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setToastMessage('Produto adicionado ao carrinho!');
        setToastColor('success');
        setShowToast(true);
        
        // Atualizar contador
        updateCartCount();
      } else {
        setToastMessage(data.error || 'Erro ao adicionar produto');
        setToastColor('danger');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
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
        {/* Searchbar */}
        <div className="search-container">
          <IonSearchbar placeholder="Buscar" className="custom-searchbar"></IonSearchbar>
        </div>

        {/* Botões de navegação horizontais */}
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
            {tiposCoposMock.map((tipo: tiposCopos) => (
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
            {produtosMock.map((produto: Produto) => (
              <SwiperSlide key={produto.id} className="product-slide">
                <div className="product-card">
                  <img src={produto.imagem} alt={produto.nome} />
                  <div className="product-info">
                    <p className="product-brand">Stanley</p>
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

        {/* Swiper de descontos */}
        <div className="swiper-container">
          <h2>Descontos</h2>
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={2.5}
            pagination={{ clickable: true }}
            className="products-swiper"
          >
            {produtosMock.slice(0, 2).map((produto: Produto) => (
              <SwiperSlide key={`desconto-${produto.id}`} className="product-slide">
                <div className="product-card discount-card">
                  <div className="discount-badge">-15%</div>
                  <img src={produto.imagem} alt={produto.nome} />
                  <div className="product-info">
                    <p className="product-brand">Stanley</p>
                    <p className="product-name">{produto.nome}</p>
                    <p className="product-price-old">
                      {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="product-price">
                      {(produto.preco * 0.85).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
