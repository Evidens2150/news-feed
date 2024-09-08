<template>
  <div class="news-list-item">
    <nuxt-link
      :href="link"
      class="news-list-item__title"
    >
      {{ title }}
    </nuxt-link>
    <p class="news-list-item__description">
      {{ description }}
    </p>
    <p class="news-list-item__bottom">
      {{ date }}
    </p>
  </div>
</template>

<script setup lang='ts'>
// Types
import type { INewsItem } from '@/types/news'

// Props
const props = withDefaults(
  defineProps<INewsItem>(),
  {
    link: '',
    title: '',
    description: '',
    date: '',
  }
);

const {
  link,
  title,
  description,
  date,
} = toRefs(props);

</script>

<style scoped lang='scss'>
.news-list-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>