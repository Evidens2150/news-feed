<template>
  <!-- <div 
    :style="`width: ${size}; height: ${size};`"
  > -->
    <component
      :is="iconComponent"
      ref="icon"
      :style="`width: ${size}; height: ${size};`"
    />
  <!-- </div> -->
</template>

<script setup lang="ts">

import { defineAsyncComponent, ref } from 'vue';

// Types
interface IIconProps {
  name?: string;
  size?: number;
  color?: string;
}

// Props
const props = withDefaults(
  defineProps<IIconProps>(),
  {
    name: '',
    color: 'currentColor',
    size: 16,
  }
);

// Data
let icon = ref<HTMLElement | null>(null);

const setIcon = (): Promise<typeof import('*.vue')> => {
  return defineAsyncComponent(async () => {
    return await import(
      `@/components/common/iconComponent/icons/${capitalizeFirstLetter(props.name)}.vue`
    );
  });
};

let iconComponent = setIcon();

// Methods
const capitalizeFirstLetter = (string: string): string => {
  if (string === '') {
    throw new Error('Некорректный ввод: строка пустая');
  }

  // Сделать первую букву заглавной и добавьте остальную часть строки
  const firstLetter = string.charAt(0).toUpperCase();
  const restOfString = string.slice(1);

  return firstLetter + restOfString;
}
</script>