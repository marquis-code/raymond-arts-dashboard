export default {
  ssr: false,
  target: "static",
  app: {
    head: {
      title: "Raymond Aworo Art Admin",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.svg" },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/driver.js/dist/driver.min.css' }
      ],
      script: [
        {
          src: "https://newwebpay.qa.interswitchng.com/inline-checkout.js",
          defer: true,
        },

      ]
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["/assets/css/main.css"],

  tailwindcss: {
    cssPath: "@/assets/css/main.css",
  },
  build: {
    transpile: ["@pdftron/webviewer", 'vee-validate'],
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: 'AIzaSyCTBVK36LVNlXs_qBOC4RywX_Ihf765lDg',
      // imageBaseUrl: process.env.VITE_IMAGE_URL || 'https://blackcountrypub.blob.core.windows.net/assets/', 
    }
  },
  // router: {
  //   extendRoutes(routes: any, resolve: any) {
  //     // Adjust all routes to be prefixed with `/about/`
  //     routes.forEach((route: any) => {
  //       if (route.path !== '/tenant') {
  //          route.path = `/tenant${route.path}`
  //       }
  //     })
  //   }
  // },

  axios: {
    timeout: 10000, // Example: set timeout to 10 seconds
    // Axios options here
  },

  plugins: [],

  vite: {
    optimizeDeps: {
      include: ['fast-deep-equal']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("pdfjs-dist")) {
              return "pdfjs";
            }
          },
        },
      },
      // transpile: ['@vueup/vue-quill'],
    },
    server: {
      port: 3001
      // fs: {
      //   allow: ["public/lib"],
      // },
    },
  },
  server: {
    port: 3040,
    host: '0.0.0.0' // This makes the server accessible from all network interfaces
  },


  compatibilityDate: "2024-09-30"
};
