<template>
  <header class="top-nav" :class="{ 'transparent-nav': transparentBg }">
    <div class="nav-left">
      <h1 class="logo" @click="$router.push('/')" style="cursor: pointer;">PutariaOnline</h1>
    </div>
    <div class="nav-center">
      <!-- Dashboard Specific Tabs -->
      <div v-if="showDashboardTabs" class="header-dash-tabs">
        <button 
          class="dash-tab" 
          :class="{ active: activeTab === 'profile' }"
          @click="$emit('tab-change', 'profile')"
        >
          <i class="fas fa-user-circle"></i> Perfil
        </button>
        <button 
          class="dash-tab" 
          :class="{ active: activeTab === 'metrics' }"
          @click="$emit('tab-change', 'metrics')"
        >
          <i class="fas fa-chart-line"></i> Dashboard
        </button>
        <button 
          class="dash-tab" 
          :class="{ active: activeTab === 'boost' }"
          @click="$emit('tab-change', 'boost')"
        >
          <i class="fas fa-bolt"></i> Impulsionamento
        </button>
      </div>

      <div v-else-if="showSearch" class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          class="search-input" 
          placeholder="Buscar modelos..."
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
        >
      </div>
    </div>
    <div class="nav-right">
      <span v-if="modelCount !== undefined" class="model-count">{{ modelCount }} modelos</span>
      
      <!-- Login Button -->
      <div v-if="!isLoggedIn" class="auth-actions">
        <button class="menu-trigger-btn" @click="$router.push('/auth')">
          <i class="fas fa-sign-in-alt"></i> Entrar
        </button>
      </div>

      <!-- User Menu -->
      <div v-else class="user-menu-wrapper" ref="menuWrapper">
        <button class="menu-trigger-btn" @click="showMenu = !showMenu">
          Menu <i class="fas" :class="showMenu ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>
        
        <div v-if="showMenu" class="menu-dropdown">
          <router-link to="/" class="menu-item" @click="showMenu = false">
            <i class="fas fa-home"></i> Home
          </router-link>
          <router-link to="/dashboard" class="menu-item" @click="showMenu = false">
            <i class="fas fa-th-large"></i> Dashboard
          </router-link>
          <a href="#" class="menu-item logout" @click.prevent="logout">
            <i class="fas fa-sign-out-alt"></i> Sair
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
  props: {
    searchQuery: {
      type: String,
      default: ""
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    modelCount: {
      type: Number,
      default: undefined
    },
    showDashboardTabs: {
      type: Boolean,
      default: false
    },
    activeTab: {
      type: String,
      default: 'profile'
    },
    transparentBg: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:searchQuery", "tab-change"],
  data() {
    return {
      showMenu: false,
      isLoggedIn: false
    };
  },
  watch: {
    '$route'() {
      this.checkLoginStatus();
    }
  },
  mounted() {
    this.checkLoginStatus();
    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (this.$refs.menuWrapper && !this.$refs.menuWrapper.contains(e.target)) {
        this.showMenu = false;
      }
    });
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('token');
    },
    logout() {
      this.showMenu = false;
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    }
  }
}
</script>

<style scoped>
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  position: sticky;
  top: 0;
  background-color: rgba(12, 11, 11, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 9999;
  width: 100%;
  max-width: 100vw;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

.transparent-nav {
  background-color: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-bottom: none !important;
}

.nav-left {
  flex: 0 0 200px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  color: #eee;
  letter-spacing: -0.01em;
}

.nav-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 48px;
  background-color: #121212;
  border: 1px solid #1a1a1a;
  border-radius: 25px;
  color: #fff;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #ff0000;
}

/* Dashboard Tabs in Header */
.header-dash-tabs {
  display: flex;
  background-color: #1a1a1a;
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
  width: fit-content;
}

@media (max-width: 768px) {
  .top-nav {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: space-between !important;
    gap: 12px !important;
    padding:  35px 10px 10px!important  }
  
  .nav-left {
    order: 1 !important;
    flex: 0 0 auto !important;
    width: auto !important;
    margin: 0 !important;
  }

  .nav-right {
    order: 2 !important;
    flex: 0 0 auto !important;
    width: auto !important;
    justify-content: flex-end !important;
    gap: 10px !important;
  }

  .nav-center {
    order: 3;
    flex-basis: 100%;
    margin-top: 5px;
  }

  .header-dash-tabs {
    justify-content: center !important;
    width: fit-content !important;
    max-width: 100vw !important;
    gap: 2px !important;
    overflow-x: auto !important;
    white-space: nowrap !important;
    padding-bottom: 5px !important;
  }

  .header-dash-tabs::-webkit-scrollbar {
    height: 4px;
  }
  
  .header-dash-tabs::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 4px;
  }

  .dash-tab {
    flex: 0 0 auto;
    padding: 5px 10px!important;
    font-size: 0.75rem!important;
    gap: 4px;
  }

  .dash-tab i {
    font-size: 0.6rem!important;
  }

  .logo {
    font-size: 1.25rem!important;
  }

  .search-container {
    width: 100%;
    max-width: none;
  }
}

.dash-tab {
  background: transparent;
  border: none;
  padding: 10px 20px;
  color: #888;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.dash-tab i { font-size: 1rem; }

.dash-tab:hover { color: #fff; }

.dash-tab.active {
  background-color: #bd2727;
  color: #fff;
  box-shadow: 0 4px 15px rgba(189, 39, 39, 0.2);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 25px;
  justify-content: flex-end;
  flex: 0 0 200px;
}

.model-count {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

.user-menu-wrapper {
  position: relative;
}

.menu-trigger-btn {
  padding: 12px 30px;
  background-color: #bd2727;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .menu-trigger-btn {
    padding: 6px 12px !important;
    font-size: 0.85rem !important;
    gap: 6px !important;
    margin: 0 !important;
  }
  
  .model-count {
    display: none !important;
  }
}

.menu-trigger-btn:hover {
  background-color: #d12c2c;
  transform: translateY(-1px);
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  width: 200px;
  background-color: #121212;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #eee;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #1a1a1a;
  color: #ff0000;
}

.menu-item i {
  font-size: 0.9rem;
  width: 20px;
  opacity: 0.7;
}

.menu-item.logout {
  border-top: 1px solid #222;
  margin-top: 5px;
  padding-top: 15px;
  color: #999;
}

.menu-item.logout:hover {
  color: #bd2727;
}
</style>
