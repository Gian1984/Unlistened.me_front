<script setup>
import EmptyState from '~/src/components/EmptyState.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { podcastService } from '~/src/services/podcastService.js'
import { stripHtmlTags } from '~/src/utils/text.js'
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})

const playerStore = usePlayerStore()
const route = useRoute()
const router = useRouter()

const episode = ref(null)
const error = ref(null)
const loading = ref(true)

const seoConfig = computed(() => {
  const fallbackCanonical = `https://www.unlistened.me/episode/${route.params.id}`

  if (error.value) {
    return {
      title: 'Episode Not Found | Unlistened.me',
      description: 'The episode you are looking for could not be found.',
      canonical: fallbackCanonical,
      robots: 'noindex,nofollow',
      ogImage: '',
    }
  }

  if (!episode.value) {
    return {
      title: 'Episode | Unlistened.me',
      description: 'Listen to podcast episodes on Unlistened.me.',
      canonical: fallbackCanonical,
      robots: 'index,follow',
      ogImage: '',
    }
  }

  return {
    title: episode.value.feedTitle
      ? `${episode.value.title} — ${episode.value.feedTitle} | Unlistened.me`
      : `${episode.value.title} | Unlistened.me`,
    description: stripHtmlTags(episode.value.description || ''),
    canonical: `https://www.unlistened.me/episode/${episode.value.id}`,
    ogType: 'article',
    ogImage: episode.value.image || '',
    robots: 'index,follow',
  }
})

useSeoMeta({
  title: () => seoConfig.value.title,
  description: () => seoConfig.value.description,
  ogTitle: () => seoConfig.value.title,
  ogDescription: () => seoConfig.value.description,
  ogImage: () => seoConfig.value.ogImage,
  ogType: () => seoConfig.value.ogType || 'website',
  twitterTitle: () => seoConfig.value.title,
  twitterDescription: () => seoConfig.value.description,
  twitterImage: () => seoConfig.value.ogImage,
  robots: () => seoConfig.value.robots,
})

useHead({
  link: [{ rel: 'canonical', href: () => seoConfig.value.canonical }],
})

const isCurrentEpisode = computed(
  () => !!episode.value && playerStore.isCurrent(episode.value.id),
)

function playEpisode() {
  if (!episode.value) return
  playerStore.play({
    contentType: 'podcast',
    id: episode.value.id,
    title: episode.value.title,
    enclosureUrl: episode.value.enclosureUrl,
    image: episode.value.image || '',
    feedTitle: episode.value.feedTitle || '',
    feedId: episode.value.feedId || null,
    duration: episode.value.duration,
  })
  router.push('/now-playing')
}

async function fetchEpisode(podcastId) {
  try {
    const response = await podcastService.getEpisode(podcastId)
    episode.value = response.data.episode

    if (!episode.value || Object.keys(episode.value).length === 0) {
      error.value = 'No podcast information found.'
    }
  } catch {
    error.value = 'Error fetching episode'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEpisode(route.params.id)
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div v-if="loading" class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div class="aspect-square rounded-2xl border border-gray-700 bg-gray-800 animate-shimmer"></div>

          <div class="space-y-4">
            <div class="h-4 w-40 rounded animate-shimmer"></div>
            <div class="h-10 w-5/6 rounded animate-shimmer"></div>
            <div class="h-4 w-full rounded animate-shimmer"></div>
            <div class="h-4 w-full rounded animate-shimmer"></div>
            <div class="h-4 w-4/5 rounded animate-shimmer"></div>
          </div>
        </div>
      </div>

      <div v-else-if="episode && !error" class="mx-auto max-w-6xl">
        <section class="rounded-3xl border border-gray-800 bg-gray-900/30 p-5 sm:p-6 lg:p-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
            <div>
              <div class="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
                <img
                  :src="episode.image || '/images/image_not_available_500.webp'"
                  :alt="episode.title"
                  loading="lazy"
                  class="aspect-square w-full object-cover"
                />
              </div>
            </div>

            <div class="min-w-0">
              <div class="mb-4 flex flex-wrap items-center gap-3">
                <span class="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                  Episode
                </span>
                <time
                  v-if="episode.datePublishedPretty"
                  :datetime="episode.newestItemPubdate"
                  class="text-sm text-gray-500"
                >
                  {{ episode.datePublishedPretty }}
                </time>
              </div>

              <h1 class="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {{ episode.title }}
              </h1>

              <p v-if="episode.feedTitle" class="mt-3 text-sm text-gray-400">
                From
                <span class="font-medium text-gray-300">{{ episode.feedTitle }}</span>
              </p>

              <p class="mt-6 max-w-4xl text-base leading-8 text-gray-400">
                {{ stripHtmlTags(episode.description) }}
              </p>

              <div class="mt-8 border-t border-gray-800 pt-6">
                <div class="flex flex-wrap items-center gap-3">
                  <NuxtLink
                    v-if="isCurrentEpisode"
                    to="/now-playing"
                    class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                  >
                    <span>Go to Now Playing</span>
                  </NuxtLink>

                  <button
                    v-else-if="episode.enclosureUrl"
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                    @click="playEpisode"
                  >
                    <span>Play episode</span>
                  </button>

                  <NuxtLink
                    v-if="episode.feedId"
                    :to="'/feed/' + episode.feedId"
                    class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
                  >
                    <span>View all episodes</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="mx-auto max-w-5xl py-16">
        <EmptyState
          :icon="ExclamationTriangleIcon"
          title="Not found"
          description="We could not find the episode you are looking for. Please go back and try again."
          action-text="Back to listing"
          action-link="/"
        />
      </div>
    </div>
  </div>
</template>
