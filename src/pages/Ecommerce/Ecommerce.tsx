import { 
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle,
  IonTitle,
} from '@ionic/react';
import { home, cart, person, logIn, personAddOutline, notifications } from 'ionicons/icons'; // Importar ícones
import { produtosMock, Produto } from '../../data/produtosMock';
import { tiposCoposMock, tiposCopos } from '../../data/coposMock';
import './Ecommerce.css';

// Importar Swiper (certifique-se de instalar: npm install swiper)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Ecommerce: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonTabBar slot="top" className="tabBarFixa">
          <IonTabButton tab="signin" href="/signin">
            <IonIcon icon={logIn} />
            <IonLabel>Login</IonLabel>
          </IonTabButton>
          <IonTabButton tab="cadastro" href="/signup">
            <IonIcon icon={personAddOutline} />
            <IonLabel>Cadastro</IonLabel>
          </IonTabButton>
          <IonTabButton tab="carrinho" href="/checkout">
            <IonIcon icon={cart} />
            <IonLabel>Carrinho</IonLabel>
          </IonTabButton>
          <IonTabButton tab="notificacoes" href="/notificacoes">
            <IonIcon icon={notifications} />
            <IonLabel>Notificações</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonHeader>

      <IonContent>
        {/* Cards hardcoded acima do swiper */}
        <div className='card-container'>
          <IonCard>
            <img alt="COPOS" src="../public/copos.png" />
            <IonCardHeader>
              <IonCardTitle>COPOS</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <IonCard>
            <img alt="PERSONALIZAR" src="../public/personalizar.png" />
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

        {/* Swiper com produtos mockados */}
        <div className="swiper-container">
          <h2>Produtos em Destaque</h2>
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={2.5}
            pagination={{ clickable: true }}
            className="products-swiper"
          >
            {produtosMock.map((produto: Produto) => (
              <SwiperSlide key={produto.id} className="slide-item">
                <img src={produto.imagem} alt={produto.nome} />
                <p className="slide-title">{produto.nome}</p>
                <p className="slide-price">
                  {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </IonContent>

      {/* Faixa inferior e botão fixo */}
      <div className="faixa-inferior-fixa">
      </div>
    </IonPage>  
  );
};

export default Ecommerce;