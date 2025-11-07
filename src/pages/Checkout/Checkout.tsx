import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonIcon,
  IonLoading,
  IonToast,
  IonAlert
} from '@ionic/react';
import { arrowBackOutline, closeOutline, chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Checkout.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Checkout: React.FC = () => {
  const history = useHistory();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/checkout/cart');
      const data = await response.json();
      if (data.success && data.cart) {
        const items = data.cart.items.map((item: any) => ({
          id: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  };

  const handleBack = () => {
    history.push('/ecommerce');
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/checkout/cart/${productId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setToastMessage('Item removido do carrinho');
        setToastColor('success');
        setShowToast(true);
        loadCart();
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      setToastMessage('Erro ao remover item');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleProcessOrder = () => {
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
      const response = await fetch('http://localhost:3000/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          customerInfo: { name: 'Cliente', email: 'cliente@email.com', phone: '(11) 99999-9999' },
          paymentMethod: 'credit_card',
          deliveryAddress: { street: 'Rua Exemplo', number: '123', city: 'São Paulo', state: 'SP', zipCode: '01234-567' }
        })
      });

      const data = await response.json();
      if (data.success) {
        setToastMessage(`Pedido ${data.order.orderNumber} realizado com sucesso!`);
        setToastColor('success');
        setShowToast(true);
        setCartItems([]);
        setTimeout(() => history.push('/ecommerce'), 2000);
      } else {
        setToastMessage(data.error || 'Erro ao processar pedido');
        setToastColor('danger');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      setToastMessage('Erro ao conectar com o servidor');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonButton slot="start" fill="clear" onClick={handleBack}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle className="header-title">Checkout</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="checkout-content">
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p>Seu carrinho está vazio</p>
            <IonButton onClick={handleBack}>Voltar às compras</IonButton>
          </div>
        ) : (
          <>
            <div className="info-section">
              <div className="section-label">ENTREGA</div>
              <div className="section-content clickable">
                <span className="section-text">Adicionar endereço de entrega</span>
                <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
              </div>
            </div>

            <div className="info-section">
              <div className="section-label">FRETE</div>
              <div className="section-content clickable">
                <div className="section-text">
                  <div className="frete-main">Gratuito</div>
                  <div className="frete-sub">Padrão | 3 a 4 dias</div>
                </div>
                <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
              </div>
            </div>

            <div className="info-section">
              <div className="section-label">PAGAMENTO</div>
              <div className="section-content clickable">
                <span className="section-text">Visa *1234</span>
                <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
              </div>
            </div>

            <div className="info-section">
              <div className="section-label">PROMOÇÕES</div>
              <div className="section-content clickable">
                <span className="section-text">Aplicar código promocional</span>
                <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
              </div>
            </div>

            {/* Itens do carrinho */}
            <div className="items-section">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <div>{item.name}</div>
                    <div>Quantidade: {item.quantity}</div>
                    <div>Preço: R${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                  </div>
                  <IonButton fill="clear" onClick={() => handleRemoveItem(item.id)}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </div>
              ))}
            </div>

            <div className="price-summary">
              <div>Total: R${total.toFixed(2).replace('.', ',')}</div>
            </div>
          </>
        )}
      </IonContent>

      {cartItems.length > 0 && (
        <div className="faixa-inferior-fixa">
          <IonButton className='pedido-btn' onClick={handleProcessOrder} disabled={loading}>
            {loading ? 'Processando...' : 'Finalizar Pedido'}
          </IonButton>
        </div>
      )}

      <IonLoading isOpen={loading} message="Processando pedido..." />
      <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={3000} color={toastColor} position="top" />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Confirmar Pedido"
        message={`Deseja confirmar o pedido no valor de R$ ${total.toFixed(2)}?`}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Confirmar', handler: confirmOrder }
        ]}
      />
    </IonPage>
  );
};

export default Checkout;
