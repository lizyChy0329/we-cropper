# we-cropper

仿微信裁剪器

A simply wechat-style image cropper wrapped with vue-advanced-cropper

## 特性

- ✨API 简单
- ✨固定裁剪框
- ✨自动放大裁剪区域
- ✨默认 esm umd 格式支持
- ✨Typescript 友好

## 要求

"vue": "^3.0.0"

## 安装

`pnpm i @lizychy0329/we-cropper`

## 用法

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

## 截图

![仿微信裁剪器](https://files.catbox.moe/hcjd0s.png)

## 类型&API

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

## 开发调试

开发：pnpm dev / pnpm watch:lib

生产：pnpm build:lib

~~*x 增大按钮点击区域*~~

~~*x 添加文案修改接口*~~

x 调整 icon
