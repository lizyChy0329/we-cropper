# We-Cropper 项目开发规范与最佳实践指南

> 本文件为AI提供充分的项目上下文，确保代码实现符合项目规范和最佳实践

## 项目概述

We-Cropper 是一个基于 Vue 3 的微信风格图片裁剪组件库，使用 vue-advanced-cropper 作为底层裁剪引擎。该组件库提供简单易用的 API，支持固定裁剪框、自动缩放裁剪区域等功能。

## 技术栈与核心能力

### 核心技术栈

- **前端框架**: Vue.js 3.x + Composition API + setup 语法糖
- **构建工具**: Vite 5.x
- **语言**: TypeScript (严格模式)
- **样式方案**: UnoCSS (原子类)
- **底层裁剪库**: vue-advanced-cropper
- **工具库**: @vueuse/core
- **包管理器**: pnpm

### 项目特点

- **组件库模式**: 同时支持 ESM / UMD 构建
- **TypeScript 支持**: 完整的类型定义
- **微信风格**: 仿微信图片裁剪界面
- **简单易用**: 只需一个核心 `useCropper` hook
- **响应式设计**: 支持移动端和桌面端

## 组件设计规范

### 核心组件结构

```
packages/
├── index.ts              # 主入口文件，导出 useCropper hook
├── cropper.vue          # 核心裁剪组件
├── types.ts             # TypeScript 类型定义
└── utils.ts             # 工具函数 (fileToBase64, base64ToBlob, urlToBase64)
```

### Hook 设计模式

```typescript
// 标准的 useCropper hook 使用模式
const { showCropper, onCrop } = useCropper({
  el: '#demoContainer',
  aspectRatio: 1 / 1,
  loadingText: '加载中...',
  resetText: '还原',
  confirmText: '确定',
  cancelText: '取消',
})
```

### 组件创建原则

1. **单一职责**: 每个组件只负责一个核心功能
2. **Composition API**: 优先使用 setup 语法糖
3. **类型安全**: 完整的 TypeScript 类型定义
4. **Props 默认值**: 为所有可选 props 提供合理的默认值
5. **事件驱动**: 使用 emit 进行组件间通信

## 代码规范

### 命名约定

- **文件/目录**: kebab-case (如: `cropper.vue`)
- **组件**: PascalCase (如: `Cropper.vue`)
- **函数**: camelCase (如: `useCropper`, `fileToBase64`)
- **接口**: PascalCase (如: `WeCropperOptions`)
- **类型**: PascalCase (如: `UseCropperOptions`)

### TypeScript 规范

```typescript
// 优先使用 interface 定义对象类型
export interface WeCropperOptions {
  src: string
  el?: HTMLElement | string
  aspectRatio?: number
  loadingText?: string
  resetText?: string
  confirmText?: string
  cancelText?: string
}

// 使用 Omit 工具类型创建相关类型
export type UseCropperOptions = Omit<WeCropperOptions, 'src'>

// 为函数参数提供默认值
export function useCropper(options: UseCropperOptions = {})
```

### 组件结构模板

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { WeCropperOptions } from './types'

const props = withDefaults(defineProps<{
  modelValue: boolean
} & WeCropperOptions>(), {
  modelValue: false,
  aspectRatio: 1 / 1,
  loadingText: 'Loading...',
  resetText: 'Reset',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'crop', base64String: string): void
}>()

// 响应式状态
const cropper = ref()
const isCropperPending = ref(true)

// 方法定义
function crop(): void {
  const { canvas } = cropper.value.getResult()
  const cropedImage = canvas.toDataURL()
  
  emit('crop', cropedImage)
  emit('update:modelValue', false)
}
</script>
```

## 样式与UI规范

### UnoCSS 使用原则

- **原子类优先**: 使用 UnoCSS 原子类组合，避免自定义 CSS
- **响应式设计**: 移动优先，使用断点前缀
- **内联样式**: 通过 `:uno:` 指令使用 UnoCSS

```html
<!-- 正确示例 -->
<div class=":uno: absolute z-3000 inset-0 left-0 right-0 top-0 bottom-0 bg-black flex justify-center items-center">
  <div class=":uno: absolute bg-white rounded-4 size-30 mx-auto flex flex-col justify-center items-center space-y-2 text-lg">
    内容
  </div>
