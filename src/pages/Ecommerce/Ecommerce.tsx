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
import './Ecommerce.css';

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
   

      {/* Faixa inferior e botão fixo */}
      <div className="faixa-inferior-fixa">
      </div>
      
    </IonPage>  
    
    
  );
};

export default Ecommerce; 