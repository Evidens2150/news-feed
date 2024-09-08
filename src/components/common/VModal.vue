<template>
  <div
    v-if="modelValue"
    class="modal"
    @click.self="handleCloseModal"
  >
  <div
    class="modal__content"
  >
    <v-button
      icon="Close"
      class="modal__button"
      @click="handleCloseModal"
    />
    <slot></slot>
  </div>
  </div>
</template>

<script setup lang='ts'>
// Components
import VButton from '@/components/common/VButton.vue';

// Model
const modelValue = defineModel<boolean>({default: false});

// Methods
const handleCloseModal = () => {
  modelValue.value = false;
}
</script>

<style scoped lang='scss'>
.modal {  
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(5px);
  z-index: 1;
}

.modal__content {
  display: flex;
  background-color: white;
  position: relative;
  width: 90vw;
  max-height: 90vh;
  padding: 10px;
  box-shadow: -4px 0px 4px rgba(0, 0, 0, 0.5), 4px 0px 4px rgba(0, 0, 0, 0.5);
}

.modal__button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  box-shadow: -4px 0px 4px rgba(0, 0, 0, 0.5), 4px 0px 4px rgba(0, 0, 0, 0.5);
}
</style>