<template>
  <div class="search">
    <v-button
      class="search__button"
      icon="Search"
      :rounded="false"
      @click="handleSearch"
    />
    <input
      class="search__input"
      v-model="modelValue"
      type="text"
      :placeholder="placeholder"
      @keyup="handleKeyup"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang='ts'>
// Modules
import { toRefs } from 'vue';
// Components
import VButton from '@/components/common/VButton.vue';

// Types
interface ISearchInputProps {
  placeholder: string,
}

// Props
const props = withDefaults(
  defineProps<ISearchInputProps>(),
  {
    placeholder: 'Фильтр по содержанию...',
  }
);

const {
  placeholder,
} = toRefs(props);

// Emits
const emits = defineEmits<{
  (e: 'search'): void;
}>();

// Model
const modelValue = defineModel();

const handleInput = (event) => {
  if (!!event.target?.value) return;
  handleSearch();
}

const handleKeyup = (event) => {
  if (event.keyCode !== 13) return;
    handleSearch();
};

const handleSearch = () => {
  emits('search');
}
</script>

<style scoped lang='scss'>
.search {
  display: flex;
  align-items: stretch;
  width: 100%;
  max-width: 500px;
  background-color: white;
  overflow: hidden;
  border-radius: 0.25rem;
  border: 1px solid #c6c9cd;

  &__button {
    height: inherit;
    padding: 0 5px;
    opacity: 0.3;
    transition: all 0.2s linear;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: transparent;
    border: none;
    width: fit-content;
    &:hover {
      opacity: 1;
    }
  }
  &__input {
    border: none;
    border-left: 1px solid #c6c9cd;
    outline: #c6c9cd;
    padding: 5px 10px;
    &::placeholder {
      color: #c6c9cd;
    }
  }
}
</style>