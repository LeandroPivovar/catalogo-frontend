<template>
  <div class="dashboard-container">
    <HeaderComponent 
      :showSearch="false" 
      :showDashboardTabs="true" 
      :activeTab="currentTab"
      @tab-change="currentTab = $event"
    />
    
    <div class="dashboard-content">
      <div class="profile-settings-wrapper">
        
        <!-- WRAPPER CARD FOR ALL SETTINGS -->
        <div v-if="currentTab === 'profile'" class="main-layout-container">
          <h1 class="page-title">Configurações de Perfil</h1>

          <form @submit.prevent="saveProfile" class="profile-form">
          <!-- SECTION 1: INFORMAÇÕES PESSOAIS -->
          <div class="settings-sub-card">
            <h2 class="section-title">Informações Pessoais</h2>
            <p class="section-subtitle">Atualize suas informações de perfil</p>
            
              <div class="form-group full-width">
                <label>Nome Exibido</label>
                <input type="text" v-model="profile.name" placeholder="Usuário">
              </div>

              <div class="form-group full-width">
                <label>Biografia</label>
                <textarea v-model="profile.bio" placeholder="Conte um pouco sobre você"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>WhatsApp (Link)</label>
                  <input type="text" v-model="profile.whatsapp" placeholder="https://wa.me/5511999999999">
                </div>
                <div class="form-group">
                  <label>Telegram (Link)</label>
                  <input type="text" v-model="profile.telegram" placeholder="https://t.me/seu_usuario">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Instagram (Link)</label>
                  <input type="text" v-model="profile.instagram" placeholder="https://instagram.com/seu_usuario">
                </div>
                <div class="form-group">
                  <label>Link Externo</label>
                  <input type="text" v-model="profile.externalLink" placeholder="https://seusite.com">
                </div>
              </div>
          </div>

          <!-- SECTION 2: FOTOS -->
          <div class="settings-sub-card">
            <h2 class="section-title">Fotos</h2>
            <p class="section-subtitle">Adicione até 10 fotos ao seu perfil</p>
            
            <div class="photos-layout">
              <div class="cover-column">
                <h3 class="subsection-title">Foto de Capa</h3>
                <div class="cover-uploader" @click="triggerUpload('cover')">
                  <div v-if="profile.coverPhoto" class="crop-preview-wrapper cover">
                    <img :src="profile.coverPhoto.src" :style="getCropStyle(profile.coverPhoto.crop)" loading="lazy">
                  </div>
                  <div v-else class="upload-placeholder vertical">
                    <i class="fas fa-plus"></i>
                    <span>Adicionar capa</span>
                  </div>
                </div>
              </div>

              <div class="gallery-column">
                <h3 class="subsection-title">Galeria de Fotos</h3>
                <div class="gallery-grid-fixed">
                  <div v-for="(photo, index) in profile.photos" :key="index" class="photo-thumbnail">
                    <div class="crop-preview-wrapper gallery">
                      <img :src="photo.src" :style="getCropStyle(photo.crop)" loading="lazy">
                    </div>
                    <button type="button" class="remove-btn" @click="removePhoto(index)">&times;</button>
                  </div>
                  <div v-if="profile.photos.length < 10" class="add-box" @click="triggerUpload('gallery')">
                    <div class="plus-icon">+</div>
                    <span>Adicionar</span>
                  </div>
                  <div v-for="n in emptyPlaceholders" :key="'empty-'+n" class="empty-placeholder"></div>
                </div>
                <div class="photo-limit-footer">
                  <span>{{ profile.photos.length }}/10 fotos adicionadas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="global-save-wrapper" style="margin-top: 20px; text-align: center;">
            <button type="submit" class="action-btn red-btn global-save-btn" style="width: 100%; padding: 18px; font-size: 1.1rem;">
              <i class="fas fa-save"></i> Salvar Todas as Configurações (Textos e Fotos)
            </button>
          </div>
          </form>

          <!-- SECTION 3: SEGURANÇA -->
          <div class="settings-sub-card">
            <h2 class="section-title">Segurança</h2>
            <p class="section-subtitle">Altere sua senha</p>

            <form @submit.prevent="updatePassword" class="password-form">
              <div class="form-group full-width mb-password">
                <label>Nova Senha</label>
                <div class="password-input-wrapper">
                  <input :type="showPasswords.new ? 'text' : 'password'" v-model="passwords.new" placeholder="Nova senha">
                  <button type="button" class="visibility-toggle" @click="showPasswords.new = !showPasswords.new">
                    <i :class="['fas', showPasswords.new ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                </div>
              </div>
              <div class="form-group full-width mb-password">
                <label>Confirmar Senha</label>
                <div class="password-input-wrapper">
                  <input :type="showPasswords.confirm ? 'text' : 'password'" v-model="passwords.confirm" placeholder="Confirme a nova senha">
                  <button type="button" class="visibility-toggle" @click="showPasswords.confirm = !showPasswords.confirm">
                    <i :class="['fas', showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                </div>
              </div>
              <p v-if="passwordError" class="error-text" :style="{ color: passwordError === 'As senhas coincidem!' ? '#2ecc71' : '#bd2727' }">{{ passwordError }}</p>
              <button type="submit" class="action-btn dark-btn">Alterar Senha</button>
            </form>
          </div>
        </div>

        <!-- IMPULSIONAMENTO TAB -->
        <div v-else-if="currentTab === 'boost'" class="main-layout-container">
          <h1 class="page-title">Impulsionamento</h1>

          <!-- SECTION 1: SEUS CRÉDITOS -->
          <div class="settings-sub-card">
            <h2 class="section-title">Seus Créditos</h2>
            <p class="section-subtitle">Gerencie seus créditos de impulsionamento</p>

            <div class="credit-display">
              <span class="credit-amount">{{ credits }}</span>
              <span class="credit-label">créditos disponíveis</span>
            </div>

            <h3 class="buy-credits-title">Comprar Mais Créditos</h3>
            <div class="credit-plans">
              <div 
                v-for="plan in creditPlans" 
                :key="plan.credits"
                class="credit-plan-card"
                :class="{ selected: selectedPlan === plan, popular: plan.popular }"
                @click="selectedPlan = plan"
              >
                <span v-if="plan.popular" class="popular-badge">Popular</span>
                <div class="plan-credits">{{ plan.credits }}</div>
                <div class="plan-credits-label">créditos</div>
                <div class="plan-price">{{ plan.price }}</div>
              </div>
            </div>

            <button class="action-btn buy-btn" @click="buyCredits">
              <i class="fas fa-credit-card"></i> Comprar Créditos
            </button>
          </div>

          <!-- SECTION 2: IMPULSIONAR PERFIL -->
          <div class="settings-sub-card">
            <h2 class="section-title">Impulsionar Perfil</h2>
            <p class="section-subtitle">Escolha como deseja impulsionar seu perfil</p>

            <!-- CARD DE IMPULSIONAMENTO AGENDADO -->
            <div v-if="scheduledBoost" class="scheduled-boost-card">
              <div class="scheduled-icon"><i class="fas fa-clock"></i></div>
              <div class="scheduled-info">
                <span class="scheduled-label">Impulsionamento Agendado</span>
                <span class="scheduled-time">Seu perfil irá para o Top 1 em: <strong>{{ scheduledBoost }}</strong></span>
              </div>
              <div class="scheduled-badge">Ativo</div>
            </div>

            <div class="boost-tabs">
              <button 
                class="boost-tab" 
                :class="{ active: boostMode === 'now' }"
                @click="boostMode = 'now'"
              >Impulsionar Agora</button>
              <button 
                class="boost-tab" 
                :class="{ active: boostMode === 'schedule' }"
                @click="boostMode = 'schedule'"
              >Agendar Impulsão</button>
            </div>

            <div v-if="boostMode === 'now'" class="boost-panel">
              <p class="boost-desc">Impulsione seu <strong>perfil</strong> imediatamente por <strong>24 horas</strong>.</p>
              <div class="boost-cost-row">
                <span>Custo:</span>
                <span class="cost-value">50 créditos</span>
              </div>
              <button class="action-btn red-btn boost-action-btn" @click="boostNow">Impulsionar Agora</button>
            </div>

            <div v-if="boostMode === 'schedule'" class="boost-panel">
              <p class="boost-desc">Agende um impulsionamento para uma data e hora específica.</p>
              <div class="form-group full-width" style="margin-bottom: 20px;">
                <label>Data e Hora</label>
                <div class="datetime-wrapper" @click="$refs.datePicker.showPicker()">
                  <input type="datetime-local" v-model="scheduleDate" class="datetime-input" ref="datePicker">
                </div>
              </div>
              <div class="boost-cost-row">
                <span>Custo:</span>
                <span class="cost-value">50 créditos</span>
              </div>
              <button class="action-btn red-btn boost-action-btn" @click="scheduleBoost">Agendar Impulsão</button>
            </div>
          </div>
        </div>

        <!-- METRICS TAB -->
        <div v-else-if="currentTab === 'metrics'" class="main-layout-container">
          <h1 class="page-title">Dashboard</h1>

          <!-- STAT CARDS -->
          <div class="stat-cards-grid">
            <div class="stat-card">
              <div class="stat-label">Visualizações Totais</div>
              <div class="stat-value">{{ analyticsStats.totalViews || 0 }}</div>
              <div class="stat-change" :class="analyticsStats.viewsGrowth >= 0 ? 'positive' : 'negative'">
                {{ analyticsStats.viewsGrowth > 0 ? '+' : '' }}{{ analyticsStats.viewsGrowth }}% vs. semana passada
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Cliques em Links</div>
              <div class="stat-value">{{ analyticsStats.linkClicks || 0 }}</div>
              <div class="stat-change" :class="analyticsStats.clicksGrowth >= 0 ? 'positive' : 'negative'">
                {{ analyticsStats.clicksGrowth > 0 ? '+' : '' }}{{ analyticsStats.clicksGrowth }}% vs. semana passada
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Taxa de Conversão</div>
              <div class="stat-value">{{ analyticsStats.conversion || 0 }}%</div>
              <div class="stat-change positive">Melhor Tração: {{ analyticsStats.topLink || 'N/A' }}</div>
            </div>
          </div>

          <!-- LINE CHART: ANÁLISE DE DESEMPENHO -->
          <div class="settings-sub-card relative">
            <h2 class="section-title">Análise de Desempenho</h2>
            <p class="section-subtitle">Visualize o desempenho do seu perfil</p>
            <div class="chart-period-tabs">
              <button class="chart-tab" :class="{ active: chartPeriod === 'weekly' }" @click="setChartPeriod('weekly')">Semanal</button>
              <button class="chart-tab" :class="{ active: chartPeriod === 'monthly' }" @click="setChartPeriod('monthly')">Mensal</button>
            </div>
            <div ref="lineChart" class="echarts-container"></div>

            <!-- MODAL FOR LINE CHART -->
            <transition name="fade">
              <div 
                v-if="showChartModal && activeChart === 'line'" 
                class="chart-stats-modal" 
                :class="{ mobile: isMobile, 'hover-mode': !isMobile }"
                :style="!isMobile ? { left: modalData.x + 'px' } : {}"
              >
                <div class="modal-header">
                  <span class="modal-date">{{ modalData.label }}</span>
                  <button class="close-modal" @click="showChartModal = false">&times;</button>
                </div>
                <div class="modal-body">
                  <div class="stat-row">
                    <i class="fas fa-eye"></i>
                    <span class="label">Visualizações</span>
                    <span class="value">{{ modalData.visits }}</span>
                  </div>
                  <div class="stat-row">
                    <i class="fas fa-mouse-pointer"></i>
                    <span class="label">Cliques em Links</span>
                    <span class="value">{{ modalData.clicks }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>


        </div>

        <div v-else class="main-layout-container construction-card">
           <h1 class="page-title">Em Breve</h1>
           <div class="settings-sub-card">
             <h2 class="section-title">Página em Construção</h2>
             <p class="section-subtitle">Esta funcionalidade estará disponível em breve.</p>
           </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATIONS -->
    <div class="toast-container">
      <transition-group name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="toast" 
          :class="toast.type"
        >
          <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
          <span>{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>

    <!-- STRIPE PIX CHECKOUT MODAL -->
    <div v-if="showCheckoutModal" class="crop-modal-overlay pix-modal-overlay" @mousedown.self="closeCheckout">
      <div class="crop-modal pix-modal" @mousedown.stop>
        <div class="modal-header-pix">
          <h3 class="modal-title">Checkout SEGURO (PIX)</h3>
          <button class="close-pix" @click="closeCheckout">&times;</button>
        </div>

        <!-- Passo 1: Coleta de Dados Billing -->
        <div v-if="checkoutStep === 'form'" class="pix-step-form">
          <p class="pix-intro">A Stripe exige seu CPF para gerar o QR Code oficial do Banco Central.</p>
          <div class="form-group-pix">
            <label>Nome Completo (na conta bancária)</label>
            <input type="text" v-model="billing.name" placeholder="João Silva">
          </div>
          <div class="form-group-pix">
            <label>E-mail</label>
            <input type="email" v-model="billing.email" placeholder="joao@email.com">
          </div>
          <div class="form-group-pix">
            <label>CPF / CNPJ</label>
            <input type="text" v-model="billing.taxId" placeholder="000.000.000-00">
          </div>
          <button 
            class="action-btn red-btn generate-pix-btn" 
            :disabled="checkoutLoading || !billing.taxId"
            @click="generatePix"
          >
            <span v-if="checkoutLoading"><i class="fas fa-spinner fa-spin"></i> Gerando...</span>
            <span v-else>Gerar QR CODE (R$ {{ selectedPlan.price.replace('R$ ', '') }})</span>
          </button>
        </div>

        <!-- Passo 2: QR Code e Instruções -->
        <div v-if="checkoutStep === 'pix'" class="pix-step-display">
          <div v-if="paymentStatus === 'pending'" class="pix-pending-state">
            <p class="pix-timer">Aguardando confirmação bancária...</p>
            <div class="qr-code-placeholder">
               <img v-if="pixData.qrCode" :src="pixData.qrCode" alt="QR Code PIX">
            </div>
            <div class="pix-copy-paste">
              <label>Código Copia e Cola:</label>
              <div class="copy-box">
                <input type="text" readonly :value="pixData.copyPaste" id="pixCodeInput">
                <button @click="copyPixCode"><i class="fas fa-copy"></i></button>
              </div>
            </div>
          </div>

          <!-- Sucesso -->
          <div v-if="paymentStatus === 'succeeded'" class="pix-success-state">
             <div class="success-icon-big"><i class="fas fa-check-circle"></i></div>
             <h4>PAGAMENTO CONCLUÍDO!</h4>
             <p>Seus {{ selectedPlan.credits }} créditos já foram adicionados à sua conta.</p>
             <button class="action-btn red-btn" @click="closeCheckout">Voltar ao Painel</button>
          </div>

          <!-- Falha -->
          <div v-if="paymentStatus === 'failed'" class="pix-error-state">
             <i class="fas fa-times-circle error-big"></i>
             <h4>Ocorreu um erro</h4>
             <p>Tente gerar um novo código ou contate o suporte.</p>
             <button class="action-btn" @click="checkoutStep = 'form'">Tentar de novo</button>
          </div>
        </div>
      </div>
    </div>

    <!-- CROP MODAL -->
    <div v-if="showCropModal" class="crop-modal-overlay" 
         @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" 
         @touchmove="onDrag" @touchend="stopDrag" @touchcancel="stopDrag"
         @mousedown.self="showCropModal = false">
      <div class="crop-modal" @mousedown.stop @touchstart.stop>
        <h3 class="modal-title">Cortar Foto {{ uploadType === 'cover' ? '(Capa)' : '(Galeria)' }}</h3>
        <p class="modal-subtitle">Arraste o quadrado vermelho para ajustar o corte</p>
        <div class="crop-viewport" ref="viewport">
          <img :src="tempPhoto" class="image-to-crop" draggable="false">
          <div 
            class="crop-selection-box" 
            :class="uploadType"
            :style="{ top: cropPos.top + 'px', left: cropPos.left + 'px', width: boxSize.w + 'px', height: boxSize.h + 'px' }"
            @mousedown.prevent="startDrag"
            @touchstart.prevent="startDrag"
          >
             <div class="crop-dragger-label"><i class="fas fa-arrows-alt"></i> Arraste</div>
             <div class="handle nw"></div><div class="handle ne"></div><div class="handle sw"></div><div class="handle se"></div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showCropModal = false">Cancelar</button>
          <button class="btn-save" @click="confirmCrop">Cortar e Salvar</button>
        </div>
      </div>
    </div>

    <input type="file" ref="fileInput" hidden @change="handleFile" accept="image/*">
  </div>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import * as echarts from 'echarts';
import api, { getImageUrl } from "../services/api";

export default {
  name: "DashboardView",
  components: { HeaderComponent },
  data() {
    return {
      currentTab: 'profile',
      profile: {
        name: "Usuário",
        bio: "",
        whatsapp: "",
        telegram: "",
        instagram: "",
        externalLink: "",
        coverPhoto: null,
        photos: [],
        status: ''
      },
      passwords: {
        new: "",
        confirm: ""
      },
      showPasswords: {
        new: false,
        confirm: false
      },
      passwordError: "",
      // Impulsionamento data
      credits: 0,
      selectedPlan: null,
      creditPlans: [],
      boostMode: 'now',
      scheduleDate: '',
      toasts: [],
      // Charts
      chartPeriod: 'weekly',
      lineChartInstance: null,
      barChartInstance: null,
      showCropModal: false,
      tempPhoto: null,
      uploadType: 'gallery',
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      initialPos: { top: 0, left: 0 },
      cropPos: { top: 50, left: 100 },
      boxSize: { w: 300, h: 300 },
      // Chart Modal
      showChartModal: false,
      modalData: null,
      activeChart: null,
      // Analytics Data
      analyticsStats: {
        totalViews: 0, viewsGrowth: 0,
        linkClicks: 0, clicksGrowth: 0,
        conversion: 0, topLink: 'N/A'
      },
      analyticsChart: [],
      // Stripe/PIX State
      stripe: null,
      showCheckoutModal: false,
      checkoutStep: 'form',
      checkoutLoading: false,
      paymentStatus: 'pending',
      billing: { name: '', email: '', taxId: '' },
      pixData: { qrCode: null, copyPaste: '', clientSecret: '' },
      paymentIntentId: null,
      checkInterval: null
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768;
    },
    emptyPlaceholders() {
      const count = 10 - this.profile.photos.length - (this.profile.photos.length < 10 ? 1 : 0);
      return Math.max(0, count);
    },
    scheduledBoost() {
      if (!this.profile.boostedAt) return null;
      const boostDate = new Date(this.profile.boostedAt);
      const now = new Date();
      if (boostDate > now) {
        return boostDate.toLocaleString('pt-BR', { 
          day: '2-digit', month: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
        });
      }
      return null;
    }
  },
  created() {
    this.fetchProfile();
    this.fetchPlans();
    this.fetchAnalytics(); // Carregar métricas em background
  },
  mounted() {
    if (this.currentTab === 'metrics') {
      this.$nextTick(() => this.initCharts());
    }
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.lineChartInstance) this.lineChartInstance.dispose();
    if (this.barChartInstance) this.barChartInstance.dispose();
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    passwords: {
      deep: true,
      handler(newVal) {
        if (!newVal.new && !newVal.confirm) {
          this.passwordError = "";
          return;
        }
        if (newVal.new && newVal.confirm) {
          if (newVal.new !== newVal.confirm) {
            this.passwordError = "As senhas não coincidem.";
          } else {
            this.passwordError = "As senhas coincidem!"; // Can be styled in green
          }
        } else {
          // One is filled, one is empty. Don't show "não coincidem" immediately unless they are typing
           this.passwordError = "";
        }
      }
    },
    currentTab(newTab) {
      if (newTab === 'metrics') {
        this.fetchAnalytics(); // Garantir dados frescos ao abrir a aba
        this.$nextTick(() => this.initCharts());
      }
    }
  },
  methods: {
    async fetchPlans() {
      try {
        const res = await api.get('/payments/plans');
        this.creditPlans = res.data.map(p => ({
            id: p.id,
            credits: p.credits,
            price: `R$ ${p.price.toFixed(2)}`,
            popular: p.id === 'popular'
        }));
      } catch (e) {
        console.error("Erro ao carregar planos:", e);
      }
    },
    async fetchProfile() {
      try {
        const response = await api.get('/user/profile');
        const userData = response.data;
        this.profile.name = userData.name || "Usuário";
        this.profile.bio = userData.bio || "";
        this.profile.whatsapp = userData.whatsapp || "";
        this.profile.telegram = userData.telegram || "";
        this.profile.instagram = userData.instagram || "";
        this.profile.externalLink = userData.externalLink || "";
        
        // SECURITY FALLBACK: Caso o Backend trave ou o Sequelize perca a tabela, 
        // o default NUNCA deve ser "active". Trave todos os contatos como "pending".
        this.profile.status = userData.status || "pending";
        localStorage.setItem('userStatus', this.profile.status);
        
        if (this.profile.status === 'pending') {
          this.$router.push('/pending');
          return;
        }
        
        // Se houver fotos na galeria (JSON no banco)
        if (userData.galleryPhotos) {
          try {
            const photos = typeof userData.galleryPhotos === 'string' 
              ? JSON.parse(userData.galleryPhotos) 
              : userData.galleryPhotos;
            // Resolver URLs de cada foto da galeria
            this.profile.photos = photos.map(p => {
              if (typeof p === 'string') return { src: getImageUrl(p) };
              return { ...p, src: getImageUrl(p.src) };
            });
          } catch (e) {
            console.error("Erro ao processar fotos:", e);
          }
        }
        
        if (userData.coverPhotoUrl) {
          try {
            const parsedCover = JSON.parse(userData.coverPhotoUrl);
            const src = parsedCover.src ? parsedCover.src : userData.coverPhotoUrl;
            this.profile.coverPhoto = { 
              ...parsedCover, 
              src: getImageUrl(src) 
            };
          } catch(e) {
            this.profile.coverPhoto = { src: getImageUrl(userData.coverPhotoUrl) };
          }
        }
        this.profile.boostedAt = userData.boostedAt || null;
        this.credits = userData.credits || 0;
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.logout();
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/auth');
    },
    triggerUpload(type) {
      this.uploadType = type;
      this.boxSize = type === 'cover' ? { w: 240, h: 360 } : { w: 300, h: 300 };
      this.cropPos = { top: 20, left: 50 };
      this.$refs.fileInput.click();
    },
    setChartPeriod(period) {
      this.chartPeriod = period;
      this.fetchAnalytics();
    },
    // --- STRIPE PIX METHODS ---
    buyCredits() {
      if (!this.selectedPlan) {
        this.showToast("Selecione um plano primeiro!", "error");
        return;
      }
      this.billing.name = this.profile.name;
      this.showCheckoutModal = true;
      this.checkoutStep = 'form';
      this.paymentStatus = 'pending';
    },
    closeCheckout() {
      this.showCheckoutModal = false;
      this.stopPolling();
    },
    async generatePix() {
      if (!this.billing.taxId) {
        this.showToast("CPF é obrigatório para gerar o PIX.", "error");
        return;
      }
      
      this.checkoutLoading = true;
      try {
        const res = await api.post('/payments/create-intent', { 
            planId: this.selectedPlan.id,
            taxId: this.billing.taxId
        });
        
        const { qrCode, copyPaste, paymentId } = res.data;
        this.paymentIntentId = paymentId;
        this.pixData.qrCode = qrCode;
        this.pixData.copyPaste = copyPaste;
        
        this.checkoutStep = 'pix';
        this.startPolling();
        
      } catch (e) {
        console.error("Erro PIX Asaas:", e);
        const errorMsg = e.response?.data?.error || "Falha ao gerar o PIX. Verifique seu CPF.";
        this.showToast(errorMsg, "error");
      } finally {
        this.checkoutLoading = false;
      }
    },
    startPolling() {
      this.stopPolling();
      this.checkInterval = setInterval(async () => {
        try {
          const res = await api.get(`/payments/status/${this.paymentIntentId}`);
          if (res.data.status === 'completed') {
            this.paymentStatus = 'succeeded';
            this.stopPolling();
            this.fetchProfile(); // Recarregar créditos
          }
        } catch (e) { console.error("Polling error", e); }
      }, 3000);
    },
    stopPolling() {
      if (this.checkInterval) clearInterval(this.checkInterval);
    },
    copyPixCode() {
      const el = document.getElementById('pixCodeInput');
      el.select();
      document.execCommand('copy');
      this.showToast("Código copiado!", "success");
    },
    initCharts() {
      this.initLineChart();
      this.initBarChart();
    },
    initLineChart() {
      if (!this.$refs.lineChart) return;
      if (this.lineChartInstance) this.lineChartInstance.dispose();
      this.lineChartInstance = echarts.init(this.$refs.lineChart, 'dark');
      
      const isWeekly = this.chartPeriod === 'weekly';
      const daysCount = isWeekly ? 7 : 30;
      
      const labels = [];
      const visits = [];
      const clicks = [];
      
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        // Garante formatação exata YYYY-MM-DD independentemente do fuso
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        
        labels.push(`${dd}/${mm}`);
        
        const v = this.analyticsChart.find(e => e.date === dateStr && e.eventType === 'profile_view');
        visits.push(v ? v.count : 0);
        
        const c = this.analyticsChart.find(e => e.date === dateStr && e.eventType === 'link_click');
        clicks.push(c ? c.count : 0);
      }

      const lineStyle = { width: 2, type: 'dashed' };
      const symbolSize = 5;
      this.lineChartInstance.setOption({
        backgroundColor: 'transparent',
        grid: { top: 20, bottom: 55, left: 50, right: 20 },
        tooltip: { 
          trigger: 'axis', 
          backgroundColor: 'rgba(26, 26, 26, 0.95)', 
          borderColor: '#444', 
          borderWidth: 1,
          textStyle: { color: '#fff', fontSize: 13 },
          padding: [10, 15],
          extraCssText: 'box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 8px;'
        },
        legend: {
          bottom: 0,
          textStyle: { color: '#888' },
          data: ['Visualizações', 'Cliques em Links']
        },
        xAxis: {
          type: 'category',
          data: labels,
          axisLine: { lineStyle: { color: '#333' } },
          axisLabel: { color: '#666' },
          splitLine: { show: true, lineStyle: { color: '#1a1a1a', type: 'dashed' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#666' },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#1a1a1a', type: 'dashed' } }
        },
        series: [
          { name: 'Visualizações', type: 'line', smooth: true, data: visits, symbol: 'circle', symbolSize, lineStyle: { ...lineStyle, color: '#bd2727', width: 2.5, type: 'solid' }, itemStyle: { color: '#bd2727' } },
          { name: 'Cliques em Links', type: 'line', smooth: true, data: clicks, symbol: 'circle', symbolSize, lineStyle: { ...lineStyle, color: '#ffd700' }, itemStyle: { color: '#ffd700' } }
        ]
      });

      // Add Hover Listener for Desktop
      this.lineChartInstance.on('mouseover', (params) => {
        if (!this.isMobile) {
          const dataIndex = params.dataIndex;
          this.activeChart = 'line';
          this.modalData = {
            label: labels[dataIndex],
            visits: visits[dataIndex],
            clicks: clicks[dataIndex],
            x: params.event.offsetX
          };
          this.showChartModal = true;
        }
      });
      this.lineChartInstance.on('mouseout', () => {
        if (!this.isMobile) {
          this.showChartModal = false;
        }
      });

      // Add Click Listener for Mobile
      this.lineChartInstance.on('click', (params) => {
        if (this.isMobile) {
          const dataIndex = params.dataIndex;
          this.activeChart = 'line';
          this.modalData = {
            label: labels[dataIndex],
            visits: visits[dataIndex],
            clicks: clicks[dataIndex],
            x: 0 // Not used on mobile
          };
          this.showChartModal = true;
        }
      });
    },
    initBarChart() {
      if (!this.$refs.barChart) return;
      if (this.barChartInstance) this.barChartInstance.dispose();
      this.barChartInstance = echarts.init(this.$refs.barChart, 'dark');
      const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
      const visits = [420, 300, 540, 510, 620, 750, 420];
      const likes = [180, 100, 290, 230, 340, 400, 210];
      const shares = [80, 50, 160, 130, 200, 230, 120];
      this.barChartInstance.setOption({
        backgroundColor: 'transparent',
        grid: { top: 20, bottom: 55, left: 50, right: 20 },
        tooltip: { 
          trigger: 'axis', 
          backgroundColor: 'rgba(26, 26, 26, 0.95)', 
          borderColor: '#444', 
          borderWidth: 1,
          textStyle: { color: '#fff', fontSize: 13 },
          padding: [10, 15],
          extraCssText: 'box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 8px;'
        },
        legend: {
          bottom: 0,
          textStyle: { color: '#888' },
          data: ['visits', 'likes', 'shares']
        },
        xAxis: {
          type: 'category',
          data: labels,
          axisLine: { lineStyle: { color: '#333' } },
          axisLabel: { color: '#666' },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#666' },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#1a1a1a', type: 'dashed' } }
        },
        series: [
          { name: 'visits', type: 'bar', data: visits, itemStyle: { color: '#bd2727', borderRadius: [4, 4, 0, 0] } },
          { name: 'likes', type: 'bar', data: likes, itemStyle: { color: '#555', borderRadius: [4, 4, 0, 0] } },
          { name: 'shares', type: 'bar', data: shares, itemStyle: { color: '#333', borderRadius: [4, 4, 0, 0] } }
        ]
      });

      // Add Hover Listener for Desktop
      this.barChartInstance.on('mouseover', (params) => {
        if (!this.isMobile) {
          const dataIndex = params.dataIndex;
          this.activeChart = 'bar';
          this.modalData = {
            label: labels[dataIndex],
            visits: visits[dataIndex],
            likes: likes[dataIndex],
            shares: shares[dataIndex],
            x: params.event.offsetX
          };
          this.showChartModal = true;
        }
      });
      this.barChartInstance.on('mouseout', () => {
        if (!this.isMobile) {
          this.showChartModal = false;
        }
      });

      // Add Click Listener for Mobile
      this.barChartInstance.on('click', (params) => {
        if (this.isMobile) {
          const dataIndex = params.dataIndex;
          this.activeChart = 'bar';
          this.modalData = {
            label: labels[dataIndex],
            visits: visits[dataIndex],
            likes: likes[dataIndex],
            shares: shares[dataIndex],
            x: 0 // Not used on mobile
          };
          this.showChartModal = true;
        }
      });
    },
    handleResize() {
      if (this.lineChartInstance) this.lineChartInstance.resize();
      if (this.barChartInstance) this.barChartInstance.resize();
    },
    handleFile(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.tempPhoto = ev.target.result;
          this.showCropModal = true;
        };
        reader.readAsDataURL(file);
      }
    },
    startDrag(e) {
      this.isDragging = true;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      this.dragStart = { x: clientX, y: clientY };
      this.initialPos = { top: this.cropPos.top, left: this.cropPos.left };
    },
    onDrag(e) {
      if (!this.isDragging) return;
      
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - this.dragStart.x;
      const deltaY = clientY - this.dragStart.y;
      
      let newLeft = this.initialPos.left + deltaX;
      let newTop = this.initialPos.top + deltaY;
      const viewport = this.$refs.viewport;
      if (viewport) {
        const maxX = viewport.clientWidth - this.boxSize.w;
        const maxY = viewport.clientHeight - this.boxSize.h;
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(0, Math.min(newTop, maxY));
      }
      this.cropPos = { top: newTop, left: newLeft };
    },
    stopDrag() { this.isDragging = false; },
    confirmCrop() {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      const cropData = {
        top: (this.cropPos.top / viewport.clientHeight) * 100,
        left: (this.cropPos.left / viewport.clientWidth) * 100,
        width: (this.boxSize.w / viewport.clientWidth) * 100,
        height: (this.boxSize.h / viewport.clientHeight) * 100
      };
      if (this.uploadType === 'cover') {
        this.profile.coverPhoto = { src: this.tempPhoto, crop: cropData };
      } else {
        if (this.profile.photos.length < 10) {
          this.profile.photos.push({ src: this.tempPhoto, crop: cropData });
        }
      }
      this.showCropModal = false;
      this.tempPhoto = null;
    },
    getCropStyle(crop) {
      if (!crop) return { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: '0', left: '0' };
      const scaleX = 100 / crop.width;
      const scaleY = 100 / crop.height;
      return {
        width: (scaleX * 100) + '%', height: (scaleY * 100) + '%',
        top: -(crop.top * scaleY) + '%', left: -(crop.left * scaleX) + '%',
        position: 'absolute', maxWidth: 'none', maxHeight: 'none'
      };
    },
    removePhoto(index) { this.profile.photos.splice(index, 1); },
    async saveProfile() {
      try {
        const data = {
          name: this.profile.name,
          bio: this.profile.bio,
          whatsapp: this.profile.whatsapp,
          telegram: this.profile.telegram,
          instagram: this.profile.instagram,
          externalLink: this.profile.externalLink,
          coverPhotoUrl: this.profile.coverPhoto ? JSON.stringify(this.profile.coverPhoto) : null,
          galleryPhotos: this.profile.photos
        };
        await api.put('/user/profile', data);
        this.showToast('Perfil salvo com sucesso!');
      } catch (error) {
        this.showToast('Erro ao salvar perfil.', 'error');
      }
    },
    showToast(message, type = 'success') {
      const id = Date.now();
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 3500);
    },
    async boostNow() {
      if (this.credits < 50) { 
        this.showToast('Créditos insuficientes! Cada impulso custa 50 créditos.', 'error'); 
        return; 
      }
      
      try {
        const response = await api.post('/user/boost');
        this.credits = response.data.credits;
        this.showToast('Perfil impulsionado para o Top 1 com sucesso!');
      } catch (e) {
        this.showToast(e.response?.data?.error || 'Erro ao impulsionar.', 'error');
      }
    },
    async scheduleBoost() {
      if (!this.scheduleDate) { 
        this.showToast('Selecione uma data e hora para o agendamento.', 'error'); 
        return; 
      }
      if (this.credits < 50) { 
        this.showToast('Créditos insuficientes para agendar.', 'error'); 
        return; 
      }

      try {
        const response = await api.post('/user/boost', { date: this.scheduleDate });
        this.credits = response.data.credits;
        this.showToast(`Agendado com sucesso para ${new Date(this.scheduleDate).toLocaleString('pt-BR')}!`);
        this.scheduleDate = '';
      } catch (e) {
        this.showToast(e.response?.data?.error || 'Erro ao agendar.', 'error');
      }
    },
    async updatePassword() {
      if (!this.passwords.new || !this.passwords.confirm) {
        this.passwordError = "Por favor, preencha ambos os campos.";
        return;
      }
      if (this.passwords.new !== this.passwords.confirm) {
        this.passwordError = "As senhas não coincidem.";
        return;
      }
      
      try {
        await api.put('/user/password', { newPassword: this.passwords.new });
        this.showToast('Senha alterada com sucesso!');
        this.passwords.new = "";
        this.passwords.confirm = "";
        this.passwordError = "";
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao alterar senha.';
        this.showToast(message, 'error');
      }
    },
    async fetchAnalytics() {
      console.log("Iniciando busca de analytics para período:", this.chartPeriod);
      try {
        const res = await api.get(`/analytics/dashboard?period=${this.chartPeriod}`);
        console.log("Resposta Analytics recebida:", res.data);
        
        if (res.data && res.data.stats) {
          this.analyticsStats = { ...res.data.stats };
          this.analyticsChart = res.data.chartData || [];
          console.log("Métricas atualizadas no estado Vue:", this.analyticsStats);
        }

        if (this.currentTab === 'metrics') {
          this.$nextTick(() => this.initCharts());
        }
      } catch (e) {
        console.error("Erro ao carregar métricas no Dashboard:", e);
      }
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  color: #fff;
  width: 100%;
}

.dashboard-content {
  width: 100%;
  padding-top: 40px;
}

.profile-settings-wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 40px 100px;
}

.main-layout-container {
  background-color: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  text-align: left;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.settings-sub-card {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
}

.section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
.section-subtitle { color: #666; font-size: 0.95rem; margin-bottom: 35px; }

.photos-layout { display: flex; gap: 60px; align-items: flex-start; width: 100%; }
.cover-column { flex: 0 0 240px; }
.gallery-column { flex: 1; }

.subsection-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 25px; color: #888; }

.cover-uploader {
  width: 240px; aspect-ratio: 2 / 3; background-color: #080808; border: 2px dashed #1a1a1a;
  border-radius: 18px; cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center;
}

.crop-preview-wrapper { position: relative; width: 100%; height: 100%; overflow: hidden; }
.crop-preview-wrapper img { pointer-events: none; object-fit: fill; }

.gallery-grid-fixed { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; }
.photo-thumbnail, .add-box, .empty-placeholder { aspect-ratio: 1 / 1; border-radius: 14px; }
.photo-thumbnail { position: relative; border: 1px solid #1a1a1a; overflow: hidden; }
.photo-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.remove-btn { 
  position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.8); border: none; 
  color: #fff; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 16px;
}

.add-box { 
  border: 2px dashed #1a1a1a; display: flex; flex-direction: column; align-items: center; justify-content: center; 
  color: #444; cursor: pointer; transition: 0.2s; 
}
.add-box:hover { border-color: #bd2727; color: #bd2727; }

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #555;
  font-weight: 600;
}

.upload-placeholder i { opacity: 0.5; font-size: 1.5rem; }

.empty-placeholder { background-color: #080808; border: 1px solid #141414; }
.photo-limit-footer { color: #555; font-size: 0.9rem; margin-top: 20px; font-weight: 600; }

.profile-form { display: flex; flex-direction: column; gap: 30px; }
.form-group { display: flex; flex-direction: column; gap: 12px; }
.form-group label { font-weight: 600; font-size: 1rem; color: #888; }
.form-group input, .form-group textarea {
  background-color: #080808; border: 1px solid #1a1a1a; padding: 20px; border-radius: 12px; 
  color: #fff; font-size: 1rem; outline: none; transition: 0.2s;
}
.form-group input:focus, .form-group textarea:focus { border-color: #bd2727; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }

.mb-password {
  margin-bottom: 20px;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-input-wrapper input {
  width: 100%;
  padding-right: 50px;
}

.visibility-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: color 0.2s;
}

.visibility-toggle:hover {
  color: #bd2727;
}

.error-text {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: left;
}

.error-text[style*="coincidem!"] {
  color: #2ecc71;
}
.error-text {
   color: #bd2727;
}

.action-btn { 
  padding: 16px 40px; border-radius: 14px; font-weight: 700; cursor: pointer; border: none; font-size: 1rem; 
  transition: 0.2s; letter-spacing: 0.5px;
}
.red-btn { background-color: #bd2727; color: #fff; }
.red-btn:hover { background-color: #d12a2a; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(189, 39, 39, 0.2); }
.dark-btn { background-color: #1a1a1a; color: #fff; }

.crop-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.96); z-index: 10000; display: flex; align-items: center; justify-content: center; }
.crop-modal { background: #111; padding: 50px; border-radius: 30px; width: 700px; text-align: center; border: 1px solid #1a1a1a; }
.crop-viewport { width: 100%; height: 480px; background: #000; border-radius: 20px; position: relative; overflow: hidden; margin-top: 35px; display: flex; align-items: center; justify-content: center; }
.image-to-crop { max-height: 100%; max-width: 100%; opacity: 0.35; user-select: none; }
.crop-selection-box { position: absolute; border: 2.5px solid #bd2727; box-shadow: 0 0 0 2500px rgba(0,0,0,0.75); cursor: move; }
.crop-dragger-label { position: absolute; top: 12px; left: 12px; color: #fff; font-size: 0.75rem; font-weight: 800; background: #bd2727; padding: 5px 12px; border-radius: 5px; }

.modal-actions { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
.btn-save { background: #bd2727; color: #fff; border: none; padding: 14px 45px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s;}
.btn-save:hover { background-color: #d12a2a; transform: translateY(-2px); }
.btn-cancel { 
  background: transparent; 
  color: #888; 
  border: 1px solid #333; 
  padding: 14px 45px; 
  border-radius: 12px; 
  font-weight: 800; 
  cursor: pointer; 
  transition: 0.2s;
}
.btn-cancel:hover {
  border-color: #bd2727;
  color: #bd2727;
}

.credit-display {
  background-color: #141414;
  border-radius: 14px;
  padding: 30px;
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.credit-amount {
  font-size: 2.8rem;
  font-weight: 800;
  color: #bd2727;
  line-height: 1;
}

.credit-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.buy-credits-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #fff;
}

.credit-plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.credit-plan-card {
  background-color: #141414;
  border: 1px solid #222;
  border-radius: 14px;
  padding: 25px 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, transform 0.2s;
}

.credit-plan-card:hover {
  border-color: #444;
  transform: translateY(-2px);
}

.credit-plan-card.selected {
  border-color: #bd2727;
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #bd2727;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 20px;
  white-space: nowrap;
}

.plan-credits {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
}

.plan-credits-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 12px;
}

.plan-price {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.buy-btn {
  width: 100%;
  text-align: center;
  background-color: #bd2727;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
}

.buy-btn:hover {
  background-color: #d12a2a;
  transform: translateY(-2px);
}

.boost-tabs {
  display: flex;
  background-color: #141414;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 25px;
}

.boost-tab {
  flex: 1;
  padding: 14px 20px;
  border: none;
  background-color: transparent;
  color: #666;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.boost-tab.active {
  background-color: #222;
  color: #fff;
}

.boost-panel {
  background-color: #141414;
  border-radius: 14px;
  padding: 25px;
}

.boost-desc {
  color: #ccc;
  font-size: 0.95rem;
  margin-bottom: 20px;
  line-height: 1.6;
}

.boost-cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #aaa;
  font-size: 0.95rem;
  margin-bottom: 20px;
  padding: 14px 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
}

.cost-value {
  font-weight: 700;
  color: #fff;
}

.boost-action-btn {
  width: 100%;
  text-align: center;
  justify-content: center;
  display: flex;
}

.datetime-wrapper {
  position: relative;
  cursor: pointer;
}

.datetime-input {
  width: 100%;
  background-color: #080808;
  border: 1px solid #1a1a1a;
  padding: 16px 20px;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: 0.2s;
  box-sizing: border-box;
  color-scheme: dark;
  cursor: pointer;
  pointer-events: none;
}

.datetime-input:focus {
  border-color: #bd2727;
}

.relative {
  position: relative !important;
}

.echarts-container {
  width: 100%;
  height: 320px;
}

.chart-stats-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  width: 250px;
  padding: 0;
  z-index: 100;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  transition: opacity 0.2s, transform 0.2s, left 0.3s ease-out;
}

.chart-stats-modal.hover-mode {
  pointer-events: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -45%);
}

.chart-stats-modal.mobile {
  position: fixed;
  top: auto;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 350px;
}

.modal-header {
  background: #222;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.modal-date {
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
}

.close-modal {
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-row i {
  width: 20px;
  color: #bd2727;
  font-size: 0.9rem;
  text-align: center;
}

.stat-row .label {
  flex: 1;
  font-size: 0.9rem;
  color: #888;
  font-weight: 500;
}

.stat-row .value {
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
}

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  min-width: 280px;
  max-width: 380px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  pointer-events: all;
}

.toast.success {
  background-color: rgba(30, 120, 60, 0.95);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.toast.error {
  background-color: rgba(140, 20, 20, 0.95);
  border: 1px solid rgba(189, 39, 39, 0.4);
}

.toast i {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.35s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

@media (max-width: 1100px) {
  .photos-layout { flex-direction: column; }
  .gallery-grid-fixed { grid-template-columns: repeat(2, 1fr); }
  .main-layout-container { padding: 30px; }
  .settings-sub-card { padding: 30px; }
}

@media (max-width: 768px) {
  .profile-settings-wrapper { padding: 0 20px 80px; }
  .main-layout-container { padding: 20px; border-radius: 20px; gap: 20px; }
  .settings-sub-card { padding: 20px; border-radius: 15px; }
  .form-row { grid-template-columns: 1fr; gap: 20px; }
  .page-title { font-size: 1.5rem; }
  .section-title { font-size: 1.3rem; }
  
  /* Impulsionamento mobile responsive */
  .credit-plans {
    grid-template-columns: 1fr; /* Stack vertically on small screens */
    gap: 20px;
  }
  .credit-plan-card {
    padding: 20px;
  }
  .boost-tabs {
    flex-direction: column;
  }
  .boost-tab {
    border-bottom: 1px solid #222;
  }
  .boost-tab:last-child {
    border-bottom: none;
  }
  .toast-container {
    top: auto;
    bottom: 20px;
    right: 10px;
    left: 10px;
  }
  .toast {
    min-width: auto;
    max-width: 100%;
    width: 100%;
  }

  .stat-card {
    padding: 20px;
  }
  .stat-value {
    font-size: 2rem;
  }
  .echarts-container {
    height: 280px;
  }

  /* Horizontal Photos on Mobile */
  .photos-layout { gap: 30px; }
  
  .cover-column, .gallery-column {
    width: 100%;
    flex: none;
  }

  .cover-uploader { 
    width: 100%; 
    max-width: 100%; 
    aspect-ratio: 3 / 4; /* Taller horizontal space */
    margin: 0; 
  }
  
  .gallery-grid-fixed { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 15px; 
  }

  /* Make thumbnails square again */
  .photo-thumbnail, .add-box, .empty-placeholder { 
    aspect-ratio: 1 / 1; 
  }

  .crop-modal { width: 95%; padding: 30px; }
  .modal-actions { flex-direction: column; }
  .btn-save, .btn-cancel { width: 100%; }
}

/* =========================================
   🎓 STAT CARDS & CHART TABS MODERN UI 
========================================= */

.stat-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  border-color: rgba(189, 39, 39, 0.5); /* Brand red glow */
}

.stat-label {
  color: #999;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  color: #fff;
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.stat-change {
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.05); /* Separator */
}

.stat-change.positive { color: #2ecc71; }
.stat-change.negative { color: #e74c3c; }

/* Chart Tabs */
.chart-period-tabs {
  display: inline-flex;
  gap: 8px;
  background-color: #1a1a1a;
  padding: 6px;
  border-radius: 24px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
}

.chart-tab {
  background: transparent;
  border: none;
  color: #888;
  padding: 10px 28px;
  border-radius: 18px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-tab:hover:not(.active) {
  color: #ccc;
  background-color: rgba(255,255,255,0.02);
}

.chart-tab.active {
  background: linear-gradient(135deg, #bd2727 0%, #a01f1f 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(189, 39, 39, 0.4);
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .stat-card { padding: 20px; }
  .stat-value { font-size: 2.2rem; }
  .chart-period-tabs { width: 100%; justify-content: space-between; }
  .chart-tab { flex: 1; text-align: center; padding: 10px 15px; }
}

/* --- PIX MODAL STYLES --- */
.pix-modal {
  max-width: 450px;
  background: #111;
  border: 1px solid #222;
}

.modal-header-pix {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.close-pix {
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
}

.pix-intro {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 25px;
  line-height: 1.5;
}

.form-group-pix {
  margin-bottom: 20px;
}

.form-group-pix label {
  display: block;
  color: #aaa;
  font-size: 0.85rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group-pix input {
  width: 100%;
  background: #080808;
  border: 1px solid #222;
  padding: 12px 15px;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
}

.generate-pix-btn {
  width: 100%;
  margin-top: 10px;
  justify-content: center;
}

.pix-pending-state {
  text-align: center;
}

.qr-code-placeholder {
  background: #fff;
  padding: 15px;
  border-radius: 15px;
  margin: 20px auto;
  width: 220px;
  height: 220px;
}

.qr-code-placeholder img {
  width: 100%;
  height: 100%;
}

.pix-copy-paste {
  margin-top: 25px;
  text-align: left;
}

.copy-box {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.copy-box input {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 10px;
  border-radius: 8px;
  color: #888;
  font-size: 0.8rem;
}

.copy-box button {
  background: #222;
  border: none;
  color: #fff;
  padding: 0 15px;
  border-radius: 8px;
  cursor: pointer;
}

.pix-success-state {
  text-align: center;
  padding: 20px 0;
}

.success-icon-big {
  font-size: 4rem;
  color: #2ecc71;
  margin-bottom: 20px;
}

.pix-success-state h4 {
  color: #fff;
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.pix-success-state p {
  color: #aaa;
  margin-bottom: 30px;
}

.scheduled-boost-card {
  background: #141414;
  border: 1px solid #1f1f1f;
  border-left: 4px solid #bd2727;
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.scheduled-icon {
  font-size: 1.2rem;
  color: #bd2727;
  background: rgba(189, 39, 39, 0.1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.scheduled-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.scheduled-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #bd2727;
  letter-spacing: 0.5px;
}

.scheduled-time {
  font-size: 0.95rem;
  color: #ccc;
  margin-top: 2px;
}

.scheduled-time strong {
  color: #fff;
}

.scheduled-badge {
  background: rgba(255, 255, 255, 0.05);
  color: #888;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

</style>
