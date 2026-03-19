<template>
  <div class="home-container">
    <HeaderComponent 
      v-model:searchQuery="searchQuery" 
      :modelCount="models.length" 
      :transparentBg="true"
    />
    
    <main class="content">
      <GalleryComponent :models="paginatedModels" @show-profile="openModel" />
      
      <!-- Model Profile Modal -->
      <ModelModal 
        :isOpen="isModalOpen" 
        :model="selectedModel" 
        @close="closeModel" 
      />
      
      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >
          <i class="fas fa-chevron-left"></i> Anterior
        </button>
        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >
          Próxima <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import GalleryComponent from "../components/GalleryComponent.vue";
import ModelModal from "../components/ModelModal.vue";
import api from "../services/api";

export default {
  name: "HomeView",
  components: {
    HeaderComponent,
    GalleryComponent,
    ModelModal
  },
  data() {
    return {
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 12, // 2 rows of 6 columns
      models: [],
      selectedModel: null,
      isModalOpen: false
    };
  },
  computed: {
    sortedModels() {
      const now = new Date().getTime();
      return [...this.models].sort((a, b) => {
        // 1. Prioridade Máxima: Boost (Last In, First Out)
        const boostA = (a.boostedAt && new Date(a.boostedAt).getTime() <= now) ? new Date(a.boostedAt).getTime() : 0;
        const boostB = (b.boostedAt && new Date(b.boostedAt).getTime() <= now) ? new Date(b.boostedAt).getTime() : 0;
        
        if (boostB !== boostA) return boostB - boostA;

        // 2. Popularidade: Cliques
        const clicksA = a.clicks || 0;
        const clicksB = b.clicks || 0;
        if (clicksB !== clicksA) return clicksB - clicksA;

        // 3. Recência: ID
        return b.id - a.id;
      });
    },
    filteredModels() {
      let result = this.sortedModels;

      // Search Filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(m => 
          m.name.toLowerCase().includes(query) || 
          m.role.toLowerCase().includes(query)
        );
      }

      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredModels.length / this.itemsPerPage);
    },
    paginatedModels() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredModels.slice(start, end).map((model, index) => {
        const globalIndex = start + index;
        return {
          ...model,
          isPremium: globalIndex < 3 // Moldura Dourada para o TOP 3 GLOBAL
        };
      });
    }
  },
  watch: {
    searchQuery() {
      // Reset to first page on search
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchModels();
  },
  methods: {
    async fetchModels() {
      try {
        const response = await api.get('/public/models');
        
        // Garantir que a resposta seja um array
        if (!Array.isArray(response.data)) {
          console.error("Erro: A API de modelos não retornou uma lista. Conteúdo recebido:", response.data);
          this.models = [];
          return;
        }

        this.models = response.data.map(user => {
          let photos = [];
          if (user.galleryPhotos) {
            try {
              photos = typeof user.galleryPhotos === 'string' 
                ? JSON.parse(user.galleryPhotos) 
                : user.galleryPhotos;
            } catch (e) {
              console.error("Erro ao converter galeria no catálogo:", e);
            }
          }
          
          let coverSrc = user.coverPhotoUrl;
          let coverCrop = null;
          if (coverSrc) {
            try {
              const parsed = JSON.parse(coverSrc);
              if (parsed && parsed.src) coverSrc = parsed.src;
              if (parsed && parsed.crop) coverCrop = parsed.crop;
            } catch(e) {
              console.debug("Legado string coverPhoto detectado.");
            }
          }
          
          let mainImage = coverSrc;
          if (!mainImage && photos.length > 0) {
            mainImage = photos[0].src || photos[0];
          } else if (!mainImage) {
            mainImage = 'https://via.placeholder.com/800x600?text=Sem+Foto';
          }

          const allImages = [mainImage, ...photos.map(p => p.src || p)];

          let calculatedAge = null;
          if (user.birthDate) {
            let birthStr = user.birthDate;
            if (birthStr.includes('/')) {
              const parts = birthStr.split('/');
              if (parts.length === 3) {
                birthStr = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`;
              }
            }
            const birth = new Date(birthStr);
            if (!isNaN(birth.getTime())) {
              const today = new Date();
              let age = today.getFullYear() - birth.getFullYear();
              const m = today.getMonth() - birth.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
              }
              calculatedAge = age;
            }
          }

          return {
            id: user.id,
            name: user.name,
            role: user.bio ? "Verificado" : "Nova",
            age: calculatedAge,
            rating: 5.0,
            isPremium: false,
            dateJoined: user.createdAt,
            bio: user.bio || "Nenhuma biografia disponível.",
            whatsapp: user.whatsapp,
            telegram: user.telegram,
            instagram: user.instagram,
            externalLink: user.externalLink,
            images: allImages,
            image: mainImage,
            coverCrop: coverCrop,
            clicks: user.clicks || 0,
            boostedAt: user.boostedAt
          };
        });
      } catch (error) {
        console.error("Erro ao buscar catálogo de usuários:", error);
      }
    },
    openModel(id) {
      this.selectedModel = this.models.find(m => m.id === id);
      this.isModalOpen = true;
      api.post('/analytics/track', { modelId: id, eventType: 'profile_view' }).catch(() => {});
    },
    closeModel() {
      this.isModalOpen = false;
      // Optionally reset id after animation
      setTimeout(() => {
        if (!this.isModalOpen) this.selectedModel = null;
      }, 400);
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  color: #fff;
  padding: 0 20px;
}

.content {
  padding-bottom: 60px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
  padding: 20px 0;
}

.page-btn {
  padding: 10px 20px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-weight: 600;
}

.page-btn:hover:not(:disabled) {
  background-color: #222;
  border-color: #ff0000;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.95rem;
  color: #999;
}
</style>



