import { getCurrentInstance, h, render } from 'vue'

import type { EventHookOn } from '@vueuse/core'
import { createEventHook } from '@vueuse/core'

import type { UseCropperOptions, WeCropperOptions } from './types'
import Cropper from './cropper.vue'

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
  showCropper: (src: string) => void
} {
  const appContext = getCurrentInstance()?.appContext
  if (!appContext) {
    throw new Error('useCropper can be used only in setup function')
  }

  const showCropper = (src: string): void => {
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
