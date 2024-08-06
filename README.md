# we-cropper

仿微信裁剪器

Wechat style image cropper wrapper with vue-advanced-cropper

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
import '@lizychy0329/we-cropper/style.css'
const { showCropper, onCrop } = useCropper({
  aspectRatio: 1 / 1,
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

  // 上传...
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
     * Cropper box aspect-ratio controll
     *
     * @default 1 / 1
     */
    aspectRatio?: number;
}

export { }
```

## 开发调试

开发：pnpm dev
生产：pnpm build
