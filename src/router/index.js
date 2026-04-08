import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import { useMessageStore } from '@/stores/messageStore'
import HomeView from '@/views/HomeView.vue'
import AboutView from "@/views/AboutView.vue";
import FeedEpisodesView from '@/views/FeedEpisodesView.vue'
import SearchResultView from "@/views/SearchResultView.vue";
import LoginView from "@/views/LoginView.vue";
import SignUpView from "@/views/SignUpView.vue";
import FavouritesView from "@/views/FavouritesView.vue"
import BookmarksView from "@/views/BookmarksView.vue"
import ForgotPasswordView from "@/views/ForgotPasswordView.vue"
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import SettingsView from "@/views/SettingsView.vue";
import TermsView from "@/views/TermsView.vue";
import SingleEpisodeView from "@/views/SingleEpisodeView.vue";
import DashboardView from "@/views/DashboardView.vue";
import ForbiddenView from "@/views/ForbiddenView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import DocumentationView from "@/views/DocumentationView.vue";
import CategoriesView from "@/views/CategoriesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/feed_listing',
      redirect: '/',
    },
    {
      path: '/feed/:id',
      name: 'episodes',
      component: FeedEpisodesView,
    },
    {
      path: '/episode/:id',
      name: 'episode',
      component: SingleEpisodeView,
    },
    {
      path: '/search-results',
      name: 'SearchResults',
      component: SearchResultView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignUpView,
    },
    {
      path: '/favourites',
      name: 'Favourites',
      component: FavouritesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/bookmarks',
      name: 'Bookmarks',
      component: BookmarksView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
    },
    {
      path: '/forgot_password',
      name: 'Forgot',
      component: ForgotPasswordView,
    },
    {
      path: '/reset_password/:token',
      name: 'Reset',
      component: ResetPasswordView,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/terms',
      name: 'TermsAndConditions',
      component: TermsView,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/categories',
      name: 'Categories',
      component: CategoriesView,
    },
    {
      path: '/documentation',
      name: 'Documentation',
      component: DocumentationView,
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: ForbiddenView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],

  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const messageStore = useMessageStore()
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

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

export default router
