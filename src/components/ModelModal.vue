<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <!-- Close Button -->
        <button class="close-btn" @click="close">
          <i class="fas fa-times"></i>
        </button>

        <div class="modal-content" v-if="model">
          <div class="main-layout">
            <!-- Gallery Left -->
            <div class="gallery-column">
              <div class="main-image-container">
                <img :src="activeImage" :alt="model.name" class="main-image">
              </div>
              
              <div class="thumbnail-slider-wrapper">
                <button class="nav-arrow left" @click="scrollThumbnails('left')">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <div class="thumbnail-slider" ref="thumbSlider">
                  <div 
                    v-for="(img, index) in model.images" 
                    :key="index" 
                    class="thumb-container"
                    :class="{ active: activeImage === img }"
                    @click="activeImage = img"
                  >
                    <img :src="img" alt="Thumbnail" class="thumb-img">
                  </div>
                </div>
                <button class="nav-arrow right" @click="scrollThumbnails('right')">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <!-- Profile Card Right -->
            <div class="profile-card-right">
              <div class="model-text">
                <h1 class="model-name">{{ model.name }}</h1>
                <p class="model-bio">{{ model.bio }}</p>
              </div>
              <div class="contact-card">
                <a v-if="model.whatsapp" @click="trackLinkClick('whatsapp')" :href="model.whatsapp.startsWith('http') ? model.whatsapp : 'https://' + model.whatsapp" target="_blank" class="contact-btn whatsapp" style="text-decoration: none;">
                  <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
                <a v-if="model.telegram" @click="trackLinkClick('telegram')" :href="model.telegram.startsWith('http') ? model.telegram : 'https://' + model.telegram" target="_blank" class="contact-btn telegram" style="text-decoration: none;">
                  <i class="fab fa-telegram-plane"></i> Telegram
                </a>
                <a v-if="model.instagram" @click="trackLinkClick('instagram')" :href="model.instagram.startsWith('http') ? model.instagram : 'https://' + model.instagram" target="_blank" class="contact-btn instagram" style="text-decoration: none;">
                  <i class="fab fa-instagram"></i> Instagram
                </a>
                <a v-if="model.externalLink" @click="trackLinkClick('external')" :href="model.externalLink.startsWith('http') ? model.externalLink : 'https://' + model.externalLink" target="_blank" class="contact-btn external" style="text-decoration: none;">
                  <i class="fas fa-link"></i> Link Externo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import api from '../services/api';

export default {
  name: "ModelModal",
  props: {
    isOpen: Boolean,
    model: Object
  },
  data() {
    return {
      activeImage: ""
    };
  },
  watch: {
    model: {
      immediate: true,
      handler(newModel) {
        if (newModel && newModel.images && newModel.images.length > 0) {
          this.activeImage = newModel.images[0];
        }
      }
    },
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    scrollThumbnails(direction) {
      const slider = this.$refs.thumbSlider;
      const scrollAmount = 150;
      if (direction === 'left') {
        slider.scrollLeft -= scrollAmount;
      } else {
        slider.scrollLeft += scrollAmount;
      }
    },
    trackLinkClick(network) {
      if (this.model && this.model.id) {
        api.post('/analytics/track', {
          modelId: this.model.id,
          eventType: 'link_click',
          linkType: network
        }).catch(() => {});
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.modal-container {
  width: 90%;
  max-width: 1100px;
  max-height: 85vh;
  background-color: #0c0808;
  color: #fff;
  overflow: hidden;
  position: relative;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #ff0000;
  transform: rotate(90deg);
}

.modal-content {
  width: 100%;
  margin: 0 auto;
}

.model-text {
  margin-bottom: 25px;
}

.model-name {
  font-size: 2.2rem;
  margin: 0 0 10px;
  font-weight: 800;
  letter-spacing: -1px;
}

.model-bio {
  color: #ccc;
  line-height: 1.5;
  font-size: 1rem;
}

.main-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 40px;
  align-items: start;
}

.main-image-container {
  width: 100%;
  height: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #000;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnail-slider-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thumbnail-slider {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  flex: 1;
  padding: 4px;
}

.thumbnail-slider::-webkit-scrollbar {
  display: none;
}

.thumb-container {
  flex: 0 0 100px;
  height: 75px;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.thumb-container.active {
  border-color: #ff0000;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-arrow {
  background-color: rgba(255, 255, 255, 0.05);
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-arrow:hover {
  background-color: #ff0000;
}

.contact-card {
  background-color: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.whatsapp { background-color: #25D366; }
.telegram { background-color: #0088CC; }
.instagram { 
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
}
.external { background-color: #fff; color: #000; }

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modal-enter 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

@keyframes modal-enter {
  from { transform: translateY(30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

@media (max-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .modal-container {
    overflow-y: auto;
    max-height: 95vh;
  }
}
</style>
