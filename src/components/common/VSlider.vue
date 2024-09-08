<template>  
  <div
    class="v-slider"
    @mousedown="startDragging"
    @mousemove="onMouseMove"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
    @dragstart.prevent
  >
    <slot></slot>
    <template v-if="isNavigation">
      <v-button
        icon="Arrow"
        class="v-slider__button v-slider__button--prev"
        :disabled="isPrevButtonDisabled"
        @click="handleClickPrev"
      />
      <v-button
        icon="Arrow"
        class="v-slider__button v-slider__button--next"
        :disabled="isNextButtonDisabled"
        @click="handleClickNext"
      />
    </template>
  </div>
</template>

<script setup lang='ts'>
// Components
import VButton from '@/components/common/VButton.vue';

// Types
interface SliderProps {
  slides: any[];
  isSwipe: boolean;
}

// Props
const props = withDefaults(
  defineProps<SliderProps>(),
  {
    slides: () => [],
    isSwipe: false,
  }
);

const {
  slides,
  isSwipe,
} = toRefs(props);

// Model
const modelValue = defineModel<number>({required: true});

// Data
const isDragging = ref(false);
const startX = ref(0);
const offsetX = ref(0);

// Computed
const isNavigation = computed((): boolean => slides.value?.length > 1);

const isPrevButtonDisabled = computed((): boolean => modelValue.value === 0 );

const isNextButtonDisabled = computed((): boolean => modelValue.value === slides.value.length - 1);

// Methods
const handleClickPrev = () => {
  if (isPrevButtonDisabled.value) return;
  modelValue.value -= 1;
};

const handleClickNext = () => {
  if (isNextButtonDisabled.value) return;
  modelValue.value += 1;
};

const startDragging = (event: MouseEvent) => {
  if (!isSwipe.value) return;
  isDragging.value = true;
  startX.value = event.clientX;
};

const onMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return;
  offsetX.value = event.clientX - startX.value;

  if (offsetX.value < -50) {
    handleClickNext();
    stopDragging();
  }

  if (offsetX.value > 50) {
    handleClickPrev();
    stopDragging();
  }
};

const stopDragging = () => {
  if (!isSwipe.value) return;
  isDragging.value = false;
  offsetX.value = 0;
};
</script>

<style scoped lang='scss'>
.v-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.v-slider__button {
  position: absolute;
  box-shadow: -4px 0px 4px rgba(0, 0, 0, 0.5), 4px 0px 4px rgba(0, 0, 0, 0.5);

  &--prev {
    top: 50%;
    left: 10px;
    transform: translateY(-50%) rotate(90deg);
  }

  &--next {
    top: 50%;
    right: 10px;
    transform: translateY(-50%) rotate(-90deg);
  }
}
</style>