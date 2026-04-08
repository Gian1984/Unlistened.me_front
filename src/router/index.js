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
      meta: {
        requiresAuth: false,
        title: "Home | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Discover new podcasts on Unlistened, the free podcast player with no cookies and no tracking."
          },
          {
            name: 'og:title',
            content: "Unlistened, your private podcast player"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Discover new podcasts on Unlistened, the free podcast player with no cookies and no tracking."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/feed_listing',
      redirect: '/',
    },
    {
      path: '/feed/:id',
      name: 'episodes',
      component: FeedEpisodesView,
      meta: {
        title: "Episodes | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Listen to episodes from your favorite podcasts on Unlistened. No cookies, no tracking."
          },
          {
            name: 'og:title',
            content: "Episodes on Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/feed/:id"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Listen to episodes from your favorite podcasts on Unlistened. No cookies, no tracking."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/episode/:id',
      name: 'episode',
      component: SingleEpisodeView,
      meta: {
        title: "Episode | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Listen to a podcast episode on Unlistened. No cookies, no tracking."
          },
          {
            name: 'og:title',
            content: "Podcast episode on Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/podcast/:id"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Listen to a podcast episode on Unlistened. No cookies, no tracking."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/search-results',
      name: 'SearchResults',
      component: SearchResultView,
      meta: {
        title: "Search results | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Find your favorite podcasts with the Unlistened search."
          },
          {
            name: 'og:title',
            content: "Search results on Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/search-results"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Find your favorite podcasts with the Unlistened search."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        title: "Sign in | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Sign in to Unlistened to access your favorite podcasts and bookmarks."
          },
          {
            name: 'og:title',
            content: "Sign in to Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/login"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Sign in to Unlistened to access your favorite podcasts and bookmarks."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignUpView,
      meta: {
        title: "Create account | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Create a free Unlistened account to save your favorite podcasts and pick up where you left off."
          },
          {
            name: 'og:title',
            content: "Create your Unlistened account"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/signup"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Create a free Unlistened account to save your favorite podcasts and pick up where you left off."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/favourites',
      name: 'Favourites',
      component: FavouritesView,
      meta: {
        requiresAuth: true,
        title: "Favourites | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Your saved podcasts on Unlistened. Sign in to keep them in sync."
          },
          {
            name: 'og:title',
            content: "Your favourites on Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/favourites"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Your saved podcasts on Unlistened. Sign in to keep them in sync."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/bookmarks',
      name: 'Bookmarks',
      component: BookmarksView,
      meta: {
        requiresAuth: true,
        title: "Bookmarks | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Save episodes to listen later. Your bookmarks live here."
          },
          {
            name: 'og:title',
            content: "Your bookmarks on Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/bookmarks"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Save episodes to listen later. Your bookmarks live here."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
      meta: {
        title: "About | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Learn about Unlistened, the free podcast player that respects your privacy."
          },
          {
            name: 'og:title',
            content: "About Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/about"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Learn about Unlistened, the free podcast player that respects your privacy."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/forgot_password',
      name: 'Forgot',
      component: ForgotPasswordView,
      meta: {
        title: "Forgot password | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Recover your Unlistened account. We will email you a reset link."
          },
          {
            name: 'og:title',
            content: "Forgot your password?"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/forgot_password"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Recover your Unlistened account. We will email you a reset link."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/reset_password/:token',
      name: 'Reset',
      component: ResetPasswordView,
      meta: {
        title: "Reset password | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Choose a new password for your Unlistened account."
          },
          {
            name: 'og:title',
            content: "Reset your Unlistened password"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/reset_password/:token"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Choose a new password for your Unlistened account."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: {
        requiresAuth: true,
        title: "Settings | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Manage your Unlistened account, your details, and your preferences."
          },
          {
            name: 'og:title',
            content: "Account settings"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/settings"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Manage your Unlistened account, your details, and your preferences."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/terms',
      name: 'TermsAndConditions',
      component: TermsView,
      meta: {
        title: "Terms and conditions | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Read the Unlistened terms and conditions, including content responsibility, trademarks, user information, and our non profit service policy."
          },
          {
            name: 'og:title',
            content: "Unlistened terms and conditions"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/terms"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Read the Unlistened terms and conditions, including content responsibility, trademarks, user information, and our non profit service policy."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: "Dashboard | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Admin dashboard for Unlistened."
          },
          {
            name: 'og:title',
            content: "Unlistened admin dashboard"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/dashboard"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Admin dashboard for Unlistened."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/categories',
      name: 'Categories',
      component: CategoriesView,
      meta: {
        title: "Categories | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Browse podcasts by category on Unlistened."
          },
          {
            name: 'og:title',
            content: "Podcast categories on Unlistened"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/categories"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Browse podcasts by category on Unlistened."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },

    {
      path: '/documentation',
      name: 'Documentation',
      component: DocumentationView,
      meta: {
        title: "Documentation | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Technical documentation for Unlistened, including features, technologies, and setup instructions."
          },
          {
            name: 'og:title',
            content: "Unlistened documentation"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/documentation"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Technical documentation for Unlistened, including features, technologies, and setup instructions."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: ForbiddenView,
      meta: {
        title: "Forbidden | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "You do not have permission to access this page."
          },
          {
            name: 'og:title',
            content: "Access denied"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/forbidden"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "You do not have permission to access this page."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
      meta: {
        title: "Page not found | Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "The page you are looking for does not exist."
          },
          {
            name: 'og:title',
            content: "Page not found"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/404"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "The page you are looking for does not exist."
          },
          {
            property: 'og:image',
            content: "https://www.unlistened.me/images/ogimage-min.png"
          },
        ]
      }
    }

  ],

  scrollBehavior(to, from, savedPosition) {
    // Always scroll to the top of the page
    return { top: 0 };
  }
})

router.beforeEach((to, from, next) => {

  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if(previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
      // Add the meta tags to the document head.
      .forEach(tag => document.head.appendChild(tag));

      const messageStore = useMessageStore()
      const authStore = useAuthStore();
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
      const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

      if (requiresAuth && !authStore.isAuthenticated) {
        messageStore.setMessage('To access this page you have to be logged in.');
        next({ name: 'Login' });
      } else if (requiresAdmin && !authStore.isAdmin) {
        messageStore.setMessage('You must be an admin to access this page.');
        next({ name: 'Login' }); // or another route to redirect non-admin users
      } else {
        next();
      }
});



export default router
