<template>
  <div class="v-pagination">
    <v-button
      :disabled="isPrevButtonDisabled"
      :rounded="false"
      icon="Arrow"
      class="v-pagination__button v-pagination__button--prev"
      @click="handleChangePage(1)"
    >
      <v-icon
        class="pagination-button__icon"
        name="Arrow"
      />
    </v-button>
    <v-button
      :disabled="isPrevButtonDisabled"
      :rounded="false"
      icon="Arrow"
      class="v-pagination__button v-pagination__button--prev"
      @click="goToPrevPage"
    />
    <v-button
      v-for="page in pages[0]"
      :key="page"
      class="v-pagination__button"
      :active="checkPageIsActive(page)"
      @click="handleChangePage(page)"
    >
      <span>{{ page }}</span>
    </v-button>
    <div
      v-if="pages[1].length"
      class="ml-[-1px] text-black flex h-8 w-8 items-center justify-center"
    >
      <span>...</span>
    </div>
    <v-button
      v-for="page in pages[1]"
      :key="page"
      class="v-pagination__button"
      :active="checkPageIsActive(page)"
      @click="handleChangePage(page)"
    >
      <span>{{ page }}</span>
    </v-button>
    <v-button
      :disabled="isNextButtonDisabled"
      :rounded="false"
      icon="Arrow"
      class="v-pagination__button v-pagination__button--next"
      @click="goToNextPage"
    />
    <v-button
      :disabled="isNextButtonDisabled"
      :rounded="false"
      icon="Arrow"
      class="v-pagination__button v-pagination__button--next"
      @click="goToLastPage"
    >
      <v-icon
        class="pagination-button__icon"
        name="Arrow"
      />
    </v-button>
  </div>
</template>

<script setup lang='ts'>
// Modules
import { computed, toRefs } from "vue";
// Components
import VButton from '@/components/common/VButton.vue';
import VIcon from '@/components/common/iconComponent/VIcon.vue';

// Types
interface IPaginationProps {
  total: number;
  pageSize: number;
};

type PagesList = number[];

// Props
const props = defineProps<IPaginationProps>();

const {
  total,
  pageSize,
} = toRefs(props);

// Model
const modelValue = defineModel<number>({required: true});

const maxPage = computed((): number => {
  if (total.value <= 0) {
    return 1;
  }
  let maxPage = Math.floor(total.value / pageSize.value);
  let mod = total.value % pageSize.value;
  if (mod > 0) {
    maxPage++;
  }
  return maxPage;
});

// Computed
const isPrevButtonDisabled = computed((): boolean => modelValue.value <= 1);

const isNextButtonDisabled = computed((): boolean => modelValue.value >= maxPage.value);

const pages = computed((): PagesList[] => {
  const pages = [[], []];
  const firstPage = modelValue.value % 2 === 0 ? modelValue.value - 1 : modelValue.value;
  if (maxPage.value < 4) {
    pages[0] = maxPage.value === 1 ? [1] : [1, 2];
    pages[1] = maxPage.value <= 2 ? [] : [3];
  } else if (maxPage.value - firstPage >= pageSize.value) {
    pages[0] = [firstPage, firstPage + 1];
    pages[1] = [firstPage + pageSize.value - 1, firstPage + pageSize.value];
  } else {
    pages[0] =
      firstPage + 3 >= maxPage.value
        ? [maxPage.value - 3, maxPage.value - 2]
        : [firstPage, firstPage + 1];
    pages[1] = [maxPage.value - 1, maxPage.value];
  }

  return pages;
});

// Methods
const checkPageIsActive = (page: number) => {
  if (!page) return;
  return modelValue.value === page;
};

const handleChangePage = (newValue: number) => {
  if (!newValue) return;
  modelValue.value = newValue;
};

const goToLastPage = () => {
  modelValue.value = maxPage.value;
};

const goToNextPage = () => {
  if (modelValue.value + 1 <= maxPage.value) {
    modelValue.value += 1;
  }
};

const goToPrevPage = () => {
  if (modelValue.value - 1 >= 1) {
    modelValue.value -= 1;
  }
};
</script>

<style scoped lang='scss'>
.v-pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

.v-pagination__button {
  width: fit-content;
  border: 1px solid gray;
  &--prev {
    border-radius: 10px;
    .pagination-button__icon,
    &:deep(.sm-button__icon) {
      transform: rotate(90deg);
    }
  }

  &--next {
    border-radius: 10px;
    .pagination-button__icon,
    &:deep(.sm-button__icon) {
      transform: rotate(-90deg);
    }    
  }
}
</style>
