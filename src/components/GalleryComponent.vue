<template>
  <div class="gallery-container">
    <div class="gallery-grid">
      <div 
        v-for="model in filteredModels" 
        :key="model.id" 
        class="profile-card" 
        :class="{ 'premium': model.isPremium }"
        @click="$emit('show-profile', model.id)"
      >
        <div class="card-image-wrapper">
          <img 
            :src="model.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=400&h=550&q=80'" 
            :alt="model.name" 
            class="profile-image" 
            :style="getCropStyle(model.coverCrop)"
            loading="lazy"
          >
          <div class="image-overlay"></div>
          <div v-if="model.isPremium" class="premium-badge">
            <i class="fas fa-crown"></i>
          </div>
        </div>
        <div class="card-info">
          <div class="info-header">
            <h3 class="name">{{ model.name }}</h3>
            <div class="rating">
              <i class="fas fa-star"></i>
              <span>{{ model.rating }}</span>
            </div>
          </div>
          <div class="details">
            <span class="role">{{ model.role }}</span>
            <span class="age" v-if="model.age">{{ model.age }} anos</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GalleryComponent",
  props: {
    models: {
      type: Array,
      required: true
    }
  },
  computed: {
    filteredModels() {
      // Logic could be added here if needed, but for now we display what's passed
      return this.models;
    }
  },
  methods: {
    getCropStyle(crop) {
      if (!crop) return { width: '100%', height: '100%', objectFit: 'cover' };
      const scaleX = 100 / crop.width;
      const scaleY = 100 / crop.height;
      return {
        width: (scaleX * 100) + '%', height: (scaleY * 100) + '%',
        top: -(crop.top * scaleY) + '%', left: -(crop.left * scaleX) + '%',
        position: 'absolute', maxWidth: 'none', maxHeight: 'none'
      };
    }
  }
}
</script>

<style scoped>
.gallery-container {
  padding: 20px 0;
  background-color: transparent;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  max-width: 1600px;
  margin: 0 auto;
}

.profile-card {
  background-color: #121212;
  border: 2px solid #ff0000;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
  position: relative;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  height: 400px;
}

.profile-card.premium {
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.profile-card:hover {
  transform: scale(1.03);
  box-shadow: -10px -10px 30px rgba(255, 0, 0, 0.5);
}

.profile-card.premium:hover {
  box-shadow: -10px -10px 30px rgba(255, 215, 0, 0.4);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.premium-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 215, 0, 0.75);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  z-index: 2;
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 16px;
  text-align: left;
  color: #fff;
  background-color: rgba(20, 20, 20, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 5;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffd700;
  font-size: 1.05rem;
  font-weight: 600;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #ccc;
  font-size: 1rem;
}

.separator {
  display: none;
}

@media (max-width: 1600px) {
  .gallery-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 30px;
  }
}

@media (max-width: 1200px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

@media (max-width: 800px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .profile-card {
    max-width: 100%;
    margin: 0 auto;
  }

  .card-info {
    padding: 25px 20px;
  }

  .name {
    font-size: 1.4rem;
  }

  .rating {
    font-size: 1.1rem;
  }

  .details {
    font-size: 1.05rem;
    gap: 4px;
  }
}
</style>



