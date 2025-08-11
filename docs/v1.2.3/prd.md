# We-Cropper v1.2.3 多语言系统产品需求文档 (PRD)

## 版本信息

- **版本号**: v1.2.3
- **功能特性**: Vue i18 多语言系统支持
- **默认语言**: 英文
- **目标发布日期**: TBD

## 1. 项目概述

### 1.1 背景与目标

We-Cropper 作为一个国际化的图片裁剪组件库，需要支持多语言功能以满足全球用户的需求。当前版本的所有文本内容都是硬编码的英文，限制了组件库在非英语地区的使用。

**目标**:
- 实现完整的多语言支持系统
- 提供灵活的语言切换机制
- 保持向后兼容性
- 支持自定义语言包

### 1.2 核心价值

- **国际化**: 支持全球用户使用
- **可扩展性**: 易于添加新语言
- **用户体验**: 提供本地化界面
- **开发者友好**: 简单的 API 设计

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 多语言支持

**需求描述**: 组件库需要支持多种语言的界面文本显示

**功能点**:
- ✅ 默认英文界面
- ✅ 支持中文简体
- ✅ 支持中文繁体
- ✅ 支持其他主流语言 (日语、韩语、法语、德语、西班牙语)

**技术实现**:
- 使用 Vue I18n 作为国际化解决方案
- 创建语言包文件结构
- 实现语言切换机制

#### 2.1.2 语言切换机制

**需求描述**: 提供灵活的语言切换方式

**功能点**:
- ✅ 全局语言配置
- ✅ 运行时语言切换
- ✅ 组件级别语言覆盖
- ✅ 自动语言检测 (可选)

**API 设计**:
```typescript
// 全局配置
useCropper({
  locale: 'zh-CN', // 设置语言
  // ... 其他配置
})

// 运行时切换
const { setLocale } = useCropperLocale()
setLocale('ja-JP')
```

#### 2.1.3 自定义语言包

**需求描述**: 允许开发者自定义或扩展语言包

**功能点**:
- ✅ 支持自定义语言包
- ✅ 支持语言包扩展
- ✅ 支持部分文本覆盖
- ✅ 语言包验证机制

**API 设计**:
```typescript
// 自定义语言包
const customLocale = {
  'zh-CN': {
    loading: '正在加载...',
    reset: '重置',
    confirm: '确认',
    cancel: '取消'
  }
}

useCropper({
  customLocale,
  // ... 其他配置
})
```

### 2.2 界面文本国际化

#### 2.2.1 按钮文本

**需要国际化的文本**:
- Loading... (加载中...)
- Reset (还原/重置)
- Confirm (确定/确认)
- Cancel (取消)

#### 2.2.2 提示信息

**需要国际化的文本**:
- 错误提示信息
- 成功提示信息
- 操作提示信息

#### 2.2.3 工具提示

**需要国际化的文本**:
- 旋转按钮提示
- 重置按钮提示
- 其他操作按钮提示

## 3. 技术设计

### 3.1 技术选型

#### 3.1.1 Vue I18n

**选择理由**:
- Vue 官方推荐的国际化解决方案
- 与 Vue 3 完全兼容
- 丰富的功能和 API
- 活跃的社区支持

**版本要求**:
- Vue I18n 9.x+ (Vue 3 兼容版本)

#### 3.1.2 语言包结构

**目录结构**:
```
packages/
├── locales/
│   ├── index.ts           # 语言包入口
│   ├── en.ts             # 英文语言包
│   ├── zh-CN.ts          # 中文简体
│   ├── zh-TW.ts          # 中文繁体
│   ├── ja.ts             # 日语
│   ├── ko.ts             # 韩语
│   ├── fr.ts             # 法语
│   ├── de.ts             # 德语
│   └── es.ts             # 西班牙语
├── types/
│   └── locale.ts         # 语言包类型定义
└── composables/
    └── useLocale.ts      # 语言切换组合式函数
```

### 3.2 API 设计

#### 3.2.1 语言包类型定义

