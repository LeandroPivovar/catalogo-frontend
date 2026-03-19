<template>
  <div class="admin-dashboard">
    <aside class="admin-sidebar glass">
      <div class="sidebar-logo">
        <i class="fas fa-crown"></i>
        <span>Admin Panel</span>
      </div>
      <nav class="sidebar-nav">
        <button class="nav-item" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          <i class="fas fa-th-large"></i> Overview
        </button>
        <button class="nav-item" :class="{ active: activeTab === 'approvals' }" @click="activeTab = 'approvals'">
          <i class="fas fa-user-check"></i> Aprovações RG
        </button>
        <button class="nav-item" :class="{ active: activeTab === 'plans' }" @click="activeTab = 'plans'">
          <i class="fas fa-shopping-cart"></i> Planos & Preços
        </button>
        <button class="nav-item" :class="{ active: activeTab === 'finance' }" @click="activeTab = 'finance'">
          <i class="fas fa-chart-line"></i> Financeiro
        </button>
        <button class="nav-item" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
          <i class="fas fa-users-cog"></i> Gerenciar Usuários
        </button>
        <div class="nav-spacer"></div>
        <button class="nav-item logout" @click="logout"><i class="fas fa-sign-out-alt"></i> Sair</button>
      </nav>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <h1>{{ tabTitle }}</h1>
        <p>{{ tabSubtitle }}</p>
      </header>

      <!-- TAB: OVERVIEW -->
      <div v-if="activeTab === 'overview'" class="tab-content fade-in">
        <div class="kpi-grid">
          <div class="kpi-card glass">
            <div class="kpi-icon money"><i class="fas fa-wallet"></i></div>
            <div class="kpi-info">
              <span class="kpi-label">Faturamento Total</span>
              <span class="kpi-value">R$ {{ stats.totalRevenue }}</span>
            </div>
          </div>
          <div class="kpi-card glass">
            <div class="kpi-icon users"><i class="fas fa-users"></i></div>
            <div class="kpi-info">
              <span class="kpi-label">Base de Modelos</span>
              <span class="kpi-value">{{ stats.totalUsers }}</span>
            </div>
          </div>
          <div class="kpi-card glass">
            <div class="kpi-icon pending"><i class="fas fa-clock"></i></div>
            <div class="kpi-info">
              <span class="kpi-label">Pendentes de Aprovação</span>
              <span class="kpi-value">{{ stats.pendingUsers }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: APPROVALS -->
      <div v-if="activeTab === 'approvals'" class="tab-content fade-in">
        <div v-if="pendingList.length === 0" class="empty-state">
           <i class="fas fa-check-circle"></i>
           <p>Nenhuma modelo aguardando aprovação no momento.</p>
        </div>
        <div v-else class="approval-grid">
           <div v-for="user in pendingList" :key="user.id" class="approval-card glass">
              <div class="card-header">
                <h3>{{ user.name }}</h3>
                <span>{{ user.email }}</span>
              </div>
              <div class="rg-viewer">
                <div class="rg-side">
                  <p>RG Frente</p>
                  <img :src="user.rgFront || 'https://via.placeholder.com/300x200?text=RG+Frente'" @click="openImage(user.rgFront)">
                </div>
                <div class="rg-side">
                  <p>RG Verso</p>
                  <img :src="user.rgBack || 'https://via.placeholder.com/300x200?text=RG+Verso'" @click="openImage(user.rgBack)">
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-reject-full" @click="quickUpdateStatus(user.id, 'rejected')">Rejeitar</button>
                <button class="btn-approve-full" @click="quickUpdateStatus(user.id, 'approved')">Aprovar Modelo</button>
              </div>
           </div>
        </div>
      </div>

      <!-- TAB: PLANS CONFIG -->
      <div v-if="activeTab === 'plans'" class="tab-content fade-in">
        <div class="plans-editor-grid">
          <div v-for="plan in plans" :key="plan.id" class="plan-config-card glass">
            <div class="plan-badge">{{ plan.id.toUpperCase() }}</div>
            <div class="form-group-admin">
               <label>Preço (R$)</label>
               <input type="number" step="0.01" v-model="plan.price">
            </div>
            <div class="form-group-admin">
               <label>Tokens / Créditos</label>
               <input type="number" v-model="plan.credits">
            </div>
            <button class="btn-save-plan" @click="savePlan(plan)">Atualizar Pacote</button>
          </div>
        </div>
      </div>

      <!-- TAB: FINANCE -->
      <div v-if="activeTab === 'finance'" class="tab-content fade-in">
        <div class="finance-grid">
           <!-- KPI CARDS FINANCE -->
           <div class="finance-kpis">
             <div class="kpi-card glass-gold">
               <span class="kpi-label">Faturamento Hoje</span>
               <span class="kpi-value">R$ {{ finance.summary.daily.toFixed(2) }}</span>
               <div class="kpi-trend pos">+ {{ ((finance.summary.daily / (finance.summary.monthly || 1)) * 100).toFixed(1) }}% do mês</div>
             </div>
             <div class="kpi-card glass-emerald">
               <span class="kpi-label">Este Mês</span>
               <span class="kpi-value">R$ {{ finance.summary.monthly.toFixed(2) }}</span>
               <small class="kpi-subtle">Total acumulado</small>
             </div>
             <div class="kpi-card glass-purple">
               <span class="kpi-label">Projeção de Fechamento</span>
               <span class="kpi-value">R$ {{ finance.summary.projection.toFixed(2) }}</span>
               <div class="projection-bar-container">
                 <div class="projection-bar" :style="'width: ' + Math.min((finance.summary.monthly / (finance.summary.projection || 1)) * 100, 100) + '%'"></div>
               </div>
             </div>
             <div class="kpi-card glass-dark">
               <span class="kpi-label">Faturamento Total</span>
               <span class="kpi-value">R$ {{ finance.summary.total.toFixed(2) }}</span>
               <small class="kpi-subtle">Desde o início</small>
             </div>
           </div>

           <!-- DETAILED TABLES -->
           <div class="finance-details-grid">
             <div class="finance-section glass">
               <h3>Histórico Diário (30 dias)</h3>
               <div class="table-container-fixed">
                 <table class="admin-table mini">
                   <thead>
                     <tr><th>Data</th><th>Faturamento</th></tr>
                   </thead>
                   <tbody>
                     <tr v-for="day in finance.dailyHistory" :key="day.date">
                       <td class="text-dim">{{ new Date(day.date + 'T12:00:00').toLocaleDateString('pt-BR') }}</td>
                       <td class="font-bold">R$ {{ day.amount.toFixed(2) }}</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </div>

             <div class="finance-section glass">
                <h3>Vendas Recentes</h3>
                <div class="table-container-fixed">
                  <table class="admin-table mini">
                    <thead>
                      <tr><th>Modelo</th><th>Valor</th><th>Data</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="sale in finance.recentSales" :key="sale.id">
                        <td>{{ sale.userName }}</td>
                        <td class="text-emerald">R$ {{ sale.amount.toFixed(2) }}</td>
                        <td class="text-dim">{{ new Date(sale.date).toLocaleString('pt-BR') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
             </div>
           </div>
        </div>
      </div>

      <!-- TAB: USER MANAGEMENT -->
      <div v-if="activeTab === 'users'" class="tab-content fade-in">
        <section class="user-management glass">
          <div class="section-header">
            <div class="search-box">
               <i class="fas fa-search"></i>
               <input type="text" v-model="search" placeholder="Buscar modelo...">
            </div>
          </div>
          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Modelo</th>
                  <th>Status</th>
                  <th>Saldo / Engajamento</th>
                  <th class="text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id" class="table-row-hover">
                  <td>
                    <div class="user-info-cell">
                      <div class="user-avatar" :style="user.status === 'approved' ? 'border-color: #2ecc71' : ''">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="user-meta">
                        <span class="user-name">{{ user.name }}</span>
                        <span class="user-email-small">{{ user.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="status-pill" :class="user.status">
                      <span class="dot"></span>
                      {{ user.status === 'approved' ? 'Aprovada' : user.status === 'pending' ? 'Pendente' : 'Desativada' }}
                    </span>
                  </td>
                  <td>
                    <div class="credits-stat">
                       <i class="fas fa-coins text-gold"></i>
                       <span class="credits-count">{{ user.credits }}</span>
                       <small class="clicks-label">({{ user.clicks || 0 }} cliques)</small>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons-list">
                      <button class="action-btn edit" @click="editUser(user)" title="Editar Perfil">
                        <i class="fas fa-pen"></i>
                      </button>
                      <button v-if="user.status === 'approved' || user.status === 'active'" class="action-btn ban" @click="quickUpdateStatus(user.id, 'rejected')" title="Desativar">
                        <i class="fas fa-ban"></i>
                      </button>
                      <button v-else class="action-btn approve" @click="quickUpdateStatus(user.id, 'approved')" title="Aprovar">
                        <i class="fas fa-check"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    <div v-if="editingUser" class="modal-overlay fade-in" @mousedown.self="editingUser = null">
      <div class="admin-modal glass-heavy slide-up">
        <div class="modal-header">
          <div class="header-content">
             <i class="fas fa-user-edit text-gold"></i>
             <h3>Editar Perfil de Elite</h3>
          </div>
          <button class="close-btn" @click="editingUser = null">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">Ajuste as permissões e o saldo da modelo <strong>{{ editingUser.name }}</strong></p>
          <div class="form-grid-modern">
             <div class="form-field-white">
                <label>Nome Completo</label>
                <input v-model="editForm.name" placeholder="Nome da Modelo">
             </div>
             <div class="form-field-white">
                <label>E-mail de Acesso</label>
                <input v-model="editForm.email" placeholder="email@exemplo.com">
             </div>
             <div class="form-field-white">
                <label>Saldo de Créditos (R$)</label>
                <div class="input-with-icon">
                   <i class="fas fa-coins"></i>
                   <input type="number" v-model="editForm.credits">
                </div>
             </div>
             <div class="form-field-white">
                <label>Status do Perfil</label>
                <select v-model="editForm.status">
                  <option value="pending">🟡 Pendente de Aprovação</option>
                  <option value="approved">🟢 Aprovada para o Catálogo</option>
                  <option value="rejected">🔴 Desativada / Reprovada</option>
                </select>
             </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel-admin" @click="editingUser = null">Cancelar</button>
          <button class="btn-save-admin-premium" @click="saveUserEdit">
            <i class="fas fa-save"></i> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "AdminDashboardView",
  data() {
    return {
      activeTab: 'overview',
      stats: { totalUsers: 0, pendingUsers: 0, totalRevenue: "0.00" },
      users: [],
      plans: [],
      search: "",
      editingUser: null,
      editForm: {},
      finance: { summary: { daily: 0, monthly: 0, total: 0, projection: 0 }, recentSales: [], dailyHistory: [] }
    };
  },
  computed: {
    tabTitle() {
      const titles = { overview: 'Dashboard', approvals: 'Aprovações de Cadastro', plans: 'Configuração de Vendas', users: 'Central de Modelos', finance: 'Inteligência Financeira' };
      return titles[this.activeTab];
    },
    tabSubtitle() {
      const subs = { overview: 'Performance geral', approvals: 'Análise de documentos KYC', plans: 'Preços e pacotes de impulsos', users: 'Gestão de base cadastrada', finance: 'Faturamento e Projeções de Lucro' };
      return subs[this.activeTab];
    },
    pendingList() { return this.users.filter(u => u.status === 'pending'); },
    filteredUsers() {
      if (!this.search) return this.users;
      return this.users.filter(u => u.name.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  created() { this.fetchData(); },
  methods: {
    async fetchData() {
      const [s, u, p, f] = await Promise.all([
        api.get("/admin/stats"), 
        api.get("/admin/users"), 
        api.get("/admin/plans"),
        api.get("/admin/finance")
      ]);
      this.stats = s.data; 
      this.users = u.data; 
      this.plans = p.data;
      this.finance = f.data;
    },
    async quickUpdateStatus(id, status) {
      await api.put(`/admin/users/${id}/status`, { status });
      this.fetchData();
    },
    async savePlan(plan) {
      await api.put(`/admin/plans/${plan.id}`, plan);
      alert("Plano atualizado!");
    },
    editUser(user) { this.editingUser = user; this.editForm = { ...user }; },
    async saveUserEdit() {
      await api.put(`/admin/users/${this.editForm.id}`, this.editForm);
      this.editingUser = null; this.fetchData();
    },
    openImage(url) { if(url) window.open(url, '_blank'); },
    logout() { localStorage.clear(); this.$router.push("/admin/login"); }
  }
};
</script>

<style scoped>
.admin-dashboard { display: flex; min-height: 100vh; background: #000; color: #fff; font-family: 'Inter', sans-serif; }
.admin-sidebar { width: 260px; background: #050505; border-right: 1px solid #111; padding: 40px 20px; position: sticky; top: 0; height: 100vh; }
.sidebar-logo { color: #bd2727; font-size: 1.5rem; font-weight: 900; margin-bottom: 50px; display: flex; align-items: center; gap: 10px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 8px; }
.nav-item { background: none; border: none; padding: 15px 20px; color: #444; border-radius: 12px; cursor: pointer; text-align: left; transition: 0.3s; font-weight: 600; }
.nav-item:hover { background: #0a0a0a; color: #888; }
.nav-item.active { background: #111; color: #bd2727; }
.admin-main { flex: 1; padding: 50px; }
.admin-header h1 { font-size: 2.2rem; font-weight: 800; }
.admin-header p { color: #555; margin-bottom: 50px; }

.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.kpi-card { padding: 30px; border-radius: 20px; border: 1px solid #111; }
.kpi-value { font-size: 2rem; font-weight: 900; display: block; }
.kpi-label { color: #444; font-size: 0.8rem; text-transform: uppercase; }

.approval-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }
.approval-card { padding: 30px; border-radius: 24px; border: 1px solid #111; }
.rg-viewer { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
.rg-side img { width: 100%; height: 120px; object-fit: cover; border-radius: 10px; cursor: zoom-in; }
.rg-side p { font-size: 0.7rem; color: #444; margin-bottom: 5px; }

.btn-approve-full { width: 100%; padding: 15px; background: #2ecc71; color: #fff; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; margin-top: 10px; }
.btn-reject-full { width: 100%; padding: 12px; background: #e74c3c1a; color: #e74c3c; border: none; border-radius: 12px; cursor: pointer; }

.plans-editor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.plan-config-card { padding: 30px; border-radius: 20px; border: 1px solid #111; }
.plan-badge { display: inline-block; padding: 4px 10px; background: #bd272722; color: #bd2727; font-size: 0.7rem; font-weight: 900; border-radius: 5px; margin-bottom: 20px; }
.btn-save-plan { width: 100%; padding: 12px; background: #fff; color: #000; border: none; border-radius: 10px; font-weight: 700; margin-top: 20px; cursor: pointer; }

.form-group-admin { margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
.form-group-admin label { font-size: 0.75rem; color: #444; text-transform: uppercase; }
.form-group-admin input, .form-group-admin select { background: #000; border: 1px solid #111; padding: 12px; color: #fff; border-radius: 10px; }

.status-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.status-pill.approved, .status-pill.active { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); }
.status-pill.pending { background: rgba(241, 196, 15, 0.1); color: #f1c40f; border: 1px solid rgba(241, 196, 15, 0.2); }
.status-pill.rejected { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2); }
.status-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }

.user-info-cell { display: flex; align-items: center; gap: 12px; }
.user-avatar { width: 42px; height: 42px; background: linear-gradient(135deg, #1a1a1a, #0a0a0a); border: 1px solid #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #555; font-size: 0.9rem; }
.user-meta { display: flex; flex-direction: column; }
.user-name { font-weight: 700; font-size: 0.95rem; color: #fff; }
.user-email-small { font-size: 0.75rem; color: #444; }

.credits-stat { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #eee; }
.text-gold { color: #ffd700; }
.clicks-label { color: #333; font-weight: 500; margin-left: 2px; }

.action-buttons-list { display: flex; justify-content: flex-end; gap: 10px; }
.action-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #111; background: #080808; color: #444; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
.action-btn:hover { color: #fff; background: #111; transform: translateY(-2px); }
.action-btn.edit:hover { border-color: #3498db; color: #3498db; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2); }
.action-btn.ban:hover { border-color: #e74c3c; color: #e74c3c; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2); }
.action-btn.approve:hover { border-color: #2ecc71; color: #2ecc71; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2); }

.search-box { position: relative; margin-bottom: 25px; max-width: 400px; }
.search-box i { position: absolute; left: 15px; top: 18px; color: #333; pointer-events: none; }
.search-box input { width: 100%; background: #080808; border: 1px solid #111; padding: 15px 15px 15px 45px; color: #fff; border-radius: 15px; font-weight: 600; transition: 0.3s; }
.search-box input:focus { border-color: #bd2727; outline: none; box-shadow: 0 0 20px rgba(189, 39, 39, 0.1); background: #0a0a0a; }

.text-right { text-align: right !important; }
.table-row-hover { transition: 0.2s; }
.table-row-hover:hover { background: rgba(255,255,255,0.01); }

.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; color: #333; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; padding: 20px 15px; border-bottom: 1px solid #111; }
.admin-table td { padding: 18px 15px; border-bottom: 1px solid rgba(255,255,255,0.02); }

.glass { background: rgba(5, 5, 5, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.03); border-radius: 30px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.finance-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
.kpi-trend { font-size: 0.7rem; font-weight: 700; margin-top: 10px; }
.kpi-trend.pos { color: #2ecc71; }
.kpi-subtle { color: #555; font-size: 0.7rem; margin-top: 10px; display: block; }

.glass-gold { background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(0,0,0,0)); border: 1px solid rgba(255, 215, 0, 0.1); }
.glass-gold .kpi-value { color: #ffd700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }

.glass-emerald { background: linear-gradient(135deg, rgba(46, 204, 113, 0.05), rgba(0,0,0,0)); border: 1px solid rgba(46, 204, 113, 0.1); }
.glass-emerald .kpi-value { color: #2ecc71; text-shadow: 0 0 20px rgba(46, 204, 113, 0.3); }

.glass-purple { background: linear-gradient(135deg, rgba(155, 89, 182, 0.05), rgba(0,0,0,0)); border: 1px solid rgba(155, 89, 182, 0.1); }
.glass-purple .kpi-value { color: #9b59b6; text-shadow: 0 0 20px rgba(155, 89, 182, 0.3); }

.glass-dark { background: rgba(10, 10, 10, 0.5); border: 1px solid #111; }

.projection-bar-container { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: 15px; overflow: hidden; }
.projection-bar { height: 100%; background: #9b59b6; box-shadow: 0 0 10px #9b59b6; transition: 1s ease-out; }

.finance-details-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; }
.finance-section h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; color: #eee; }
.table-container-fixed { max-height: 400px; overflow-y: auto; }

.mini th { font-size: 0.6rem !important; padding: 10px !important; }
.mini td { padding: 12px 10px !important; font-size: 0.85rem; }
.text-dim { color: #444; }
.text-emerald { color: #2ecc71; font-weight: 700; }
.font-bold { font-weight: 800; }


.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.glass-heavy { background: rgba(5, 5, 5, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.05); }

.admin-modal { width: 520px; padding: 0; overflow: hidden; box-shadow: 0 30px 100px rgba(0,0,0,0.8); }
.modal-header { padding: 25px 30px; border-bottom: 1px solid rgba(255,255,255,0.03); display: flex; justify-content: space-between; align-items: center; }
.header-content { display: flex; align-items: center; gap: 12px; }
.header-content h3 { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.5px; }
.close-btn { background: none; border: none; color: #444; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
.close-btn:hover { color: #fff; }

.modal-body { padding: 30px; }
.modal-subtitle { font-size: 0.85rem; color: #555; margin-bottom: 25px; }
.modal-subtitle strong { color: #eee; }

.form-grid-modern { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-field-white { display: flex; flex-direction: column; gap: 8px; }
.form-field-white label { font-size: 0.7rem; font-weight: 800; color: #333; text-transform: uppercase; letter-spacing: 1px; }
.form-field-white input, .form-field-white select { background: #080808; border: 1px solid #111; padding: 14px; border-radius: 12px; color: #fff; font-weight: 600; outline: none; transition: 0.3s; }
.form-field-white input:focus, .form-field-white select:focus { border-color: #bd2727; background: #0a0a0a; box-shadow: 0 0 15px rgba(189, 39, 39, 0.1); }

.input-with-icon { position: relative; }
.input-with-icon i { position: absolute; left: 15px; top: 15px; color: #333; font-size: 0.8rem; }
.input-with-icon input { padding-left: 40px !important; width: 100%; box-sizing: border-box; }

.modal-footer { padding: 25px 30px; background: rgba(255,255,255,0.01); display: flex; gap: 15px; justify-content: flex-end; }
.btn-cancel-admin { background: none; border: 1px solid #111; color: #444; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-cancel-admin:hover { border-color: #333; color: #888; }

.btn-save-admin-premium { background: #bd2727; color: #fff; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 20px rgba(189, 39, 39, 0.2); transition: 0.2s; display: flex; align-items: center; gap: 8px; }
.btn-save-admin-premium:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(189, 39, 39, 0.3); background: #d42b2b; }

.slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
