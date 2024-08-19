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

function reset(): void {
  cropedImage.value = ''
}
</script>

<template>
  <div class="space-y-4 p-6 bg-gray-100 dark:bg-[#262335] rounded-lg">
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

    <div v-if="cropedImage" class="border-2 border-green border-solid bg-gray-300 p-1 size-50">
      <img :src="cropedImage" class="w-full h-full object-center object-cover" alt="图片">
    </div>
  </div>
</template>