</div>

<!-- 错误示例 -->
<div style="position: absolute; z-index: 3000; background: black;">
  <!-- 避免内联样式 -->
</div>
```

### 微信风格设计

- **配色方案**: 黑色背景 + 白色操作栏
- **按钮布局**: 底部固定操作栏，分为两行
- **交互反馈**: 加载状态、旋转、重置、确认、取消操作
- **安全区域**: 支持 `env(safe-area-inset-bottom)`

## 构建与发布规范

### Vite 配置

```typescript
// 支持多种构建模式
- lib: 构建为组件库 (ESM + UMD + TypeScript)
- docs: 构建文档站点
```

### 包管理

- **包管理器**: pnpm (优先)
- **发布流程**: 使用 bumpp 进行版本管理
- **代码检查**: ESLint + lint-staged
- **Git Hooks**: simple-git-hooks

## 性能优化

### 组件优化

1. **按需渲染**: 使用 `v-if` 控制组件显示/隐藏
2. **事件处理**: 合理使用事件监听和清理
3. **资源优化**: 图片加载状态管理
4. **内存管理**: 组件销毁时清理 DOM 元素

### 代码分割

```typescript
// lib 模式下的代码分割
rollupOptions: {
  external: ['vue'],
  output: {
    globals: {
      vue: 'Vue',
    },
  },
}
```

## 测试规范

### 测试策略

- **单元测试**: 核心工具函数测试
- **组件测试**: Cropper 组件交互测试
- **集成测试**: useCropper hook 功能测试
- **E2E 测试**: 完整裁剪流程测试

### 测试工具

- **测试框架**: Vitest
- **组件测试**: @vue/test-utils
- **模拟工具**: vi.fn()

## 文档规范

### API 文档

- **类型定义**: 完整的 TypeScript 接口文档
- **使用示例**: 实际可运行的代码示例
- **参数说明**: 每个参数的类型、默认值、说明
- **事件说明**: 事件的参数和触发时机

### 更新日志

- **版本管理**: 语义化版本控制
- **变更记录**: 详细的功能变更和 bug 修复
- **兼容性说明**: 破坏性变更的迁移指南

## 常见问题与解决方案

### 移动端兼容性

- **触摸事件**: 确保裁剪操作在移动端流畅
- **安全区域**: 处理刘海屏和底部安全区域
- **性能优化**: 大图片裁剪时的性能优化

### 桌面端适配

- **鼠标交互**: 支持鼠标拖拽和滚轮缩放
- **键盘快捷键**: 支持旋转、重置等快捷操作
- **高分辨率**: 支持 4K 等高分辨率屏幕

## 开发工作流

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建组件库
pnpm build:lib

# 构建文档
pnpm build:docs

# 代码检查
pnpm lint
```

### 发布流程

```bash
# 版本升级
pnpm release

# 发布到 npm
npm publish
```

## 代码审查检查清单

- [ ] 组件功能符合需求
- [ ] TypeScript 类型定义完整
- [ ] Props 默认值合理
- [ ] 事件处理正确
- [ ] 样式符合微信风格
- [ ] 移动端兼容性良好
- [ ] 性能优化已考虑
- [ ] 文档更新完整
- [ ] 测试覆盖充分
- [ ] 代码注释清晰

---

## 特殊注意事项

### 组件库模式

- **外部依赖**: vue 作为 peerDependency
- **构建输出**: 同时支持 ESM 和 UMD 格式
- **类型文件**: 生成 .d.ts 类型定义文件
- **CSS 提取**: 库模式下的 CSS 处理

### 第三方库集成

- **vue-advanced-cropper**: 底层裁剪引擎
- **@vueuse/core**: 提供 createEventHook 等工具函数
- **UnoCSS**: 原子化 CSS 框架

### 版本兼容性

- **Vue 3**: 要求 Vue 3.0+ 版本
- **TypeScript**: 支持 TypeScript 5.x
- **构建工具**: Vite 5.x
- **Node.js**: 支持 Node 18+