<template>
  <button
    class="v-button"
    :class="{
      'v-button--rounded': rounded,
      'v-button--active': active,
    }"
    :disabled="isButtonDisabled"
    @click="handleClick"
  >
    <slot></slot>
    <v-icon
      v-if="!!icon"
      class="sm-button__icon"
      :name="`${icon}`"
    />
  </button>
</template>

<script setup lang="ts">
// Modules
import { computed, toRefs } from 'vue';
// Components
import VIcon from '@/components/common/iconComponent/VIcon.vue';

// Types
interface IButtonProps {
  icon?: string | null;
  rounded?: boolean;
  disabled?: boolean;
  active?: boolean;
}

// Props
const props = withDefaults(
  defineProps<IButtonProps>(),
  {
    icon: null,
    rounded: true,
    disabled: false,
    active: false,
  }
);

const {
  icon,
  disabled,
  active,
} = toRefs(props);

// Emits
const emits = defineEmits<{
  (e: 'click'): void;
}>();

// Computed
const isButtonDisabled = computed((): boolean => active.value || disabled.value);

// Methods
const handleClick = (): void => {
    emits('click');
  };

</script>

<style scoped lang='scss'>
.v-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background-color: azure;

  width: 100%;

  padding: 7px 8px;

  border: none;
  opacity: 1;
  transition: all 0.3s linear;

  &--rounded {  
    width: fit-content;  
    border-radius: 100px;
  }

  &:not(:disabled) {
    cursor: pointer;
    &:hover {
      background-color: rgb(134, 212, 114);
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &.v-button--active {
      background-color: rgb(134, 212, 114);
      opacity: 1;
      cursor: default;
    }
  }
}
</style>