```typescript
// packages/types/locale.ts
export interface LocaleMessages {
  loading: string
  reset: string
  confirm: string
  cancel: string
  rotate: string
  error: {
    loadImage: string
    cropImage: string
  }
  tooltip?: {
    rotate: string
    reset: string
  }
}

export type LocaleCode = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'fr' | 'de' | 'es'

export interface LocaleConfig {
  locale?: LocaleCode
  fallbackLocale?: LocaleCode
  customLocale?: Partial<Record<LocaleCode, Partial<LocaleMessages>>>
}
```

#### 3.2.2 语言包实现

```typescript
// packages/locales/en.ts
export default {
  loading: 'Loading...',
  reset: 'Reset',
  confirm: 'Confirm',
  cancel: 'Cancel',
  rotate: 'Rotate',
  error: {
    loadImage: 'Failed to load image',
    cropImage: 'Failed to crop image'
  },
  tooltip: {
    rotate: 'Rotate image',
    reset: 'Reset to original'
  }
}

// packages/locales/zh-CN.ts
export default {
  loading: '加载中...',
  reset: '还原',
  confirm: '确定',
  cancel: '取消',
  rotate: '旋转',
  error: {
    loadImage: '图片加载失败',
    cropImage: '图片裁剪失败'
  },
  tooltip: {
    rotate: '旋转图片',
    reset: '还原原始状态'
  }
}
```

#### 3.2.3 组合式函数设计

```typescript
// packages/composables/useLocale.ts
import { ref, computed } from 'vue'
import { createI18n } from 'vue-i18n'
import type { LocaleCode, LocaleConfig, LocaleMessages } from '../types/locale'
import en from '../locales/en'
import zhCN from '../locales/zh-CN'
// ... 其他语言包导入

const defaultLocale: LocaleCode = 'en'

const messages = {
  en,
  'zh-CN': zhCN,
  // ... 其他语言包
}

export function useLocale(config: LocaleConfig = {}) {
  const { locale = defaultLocale, fallbackLocale = 'en', customLocale = {} } = config
  
  // 合并自定义语言包
  const mergedMessages = {
    ...messages,
    ...customLocale
  }
  
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale,
    messages: mergedMessages
  })
  
  const currentLocale = ref<LocaleCode>(locale)
  
  const setLocale = (newLocale: LocaleCode) => {
    currentLocale.value = newLocale
    i18n.global.locale.value = newLocale
  }
  
  const t = (key: string) => {
    return i18n.global.t(key)
  }
  
  return {
    currentLocale: computed(() => currentLocale.value),
    setLocale,
    t,
    i18n
  }
}
```

### 3.3 组件集成

#### 3.3.1 Cropper 组件修改

```vue
<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import type { WeCropperOptions } from './types'

const props = withDefaults(defineProps<{
  modelValue: boolean
} & WeCropperOptions>(), {
  modelValue: false,
  aspectRatio: 1 / 1,
  // 移除硬编码的文本属性
})

const { t } = useLocale({
  locale: props.locale,
  customLocale: props.customLocale
})

// 在模板中使用 t() 函数
</script>

<template>
  <div class="cropper-container">
    <!-- 使用国际化文本 -->
    <span>{{ t('loading') }}</span>
    <button>{{ t('reset') }}</button>
    <button>{{ t('confirm') }}</button>
    <button>{{ t('cancel') }}</button>
  </div>
</template>
```

#### 3.3.2 useCropper Hook 修改

```typescript
// packages/index.ts
export function useCropper(options: UseCropperOptions = {}) {
  const { locale = 'en', customLocale, ...cropperOptions } = options
  
  const showCropper = (src: string): void => {
    const cropperConfig = {
      src,
      locale,
      customLocale,
      ...cropperOptions
    }
    
    createCropper(cropperConfig)
  }
  
  return {
    onCrop,
    showCropper,
    // 新增语言控制方法
    setLocale: (newLocale: LocaleCode) => {
      // 实现语言切换逻辑
    }
  }
}
```

## 4. 数据设计

### 4.1 语言包数据结构

```typescript
interface LocaleMessage {
  [key: string]: string | LocaleMessage
}

interface LocaleMessages {
  [locale: string]: LocaleMessage
}
```

### 4.2 语言包示例

