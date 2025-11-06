import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonText, IonIcon, IonLoading, IonToast } from '@ionic/react';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { authService } from '../../services/authService'
import './SignIn.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const history = useHistory();

  const handleContinue = async () => {
    if (!email || !password) {
      setToastMessage('Por favor, preencha todos os campos');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.success) {
        setToastMessage(`Bem-vindo, ${response.name}!`);
        setToastColor('success');
        setShowToast(true);

        // Redirecionar para a página principal após 1 segundo
        setTimeout(() => {
          history.push('/ecommerce');
        }, 1000);
      } else {
        setToastMessage(response.error || 'Erro ao fazer login');
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
            Insira seu e-mail e senha para se cadastrar neste aplicativo
          </IonText>

          <IonInput
            value={email}
            placeholder="email@dominio.com"
            onIonChange={e => setEmail(e.detail.value!)}
            type="email"
            className="login-input"
          />

          <IonInput
            value={password}
            placeholder="Senha"
            onIonChange={e => setPassword(e.detail.value!)}
            type="password"
            className="login-input"
          />

          <IonButton 
            expand="block" 
            className="login-button" 
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Continuar'}
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

        <IonLoading
          isOpen={loading}
          message={'Autenticando...'}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
