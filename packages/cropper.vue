<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import 'vue-advanced-cropper/dist/theme.compact.css'
import { ref } from 'vue'
import { useLocale } from './composables/useLocale'
import type { WeCropperOptions } from './types'

const props = withDefaults(defineProps<{
  modelValue: boolean
} & WeCropperOptions>(), {
  modelValue: false,
  aspectRatio: 1 / 1,
  locale: 'en' as const,
  // 保持向后兼容的默认值
  loadingText: 'Loading...',
  resetText: 'Reset',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'crop', base64String: string): void
}>()

const cropperRef = ref()
const isCropperPending = ref(true)

// 使用多语言功能
const { t, currentLocale, mergeCustomLocale } = useLocale({
  locale: props.locale,
  customLocale: props.customLocale,
})

// 如果有自定义语言包，合并它们
if (props.customLocale) {
  mergeCustomLocale(props.customLocale)
}

function onReady(): void {
  isCropperPending.value = false
}

function crop(): void {
  const { canvas } = cropperRef.value.getResult()
  const cropedImage = canvas.toDataURL()

  emit('crop', cropedImage)
  emit('update:modelValue', false)
}

function rotate(angle: number): void {
  cropperRef.value.rotate(angle)
}

function reset(): void {
  cropperRef.value.reset()
}

function cancel(): void {
  emit('update:modelValue', false)
}

// 向后兼容：获取文本的辅助函数
const getText = (key: string, fallback: string) => {
  try {
    return t(key)
  } catch {
    return fallback
  }
}
</script>

<template>
  <div v-if="props.modelValue" class=":uno: absolute z-3000 inset-0 left-0 right-0 top-0 bottom-0 bg-black flex justify-center items-center">
    <!-- pending -->
    <template v-if="isCropperPending">
      <div class=":uno: absolute bg-white rounded-4 size-30 mx-auto flex flex-col justify-center items-center space-y-2 text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5" /><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate" /></path></svg>
        <span>{{ getText('loading', props.loadingText) }}</span>
      </div>
    </template>
    <!-- canvas -->
    <Cropper
      ref="cropperRef"
      class=":uno: h-full w-full [&_.vue-simple-handler-wrapper]:(size-6) [&_.vue-simple-handler--west-north]:(size-4 opacity-100) [&_.vue-simple-handler--east-south]:(size-4 opacity-100) [&_.vue-simple-handler--west-south]:(size-4 opacity-100) [&_.vue-simple-handler--east-north]:(size-4 opacity-100)"

      bsrc="https://0.z.wiki/autoupload/20240708/BSGF/1130X750/65535_53035727810_fce2af1c7e_h_750_1130_nofilter.jp"
      :src="src"
      :auto-zoom="true"
      :stencil-props="{
        movable: false,
        resizable: true,
        aspectRatio: props.aspectRatio,
        handlers: {
          eastNorth: true,
          north: false,
          westNorth: true,
          west: false,
          westSouth: true,
          south: false,
          eastSouth: true,
          east: false,
        },
      }"
      image-restriction="stencil"
      :resize-image="{ touch: true, wheel: true, adjustStencil: false }"
      :min-width="300"
      :min-height="300"
      @ready="onReady"
    />

    <!-- :stencilSize="{
        width: 300,
	      height: 300,
      }" -->

    <!-- action -->
    <div class=":uno: absolute bottom-0 w-full bg-[#111]/70 text-white divide-x-0 divide-y-1 divide-solid divide-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div class=":uno: flex justify-between">
        <div class=":uno: px-6 py-5">
          <!-- Rotate -->
          <svg class=":uno: size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M18 14v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2M13.914 2.914L11.828 5H14a8 8 0 0 1 8 8h-2c0-3.308-2.692-6-6-6h-2.172l2.086 2.086L12.5 10.5L8 6l1.414-1.414L12.5 1.5z" @click="rotate(-90)" /></svg>
        </div>
        <div class=":uno: px-6 py-5" @click="reset">
          {{ getText('reset', props.resetText) }}
        </div>
      </div>
      <div class=":uno: flex justify-between">
        <div class=":uno: px-6 py-5" @click="cancel">
          {{ getText('cancel', props.cancelText) }}
        </div>
        <div class=":uno: px-6 py-5" @click="crop">
          {{ getText('confirm', props.confirmText) }}
        </div>
      </div>
    </div>
  </div>
</template>
