import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import HomeView from '@/views/HomeView.vue'
import AboutView from "@/views/AboutView.vue";
import FeedEpisodesView from '@/views/FeedEpisodesView.vue'
import SearchResultView from "@/views/SearchResultView.vue";
import LoginView from "@/views/LoginView.vue";
import SignInView from "@/views/SignInView.vue";
import FavouritesView from "@/views/FavouritesView.vue"
import BookmarksView from "@/views/BookmarksView.vue"
import ForgotPasswordView from "@/views/ForgotPasswordView.vue"
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import SettingsView from "@/views/SettingsView.vue";
import TermsView from "@/views/TermsView.vue";
import FeedsView from "@/views/FeedsView.vue";
import SingleEpisodeView from "@/views/SingleEpisodeView.vue";
import DashboardView from "@/views/DashboardView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
        title: "Unlistened - Home",
        metaTags: [
          {
            name: 'description',
            content: "Discover new podcasts on Unlistened, a free podcast app without cookies or profiling."
          },
          {
            name: 'og:title',
            content: "Unlistened - Home"
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
            content: "Discover new podcasts on Unlistened, a free podcast app without cookies or profiling."
          }
        ]
      }
    },
    {
      path: '/feed_listing',
      name: 'Feeds',
      component: FeedsView,
      meta: {
        title: "Unlistened - Feeds",
        metaTags: [
          {
            name: 'description',
            content: "Browse and listen to a variety of podcasts on Unlistened. Enjoy your favorite shows without tracking."
          },
          {
            name: 'og:title',
            content: "Unlistened - Podcasts"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/feed_listing"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Browse and listen to a variety of podcasts on Unlistened. Enjoy your favorite shows without tracking."
          }
        ]
      }
    },
    {
      path: '/feed/:id',
      name: 'episodes',
      component: FeedEpisodesView,
      meta: {
        title: "Unlistened - Podcast Episodes",
        metaTags: [
          {
            name: 'description',
            content: "Listen to episodes from your favorite podcasts on Unlistened. No cookies, no profiling."
          },
          {
            name: 'og:title',
            content: "Unlistened - Podcast Episodes"
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
            content: "Listen to episodes from your favorite podcasts on Unlistened. No cookies, no profiling."
          }
        ]
      }
    },
    {
      path: '/episode/:id',
      name: 'episode',
      component: SingleEpisodeView,
      meta: {
        title: "Unlistened - Podcast",
        metaTags: [
          {
            name: 'description',
            content: "Listen episode from your favorite podcasts on Unlistened. No cookies, no profiling."
          },
          {
            name: 'og:title',
            content: "Unlistened - Podcast"
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
            content: "Listen to episode from your favorite podcasts on Unlistened. No cookies, no profiling."
          }
        ]
      }
    },
    {
      path: '/search-results',
      name: 'SearchResults',
      component: SearchResultView,
      meta: {
        title: "Unlistened - Search Results",
        metaTags: [
          {
            name: 'description',
            content: "Find your favorite podcasts with Unlistened's powerful search feature."
          },
          {
            name: 'og:title',
            content: "Unlistened - Search Results"
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
            content: "Find your favorite podcasts with Unlistened's powerful search feature."
          }
        ]
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        title: "Unlistened - Login",
        metaTags: [
          {
            name: 'description',
            content: "Log in to Unlistened to access your favorite podcasts and bookmarks."
          },
          {
            name: 'og:title',
            content: "Unlistened - Login"
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
            content: "Log in to Unlistened to access your favorite podcasts and bookmarks."
          }
        ]
      }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignInView,
      meta: {
        title: "Unlistened - Sign In",
        metaTags: [
          {
            name: 'description',
            content: "Sign in to Unlistened to save your favorite podcasts and access them anytime."
          },
          {
            name: 'og:title',
            content: "Unlistened - Sign In"
          },
          {
            name: 'og:url',
            content: "https://www.unlistened.me/signin"
          },
          {
            name: 'og:type',
            content: "website"
          },
          {
            property: 'og:description',
            content: "Sign in to Unlistened to save your favorite podcasts and access them anytime."
          }
        ]
      }
    },
    {
      path: '/favourites',
      name: 'Favourites',
      component: FavouritesView,
      meta: {
        requiresAuth: true,
        title: "Unlistened - Favourites",
        metaTags: [
          {
            name: 'description',
            content: "Access your favorite podcasts on Unlistened. Log in to save and retrieve your favorites."
          },
          {
            name: 'og:title',
            content: "Unlistened - Favourites"
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
            content: "Access your favorite podcasts on Unlistened. Log in to save and retrieve your favorites."
          }
        ]
      }
    },
    {
      path: '/bookmarks',
      name: 'Bookmarks',
      component: BookmarksView,
      meta: {
        requiresAuth: true,
        title: "Unlistened - Bookmarks",
        metaTags: [
          {
            name: 'description',
            content: "Bookmark your favorite podcast episodes on Unlistened for easy access later."
          },
          {
            name: 'og:title',
            content: "Unlistened - Bookmarks"
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
            content: "Bookmark your favorite podcast episodes on Unlistened for easy access later."
          }
        ]
      }
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
      meta: {
        title: "About Unlistened",
        metaTags: [
          {
            name: 'description',
            content: "Learn more about Unlistened, the free podcast app that respects your privacy."
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
            content: "Learn more about Unlistened, the free podcast app that respects your privacy."
          }
        ]
      }
    },
    {
      path: '/forgot_password',
      name: 'Forgot',
      component: ForgotPasswordView,
      meta: {
        title: "Unlistened - Forgot Password",
        metaTags: [
          {
            name: 'description',
            content: "Reset your password on Unlistened to regain access to your account."
          },
          {
            name: 'og:title',
            content: "Unlistened - Forgot Password"
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
            content: "Reset your password on Unlistened to regain access to your account."
          }
        ]
      }
    },
    {
      path: '/reset_password/:token',
      name: 'Reset',
      component: ResetPasswordView,
      meta: {
        title: "Unlistened - Reset Password",
        metaTags: [
          {
            name: 'description',
            content: "Reset your password on Unlistened using the link sent to your email."
          },
          {
            name: 'og:title',
            content: "Unlistened - Reset Password"
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
            content: "Reset your password on Unlistened using the link sent to your email."
          }
        ]
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: {
        requiresAuth: true,
        title: "Unlistened - Settings",
        metaTags: [
          {
            name: 'description',
            content: "Manage your account settings on Unlistened. Customize your experience and preferences."
          },
          {
            name: 'og:title',
            content: "Unlistened - Settings"
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
            content: "Manage your account settings on Unlistened. Customize your experience and preferences."
          }
        ]
      }
    },
    {
      path: '/terms',
      name: 'TermsAndConditions',
      component: TermsView,
      meta: {
        title: "Unlistened - Terms and Conditions",
        metaTags: [
          {
            name: 'description',
            content: "Read the terms and conditions of Unlistened, including content responsibility, trademarks, user information, and our non-profit service policy."
          },
          {
            name: 'og:title',
            content: "Unlistened - Terms and Conditions"
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
            content: "Read the terms and conditions of Unlistened, including content responsibility, trademarks, user information, and our non-profit service policy."
          }
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
        title: "Unlistened - Settings",
        metaTags: [
          {
            name: 'description',
            content: "Manage Unlistened."
          },
          {
            name: 'og:title',
            content: "Unlistened - Dashboard"
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
            content: "Unlistened - Dashboard"
          }
        ]
      }
    },
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

      const authStore = useAuthStore();
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
      const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

      if (requiresAuth && !authStore.isAuthenticated) {
        authStore.setLoginMessage('To access this page you have to be logged in.');
        next({ name: 'Login' });
      } else if (requiresAdmin && !authStore.isAdmin) {
        authStore.setLoginMessage('You must be an admin to access this page.');
        next({ name: 'Login' }); // or another route to redirect non-admin users
      } else {
        next();
      }
});



export default router
