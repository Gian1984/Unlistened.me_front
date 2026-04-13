import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import { useMessageStore } from '@/stores/messageStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/feed_listing',
      redirect: '/',
    },
    {
      path: '/feed/:id',
      name: 'episodes',
      component: () => import('@/views/FeedEpisodesView.vue'),
    },
    {
      path: '/episode/:id',
      name: 'episode',
      component: () => import('@/views/SingleEpisodeView.vue'),
    },
    {
      path: '/search-results',
      name: 'SearchResults',
      component: () => import('@/views/SearchResultView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/SignUpView.vue'),
    },
    {
      path: '/favourites',
      name: 'Favourites',
      component: () => import('@/views/FavouritesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bookmarks',
      name: 'Bookmarks',
      component: () => import('@/views/BookmarksView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/forgot_password',
      name: 'Forgot',
      component: () => import('@/views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset_password/:token',
      name: 'Reset',
      component: () => import('@/views/ResetPasswordView.vue'),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/terms',
      name: 'TermsAndConditions',
      component: () => import('@/views/TermsView.vue'),
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/CategoriesView.vue'),
    },
    {
      path: '/podcasts',
      name: 'Podcasts',
      component: () => import('@/views/PodcastsView.vue'),
    },
    {
      path: '/music',
      name: 'Music',
      component: () => import('@/views/MusicHomeView.vue'),
    },
    {
      path: '/music/albums',
      name: 'MusicAlbums',
      component: () => import('@/views/MusicAlbumsView.vue'),
    },
    {
      path: '/music/singles',
      name: 'MusicSingles',
      component: () => import('@/views/MusicSinglesView.vue'),
    },
    {
      path: '/music/album/:id',
      name: 'MusicAlbum',
      component: () => import('@/views/MusicAlbumView.vue'),
    },
    {
      path: '/music/favorites',
      name: 'MusicFavorites',
      component: () => import('@/views/MusicFavoritesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/music/playlists',
      name: 'MusicPlaylists',
      component: () => import('@/views/MusicPlaylistsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/music/playlists/:id',
      name: 'MusicPlaylistDetail',
      component: () => import('@/views/MusicPlaylistDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/now-playing',
      name: 'NowPlaying',
      component: () => import('@/views/NowPlayingView.vue'),
    },
    {
      path: '/documentation',
      name: 'Documentation',
      component: () => import('@/views/DocumentationView.vue'),
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: () => import('@/views/ForbiddenView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const messageStore = useMessageStore()
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (!authStore.isInitialized || requiresAuth || requiresAdmin) {
    await authStore.initializeAuth()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    messageStore.setMessage('To access this page you have to be logged in.')
    next({ name: 'Login' })
  } else if (requiresAdmin && !authStore.isAdmin) {
    messageStore.setMessage('You must be an admin to access this page.')
    next({ name: 'Login' })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  window.dataLayer = window.dataLayer || []

  window.dataLayer.push({
    event: 'page_view',
    page_location: window.location.href,
    page_path: to.fullPath,
    page_title: document.title,
    page_referrer: from.fullPath
        ? `${window.location.origin}${from.fullPath}`
        : document.referrer
  })
})

export default router
