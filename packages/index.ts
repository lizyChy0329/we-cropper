import { getCurrentInstance, h, render } from 'vue'
import type { ComputedRef } from 'vue'

import type { EventHookOn } from '@vueuse/core'
import { createEventHook } from '@vueuse/core'

import type { UseCropperOptions, WeCropperOptions } from './types'
import Cropper from './cropper.vue'
import { useLocale } from './composables/useLocale'
import type { LocaleCode } from './types/locale'

export * from './utils'

const { on: onCrop, trigger } = createEventHook()

function createCropper(cropperConfig: WeCropperOptions): void {
  let teleportElement = document.body
  if (cropperConfig.el) {
    if (typeof cropperConfig.el === 'string') {
      teleportElement = document.getElementById(cropperConfig.el.slice(1)) || document.body
    }
    else {
      teleportElement = cropperConfig.el
    }
  }

  const defaultProps = {
    'src': cropperConfig.src,
    'modelValue': true,
    'onUpdate:modelValue': (value: boolean) => {
      if (!value) {
        render(null, teleportElement)
      }
    },
    'onCrop': (base64String: string) => {
      trigger(base64String)
    },
  }

  const cropperComponentProps = {
    ...defaultProps,
    ...cropperConfig,
  }

  type DefaultProps = typeof defaultProps
  type CropperComponentProps = DefaultProps & WeCropperOptions

  async function createCropperComponent(cropperComponentProps: CropperComponentProps): Promise<void> {
    const vueComponent = h(Cropper, cropperComponentProps)

    render(vueComponent, teleportElement)
  }

  createCropperComponent(cropperComponentProps)
}

export function useCropper(options: UseCropperOptions = {}): {
  onCrop: EventHookOn<any>
  showCropper: (src: string, config?: UseCropperOptions) => void
  setLocale: (locale: LocaleCode) => void
  currentLocale: ComputedRef<LocaleCode>
} {
  const appContext = getCurrentInstance()?.appContext
  if (!appContext) {
    throw new Error('useCropper can be used only in setup function')
  }

  // 初始化多语言功能
  const { setLocale, currentLocale } = useLocale({
    locale: options.locale || 'en',
    customLocale: options.customLocale,
  })

  const showCropper = (src: string, config?: UseCropperOptions): void => {
    const cropperConfig = {
      src,
      ...options,
      ...config,
      locale: currentLocale.value, // 使用动态的currentLocale值
    }

    createCropper(cropperConfig)
  }

  return {
    onCrop,
    showCropper,
    setLocale,
    currentLocale,
  }
}
