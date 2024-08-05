<script setup lang="ts">
import { ref } from 'vue'
// @mfex/we-cropper
import { fileToBase64, useCropper } from '@mfex/we-cropper'
import '@mfex/we-cropper/style.css'
import { useFileDialog } from '@vueuse/core'

const { showCropper, onCrop } = useCropper({
  aspectRatio: 1 / 1,
})

// @vueuse/core
const { open, onChange } = useFileDialog({
  multiple: false,
  accept: 'image/*',
})

// start
const cropedImage = ref('')
onChange(async (files) => {
  if (!files) {
    return
  }

  const base64String = await fileToBase64(files[0])
  showCropper(base64String)
})

onCrop((base64String: string) => {
  cropedImage.value = base64String

  // 上传...
})
</script>

<template>
  <div class="space-y-4">
    <div class="border-2 border-green border-solid bg-amber p-1 size-50">
      <img :src="cropedImage" class="w-full h-full object-center object-cover" alt="fff">
    </div>

    <div class="py-4 px-2 bg-emerald rounded-2xl">
      <button type="button" @click="open()">
        选择图片
      </button>
      <!-- <input
        type="file" @change="async (event: Event) => {
          const { files } = event.target as HTMLInputElement;

          if (!files || !files.length || files.length > 1) {
            return;
          }

          const file = files[0]
          const base64String = await fileToBase64(file)

          showCropper(base64String)
        }"
      > -->
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
