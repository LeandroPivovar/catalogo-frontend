<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-main-title">Putaria Online</h1>
        <p class="auth-sub-header">Entre com sua conta para continuar</p>

        <div class="auth-tabs">
          <button 
            class="auth-tab" 
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            Login
          </button>
          <button 
            class="auth-tab" 
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            Cadastro
          </button>
        </div>

        <!-- LOGIN FORM -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="activeTab === 'login'" class="auth-form" key="login">
            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <i class="far fa-envelope"></i>
                <input type="email" placeholder="seu@email.com" v-model="loginData.email">
              </div>
            </div>

            <div class="form-group">
              <label>Senha</label>
              <div class="input-wrapper has-icon-right">
                <i class="fas fa-lock icon-left"></i>
                <input :type="showPass ? 'text' : 'password'" placeholder="••••••••" v-model="loginData.password">
                <button class="toggle-pass" @click="showPass = !showPass">
                  <i class="far" :class="showPass ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="auth-actions">
              <div class="remember-me">
                <input type="checkbox" id="remember">
                <label for="remember">Lembrar de mim</label>
              </div>
              <a href="#" class="forgot-pass">Esqueceu a senha?</a>
            </div>

            <button class="auth-btn red-btn" @click="handleLogin" :disabled="loading">
              <span v-if="loading"><i class="fas fa-spinner fa-spin"></i> Entrando...</span>
              <span v-else>Entrar</span>
            </button>
          </div>

          <!-- REGISTER FORM -->
          <div v-else-if="activeTab === 'register'" class="auth-form" key="register">
            <div class="form-group">
              <label>Nome Completo</label>
              <div class="input-wrapper">
                <i class="far fa-user"></i>
                <input type="text" placeholder="Seu nome completo" v-model="registerData.name">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>CPF</label>
                <div class="input-wrapper">
                  <i class="far fa-address-card"></i>
                  <input type="text" placeholder="000.000.000-00" v-model="registerData.cpf">
                </div>
              </div>
              <div class="form-group">
                <label>Data de Nascimento</label>
                <div class="input-wrapper">
                  <i class="far fa-calendar-alt"></i>
                  <input type="date" v-model="registerData.birthDate">
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group file-group">
                <label>RG Frente</label>
                <div class="file-preview-container" @click="$refs.rgFrente.click()">
                  <input type="file" ref="rgFrente" hidden accept="image/*" @change="handleFile($event, 'rgFrente')">
                  <div v-if="rgFrentePreview" class="preview-box">
                    <img :src="rgFrentePreview" alt="RG Frente">
                    <button class="remove-file" @click.stop="rgFrentePreview = ''">&times;</button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-camera"></i>
                    <span>Toque para enviar</span>
                  </div>
                </div>
              </div>
              <div class="form-group file-group">
                <label>RG Verso</label>
                <div class="file-preview-container" @click="$refs.rgVerso.click()">
                  <input type="file" ref="rgVerso" hidden accept="image/*" @change="handleFile($event, 'rgVerso')">
                  <div v-if="rgVersoPreview" class="preview-box">
                    <img :src="rgVersoPreview" alt="RG Verso">
                    <button class="remove-file" @click.stop="rgVersoPreview = ''">&times;</button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-camera"></i>
                    <span>Toque para enviar</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>E-mail</label>
              <div class="input-wrapper">
                <i class="far fa-envelope"></i>
                <input type="email" placeholder="seu@email.com" v-model="registerData.email">
              </div>
            </div>

            <div class="form-group">
              <label>Número de Telefone</label>
              <div class="input-wrapper">
                <i class="fas fa-phone-alt"></i>
                <input type="tel" placeholder="(00) 00000-0000" v-model="registerData.phone">
              </div>
            </div>

            <div class="form-group">
              <label>Escolha uma Senha</label>
              <div class="input-wrapper has-icon-right">
                <i class="fas fa-lock icon-left"></i>
                <input :type="showPass ? 'text' : 'password'" placeholder="••••••••" v-model="registerData.password">
                <button class="toggle-pass" @click="showPass = !showPass">
                  <i class="far" :class="showPass ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <button class="auth-btn red-btn" @click="handleRegister" :disabled="loading">
              <span v-if="loading"><i class="fas fa-spinner fa-spin"></i> Cadastrando...</span>
              <span v-else>Cadastrar</span>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- TOASTS -->
    <div class="toast-container">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
          <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
          {{ toast.message }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "AuthView",
  data() {
    return {
      activeTab: 'login',
      showPass: false,
      toasts: [],
      rgFrentePreview: '',
      rgVersoPreview: '',
      loginData: {
        email: '',
        password: ''
      },
      registerData: {
        name: '',
        cpf: '',
        birthDate: '',
        phone: '',
        email: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      if (this.loading) return;
      this.loading = true;
      try {
        const response = await api.post('/auth/login', this.loginData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userStatus', response.data.user.status);
        localStorage.setItem('emailVerified', response.data.user.emailVerified);
        
        if (!response.data.user.emailVerified) {
          this.showToast('Por favor, confirme seu e-mail antes de acessar. Enviamos um link para você.', 'error');
        } else if (response.data.user.status === 'pending') {
          this.showToast('E-mail confirmado! Sua conta agora está em análise pela nossa equipe.', 'warning');
        } else {
          this.showToast('Login realizado com sucesso! Redirecionando...');
        }
        
        // Se para a conta for pending ou e-mail não verificado, o router/dashboard redirecionará para /pending
        setTimeout(() => this.$router.push('/dashboard'), 1500);
      } catch (error) {
        if (error.response?.data?.status === 'rejected') {
          this.showToast('Sua conta foi reprovada. Entre em contato com o suporte.', 'error');
          return;
        }
        const message = error.response?.data?.error || error.response?.data?.message || 'Erro ao realizar login.';
        this.showToast(message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async handleRegister() {
      if (this.loading) return;
      if (!this.rgFrentePreview || !this.rgVersoPreview) {
        this.showToast('Por favor, envie as fotos do RG frente e verso.', 'error');
        return;
      }
      
      this.loading = true;
      try {
        // Para fins de POC, estamos enviando as URLs como placeholders
        // No futuro, implementaremos o upload real de arquivos
        const data = {
          ...this.registerData,
          rgFrenteUrl: this.rgFrentePreview,
          rgVersoUrl: this.rgVersoPreview
        };
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userStatus', response.data.user.status);
        localStorage.setItem('emailVerified', response.data.user.emailVerified);
        
        this.registerData = { name: '', cpf: '', birthDate: '', phone: '', email: '', password: '' };
        this.rgFrentePreview = '';
        this.rgVersoPreview = '';
        
        this.showToast('Cadastro recebido! Redirecionando...');
        setTimeout(() => this.$router.push('/dashboard'), 1500);
      } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || 'Erro ao realizar cadastro.';
        this.showToast(message, 'error');
      } finally {
        this.loading = false;
      }
    },
    handleFile(e, type) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (type === 'rgFrente') this.rgFrentePreview = event.target.result;
          if (type === 'rgVerso') this.rgVersoPreview = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    showToast(message, type = 'success') {
      const id = Date.now();
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 3000);
    }
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.auth-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-card {
  background-color: #121212;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.auth-main-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #d6244a;
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.auth-sub-header {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 25px;
}

.auth-tabs {
  display: flex;
  background-color: #1a1a1a;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.auth-tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: #aaa;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-tab.active {
  background-color: #d6244a;
  color: #fff;
}

.auth-form {
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-wrapper > i,
.input-wrapper .icon-left {
  position: absolute;
  left: 18px;
  color: #666;
  font-size: 0.9rem;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 15px 14px 45px;
  background-color: #0d0d0d;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  border-color: #d6244a;
}

.has-icon-right input {
  padding-right: 45px;
}

.toggle-pass {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  z-index: 10;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-pass i {
  position: static !important;
  left: auto !important;
  color: inherit;
  font-size: 1.1rem;
}

.toggle-pass:hover {
  color: #d6244a;
}

.file-preview-container {
  width: 100%;
  height: 100px;
  background-color: #0d0d0d;
  border: 1px dashed #222;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.file-preview-container:hover {
  border-color: #d6244a;
  background-color: #111;
}

.preview-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-file {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 22px;
  height: 22px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #444;
}

.upload-placeholder i {
  font-size: 1.2rem;
}

.upload-placeholder span {
  font-size: 0.7rem;
  font-weight: 600;
}

.auth-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
}

.remember-me input {
  accent-color: #d6244a;
}

.forgot-pass {
  color: #d6244a;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.auth-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  flex-shrink: 0;
}

.red-btn {
  background-color: #d6244a;
  color: #fff;
}

.red-btn:hover {
  background-color: #e02b54;
  transform: translateY(-1px);
}

.social-login {
  margin-top: 25px;
  flex-shrink: 0;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
}

.divider span {
  position: relative;
  background-color: #121212;
  padding: 0 15px;
  color: #444;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.social-btns {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  background-color: #1a1a1a;
  border: 1px solid #222;
  border-radius: 10px;
  color: #eee;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}

.toast-container {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 99999;
}

@media (max-width: 480px) {
  .auth-container {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  }
  .form-row { grid-template-columns: 1fr; }
}
</style>
