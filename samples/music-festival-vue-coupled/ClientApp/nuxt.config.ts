export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8080/api/episerver/v3.0/',
      websiteUrl: 'http://localhost:8080'
    }
  },
  components: {
    dirs: [
      {
        path: '~/components',
        global: false
      },
      {
        path: '~/views/pages',
        global: true
      },
      {
        path: '~/views/blocks',
        global: true
      },
      {
        path: '~/views/media',
        global: true
      }
    ]
  },
  css: ['@/assets/styles/main.less']
})
