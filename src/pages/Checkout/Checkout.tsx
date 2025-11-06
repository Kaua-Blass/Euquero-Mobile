import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { chevronForward, arrowBackOutline } from 'ionicons/icons'; // Importar ícones
import './Checkout.css';

const Checkout: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-toolbar">
          <IonButton slot="start" fill="clear" className="back-button">
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
             {/* Faixa inferior e botão fixo */}
             <div className="faixa-superior-fixa">
            </div>
          <IonTitle className="custom-title">
            <span className="title-text">Criar <span className="title-span">uma conta</span></span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        
        {/* Lista de Informações de Checkout */}
        <IonList lines="full" className="checkout-list">
          <IonItem button detail={false}>
            <IonLabel>ENTREGA</IonLabel>
            <p className="item-detail">Adicionar endereço de entrega</p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>
          
          <IonItem button detail={false}>
            <IonLabel>FRETE</IonLabel>
            <p className="item-detail">Gratuito <br /> Padrão | 3 a 4 dias</p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>
          
          <IonItem button detail={false}>
            <IonLabel>PAGAMENTO</IonLabel>
            <p className="item-detail">Visa *1234</p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>

          <IonItem button detail={false}>
            <IonLabel>PROMOÇÕES</IonLabel>
            <p className="item-detail">Aplicar código promocional</p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>
        </IonList>

        {/* Seção de Itens (Produtos) */}
        <div className="section-title">ITENS</div>
        
        {/* Cabeçalho da tabela de Itens */}
        <IonGrid className="items-header ion-padding-horizontal">
            <IonRow>
                <IonCol size="4"> </IonCol>
                <IonCol size="5">DESCRIÇÃO</IonCol>
                <IonCol size="3" className="ion-text-right">PREÇO</IonCol>
            </IonRow>
        </IonGrid>

        {/* Item 1 - Copo Térmico */}
        <IonGrid className="item-row ion-padding-horizontal">
            <IonRow className="ion-align-items-center">
                <IonCol size="4">
                    <img src="" alt="Copo Térmico" className="item-image" />
                </IonCol>
                <IonCol size="5" className="item-description">
                    Stanley <br />
                    **Copo Térmico Cerveja Sem Tampa** <br />
                    Vermelho - 473ml
                </IonCol>
                <IonCol size="3" className="ion-text-right item-price">R$174,99</IonCol>
            </IonRow>
        </IonGrid>

        {/* Item 2 - Garrafa Térmica */}
        <IonGrid className="item-row ion-padding-horizontal">
            <IonRow className="ion-align-items-center">
                <IonCol size="4">
                    <img src="" alt="Garrafa Térmica" className="item-image" />
                </IonCol>
                <IonCol size="5" className="item-description">
                    Stanley <br />
                    **Garrafa Térmica** <br />
                    Green - 1.2L <br />
                    Quantidade: 01
                </IonCol>
                <IonCol size="3" className="ion-text-right item-price">R$329,99</IonCol>
            </IonRow>
        </IonGrid>

        {/* Seção de Resumo de Preços */}
        <IonList lines="none" className="price-summary">
            <IonItem>
                <IonLabel>Subtotal (2)</IonLabel>
                <IonLabel slot="end" className="price-label">R$504,98</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Total do frete</IonLabel>
                <IonLabel slot="end" className="price-label">Gratuito</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Impostos</IonLabel>
                <IonLabel slot="end" className="price-label">R$20,00</IonLabel>
            </IonItem>
            <IonItem className="total-row">
                <IonLabel>Total</IonLabel>
                <IonLabel slot="end" className="total-price">R$524,98</IonLabel>
            </IonItem>
        </IonList>

      </IonContent>

      {/* Faixa inferior e botão fixo */}
      <div className="faixa-inferior-fixa">
        <IonButton className='pedido-btn'>Fazer pedido</IonButton>
      </div>
    </IonPage>  
  );
};

export default Checkout; 