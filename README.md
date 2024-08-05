# wip...

尚未上传到 npm ，但代码 pnpm build 后可用

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

## 用法

```javascript
// lizy0329-biubiubiu/we-cropper
import { fileToBase64, useCropper } from 'lizy0329-biubiubiu/we-cropper'
import 'lizy0329-biubiubiu/we-cropper/style.css'
const { showCropper, onCrop } = useCropper({
  'aspect-ratio': 1 / 1,
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

## 开发调试

开发：pnpm dev
生产：pnpm build
