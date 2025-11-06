import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonText, IonIcon } from '@ionic/react';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { useHistory } from 'react-router';
import './SignIn.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const history = useHistory();

  const handleContinue = () => {
    console.log('Email:', email);
  };

  const handleBack = () => {
    history.push('/ecommerce');
  };

  return (
    <IonPage>
      <IonContent className="login-content" fullscreen>
        <div className="login-container">
          <IonText className="login-title">
            <h1>Eu <span>Quero</span></h1>
          </IonText>
          
          <IonText className="login-subtitle">
            <span className="criar-conta">Criar</span> <span className="yellow-text">uma conta</span><br />
            Insira seu e-mail para se cadastrar neste aplicativo
          </IonText>

          <IonInput
            value={email}
            placeholder="email@dominio.com"
            onIonChange={e => setEmail(e.detail.value!)}
            type="email"
            className="login-input"
          />

          <IonButton expand="block" className="login-button" onClick={handleContinue}>
            Continuar
          </IonButton>

          <div className="login-or">ou</div>

          <IonButton expand="block" className="login-google">
            <IonIcon icon={logoGoogle} /> Continuar com o Google
          </IonButton>

          <IonButton expand="block" className="login-apple">
            <IonIcon icon={logoApple} /> Continuar com a Apple
          </IonButton>

          <IonText className="login-footer">
            Ao clicar em continuar, você concorda com os nossos <span>Termos de Serviço</span> e com a <span>Política de Privacidade</span>
          </IonText>

          <IonButton expand="block" fill="clear" className="login-back-button" onClick={handleBack}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
