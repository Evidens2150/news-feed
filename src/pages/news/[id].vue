<template>  
  <v-loader v-if="isLoading"/>
  <div 
    v-else
    class="news-item container"
  >
    <h1 class="news-item__title heading">
      {{ title }}
    </h1>
    <div class="news-item__subtitle-block">
      <p
        v-for="(subtitle, subtitleIdx) in newsSubtitleList"
        :key="subtitleIdx"
        class="news-item__subtitle-row"
      >
        <span class="news-item__subtitle-label">
          {{ subtitle.label }}     
        </span>
        <span class="news-item__subtitle-value">
          {{ subtitle.value }}      
        </span>
      </p>
    </div>
    <div
      v-if="!!overview"
      v-html="overview"
      class="news-item__overview"
    >
    </div>
    <image-gallery
      v-if="!!images.length"
      :images="images"
    />
    <div    
      v-if="!!content"
      v-html="content"
      class="news-item__content"
    >
    </div>
    <div class="news-item__bottom-block">
      <v-button
        icon="Arrow"
        class="news-item__button"
        @click="handleClickBack"
      >
        Назад к ленте
      </v-button>
      <a
        v-if="!!linkToOriginNews"
        :href="linkToOriginNews"
        target="_blank"
        rel="noopener noreferrer"        
      >
        Новость на сайте РБК
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// Modules
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
// Composables
import { useRoute, useRouter } from 'vue-router';
// Components
import VLoader from '@/components/common/VLoader.vue';
import ImageGallery from '@/components/ImageGallery.vue';
import VButton from '@/components/common/VButton.vue';

// Types
import type { SubtitleItem, Image } from '@/types/news';


// Data
const route = useRoute();
const router = useRouter();
const isLoading = ref<boolean>(true);
const title = ref<string>('');
const overview = ref<string>('');
const content = ref<string>('');
const datetime = ref<string>('');
const autor = ref<string>('');
const images = ref<Image[]>([]);

// Computed
const newsId = computed((): string => route.params.id.toString().split('-').join('/'));

const linkToOriginNews = computed((): string => `https://www.rbc.ru/${newsId.value}`);

const newsSubtitleList = computed((): SubtitleItem[] => {
  const list = [];

  if (!!autor.value) {    
    list.push({
      label: 'Автор:',
      value: autor.value,
    });
  }

  if (!!datetime.value) {
    list.push({
      label: 'Опубликовано:',
      value: new Date(datetime.value).toLocaleString(),
    });
  }

  return list;
})

// Hooks
onMounted(() => {
  fetchAndParseCurrentNews();
});

// Methods
const handleClickBack = () => {
  router.push('/');
};

const fetchAndParseCurrentNews = async () => {
  try {
    const { data } = await axios.get(`/api/news?${newsId.value}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    title.value = doc.querySelector('h1')?.innerText || '';
    datetime.value = doc.querySelector('time')?.getAttribute('datetime') || '';
    autor.value = doc.querySelector('span.article__authors__author__name')?.innerHTML || '';
    overview.value = doc.querySelector('div.article__text__overview')?.innerHTML || '';

    const textElements = doc.querySelectorAll('div.article__text>p');
    const textList: string[] = [];

    textElements?.forEach(paragraph => {
      textList.push(paragraph.innerHTML)
    })

    content.value = textList.join('<br>')

    getImages(doc);
  } catch (error) {
    console.error('Ошибка при получении новости:', error);
  } finally {
    isLoading.value = false;
  }
};

const getImages = (doc: Document) => {
  const mainImg: HTMLImageElement | null = doc.querySelector('.article__main-image img') as HTMLImageElement;
  if (!!mainImg) {
    images.value.push({
      src: mainImg.src,
      alt: mainImg.alt,
    })
  }

  const galerySrc: NodeListOf<Element> = doc.querySelectorAll('.gallery_vertical img'); 
  const galeryImages: HTMLImageElement[] = Array.from(galerySrc).map((img) => img as HTMLImageElement);
  galeryImages.forEach(img => {
    images.value.push({
      src: img.src,
      alt: img.alt,
    })
  })
}
</script>

<style scoped lang='scss'>
.news-item {
  padding-bottom: 50px;
}

.news-item__subtitle-block,
.news-item__overview,
.news-item__content {
  margin: 20px 0;
}

.news-item__subtitle-row {
  color: gray;
}

.news-item__subtitle-value {
  padding-left: 5px;
}

.news-item__bottom-block {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.news-item__button:deep(.sm-button__icon) {  
  transform: rotate(90deg);
}
</style>