```json
{
  "en": {
    "loading": "Loading...",
    "reset": "Reset",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "rotate": "Rotate",
    "error": {
      "loadImage": "Failed to load image",
      "cropImage": "Failed to crop image"
    },
    "tooltip": {
      "rotate": "Rotate image",
      "reset": "Reset to original"
    }
  },
  "zh-CN": {
    "loading": "加载中...",
    "reset": "还原",
    "confirm": "确定",
    "cancel": "取消",
    "rotate": "旋转",
    "error": {
      "loadImage": "图片加载失败",
      "cropImage": "图片裁剪失败"
    },
    "tooltip": {
      "rotate": "旋转图片",
      "reset": "还原原始状态"
    }
  }
}
```

## 5. 非功能需求

### 5.1 性能要求

- **包大小影响**: 语言包应该按需加载，避免增加主包大小
- **内存使用**: 语言包应该合理管理，避免内存泄漏
- **切换性能**: 语言切换应该快速响应，无卡顿

### 5.2 兼容性要求

- **向后兼容**: 现有 API 保持不变，新增语言相关配置为可选
- **Vue 版本**: 兼容 Vue 3.0+
- **TypeScript**: 完整的类型支持

### 5.3 可维护性要求

- **代码结构**: 清晰的目录结构和模块划分
- **文档完善**: 提供完整的 API 文档和使用示例
- **测试覆盖**: 核心功能单元测试覆盖

## 6. 测试策略

### 6.1 单元测试

- **语言包加载测试**: 验证语言包正确加载
- **语言切换测试**: 验证语言切换功能正常
- **文本渲染测试**: 验证国际化文本正确显示

### 6.2 集成测试

- **组件集成测试**: 验证 Cropper 组件与多语言系统集成
- **Hook 集成测试**: 验证 useCropper hook 的多语言支持

### 6.3 E2E 测试

- **完整流程测试**: 验证完整的多语言使用流程
- **浏览器兼容性测试**: 验证在不同浏览器中的表现

## 7. 风险评估

### 7.1 技术风险

- **Vue I18n 依赖**: 增加 Vue I18n 依赖可能影响包大小
- **向后兼容**: 需要确保现有用户的代码不受影响
- **性能影响**: 多语言系统可能影响组件性能

### 7.2 缓解措施

- **按需加载**: 语言包按需加载，减少主包大小
- **渐进式升级**: 保持现有 API 兼容，新功能作为可选配置
- **性能优化**: 合理的语言包管理和缓存策略

## 8. 发布计划

### 8.1 开发阶段

- **Week 1**: 技术调研和方案设计
- **Week 2**: 核心功能开发
- **Week 3**: 组件集成和测试
- **Week 4**: 文档编写和优化

### 8.2 测试阶段

- **Week 5**: 单元测试和集成测试
- **Week 6**: E2E 测试和性能测试
- **Week 7**: Bug 修复和优化

### 8.3 发布阶段

- **Week 8**: RC 版本发布
- **Week 9**: 用户反馈收集和修复
- **Week 10**: 正式版本发布

## 9. 成功指标

### 9.1 功能指标

- ✅ 支持至少 8 种语言
- ✅ 语言切换功能正常
- ✅ 自定义语言包功能正常
- ✅ 向后兼容性保持

### 9.2 质量指标

- ✅ 单元测试覆盖率 > 80%
- ✅ 集成测试覆盖率 > 70%
- ✅ 无关键 bug
- ✅ 性能影响 < 5%

### 9.3 用户体验指标

- ✅ API 使用简单直观
- ✅ 文档清晰完整
- ✅ 示例代码可运行
- ✅ 错误处理友好

## 10. 附录

### 10.1 参考文档

- [Vue I18n 官方文档](https://vue-i18n.intlify.dev/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

### 10.2 相关工具

- **构建工具**: Vite
- **测试工具**: Vitest
- **代码检查**: ESLint
- **格式化工具**: Prettier

### 10.3 术语表

- **i18n**: Internationalization (国际化)
- **l10n**: Localization (本地化)
- **Locale**: 语言环境标识符 (如: en, zh-CN)
- **Language Pack**: 语言包
- **Fallback**: 回退语言

---

**文档版本**: v1.0
**最后更新**: 2024-01-01
**负责人**: 开发团队
**审核人**: 产品经理