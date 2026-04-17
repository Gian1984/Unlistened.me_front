export const staticPageSeo = {
  home: {
    path: '/',
    title: 'Free podcasts and music, no tracking, Unlistened.me',
    description: 'Discover and stream thousands of podcasts and free Creative Commons music. No cookies, no tracking, no account required for listening.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/home.png',
    ogImageAlt: 'Unlistened.me home page',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
    ],
    faqItems: [
      {
        question: 'Is Unlistened.me free?',
        answer: 'Yes. Unlistened.me is completely free. There is no subscription, no ads, and no hidden cost.',
      },
      {
        question: 'Do you track my listening activity?',
        answer: 'No. Unlistened.me does not use cookies to track listening habits or personal behavior.',
      },
      {
        question: 'Do I need an account to listen to podcasts?',
        answer: 'No. You can browse and listen without an account. A free account is only needed for saved features.',
      },
      {
        question: 'How many podcasts are available on Unlistened.me?',
        answer: 'Unlistened.me indexes thousands of podcasts across many categories, including technology, culture, arts, and personal development.',
      },
      {
        question: 'Can I listen on mobile?',
        answer: 'Yes. Unlistened.me is responsive and works on modern smartphone and tablet browsers.',
      },
    ],
  },
  podcasts: {
    path: '/podcasts',
    title: 'Trending podcasts on Unlistened.me',
    description: 'Browse and stream trending podcasts for free on Unlistened.me. Explore categories, discover new voices, and listen without tracking.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/podcasts.png',
    ogImageAlt: 'Trending podcasts on Unlistened.me',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Podcasts', url: 'https://www.unlistened.me/podcasts' },
    ],
  },
  music: {
    path: '/music',
    title: 'Free Creative Commons music on Unlistened.me',
    description: 'Stream free Creative Commons music from independent artists on Unlistened.me. Explore genres, save tracks, and build playlists without tracking.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/music.png',
    ogImageAlt: 'Free music on Unlistened.me',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Music', url: 'https://www.unlistened.me/music' },
    ],
  },
  categories: {
    path: '/categories',
    title: 'Browse podcast categories on Unlistened.me',
    description: 'Explore podcasts by category on Unlistened.me. From technology and science to arts, comedy, true crime, and personal growth, find your next favorite show.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/categories.png',
    ogImageAlt: 'Podcast categories on Unlistened.me',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Categories', url: 'https://www.unlistened.me/categories' },
    ],
  },
  about: {
    path: '/about',
    title: 'About Unlistened.me, private listening for podcasts and music',
    description: 'Learn about Unlistened.me, the listening platform for podcasts and free Creative Commons music. No ads, no tracking, built for listeners.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/about.png',
    ogImageAlt: 'About Unlistened.me',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'About', url: 'https://www.unlistened.me/about' },
    ],
    faqItems: [
      {
        question: 'Who created Unlistened.me?',
        answer: 'Unlistened.me was created by Gianluca Tiengo as an independent project focused on simple and privacy respectful digital products.',
      },
      {
        question: 'Is Unlistened.me open source?',
        answer: 'Unlistened.me is a personal project built with Vue, Vite, and Laravel. Parts of it may be shared over time.',
      },
      {
        question: 'How can I contact support?',
        answer: 'You can write to support@unlistened.me.',
      },
      {
        question: 'Does Unlistened.me use cookies?',
        answer: 'Unlistened.me does not use tracking cookies. A session cookie is only used when you choose to log in.',
      },
    ],
  },
  documentation: {
    path: '/documentation',
    title: 'User guide for Unlistened.me',
    description: 'Learn how to use Unlistened.me, from discovering podcasts and music to saving favorites, playlists, and bookmarks.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/documentation.png',
    ogImageAlt: 'User guide for Unlistened.me',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Documentation', url: 'https://www.unlistened.me/documentation' },
    ],
    faqItems: [
      {
        question: 'Do I need an account to start listening?',
        answer: 'No. You can browse and listen without an account. An account is only needed for saved features such as favorites, bookmarks, and playlists.',
      },
      {
        question: 'Where can I save podcasts and episodes?',
        answer: 'Podcasts can be saved to favorites and episodes can be saved to bookmarks.',
      },
      {
        question: 'Does Unlistened.me remember where I stopped listening?',
        answer: 'Yes. Listening progress is stored so you can resume from where you left off.',
      },
      {
        question: 'Can I create playlists for music?',
        answer: 'Yes. Signed in users can like tracks, create playlists, and organize music into personal collections.',
      },
    ],
  },
  terms: {
    path: '/terms',
    title: 'Terms and conditions for Unlistened.me',
    description: 'Read the terms and conditions for Unlistened.me, including content responsibility, trademarks, user information, and service rules.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/terms.png',
    ogImageAlt: 'Terms and conditions for Unlistened.me',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Terms', url: 'https://www.unlistened.me/terms' },
    ],
    faqItems: [
      {
        question: 'Who is responsible for podcast and music content on Unlistened.me?',
        answer: 'Creators and rights holders remain responsible for the content made available through the platform.',
      },
      {
        question: 'Does Unlistened.me provide warranties about the service?',
        answer: 'No. The service is provided as is and as available.',
      },
      {
        question: 'Can the terms change over time?',
        answer: 'Yes. The terms may be updated when necessary.',
      },
      {
        question: 'Is Unlistened.me a commercial service?',
        answer: 'No. Unlistened.me is presented as a non profit project.',
      },
    ],
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy policy for Unlistened.me',
    description: 'Learn how Unlistened.me collects, uses, and protects your data. Privacy focused listening with clear and simple policies.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/privacy.png',
    ogImageAlt: 'Privacy policy for Unlistened.me',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Privacy', url: 'https://www.unlistened.me/privacy' },
    ],
    faqItems: [
      {
        question: 'Does Unlistened.me track my listening activity?',
        answer: 'No. Optional analytics remain disabled until you explicitly accept them.',
      },
      {
        question: 'What personal data is stored if I create an account?',
        answer: 'If you create an account, Unlistened.me stores your name, email address, hashed password, preferences, and saved library items.',
      },
      {
        question: 'Can I delete my account and saved data?',
        answer: 'Yes. You can delete your account from the Settings page.',
      },
      {
        question: 'Are podcast audio files hosted by Unlistened.me?',
        answer: 'Not always. Some podcast covers and audio files are hosted by the podcasts themselves.',
      },
    ],
  },
  login: {
    path: '/login',
    title: 'Sign In | Unlistened.me',
    description: 'Sign in to Unlistened.me to access your saved podcasts and bookmarks.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/login.png',
    ogImageAlt: 'Sign in to Unlistened.me',
    robots: 'noindex,nofollow',
  },
  signup: {
    path: '/signup',
    title: 'Create Account | Unlistened.me',
    description: 'Create a free Unlistened.me account to save your favorite podcasts and pick up where you left off.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/signup.png',
    ogImageAlt: 'Create an Unlistened.me account',
    robots: 'noindex,nofollow',
  },
  search: {
    path: '/search-results',
    title: 'Search results on Unlistened.me',
    description: 'Search results on Unlistened.me for podcasts and music.',
    ogType: 'website',
    ogImage: 'https://www.unlistened.me/images/og/search.png',
    ogImageAlt: 'Search results on Unlistened.me',
    robots: 'noindex,nofollow',
  },
}
