<script setup>
import Footer from '../components/Footer.vue'
import EmptyState from '../components/EmptyState.vue'
import {
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'
import { usePlayerStore } from '@/stores/playerStore.js'
import { podcastService } from '@/services/podcastService.js'
import { stripHtmlTags } from '@/utils/text.js'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/seo/composables/useSeo.js'
import { buildEpisodeSchema } from '@/seo/schemas/episode.js'
import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'

const playerStore = usePlayerStore()
const route = useRoute()

const episode = ref(null)
const error = ref(null)
const loading = ref(true)

const seoConfig = computed(() => {
  if (!episode.value) {
    return { title: 'Loading... | Unlistened.me', robots: 'noindex' }
  }
  const breadcrumbs = [{ name: 'Home', url: 'https://www.unlistened.me/' }]
  if (episode.value.feedId && episode.value.feedTitle) {
    breadcrumbs.push({ name: episode.value.feedTitle, url: `https://www.unlistened.me/feed/${episode.value.feedId}` })
  }
  breadcrumbs.push({ name: episode.value.title, url: `https://www.unlistened.me/episode/${episode.value.id}` })

  return {
    title: episode.value.feedTitle
      ? `${episode.value.title} — ${episode.value.feedTitle} | Unlistened.me`
      : `${episode.value.title} | Unlistened.me`,
    description: episode.value.description,
    canonical: `https://www.unlistened.me/episode/${episode.value.id}`,
    ogType: 'article',
    ogImage: episode.value.image,
    jsonLd: [
      buildEpisodeSchema(episode.value),
      buildBreadcrumbSchema(breadcrumbs),
    ].filter(Boolean),
  }
})

useSeo(seoConfig)

const isPlaying = computed(() => playerStore.isVisible && playerStore.currentEpisode)

async function fetchEpisode(podcastId) {
  try {
    const response = await podcastService.getEpisode(podcastId)
    episode.value = response.data.episode

    if (!episode.value || Object.keys(episode.value).length === 0) {
      error.value = 'No podcast information found.'
    }
  } catch (err) {
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
      <!-- Loading -->
      <div v-if="loading" class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div class="aspect-square rounded-2xl bg-gray-800 animate-shimmer border border-gray-700"></div>

          <div class="space-y-4">
            <div class="h-4 w-40 rounded animate-shimmer"></div>
            <div class="h-10 w-5/6 rounded animate-shimmer"></div>
            <div class="h-4 w-full rounded animate-shimmer"></div>
            <div class="h-4 w-full rounded animate-shimmer"></div>
            <div class="h-4 w-4/5 rounded animate-shimmer"></div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="episode && !error" class="mx-auto max-w-6xl">
        <!-- Episode hero -->
        <section class="rounded-3xl border border-gray-800 bg-gray-900/30 p-5 sm:p-6 lg:p-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
            <!-- Cover -->
            <div>
              <div class="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
                <img
                    :src="episode.image || '/images/image_not_available_500.webp'"
                    :alt="episode.title"
                    class="aspect-square w-full object-cover"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3 mb-4">
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

              <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl leading-tight">
                {{ episode.title }}
              </h1>

              <p
                  v-if="episode.feedTitle"
                  class="mt-3 text-sm text-gray-400"
              >
                From
                <span class="font-medium text-gray-300">{{ episode.feedTitle }}</span>
              </p>

              <p class="mt-6 max-w-4xl text-base leading-8 text-gray-400">
                {{ stripHtmlTags(episode.description) }}
              </p>

              <!-- Actions -->
              <div class="mt-8 border-t border-gray-800 pt-6">
                <div class="flex flex-wrap items-center gap-3">
                  <router-link
                      v-if="isPlaying"
                      to="/now-playing"
                      class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                  >
                    <span>Back to Now Playing</span>
                  </router-link>

                  <router-link
                      v-if="episode.feedId"
                      :to="'/feed/' + episode.feedId"
                      class="inline-flex items-center gap-2 rounded-full bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
                  >
                    <span>Open podcast</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Error -->
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

  <Footer />
</template>