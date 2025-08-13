# We-Cropper 项目指导文档

> 本文档为 Trae AI 提供项目上下文，确保代码实现符合项目规范和最佳实践

## product

We-Cropper 是一个基于 Vue 3 的微信风格图片裁剪组件库，专注于提供简单易用的图片裁剪解决方案。该产品的主要用途包括：

- **图片裁剪**: 提供固定裁剪框、自动缩放裁剪区域等功能
- **多平台支持**: 同时支持移动端和桌面端使用
- **组件库模式**: 可作为 npm 包集成到各种 Vue 3 项目中
- **国际化支持**: 内置多语言支持，包括中文、英文、日文等9种语言
- **多种裁剪形状**: 支持矩形和圆形裁剪模式

该产品适用于需要图片裁剪功能的 Web 应用，特别适合需要微信风格界面的项目。

## tech

### 核心技术栈

- **前端框架**: Vue.js 3.x + Composition API + setup 语法糖
- **构建工具**: Vite 5.x
- **语言**: TypeScript (严格模式)
- **样式方案**: UnoCSS (原子类)
- **底层裁剪库**: vue-advanced-cropper
- **工具库**: @vueuse/core
- **国际化**: vue-i18n
- **包管理器**: pnpm

### 开发工具

- **代码检查**: ESLint + @antfu/eslint-config
- **Git Hooks**: simple-git-hooks
- **版本管理**: bumpp
- **文档生成**: VitePress

### 构建配置

- **多模式构建**: 支持 lib（组件库）和 docs（文档）两种构建模式
- **输出格式**: 同时支持 ESM、UMD 和 TypeScript 类型定义
- **代码分割**: 优化包大小，支持按需加载

## structure

### 项目目录结构

```
we-cropper/
├── packages/                 # 组件库源码
│   ├── index.ts             # 主入口文件，导出 useCropper hook
│   ├── cropper.vue         # 核心裁剪组件
│   ├── types.ts            # TypeScript 类型定义
│   ├── utils.ts            # 工具函数
│   ├── composables/        # 组合式函数
│   │   └── useLocale.ts    # 国际化相关
│   ├── locales/            # 语言包
│   │   ├── en.ts          # 英文
│   │   ├── zh-CN.ts       # 简体中文
│   │   ├── zh-TW.ts       # 繁体中文
│   │   ├── ja.ts          # 日文
│   │   ├── ko.ts          # 韩文
│   │   ├── fr.ts          # 法文
│   │   ├── de.ts          # 德文
│   │   ├── es.ts          # 西班牙文
│   │   └── ru.ts          # 俄文
│   └── types/              # 类型定义
│       └── locale.ts      # 国际化类型
├── src/                    # 文档站点源码
│   ├── App.vue            # 主应用组件
│   ├── main.ts            # 入口文件
│   └── components/        # 文档组件
│       ├── Playground.vue # 演示组件
│       └── Logo.vue       # Logo 组件
├── docs/                   # 构建后的文档
├── dist/                   # 构建后的组件库
├── .github/               # GitHub 配置
│   └── workflows/         # CI/CD 工作流
├── .trae/                 # Trae AI 配置
│   └── rules/             # 项目规则文档
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

### 组件设计模式

#### 核心组件
- **Cropper.vue**: 主要的裁剪组件，包含裁剪界面和交互逻辑
- **useCropper**: 核心 hook，提供裁剪功能的 API
- **工具函数**: fileToBase64、base64ToBlob、urlToBase64

#### 代码组织原则
- **单一职责**: 每个文件只负责一个核心功能
- **类型安全**: 完整的 TypeScript 类型定义
- **组合式 API**: 优先使用 Composition API 和 setup 语法糖
- **原子化样式**: 使用 UnoCSS 避免自定义 CSS

### 命名约定

- **文件/目录**: kebab-case (如: `cropper.vue`)
- **组件**: PascalCase (如: `Cropper.vue`)
- **函数**: camelCase (如: `useCropper`, `fileToBase64`)
- **接口**: PascalCase (如: `WeCropperOptions`)
- **类型**: PascalCase (如: `UseCropperOptions`)
- **常量**: UPPER_SNAKE_CASE (如: `LOCALE_CODES`)

### 开发工作流

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

# 发布版本
pnpm release
```

### 构建规范

- **库模式**: 生成 ESM、UMD 和 TypeScript 类型定义
- **文档模式**: 生成静态文档站点
- **外部依赖**: vue 和 vue-i18n 作为 peerDependencies
- **代码分割**: 优化包大小和加载性能

---

## 指令录入

> 请为该项目生成项目指导文档（project_rules.md），这些文档存储在 .trae/rules/中 ，用于指导 Trae 的行为。它们包含以下信息：
>
>  - Your product and its purpose（您的产品及其用途）（用 product 作为分割）
>
>  - Technical stack and frameworks（技术堆栈和框架）（用 tech 作为分割）
>
>  - Project structure and conventions（项目结构和惯例）（用 structure 作为分割）
>
>  同时，将以上这段指令 录入到 project_rules.md 上
