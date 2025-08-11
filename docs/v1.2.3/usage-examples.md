# we-cropper v1.2.3 多语言系统使用示例

## 基础使用

### 1. 安装依赖

```bash
npm install vue-i18n@^9.0.0
# 或
pnpm add vue-i18n@^9.0.0
```

### 2. 基本用法

```typescript
import { useCropper } from '@lizychy0329/we-cropper'

// 基础使用（默认英文）
const { showCropper } = useCropper()

// 显示裁剪器
showCropper('data:image/png;base64,...')
```

### 3. 指定语言

```typescript
import { useCropper } from '@lizychy0329/we-cropper'

// 使用中文
const { showCropper } = useCropper({
  locale: 'zh-cn'
})

showCropper('data:image/png;base64,...')
```

### 4. 动态语言切换

```typescript
import { useCropper } from '@lizychy0329/we-cropper'
import { ref } from 'vue'

const { showCropper, setLocale, currentLocale } = useCropper({
  locale: 'en'
})

const currentLang = ref('en')

function changeLanguage(lang: string) {
  setLocale(lang as any)
  currentLang.value = lang
}

// 在模板中使用
function showCropperWithLang() {
  showCropper('data:image/png;base64,...')
}
```

### 5. 自定义语言包

```typescript
import { useCropper } from '@lizychy0329/we-cropper'

const customLocale = {
  'zh-cn': {
    loading: '正在加载图片...',
    reset: '重置图片',
    confirm: '确认裁剪',
    cancel: '取消操作',
    rotate: '旋转图片',
    error: {
      loadImage: '图片加载失败',
      cropImage: '图片裁剪失败'
    },
    tooltip: {
      rotate: '点击旋转图片',
      reset: '恢复原始状态'
    }
  }
}

const { showCropper } = useCropper({
  locale: 'zh-cn',
  customLocale
})

showCropper('data:image/png;base64,...')
```

### 6. 在vue组件中使用

```vue
<template>
  <div>
    <button @click="showCropperWithEn">英文裁剪器</button>
    <button @click="showCropperWithZh">中文裁剪器</button>
    <button @click="showCropperWithCustom">自定义语言</button>
  </div>
</template>

<script setup lang="ts">
import { useCropper } from '@lizychy0329/we-cropper'

// 英文裁剪器
const { showCropper: showCropperEn } = useCropper({
  locale: 'en'
})

// 中文裁剪器
const { showCropper: showCropperZh } = useCropper({
  locale: 'zh-cn'
})

// 自定义语言裁剪器
const customLocale = {
  'zh-cn': {
    loading: '请稍等，图片加载中...',
    reset: '重新开始',
    confirm: '完成裁剪',
    cancel: '放弃操作'
  }
}

const { showCropper: showCropperCustom } = useCropper({
  locale: 'zh-cn',
  customLocale
})

const showCropperWithEn = () => {
  showCropperEn('data:image/png;base64,...')
}

const showCropperWithZh = () => {
  showCropperZh('data:image/png;base64,...')
}

const showCropperWithCustom = () => {
  showCropperCustom('data:image/png;base64,...')
}
</script>
```

## 支持的语言列表

| 语言代码 | 语言名称 | 文件名 |
|----------|----------|--------|
| en | 英语 | en.ts |
| zh-cn | 中文简体 | zh-cn.ts |
| zh-tw | 中文繁体 | zh-tw.ts |
| ja | 日语 | ja.ts |
| ko | 韩语 | ko.ts |
| fr | 法语 | fr.ts |
| de | 德语 | de.ts |
| es | 西班牙语 | es.ts |
| ru | 俄语 | ru.ts |

## api 参考

### useCropper

```typescript
function useCropper(options: useCropperOptions = {}): {
  onCrop: eventHookOn<any>     // 裁剪完成事件
  showCropper: (src: string) => void  // 显示裁剪器
  setLocale: (locale: localeCode) => void  // 设置语言
  currentLocale: computedRef<localeCode>  // 当前语言
}
```

### useCropperOptions

```typescript
interface useCropperOptions {
  locale?: localeCode                    // 语言设置
  customLocale?: Partial<Record<localeCode, Partial<localeMessages>>>  // 自定义语言包
  aspectRatio?: number                   // 裁剪比例
  el?: HTMLElement | string             // 挂载元素
  // 其他配置项...
}
```

### 向后兼容

为了保持向后兼容，原有的文本配置项仍然支持，但已标记为废弃：

```typescript
// 这些配置项仍然可用，但建议使用 locale 配置
loadingText?: string    // 加载文本
resetText?: string      // 重置文本
confirmText?: string    // 确认文本
cancelText?: string     // 取消文本
```

## 迁移指南

### 从 v1.2.2 迁移到 v1.2.3

#### 1. 安装依赖

```bash
npm install vue-i18n@^9.0.0
```

#### 2. 更新代码

**之前 (v1.2.2):**

```typescript
const { showCropper } = useCropper({
  loadingText: 'loading...',
  resetText: 'reset',
  confirmText: 'confirm',
  cancelText: 'cancel'
})
```

**之后 (v1.2.3):**

```typescript
// 方式1：使用预设语言
const { showCropper } = useCropper({
  locale: 'en'
})

// 方式2：使用自定义语言包
const { showCropper } = useCropper({
  locale: 'en',
  customLocale: {
    en: {
      loading: 'loading...',
      reset: 'reset',
      confirm: 'confirm',
      cancel: 'cancel'
    }
  }
})

// 方式3：保持向后兼容（不推荐）
const { showCropper } = useCropper({
  loadingText: 'loading...',
  resetText: 'reset',
  confirmText: 'confirm',
  cancelText: 'cancel'
})
```

#### 3. 新增功能

```typescript
// 动态语言切换
const { showCropper, setLocale, currentLocale } = useCropper()

// 切换到中文
setLocale('zh-cn')

// 获取当前语言
console.log(currentLocale.value) // 'zh-cn'
```

## 常见问题

### q: 如何添加新的语言支持？

a: 可以通过自定义语言包的方式添加新语言：

```typescript
const customLocale = {
  'ru': { // 俄语
    loading: 'загрузка...',
    reset: 'сброс',
    confirm: 'подтвердить',
    cancel: 'отмена',
    rotate: 'повернуть',
    error: {
      loadImage: 'Ошибка загрузки изображения',
      cropImage: 'Ошибка обрезки изображения'
    },
    tooltip: {
      rotate: 'Повернуть',
      reset: 'Сброс'
    }
  }
}

const { showCropper } = useCropper({
  locale: 'ru'
})
```

### q: 语言包不生效怎么办？

a: 请检查以下几点：

1. 确保已安装 vue-i18n 依赖
2. 检查语言代码是否正确（如 'zh-cn' 而不是 'zh'）
3. 确保自定义语言包的格式正确

### q: 如何在运行时切换语言？

a: 使用 setlocale 方法：

```typescript
const { setLocale } = useCropper()
setLocale('zh-cn')  // 切换到中文
```

---

**版本**: v1.2.3  
**最后更新**: 2024-01-01  
**维护者**: we-cropper 开发团队

## 宣传语

```
we-cropper: A powerful WeChat-style image cropper built with Vue 3, now featuring i18n support with vibeCoding!

Example URL: <https://lizychy0329.github.io/we-cropper/>
```
