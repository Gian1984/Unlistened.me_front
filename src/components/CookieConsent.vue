<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  XMarkIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

// localStorage key
const STORAGE_KEY = 'unlistened_cookie_consent_v1'

// State
const bannerVisible = ref(false)
const preferencesOpen = ref(false)
const hasDecision = ref(false)

// Preferences — "necessary" is always true and cannot be disabled
const preferences = ref({
  necessary: true,
  analytics: false,
  marketing: false,
})

// Push consent state to Google Consent Mode v2 (works whether GTM is installed or not)
function pushConsent(prefs) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }

  gtag('consent', 'update', {
    ad_storage: prefs.marketing ? 'granted' : 'denied',
    ad_user_data: prefs.marketing ? 'granted' : 'denied',
    ad_personalization: prefs.marketing ? 'granted' : 'denied',
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    functionality_storage: 'granted',
    personalization_storage: prefs.analytics ? 'granted' : 'denied',
    security_storage: 'granted',
  })

  window.dataLayer.push({
    event: 'cookie_consent_update',
    consent: prefs,
  })
}

function saveDecision(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...prefs,
      timestamp: Date.now(),
    }))
  } catch (e) {
    // localStorage not available — ignore
  }
  hasDecision.value = true
  pushConsent(prefs)
}

function acceptAll() {
  preferences.value = { necessary: true, analytics: true, marketing: true }
  saveDecision(preferences.value)
  bannerVisible.value = false
  preferencesOpen.value = false
}

function rejectAll() {
  preferences.value = { necessary: true, analytics: false, marketing: false }
  saveDecision(preferences.value)
  bannerVisible.value = false
  preferencesOpen.value = false
}

function saveCustom() {
  saveDecision(preferences.value)
  bannerVisible.value = false
  preferencesOpen.value = false
}

function openPreferences() {
  preferencesOpen.value = true
}

function closePreferences() {
  preferencesOpen.value = false
}

function reopenBanner() {
  preferencesOpen.value = true
}

onMounted(() => {
  // Set Consent Mode defaults before anything else — "denied" until the user decides
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        preferences.value = {
          necessary: true,
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
        }
        hasDecision.value = true
        pushConsent(preferences.value)
        return
      }
    } catch (e) {
      // ignore parse errors
    }

    // No decision yet — set denied defaults and show the banner
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500,
    })

    bannerVisible.value = true
  }
})

// Re-show banner when user clicks the floating cookie icon
watch(preferencesOpen, (open) => {
  if (open) bannerVisible.value = false
})
</script>

<template>
  <!-- Initial banner (first visit or user never decided) -->
  <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
  >
    <div
        v-if="bannerVisible && !preferencesOpen"
        class="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-gray-800 bg-gray-900/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
          <!-- Cookie SVG icon -->
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.6 11.3a5 5 0 0 1-5-5 5 5 0 0 1-5-5 10 10 0 1 0 10 10Z" />
            <circle cx="9" cy="10" r="0.9" fill="currentColor" />
            <circle cx="14" cy="14" r="0.9" fill="currentColor" />
            <circle cx="9" cy="16" r="0.9" fill="currentColor" />
            <circle cx="15" cy="9" r="0.9" fill="currentColor" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h2 class="text-base font-semibold text-white">We value your privacy</h2>
          <p class="mt-1.5 text-sm leading-6 text-gray-400">
            We use cookies to keep the site running smoothly and, with your permission, to understand how it is used and improve your experience. You can accept all, reject non-essential, or customize your choices.
          </p>

          <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
                type="button"
                @click="acceptAll"
                class="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Accept all
            </button>
            <button
                type="button"
                @click="rejectAll"
                class="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
            >
              Reject non-essential
            </button>
            <button
                type="button"
                @click="openPreferences"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <Cog6ToothIcon class="h-4 w-4" />
              Customize
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Preferences modal -->
  <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
  >
    <div
        v-if="preferencesOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
        @click.self="closePreferences"
    >
      <div class="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-gray-800 px-6 py-5">
          <div>
            <h2 class="text-base font-semibold text-white">Cookie preferences</h2>
            <p class="mt-1 text-xs text-gray-400">Choose which categories of cookies you want to allow.</p>
          </div>
          <button
              type="button"
              @click="closePreferences"
              class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <span class="sr-only">Close</span>
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="max-h-[60vh] space-y-3 overflow-y-auto px-6 py-5">
          <!-- Necessary -->
          <div class="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  <ShieldCheckIcon class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Strictly necessary</p>
                  <p class="mt-1 text-xs leading-5 text-gray-400">Required for the site to work (authentication, session, security). Cannot be turned off.</p>
                </div>
              </div>
              <span class="shrink-0 rounded-full bg-gray-800 px-2.5 py-1 text-[11px] font-medium text-gray-400 ring-1 ring-inset ring-gray-700">Always on</span>
            </div>
          </div>

          <!-- Analytics -->
          <div class="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                  <ChartBarIcon class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Analytics</p>
                  <p class="mt-1 text-xs leading-5 text-gray-400">Anonymous usage data that helps us understand how the site is used and improve it over time.</p>
                </div>
              </div>
              <button
                  type="button"
                  role="switch"
                  :aria-checked="preferences.analytics"
                  @click="preferences.analytics = !preferences.analytics"
                  :class="[preferences.analytics ? 'bg-indigo-600' : 'bg-gray-700', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors']"
              >
                <span
                    :class="[preferences.analytics ? 'translate-x-5' : 'translate-x-0.5', 'pointer-events-none mt-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform']"
                />
              </button>
            </div>
          </div>

          <!-- Marketing -->
          <div class="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 ring-1 ring-inset ring-pink-500/20">
                  <MegaphoneIcon class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Marketing</p>
                  <p class="mt-1 text-xs leading-5 text-gray-400">Used to deliver relevant content and measure the performance of campaigns.</p>
                </div>
              </div>
              <button
                  type="button"
                  role="switch"
                  :aria-checked="preferences.marketing"
                  @click="preferences.marketing = !preferences.marketing"
                  :class="[preferences.marketing ? 'bg-indigo-600' : 'bg-gray-700', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors']"
              >
                <span
                    :class="[preferences.marketing ? 'translate-x-5' : 'translate-x-0.5', 'pointer-events-none mt-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform']"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 border-t border-gray-800 bg-gray-900 px-6 py-4 sm:flex-row sm:justify-between">
          <button
              type="button"
              @click="rejectAll"
              class="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
          >
            Reject non-essential
          </button>
          <div class="flex flex-col gap-2 sm:flex-row">
            <button
                type="button"
                @click="saveCustom"
                class="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
            >
              Save choices
            </button>
            <button
                type="button"
                @click="acceptAll"
                class="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Floating cookie button — visible after a decision has been made -->
  <button
      v-if="hasDecision && !bannerVisible && !preferencesOpen"
      type="button"
      @click="reopenBanner"
      title="Cookie preferences"
      class="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-gray-900/90 text-indigo-400 shadow-lg backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-gray-800 hover:text-indigo-300"
  >
    <span class="sr-only">Manage cookie preferences</span>
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21.6 11.3a5 5 0 0 1-5-5 5 5 0 0 1-5-5 10 10 0 1 0 10 10Z" />
      <circle cx="9" cy="10" r="0.9" fill="currentColor" />
      <circle cx="14" cy="14" r="0.9" fill="currentColor" />
      <circle cx="9" cy="16" r="0.9" fill="currentColor" />
      <circle cx="15" cy="9" r="0.9" fill="currentColor" />
    </svg>
  </button>
</template>
