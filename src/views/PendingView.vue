<template>
  <div class="pending-page">
    <div class="pending-card">
      <div class="pending-icon">
        <i class="far fa-clock"></i>
      </div>
      <div v-if="!emailVerified">
        <h1 class="pending-title">Confirme seu E-mail</h1>
        <p class="pending-text">
          Enviamos um link de confirmação para o seu e-mail. 
          <br><strong>Por favor, verifique sua caixa de entrada (e a pasta de SPAM) para concluir o cadastro.</strong>
        </p>
      </div>

      <div v-else>
        <h1 class="pending-title">Sua conta está em análise</h1>
        <p class="pending-text">
          Seu e-mail foi confirmado com sucesso! 👋
          <br><br>
          Agora nossa equipe está verificando seus documentos. Em breve seu perfil estará ativo no catálogo.
        </p>
      </div>
      
      <div class="actions">
        <button v-if="!emailVerified" class="action-btn red-btn" @click="checkStatus">
          <i class="fas fa-sync-alt"></i> Já confirmei o e-mail
        </button>
        <button v-else class="action-btn red-btn" @click="checkStatus">
          <i class="fas fa-sync-alt"></i> Atualizar Status de Análise
        </button>
        <button class="action-btn" :class="emailVerified ? 'dark-btn' : 'red-btn'" @click="$router.push('/')">Ir para Catálogo</button>
        <button class="action-btn dark-btn" @click="logout">Sair da Conta</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: 'PendingView',
  data() {
    return {
      emailVerified: localStorage.getItem('emailVerified') === 'true'
    }
  },
  created() {
    this.checkStatus();
  },
  methods: {
    async checkStatus() {
      try {
        const res = await api.get('/user/profile');
        this.emailVerified = res.data.emailVerified;
        localStorage.setItem('emailVerified', this.emailVerified);
        
        // Se já foi aprovado e verificado, manda pro dashboard
        if (this.emailVerified && res.data.status === 'approved' || res.data.status === 'active') {
          this.$router.push('/dashboard');
        }
      } catch (e) {
        console.error("Erro ao verificar status", e);
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userStatus');
      localStorage.removeItem('emailVerified');
      this.$router.push('/auth');
    }
  }
}
</script>

<style scoped>
.pending-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0d0d0d;
  padding: 20px;
}

.pending-card {
  background-color: #121212;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  padding: 50px 30px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.pending-icon {
  width: 90px;
  height: 90px;
  background-color: rgba(214, 36, 74, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
}

.pending-icon i {
  font-size: 3rem;
  color: #d6244a;
}

.pending-title {
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 20px;
  font-weight: 800;
}

.pending-text {
  color: #888;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 35px;
}

.pending-text strong {
  color: #ddd;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-btn {
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.red-btn {
  background-color: #d6244a;
  color: #fff;
}

.red-btn:hover {
  background-color: #bd2727;
}

.dark-btn {
  background-color: #1a1a1a;
  color: #eee;
  border: 1px solid #333;
}

.dark-btn:hover {
  background-color: #2a2a2a;
}
</style>
