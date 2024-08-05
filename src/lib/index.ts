import { h, render } from 'vue'
import { createEventHook } from '@vueuse/core'
import type { UseCropperOptions, WeCropperOptions } from './types'
import Cropper from './cropper.vue'

export * from './utils'

const { on: onCrop, trigger } = createEventHook()

function createCropper(cropperConfig: WeCropperOptions) {
  const bodyEl = document.body

  const defaultProps = {
    'src': cropperConfig.src,
    'modelValue': true,
    'onUpdate:modelValue': (value: boolean) => {
      if (!value) {
        render(null, bodyEl)
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

  async function createCropperComponent(cropperComponentProps: CropperComponentProps) {
    const vueComponent = h(Cropper, cropperComponentProps)

    render(vueComponent, bodyEl)
  }

  createCropperComponent(cropperComponentProps)

  return () => {
    // destroy component
    render(null, bodyEl)
  }
}

export function useCropper(options: UseCropperOptions = {}) {
  const showCropper = (src: string) => {
    const cropperConfig = {
      src,
      ...options,
    }

    createCropper(cropperConfig)
  }

  return {
    onCrop,
    showCropper,
  }
}
