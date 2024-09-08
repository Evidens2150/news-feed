<template>
  <div 
    class="image-gallery"
  >   
    <v-slider 
      v-model="chosenImageIndex"
      :slides="images"
      class="image-gallery__slider"
    >
      <div
        class="image-gallery__slide"
        @click.stop="handleOpenModal"
      >
        <img
          :src="chosenImage?.src"
          :alt="chosenImage?.alt"
          class="image-gallery__image"          
        />
      </div>
    </v-slider>
    <v-modal v-model="isModalOpen">
      <v-slider 
        v-model="chosenImageIndex"
        :slides="images"
        is-swipe
      >
        <div class="image-gallery__modal-slide">
          <img
            :src="chosenImage?.src"
            :alt="chosenImage?.alt"
            class="image-gallery__image"
          />
          <span
            v-html="chosenImage?.alt"
            class="image-gallery__description"
          >
          </span>
        </div>
      </v-slider>
    </v-modal>
  </div>
</template>

<script setup lang='ts'>
// Modules
import { toRefs } from 'vue';
// Components
import VModal from '@/components/common/VModal.vue'
import VSlider from '@/components/common/VSlider.vue';
// Types
import type { IImageModalProps, Image } from '@/types/news'

// Props
const props = withDefaults(
  defineProps<IImageModalProps>(),
  {   
    images: () => [],
  }
);
const {
  images,
} = toRefs(props);

// Emits
const emits = defineEmits<{
  (e: 'close'): void; 
}>();

// Data
const chosenImageIndex = ref<number>(0);
const isModalOpen = ref<boolean>(false);


// Computed
const chosenImage = computed(():Image | null => images.value?.[chosenImageIndex.value] || null);

// Methods
const handleOpenModal = () => {
  isModalOpen.value = true;
};
</script>

<style scoped lang='scss'>
.image-gallery__slider {
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
}

.image-gallery__slide {
  cursor: pointer;
}

.image-gallery__modal-slide {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
}

.image-gallery__image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}

.image-gallery__description {
  width: 100%;
  text-align: center;
}
</style>