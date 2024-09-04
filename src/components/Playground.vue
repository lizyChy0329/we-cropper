<script setup lang="ts">
import { ref } from 'vue'
// @lizychy0329/we-cropper
import { useFileDialog } from '@vueuse/core'
import { fileToBase64, useCropper } from '../../packages'

// const demoContainer = ref(null)
const { showCropper, onCrop } = useCropper({
  el: '#demoContainer',
  aspectRatio: 1 / 1,
  loadingText: '加载中...',
  resetText: '还原',
  confirmText: '确定',
  cancelText: '取消',
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

function reset(): void {
  cropedImage.value = ''
}
</script>

<template>
  <div id="demoContainer" class="relative p-6 bg-gray-100 dark:bg-[#262335] rounded-lg w-full sm:w-[375px] h-[738px] after:(content-['Demo'] absolute inset-0 flex justify-center items-center text-gray-400 text-2xl pointer-events-none)">
    <div class="flex gap-2">
      <button
        type="button" class="bg-[color:#44bd87] text-white border-b-[#249252] rounded  align-middle px-[15px] py-[3px] border-b-2 border-none border-solid outline-none
  text-shadow-[1px_1px_1px_#249252] hover:bg-[#19633b] active:(border-b-0 border-t-2 border-t-[#19633b])" @click="open()"
      >
        Choose file
      </button>

      <button
        type="button" class="bg-[color:#44bd87] text-white border-b-[#249252] rounded  align-middle px-[15px] py-[3px] border-b-2 border-none border-solid outline-none
  text-shadow-[1px_1px_1px_#249252] hover:bg-[#19633b] active:(border-b-0 border-t-2 border-t-[#19633b])" @click="reset()"
      >
        Reset
      </button>
    </div>

    <div v-if="cropedImage" class="border-2 border-green border-solid bg-gray-300 p-1 size-50 mt-4">
      <img :src="cropedImage" class="w-full h-full object-center object-cover" alt="图片">
    </div>
  </div>
</template>
