import React, { useState, useEffect } from 'react';
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
  IonCol,
  IonLoading,
  IonToast,
  IonAlert
} from '@ionic/react';
import { chevronForward, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { cartService, checkoutService, CartItem, Order } from '../../services/checkoutService';
import './Checkout.css';

const Checkout: React.FC = () => {
  const history = useHistory();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  
  // Calcular totais
  const totals = checkoutService.calculateTotals(cartItems, promoCode);

  useEffect(() => {
    // Carregar itens do carrinho
    loadCart();
  }, []);

  const loadCart = () => {
    const items = cartService.getCart();
    setCartItems(items);
  };

  const handleBack = () => {
    history.push('/ecommerce');
  };

  const handleProcessOrder = async () => {
    // Validar se há itens no carrinho
    if (cartItems.length === 0) {
      setToastMessage('Seu carrinho está vazio!');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setShowAlert(true);
  };

  const confirmOrder = async () => {
    setLoading(true);

    try {
      // Criar objeto de pedido
      const order: Order = {
        items: cartItems,
        address: {
          street: 'Rua Exemplo',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        },
        paymentMethod: {
          type: 'credit_card',
          cardNumber: '**** **** **** 1234'
        },
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        promoCode: promoCode || undefined
      };

      // Processar pedido
      const response = await checkoutService.processOrder(order);

      if (response.success) {
        setToastMessage(`Pedido ${response.orderId} realizado com sucesso!`);
        setToastColor('success');
        setShowToast(true);

        // Limpar carrinho
        setCartItems([]);

        // Redirecionar após 2 segundos
        setTimeout(() => {
          history.push('/ecommerce');
        }, 2000);
      } else {
        setToastMessage(response.error || 'Erro ao processar pedido');
        setToastColor('danger');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro ao conectar com o servidor');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) {
      setToastMessage('Digite um código promocional');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setLoading(true);
    const result = await checkoutService.validatePromoCode(promoCode);
    setLoading(false);

    setToastMessage(result.message);
    setToastColor(result.valid ? 'success' : 'danger');
    setShowToast(true);

    if (result.valid) {
      // Recarregar para atualizar totais
      loadCart();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-toolbar">
          <IonButton slot="start" fill="clear" className="back-button" onClick={handleBack}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <div className="faixa-superior-fixa"></div>
          <IonTitle className="custom-title">
            <span className="title-text">Finalizar <span className="title-span">Compra</span></span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Lista de Informações de Checkout */}
        <IonList lines="full" className="checkout-list">
          <IonItem button detail={false}>
            <IonLabel>ENTREGA</IonLabel>
            <p className="item-detail">Rua Exemplo, 123 - Centro</p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>
          
          <IonItem button detail={false}>
            <IonLabel>FRETE</IonLabel>
            <p className="item-detail">
              {totals.shipping === 0 ? 'Gratuito' : `R$ ${totals.shipping.toFixed(2)}`}
              <br /> Padrão | 3 a 4 dias
            </p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>
          
          <IonItem button detail={false}>
            <IonLabel>PAGAMENTO</IonLabel>
            <p className="item-detail">Visa *1234</p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>

          <IonItem button detail={false} onClick={handleApplyPromo}>
            <IonLabel>PROMOÇÕES</IonLabel>
            <p className="item-detail">
              {promoCode ? `Código: ${promoCode}` : 'Aplicar código promocional'}
              <br />
              <small>Códigos válidos: EUQUERO10, PRIMEIRACOMPRA</small>
            </p>
            <IonIcon icon={chevronForward} slot="end" color="medium" />
          </IonItem>
        </IonList>

        {/* Seção de Itens (Produtos) */}
        <div className="section-title">ITENS ({cartItems.length})</div>
        
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p>Seu carrinho está vazio</p>
            <IonButton onClick={handleBack}>Voltar às compras</IonButton>
          </div>
        ) : (
          <>
            {/* Cabeçalho da tabela de Itens */}
            <IonGrid className="items-header ion-padding-horizontal">
              <IonRow>
                <IonCol size="4"> </IonCol>
                <IonCol size="5">DESCRIÇÃO</IonCol>
                <IonCol size="3" className="ion-text-right">PREÇO</IonCol>
              </IonRow>
            </IonGrid>

            {/* Itens do carrinho */}
            {cartItems.map((item) => (
              <IonGrid key={item.id} className="item-row ion-padding-horizontal">
                <IonRow className="ion-align-items-center">
                  <IonCol size="4">
                    <img src={item.image} alt={item.name} className="item-image" />
                  </IonCol>
                  <IonCol size="5" className="item-description">
                    {item.brand} <br />
                    <strong>{item.name}</strong> <br />
                    {item.color && `${item.color} - `}
                    {item.size} <br />
                    Quantidade: {item.quantity}
                  </IonCol>
                  <IonCol size="3" className="ion-text-right item-price">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </IonCol>
                </IonRow>
              </IonGrid>
            ))}

            {/* Seção de Resumo de Preços */}
            <IonList lines="none" className="price-summary">
              <IonItem>
                <IonLabel>Subtotal ({cartItems.length})</IonLabel>
                <IonLabel slot="end" className="price-label">
                  R$ {totals.subtotal.toFixed(2)}
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Total do frete</IonLabel>
                <IonLabel slot="end" className="price-label">
                  {totals.shipping === 0 ? 'Gratuito' : `R$ ${totals.shipping.toFixed(2)}`}
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Impostos</IonLabel>
                <IonLabel slot="end" className="price-label">
                  R$ {totals.tax.toFixed(2)}
                </IonLabel>
              </IonItem>
              {totals.discount > 0 && (
                <IonItem>
                  <IonLabel>Desconto</IonLabel>
                  <IonLabel slot="end" className="price-label" style={{ color: 'green' }}>
                    - R$ {totals.discount.toFixed(2)}
                  </IonLabel>
                </IonItem>
              )}
              <IonItem className="total-row">
                <IonLabel>Total</IonLabel>
                <IonLabel slot="end" className="total-price">
                  R$ {totals.total.toFixed(2)}
                </IonLabel>
              </IonItem>
            </IonList>
          </>
        )}
      </IonContent>

      {/* Faixa inferior e botão fixo */}
      {cartItems.length > 0 && (
        <div className="faixa-inferior-fixa">
          <IonButton 
            className='pedido-btn' 
            onClick={handleProcessOrder}
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Fazer pedido'}
          </IonButton>
        </div>
      )}

      <IonLoading
        isOpen={loading}
        message={'Processando pedido...'}
      />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        color={toastColor}
        position="top"
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Confirmar Pedido'}
        message={`Deseja confirmar o pedido no valor de R$ ${totals.total.toFixed(2)}?`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Confirmar',
            handler: confirmOrder
          }
        ]}
      />
    </IonPage>  
  );
};

export default Checkout;
