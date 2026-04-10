// Tutte le pagine auth sono noindex: non utili su Google,
// evitano crawl budget sprecato e indicizzazione di pagine senza contenuto.

export const loginSeo = {
  title: 'Sign In | Unlistened.me',
  description: 'Sign in to Unlistened.me to access your saved podcasts and bookmarks.',
  canonical: 'https://www.unlistened.me/login',
  robots: 'noindex,nofollow',
  ogImage: 'https://www.unlistened.me/images/og/login.png',
}

export const signupSeo = {
  title: 'Create Account | Unlistened.me',
  description: 'Create a free Unlistened.me account to save your favourite podcasts and pick up where you left off.',
  canonical: 'https://www.unlistened.me/signup',
  robots: 'noindex,nofollow',
  ogImage: 'https://www.unlistened.me/images/og/signup.png',
}

export const forgotSeo = {
  title: 'Forgot Password | Unlistened.me',
  description: 'Recover your Unlistened.me account. We will email you a reset link.',
  canonical: 'https://www.unlistened.me/forgot_password',
  robots: 'noindex,nofollow',
}

export const resetSeo = {
  title: 'Reset Password | Unlistened.me',
  description: 'Choose a new password for your Unlistened.me account.',
  robots: 'noindex,nofollow',
}

export const settingsSeo = {
  title: 'Settings | Unlistened.me',
  description: 'Manage your Unlistened.me account, details, and preferences.',
  canonical: 'https://www.unlistened.me/settings',
  robots: 'noindex,nofollow',
}

export const favouritesSeo = {
  title: 'Your Favourites | Unlistened.me',
  description: 'Your saved podcasts on Unlistened.me.',
  canonical: 'https://www.unlistened.me/favourites',
  robots: 'noindex,nofollow',
}

export const bookmarksSeo = {
  title: 'Your Bookmarks | Unlistened.me',
  description: 'Episodes you have bookmarked to listen later on Unlistened.me.',
  canonical: 'https://www.unlistened.me/bookmarks',
  robots: 'noindex,nofollow',
}

export const dashboardSeo = {
  title: 'Dashboard | Unlistened.me',
  description: 'Admin dashboard.',
  canonical: 'https://www.unlistened.me/dashboard',
  robots: 'noindex,nofollow',
}

export const notFoundSeo = {
  title: 'Page Not Found | Unlistened.me',
  description: 'The page you are looking for does not exist.',
  robots: 'noindex,nofollow',
}

export const forbiddenSeo = {
  title: 'Access Denied | Unlistened.me',
  description: 'You do not have permission to access this page.',
  robots: 'noindex,nofollow',
}
