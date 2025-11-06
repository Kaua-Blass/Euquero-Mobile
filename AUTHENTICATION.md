# Sistema de Autenticação - Eu Quero Mobile

## 📋 Visão Geral

Sistema de autenticação mockado implementado para simular um backend real. O sistema valida credenciais, gera tokens de sessão e gerencia o estado de autenticação do usuário.

## 🔐 Usuários de Teste

O sistema possui 2 usuários mockados para testes:

### Usuário 1 - Usuário Comum
- **Email:** `usuario@teste.com`
- **Senha:** `123456`
- **Nome:** Usuário Teste

### Usuário 2 - Administrador
- **Email:** `admin@euquero.com`
- **Senha:** `admin123`
- **Nome:** Administrador

## 🏗️ Arquitetura

### Frontend
- **Localização:** `src/pages/SignIn/SignIn.tsx`
- **Funcionalidades:**
  - Formulário de login com email e senha
  - Validação de campos
  - Loading state durante autenticação
  - Toast notifications para feedback
  - Redirecionamento após login bem-sucedido

### Serviço de Autenticação
- **Localização:** `src/services/authService.ts`
- **Funcionalidades:**
  - `login(email, password)` - Autentica usuário e gera token
  - `validateToken(token)` - Valida token de sessão
  - `logout()` - Remove token e dados do usuário
  - `isAuthenticated()` - Verifica se usuário está autenticado
  - `getUserData()` - Retorna dados do usuário logado

### Backend Mock
- **Localização:** `backend/login.ts`
- **Nota:** Arquivo de referência para implementação futura com Node.js/Express

## 🔄 Fluxo de Autenticação

```
1. Usuário preenche email e senha
   ↓
2. Frontend chama authService.login()
   ↓
3. authService valida credenciais contra usuários mockados
   ↓
4. Se válido:
   - Gera token aleatório (32 caracteres hex)
   - Define expiração (60 segundos)
   - Salva no localStorage (token, email, nome)
   - Retorna sucesso com dados do usuário
   ↓
5. Frontend exibe toast de sucesso
   ↓
6. Redireciona para /ecommerce após 1 segundo
```

## 💾 Armazenamento

Os dados são armazenados no **localStorage** do navegador:

- `authToken` - Token de autenticação
- `userEmail` - Email do usuário
- `userName` - Nome do usuário

## ⏱️ Expiração de Token

- **Duração:** 60 segundos (1 minuto)
- **Comportamento:** Após expiração, o token é invalidado automaticamente

## 🧪 Como Testar

### 1. Acesse a página de login
```
http://localhost:5173/SignIn
```

### 2. Use um dos usuários de teste
```
Email: usuario@teste.com
Senha: 123456
```

### 3. Clique em "Continuar"

### 4. Observe o comportamento:
- Loading spinner aparece
- Toast de sucesso: "Bem-vindo, Usuário Teste!"
- Redirecionamento para página principal

### 5. Teste com credenciais inválidas:
```
Email: teste@invalido.com
Senha: senhaerrada
```
- Toast de erro: "Email or password not matches."

## 🔧 Implementação Futura

Para conectar com um backend real:

### 1. Substitua o authService por chamadas HTTP:

```typescript
// src/services/authService.ts
export const authService = {
  async login(email: string, password: string) {
    const response = await fetch('http://seu-backend.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
};
```

### 2. Configure CORS no backend

### 3. Implemente endpoints:
- `POST /api/login` - Autenticação
- `POST /api/validate-token` - Validação de token
- `POST /api/logout` - Logout

## 📝 Estrutura de Resposta

### Login Bem-Sucedido
```json
{
  "success": true,
  "username": "usuario@teste.com",
  "name": "Usuário Teste",
  "token": "a1b2c3d4e5f6...",
  "expiresAt": 1234567890
}
```

### Login com Erro
```json
{
  "success": false,
  "error": "Email or password not matches."
}
```

## 🛡️ Segurança

**Nota Importante:** Este é um sistema mockado para desenvolvimento. Em produção:

1. ✅ Use HTTPS
2. ✅ Hash de senhas (bcrypt, argon2)
3. ✅ Tokens JWT ou sessões seguras
4. ✅ Rate limiting
5. ✅ Validação de entrada no backend
6. ✅ CSRF protection
7. ✅ Não armazene senhas em texto plano

## 📚 Referências

- [Ionic React Authentication](https://ionicframework.com/docs/react/your-first-app)
- [React Router Authentication](https://reactrouter.com/en/main/start/tutorial#authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
