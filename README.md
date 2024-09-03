<h2 align="center"><img src="https://files.catbox.moe/cmdn41.svg" height="128" /><br />we-cropper</h2>
<p align="center"><strong>⚡️ A simply wechat-style image cropper wrapped with vue-advanced-cropper
</strong></p>
<p align=center>
<a href="https://www.npmjs.com/package/@lizychy0329/we-cropper"><img alt="NPM Version" src="https://img.shields.io/npm/v/%40lizychy0329%2Fwe-cropper?color=25234c1&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lizychy0329%2Fwe-cropper"></a>
</p>

## Feature

- ✨ Easy to use: only one core `useCropper`
- 🚀 Fixed cropping box
- 🎯 Automatically zoom-in on the crop area
- ❄️ ESM / UMD support
- 🦾 Typescript support

## peerDependencies

"vue": "^3.0.0"

## Install

`pnpm i @lizychy0329/we-cropper`

## Usage

```javascript
// @lizychy0329/we-cropper
import { fileToBase64, useCropper } from '@lizychy0329/we-cropper'

const { showCropper, onCrop } = useCropper({
  el: '#demoContainer', // default: document.body
  aspectRatio: 1 / 1,
  loadingText: '加载中...',
  resetText: '还原',
  confirmText: '确定',
  cancelText: '取消',
})

// @vueuse/core
const { open, onChange } = useFileDialog({
  multiple: false,
  accept: 'image/*'
})

// start
const cropedImage = ref('')
onChange(async (files) => {
  const base64String = await fileToBase64(files[0])
  showCropper(base64String)
})

onCrop((base64String) => {
  cropedImage.value = base64String

  // upload you cropedImage to OSS...
})
```

## Screenshot

![we-cropper](https://files.catbox.moe/hcjd0s.png)

## Typescript

```Typescript
/**
 * @description: base64 to blob
 * @param base64String
 */
export declare function base64ToBlob(base64String: string): Promise<Blob>;

/**
 * @description: blob to base64
 * @param file
 */
export declare function fileToBase64(file: File): Promise<string>;

/**
 * @description: url to base64
 * @param url
 * @param mineType 'image/png'
 */
export declare function urlToBase64(url: string, mineType?: string): Promise<string>;

export declare function useCropper(options?: UseCropperOptions): {
    onCrop: EventHookOn<any>;
    showCropper: (src: string) => void;
};

declare type UseCropperOptions = Omit<WeCropperOptions, 'src'>;

declare interface WeCropperOptions {
    /**
     * A base64string created from File
     *
     * @remarks Can use utils/fileToBase64 methods to transform
     */
    src: string;
    /**
     * Like teleport API in Vue3
     *
     * @default document.body
     */
    el?: HTMLElement | string
    /**
     * Cropper box aspect-ratio controll
     *
     * @default 1 / 1
     */
    aspectRatio?: number;

    /**
     * loading text
     *
     * @default Loading...
     */
    loadingText?: string

    /**
     * reset button text
     *
     * @default Reset
     */
    resetText?: string

    /**
     * confirm button text
     *
     * @default Confirm
     */
    confirmText?: string

    /**
     * cancel button text
     *
     * @default Cancel
     */
    cancelText?: string
}

export { }
```

## Local Dev

dev：pnpm dev / pnpm watch:lib

build：pnpm build:lib
