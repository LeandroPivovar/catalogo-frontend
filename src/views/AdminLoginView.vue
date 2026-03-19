<template>
  <div class="admin-login-container">
    <div class="login-box glass">
      <div class="logo-section">
        <i class="fas fa-user-shield"></i>
        <h1>Admin Control</h1>
        <p>Acesso Restrito ao Catálogo</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label><i class="fas fa-envelope"></i> E-mail</label>
          <input type="email" v-model="email" placeholder="admin@admin.com" required>
        </div>

        <div class="form-group">
          <label><i class="fas fa-lock"></i> Senha</label>
          <input type="password" v-model="password" placeholder="••••••••" required>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading"><i class="fas fa-spinner fa-spin"></i> Entrando...</span>
          <span v-else>Entrar no Painel</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "AdminLoginView",
  data() {
    return {
      email: "",
      password: "",
      error: "",
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = "";
      try {
        const response = await api.post("/admin/login", {
          email: this.email,
          password: this.password
        });
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", "admin");
        
        this.$router.push("/admin/dashboard");
      } catch (err) {
        this.error = err.response?.data?.error || "Falha na autenticação administrativa.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top right, #1a0505, #000);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.glass {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
}

.logo-section i {
  font-size: 3rem;
  color: #bd2727;
  margin-bottom: 15px;
}

.logo-section h1 {
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.logo-section p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 30px;
}

.auth-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #aaa;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 15px;
  border-radius: 10px;
  color: #fff;
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: #bd2727;
  outline: none;
  background: rgba(255, 255, 255, 0.05);
}

.login-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #bd2727, #8a1d1d);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(189, 39, 39, 0.3);
}

.error-msg {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-bottom: 15px;
  background: rgba(255, 77, 77, 0.1);
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}
</style>
