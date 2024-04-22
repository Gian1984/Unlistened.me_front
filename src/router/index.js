import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView.vue";
import PodcastEpisodesView from '../views/PodcastEpisodesView.vue'
import PodcastView from "../views/PodcastView.vue";
import SearchResultView from "../views/SearchResultView.vue";
import LoginView from "../views/LoginView.vue";
import SignInView from "../views/SignInView.vue";
import FavouritesView from "../views/FavouritesView.vue"
import BookmarksView from "../views/BookmarksView.vue"
import ForgotPasswordView from "../views/ForgotPasswordView.vue"
import ResetPasswordView from "../views/ResetPasswordView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
        title: "L'Artigiano della Farina - Home",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Home"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },
    {
      path: '/podcast_listing',
      name: 'podcast',
      component: PodcastView,
      meta: {
        title: "Unlistened - Podcasts",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "Unlistened - Podcasts"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },
    {
      path: '/podcast/:id',
      name: 'episodes',
      component: PodcastEpisodesView,
      meta: {
        title: "L'Artigiano della Farina - Accueil",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },

    {
      path: '/search-results',
      name: 'SearchResults',
      component: SearchResultView,
      meta: {
        title: "L'Artigiano della Farina - Search",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        title: "L'Artigiano della Farina - Accueil",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignInView,
      meta: {
        title: "L'Artigiano della Farina - Accueil",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
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
        title: "Favourites - Unreaded.me",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
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
        title: "Bookmarks - Unreaded.me",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
      meta: {
        title: "About - Unlistened.me",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },
    {
      path: '/forgot_password',
      name: 'Forgot',
      component: ForgotPasswordView,
      meta: {
        title: "Forgot password - Unlistened.me",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },
    {
      path: '/reset_password',
      name: 'Reset',
      component: ResetPasswordView,
      meta: {
        title: "Reset Password - Unlistened.me",
        metaTags: [

          {
            name: 'description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          },
          {
            name: 'og:title',
            content: "L'Artigiano della Farina - Accueil"
          },
          {
            name: 'og:url',
            content: "https://www.artigianodellafarina.be"
          },
          {
            name: 'og:type',
            content: "website/homepage"
          },
          {
            property: 'og:description',
            content: "Célébrant l'art de la boulangerie, L'Artigiano della Farina propose une expérience culinaire extraordinaire, transformant avec amour la farine en pizzas et sandwiches sublimes, un véritable voyage de saveurs authentiques."
          }
        ]
      }
    },

  ]
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

      if (requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login' });
      } else {
        next();
      }
});



export default router
