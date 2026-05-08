import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// @pinia/nuxt creates the Pinia instance automatically (see modules in nuxt.config.ts).
// This plugin only adds the persistedstate plugin to it so player/queue/history can persist.
export default defineNuxtPlugin(({ $pinia }) => {
  ;($pinia as any).use(piniaPluginPersistedstate)
})
