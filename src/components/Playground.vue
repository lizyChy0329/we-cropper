<script setup lang="ts">
import { ref } from 'vue'
// @lizychy0329/we-cropper
import { fileToBase64, useCropper } from '@lizychy0329/we-cropper'
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
  <div class="space-y-4 ">
    <div class="border-2 border-green border-solid bg-gray-300 p-1 size-50">
      <img :src="cropedImage" class="w-full h-full object-center object-cover" alt="图片">
    </div>

    <button type="button" class="bg-emerald-400 hover:bg-emerald-500 flex items-center justify-center space-x-3 transition rounded-full text-white text-lg font-semibold py-3 px-6 w-full sm:w-auto cursor-pointer" @click="open()">
      选择图片
    </button>
  </div>
</template>
