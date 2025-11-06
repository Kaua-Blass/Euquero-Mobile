import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonLabel, IonText } from '@ionic/react';
import './SignIn.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    console.log('Email:', email);

  };

  return (
    <IonPage>
      <IonContent className="login-content" fullscreen>
        <div className="login-container">
          <IonText className="login-title">
            <h1>Eu <span>Quero</span></h1>
          </IonText>
          <IonText className="login-subtitle">
            Criar uma conta<br />
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

          <IonButton expand="block" fill="outline" className="login-google">
            Continuar com o Google
          </IonButton>

          <IonButton expand="block" fill="outline" className="login-apple">
            Continuar com a Apple
          </IonButton>

          <IonText className="login-footer">
            Ao clicar em continuar, você concorda com os nossos <span>Termos de Serviço</span> e com a <span>Política de Privacidade</span>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
