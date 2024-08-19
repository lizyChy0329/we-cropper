<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { codeToHtml } from 'shiki/bundle/web'
import { isDark, toggleDarkmode } from '~/composables/useDarkmode'
import Playground from '~/components/Playground.vue'

const demoCode0 = `# install
> pnpm i @lizychy0329/we-cropper
`

const html = ref('')
onBeforeMount(async () => {
  html.value = await codeToHtml(demoCode0, {
    lang: 'shell',
    themes: {
      light: 'min-light',
      dark: 'synthwave-84',
    },
  })
})
</script>

<template>
  <div class="w-full h-full min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <div class="container mx-auto max-w-5xl relative">
      <nav class="h-20 px-4 sm:px-0 py-4 flex-between text-primary">
        <div class="font-semibold text-xl flex-center gap-2">
          <Logo class="h-6 w-6" />
          we-cropper
        </div>
        <div class="flex-center gap-4">
          <button
            class="!bg-transparent opacity-50 hover:opacity-100 transition"
            @click="(e) => toggleDarkmode()"
          >
            <carbon:moon v-if="isDark" class="w-6 h-6" />
            <carbon:sun v-else class="w-6 h-6" />
          </button>
          <a
            class="opacity-50 hover:opacity-100 transition"
            href="https://github.com/lizyChy0329"
          >
            <carbon:logo-github class="h-6 w-6" />
          </a>
        </div>
      </nav>
      <header class="px-4 sm:px-0 py-10">
        <div class="font-extrabold space-y-4">
          <span class="text-6xl text-primary">Simply Cropping</span>
          <div class="text-6xl text-primary">
            Like <span text-neon>WeChat!</span>
          </div>
        </div>
        <div
          class="text-2xl font-semibold text-slate-700 py-4 dark:text-slate-200"
        >
          A wechat style image cropper wrapped with vue-advanced-cropper
        </div>
        <!-- <div class="grid grid-cols-2 gap-4 mt-8">
          <a
            class="bg-gray-200 hover:bg-gray-300 transition rounded-full text-lg font-semibold py-3 px-6 w-full sm:w-auto text-center"
            href="https://github.com/xiaoluoboding/vue-library-starter"
            target="_blank"
          >
            <span>Documentation</span>
          </a>
          <a
            class="bg-emerald-400 hover:bg-emerald-500 flex items-center justify-center space-x-3 transition rounded-full text-white text-lg font-semibold py-3 px-6 w-full sm:w-auto cursor-pointer"
            href="https://github.com/lizyChy0329/we-cropper"
            target="_blank"
          >
            <span>Documentation</span>
          </a>
        </div> -->
      </header>

      <div space-y-4 px-4 sm:px-0>
        <h2 class="text-2xl font-bold my-4 text-primary">
          Demo
        </h2>
        <!-- playground -->
        <Playground />

        <h2 class="text-2xl font-bold text-primary">
          Install
        </h2>
        <main class=" text-xs 2xl:text-sm drop-shadow-sm dark:(drop-shadow-color-gray-700) [&>pre]:(p-4 rounded-xl bg-transparent)" v-html="html" />
      </div>

      <footer
        class="py-16 w-full flex-center text-primary"
        text="slate-900 dark:slate-300 opacity-60 sm"
      >
        <div class="copyright flex flex-col justify-center items-center">
          <p>
            Code with ❤ & ☕️ by
            <a class="text-neon" href="https://github.com/lizyChy0329">
              @lizyChy0329
            </a>
            <span> © {{ new Date().getFullYear() }}</span>
          </p>
          <p class="flex items-center space-x-1">
            <carbon:logo-twitter class="text-emerald-500" />
            <span>
              <a
                href="https://x.com/lizyChy0329"
                class="text-neon"
                target="_blank"
              >
                Follow me on Twitter
              </a>
            </span>
          </p>
        </div>
      </footer>

      <div class="w-full mx-auto" />
    </div>
  </div>
</template>

<style>
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
</style>
