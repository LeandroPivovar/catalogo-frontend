<template>
  <transition name="fade">
    <div v-if="!isVerified" class="age-gate-overlay">
      <div class="age-gate-card">
        <h1 class="logo">PutariaOnline</h1>
        <div class="warning-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Aviso de Conteúdo Adulto</h2>
        <p>
          Este site contém conteúdo adulto e é destinado apenas a maiores de 18 anos. 
          Ao continuar, você confirma que tem idade legal para acessar este tipo de material.
        </p>
        
        <div class="age-gate-actions">
          <button class="gate-btn enter-btn" @click="verifyAge">
            SOU MAIOR DE IDADE
          </button>
          <button class="gate-btn exit-btn" @click="exitSite">
            VOLTAR
          </button>
        </div>
        
        <p class="privacy-note">
          Sua privacidade é importante para nós. Nenhuma informação pessoal é coletada nesta etapa.
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AgeGate",
  data() {
    return {
      isVerified: true // Default to true to avoid flicker, then check in mounted
    };
  },
  mounted() {
    this.checkVerification();
  },
  methods: {
    checkVerification() {
      const verified = localStorage.getItem("ageVerified");
      this.isVerified = verified === "true";
    },
    verifyAge() {
      localStorage.setItem("ageVerified", "true");
      this.isVerified = true;
    },
    exitSite() {
      window.location.href = "https://www.google.com";
    }
  }
};
</script>

<style scoped>
.age-gate-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1a0505, #000);
  z-index: 999999; /* Higher than everything */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.age-gate-card {
  background-color: #0c0808;
  border: 1px solid rgba(214, 36, 74, 0.3);
  border-radius: 24px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(214, 36, 74, 0.1);
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  color: #d6244a;
  margin-bottom: 30px;
  letter-spacing: -1px;
}

.warning-icon {
  font-size: 3rem;
  color: #f1c40f;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

p {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 1rem;
}

.age-gate-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.gate-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.enter-btn {
  background-color: #d6244a;
  color: #fff;
}

.enter-btn:hover {
  background-color: #e02b54;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(214, 36, 74, 0.4);
}

.exit-btn {
  background-color: transparent;
  border: 1px solid #333;
  color: #888;
}

.exit-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  border-color: #666;
}

.privacy-note {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
