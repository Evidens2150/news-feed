<template>
  <v-loader v-if="isLoading"/>
  <div 
    v-else
    class="news container"
  >
    <h1 class="news__title heading">Новости РБК</h1>
      <v-button
        class="news__button"
        :rounded="false"
        @click="handleUpdateNews"
      >
        Обновить ленту новостей
      </v-button>
      <search-input
        v-model="filterInputValue"
        class="news__filter"
        @search="handleSearchByFilter"
      />
    <p class="news__empty" v-if="!news.length">Новостей нет</p>
    <template v-else>
      <p class="news__empty" v-if="!visibleNews.length">Нет новостей, соответствующих фильтру</p>
      <template v-else>
        <div class="news__list">
          <news-list-item
            v-for="(news, index) in visibleNews"
            :key="index"
            :link="news.link"
            :title="news.title"
            :description="news.description"
            :date="news.date"
            class="news__list-item"
          />
        </div>
        <div class="news__pagination-wrapper">
          <div class="news__pagination">
            <v-pagination
              v-model="activePage"
              :page-size="itemsPerPage"
              :total="total"          
            />
          </div>
        </div>
      </template> 
    </template>
  </div>
</template>

<script setup lang="ts">
// Modules
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
// Components
import VLoader from '@/components/common/VLoader.vue';
import SearchInput from '@/components/SearchInput.vue';
import VButton from '@/components/common/VButton.vue';
import NewsListItem from '@/components/NewsListItem.vue';
import VPagination from '@/components/common/VPagination.vue';

// Types
import type { INewsItem } from '@/types/news'

// Data
const news = ref<INewsItem[]>([]);
const isLoading = ref<boolean>(true);
const filter = ref<string>('');
const filterInputValue = ref<string>('');
const activePage = ref<number>(1);
const itemsPerPage = ref<number>(5);

// Hooks
onMounted(() => {
  fetchAndParseRss();
});

// Computed
const filteredNews = computed((): INewsItem[] => {
  const filterValue = filter.value.toLowerCase();
  return news.value.filter(news => {
    return news.title.toLowerCase().includes(filterValue) 
    || news.description.toLowerCase().includes(filterValue);
  })
});

const total = computed((): number => filteredNews.value.length)

const startVisibleNewsIndex = computed((): number => (activePage.value - 1) * itemsPerPage.value);

const visibleNews = computed((): INewsItem[] => {  
  const start = startVisibleNewsIndex.value;
  const end = start + itemsPerPage.value;
  return filteredNews.value.slice(start, end);
});

// Methods
const handleSearchByFilter = () => {
  activePage.value = 1;
  filter.value = filterInputValue.value;
};

const handleUpdateNews = () => {
  isLoading.value = true;
  filterInputValue.value = '';
  handleSearchByFilter();
  fetchAndParseRss();
};

const fetchAndParseRss = async () => {
  try {
    const { data } = await axios.get('/api/news');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");

    const items = xmlDoc.getElementsByTagName("item");
    const newsItems: INewsItem[] = [];

    Array.from(items).forEach(item => {
      const title = item.getElementsByTagName("title")[0].textContent;
      const linkOrigin = item.getElementsByTagName("link")[0].textContent;
      const link = getNewsLink(linkOrigin);
      const description = item.getElementsByTagName("description")[0].textContent;
      const pubDateOrigin = item.getElementsByTagName("pubDate")?.[0]?.textContent;
      const date = !pubDateOrigin ? '' : new Date(pubDateOrigin).toLocaleString();

      newsItems.push({
        title,
        link,
        description,
        date
      });
    });

    news.value = newsItems;
  } catch (error) {
    console.error("Ошибка при загрузке или парсинге RSS:", error);
  } finally {
    isLoading.value = false;
  }
};

const getNewsLink = (originUrl?: string | null) => {
  if (!originUrl) return '/'
  const urlParts = originUrl.replace('https://www.rbc.ru/', '').split('/');
  const id = urlParts.join('-');
  return `/news/${id}`
};
</script>

<style scoped lang='scss'>
.news {
  position: relative;
}

.news__empty {
  margin: 20px 40px;
  text-align: center;
}

.news__button {
  margin: 20px auto;
  width: fit-content;
}

.news__filter {
  margin: 20px auto;
}

.news__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 80px;
}

.news__list-item {
  padding-bottom: 15px;

  &:not(:last-child) {
    border-bottom: 1px solid gray;
  }
}

.news__pagination-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.news__pagination {  
  max-width: 1240px;
  margin: 0 auto;
  width: 100%;
  padding: 10px 10px 20px;
  display: flex;
  justify-content: center;
  background-color: #f1f5f9;
  box-shadow: 0px -1px 1px rgba(0, 0, 0, 0.5);
}
</style>