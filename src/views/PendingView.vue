<template>
  <div class="pending-page">
    <div class="pending-card">
      <div class="pending-icon">
        <i class="far fa-clock"></i>
      </div>
      <h1 class="pending-title">Sua conta está em análise</h1>
      <p class="pending-text">
        Recebemos seu cadastro e os documentos enviados! Nossa equipe está verificando as informações.
        <br><br>
        <strong>Você não poderá acessar as configurações ou o painel até que a conta seja aprovada.</strong>
      </p>
      
      <div class="actions">
        <button class="action-btn red-btn" @click="$router.push('/')">Ir para Catálogo</button>
        <button class="action-btn dark-btn" @click="logout">Sair da Conta</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PendingView',
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userStatus');
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
