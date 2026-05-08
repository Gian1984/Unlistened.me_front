<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ArrowRightIcon, StarIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import PageHero from '@/components/PageHero.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { podcastService } from '@/services/podcastService.js'
import { stripHtmlTags } from '@/utils/text.js'

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()
const { redirectToLogin } = useAuthIntent()
messageStore.initializeMessage()

const feeds = ref([])
const loading = ref(true)
const error = ref(null)
const categoryName = ref('')
const show = ref(false)

const categoryId = computed(() => parseCategorySlug(String(route.params.slug || '')))

const displayName = computed(() => categoryName.value || titleCaseFromSlug(String(route.params.slug || '')))

function titleCaseFromSlug(slug) {
  const tail = slug.includes('-') ? slug.split('-').slice(1).join(' ') : slug
  if (!tail) return ''
  return tail.replace(/\b\w/g, (c) => c.toUpperCase())
}

const seoConfig = computed(() => {
  const fallbackCanonical = `https://www.unlistened.me/categories/${route.params.slug}`
  if (error.value) {
    return {
      title: 'Category Not Found',
      description: 'The podcast category you are looking for could not be found.',
      canonical: fallbackCanonical,
      robots: 'noindex,nofollow',
    }
  }
  const name = displayName.value || 'Podcast category'
  return {
    title: `${name} Podcasts`,
    description: `Browse trending ${name} podcasts on Unlistened.me. Discover new shows in this category and start listening for free.`,
    canonical: fallbackCanonical,
    robots: 'index,follow',
  }
})

useSeoMeta({
  title: () => seoConfig.value.title,
  description: () => seoConfig.value.description,
  ogTitle: () => seoConfig.value.title,
  ogDescription: () => seoConfig.value.description,
  twitterTitle: () => seoConfig.value.title,
  twitterDescription: () => seoConfig.value.description,
  robots: () => seoConfig.value.robots,
})

useHead({
  link: [{ rel: 'canonical', href: () => seoConfig.value.canonical }],
})

async function fetchFeedsForCategory() {
  if (!categoryId.value) {
    error.value = 'Invalid category'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  try {
    const response = await podcastService.searchByCategory(categoryId.value)
    feeds.value = response.data?.feeds || []
    if (!feeds.value.length) {
      error.value = 'No podcasts found in this category.'
    }
  } catch {
    error.value = 'Could not load podcasts for this category.'
  } finally {
    loading.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  if (!authStore.isAuthenticated) {
    redirectToLogin({
      message: 'Sign in to save this podcast — we\'ll add it after you log in.',
      intent: buildIntent('fav', feedId, feedTitle),
    })
    return
  }
  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 3000)
  } catch (err) {
    if (err.response?.status !== 401) {
      messageStore.setMessage('There was an error while saving the favorite. Please try again.')
    }
  }
}

onMounted(() => fetchFeedsForCategory())
watch(() => route.params.slug, () => fetchFeedsForCategory())
</script>

<template>
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 z-10 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-2 border-green-500 bg-gray-800 shadow-lg ring-1 ring-gray-700">
          <div class="p-4">
            <div class="flex items-start">
              <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-green-400" aria-hidden="true" />
              <p class="ml-3 text-sm font-medium text-white">Added to favourites!</p>
              <button type="button" @click="show = false" class="ml-auto inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300">
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <PageHero
        :eyebrow="'Category'"
        :title="displayName ? `${displayName} podcasts` : 'Category podcasts'"
        :description="`Discover ${displayName || 'category'} shows trending on Unlistened.me. Save your favourites and start listening for free.`"
        :breadcrumbs="[
          { label: 'Home', to: '/' },
          { label: 'Categories', to: '/categories' },
          { label: displayName },
        ]"
      />

      <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SkeletonCard v-for="n in 9" :key="n" />
      </div>

      <EmptyState
        v-else-if="error"
        :title="error"
        description="Try browsing the full category list to find something you like."
        action-text="Back to categories"
        action-link="/categories"
      />

      <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="feed in feeds"
          :key="feed.id"
          class="group overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-all hover:border-indigo-500 hover:shadow-lg"
        >
          <NuxtLink :to="'/feed/' + feed.id" class="block">
            <div class="flex items-center gap-3 p-4">
              <div class="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-700">
                <img
                  :src="feed.image || '/images/image_not_available_500.webp'"
                  :alt="feed.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                  {{ feed.title }}
                </h3>
                <p class="mt-0.5 truncate text-xs text-gray-400">{{ feed.author }}</p>
                <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                  {{ stripHtmlTags(feed.description) }}
                </p>
              </div>
            </div>
          </NuxtLink>
          <div class="flex items-center gap-2 px-4 pb-3">
            <button
              @click.prevent="addFavourite(feed.id, feed.title)"
              class="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-pink-400"
              title="Add to favourites"
            >
              <StarIcon class="h-4 w-4" />
              <span class="hidden sm:inline">Save</span>
            </button>
            <NuxtLink
              :to="'/feed/' + feed.id"
              class="ml-auto flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-indigo-400"
            >
              <span>Episodes</span>
              <ArrowRightIcon class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
