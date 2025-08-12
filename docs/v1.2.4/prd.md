# We-Cropper 圆形裁剪框功能 PRD

## 文档信息

- **项目名称**: We-Cropper
- **功能名称**: 圆形裁剪框支持
- **版本**: v1.2.4
- **创建日期**: 2024年当前日期
- **负责人**: 产品经理
- **文档状态**: 草稿

## 1. 功能概述

### 1.1 背景描述

We-Cropper 目前只支持矩形裁剪框，但在很多实际应用场景中（如用户头像裁剪、圆形图标制作等），用户需要圆形裁剪功能。基于 vue-advanced-cropper 库的 CircleStencil 组件，我们可以为 We-Cropper 添加圆形裁剪框支持。

### 1.2 功能目标

- 在现有矩形裁剪框基础上，增加圆形裁剪框选项
- 保持与现有API的兼容性
- 提供简单易用的配置方式
- 支持动态切换裁剪框形状
- 保持微信风格的用户体验

### 1.3 目标用户

- 需要圆形头像裁剪的开发者
- 需要圆形图标制作的用户
- 希望提供多样化裁剪选择的应用开发者

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 圆形裁剪框模式

- **功能描述**: 支持圆形裁剪框，用户可以在圆形区域内进行图片裁剪
- **使用场景**: 用户头像裁剪、圆形图标制作等
- **技术实现**: 基于 vue-advanced-cropper 的 CircleStencil 组件
- **约束条件**: 圆形裁剪框强制使用 1:1 的宽高比

#### 2.1.2 裁剪框形状切换

- **功能描述**: 支持在矩形和圆形裁剪框之间动态切换
- **使用场景**: 用户根据需要选择不同的裁剪形状
- **技术实现**: 通过 stencil-component 属性动态切换组件
- **约束条件**: 切换时保持当前裁剪位置和缩放比例

#### 2.1.3 形状预览

- **功能描述**: 在裁剪过程中实时显示圆形裁剪效果预览
- **使用场景**: 用户裁剪时能够看到最终的圆形效果
- **技术实现**: 利用 CircleStencil 的预览功能
- **约束条件**: 预览效果与最终输出保持一致

### 2.2 扩展功能

#### 2.2.1 形状选择器

- **功能描述**: 在操作界面添加形状选择按钮
- **使用场景**: 用户可以方便地切换裁剪形状
- **技术实现**: 在底部操作栏添加形状切换按钮
- **约束条件**: 界面保持简洁，不影响现有操作

#### 2.2.2 智能比例适配

- **功能描述**: 切换到圆形模式时自动调整比例为 1:1
- **使用场景**: 避免用户手动调整比例的麻烦
- **技术实现**: 监听形状变化，自动设置 aspectRatio
- **约束条件**: 切换回矩形时恢复原有比例

## 3. 技术实现

### 3.1 技术架构

#### 3.1.1 依赖库分析

```typescript
// vue-advanced-cropper 已有的圆形裁剪支持
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
```

#### 3.1.2 组件结构设计

```typescript
// 新增的形状类型
type CropperShape = 'rectangle' | 'circle'

// 扩展的配置接口
interface ExtendedWeCropperOptions extends WeCropperOptions {
  shape?: CropperShape           // 裁剪框形状
}
```

### 3.2 API 设计

#### 3.2.1 Props 扩展

```typescript
interface WeCropperOptions {
  // 现有属性...
  
  // 新增属性
  shape?: 'rectangle' | 'circle'    // 裁剪框形状，默认为 'rectangle'
}
```

#### 3.2.2 事件扩展

```typescript
// 新增事件
type CropperEvents = {
  (e: 'shape-change', shape: CropperShape): void    // 形状变化事件
  (e: 'crop', base64String: string, shape: CropperShape): void  // 裁剪事件（包含形状信息）
}
```

#### 3.2.3 方法扩展

```typescript
// 新增方法
interface CropperMethods {
  setShape(shape: CropperShape): void    // 设置裁剪框形状
  getShape(): CropperShape               // 获取当前裁剪框形状
}
```

### 3.3 组件实现

#### 3.3.1 核心组件修改

```vue
<!-- packages/cropper.vue -->
<template>
  <div v-if="props.modelValue" class="cropper-container">
    <!-- 裁剪器组件 -->
    <Cropper
      ref="cropperRef"
      :src="src"
      :stencil-component="currentStencil"
      :stencil-props="getStencilProps()"
      :auto-zoom="true"
      image-restriction="stencil"
      @ready="onReady"
    />
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <!-- 形状切换按钮 -->
      <div class="shape-selector" @click="toggleShape">
        <svg v-if="currentShape === 'rectangle'" class="shape-icon">
          <!-- 矩形图标 -->
        </svg>
        <svg v-else class="shape-icon">
          <!-- 圆形图标 -->
        </svg>
      </div>
      
      <!-- 现有操作按钮 -->
      <div class="rotate-button" @click="rotate(-90)">
        <!-- 旋转图标 -->
      </div>
      <div class="reset-button" @click="reset">
        {{ getText('reset', props.resetText) }}
      </div>
    </div>
  </div>
</template>
```

#### 3.3.2 形状管理逻辑

```typescript
// 形状管理
const currentShape = ref<CropperShape>(props.shape || 'rectangle')
const currentStencil = computed(() => {
  return currentShape.value === 'circle' ? CircleStencil : undefined
})

// 获取 stencil 属性
function getStencilProps() {
  const baseProps = {
    movable: false,
    resizable: true,
    handlers: {
      eastNorth: true,
      north: false,
      westNorth: true,
      west: false,
      westSouth: true,
      south: false,
      eastSouth: true,
      east: false,
    },
  }
  
  if (currentShape.value === 'circle') {
    return {
      ...baseProps,
      aspectRatio: 1, // 圆形强制 1:1 比例
      preview: true,  // 启用预览
    }
  }
  
  return {
    ...baseProps,
    aspectRatio: props.aspectRatio,
  }
}

// 切换形状
function toggleShape() {
  const newShape = currentShape.value === 'rectangle' ? 'circle' : 'rectangle'
  setShape(newShape)
}

function setShape(shape: CropperShape) {
  currentShape.value = shape
  emit('shape-change', shape)
}
```

### 3.4 样式实现

#### 3.4.1 圆形裁剪框样式

```css
/* 圆形裁剪框样式 */
.circle-cropper {
  border-radius: 50%;
  overflow: hidden;
}

/* 形状选择器样式 */
.shape-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shape-selector:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.shape-icon {
  width: 24px;
  height: 24px;
  fill: white;
}
```

#### 3.4.2 响应式适配

```css
/* 移动端适配 */
@media (max-width: 768px) {
  .shape-selector {
    padding: 16px;
  }
  
  .shape-icon {
    width: 20px;
    height: 20px;
  }
}

/* 桌面端适配 */
@media (min-width: 769px) {
  .shape-selector {
    padding: 12px;
  }
  
  .shape-icon {
    width: 24px;
    height: 24px;
  }
}
```

## 4. 用户体验设计

### 4.1 交互流程

#### 4.1.1 默认矩形模式

1. 用户打开裁剪器，默认显示矩形裁剪框
2. 用户可以正常进行矩形裁剪操作
3. 用户可以通过形状切换按钮切换到圆形模式

#### 4.1.2 圆形模式切换

1. 用户点击形状切换按钮
2. 界面平滑过渡到圆形裁剪框
3. 自动调整宽高比为 1:1
4. 显示圆形裁剪预览效果

#### 4.1.3 裁剪操作流程

1. 用户选择图片
2. 用户选择裁剪形状（矩形/圆形）
3. 用户调整裁剪区域位置和大小
4. 用户点击确认按钮完成裁剪
5. 获得对应形状的裁剪结果

### 4.2 界面设计

#### 4.2.1 操作栏布局

```
+---------------------------------+
| [形状] [旋转]      [重置]       |
+---------------------------------+
| [取消]               [确认]     |
+---------------------------------+
```

#### 4.2.2 形状切换按钮

- **矩形图标**: 显示一个正方形轮廓
- **圆形图标**: 显示一个圆形轮廓
- **交互效果**: 点击切换，当前选中的形状图标高亮显示

#### 4.2.3 视觉反馈

- **切换动画**: 形状切换时有平滑的过渡动画
- **状态指示**: 当前选中的形状有明显的视觉区分
- **操作提示**: 长按形状按钮显示提示文本

### 4.3 错误处理

#### 4.3.1 图片加载失败

- **处理方式**: 显示错误提示，保持当前形状选择
- **用户提示**: "图片加载失败，请重试"

#### 4.3.2 圆形裁剪限制

- **处理方式**: 自动调整比例为 1:1，无需用户干预
- **用户提示**: 无需提示，保持界面简洁

#### 4.3.3 兼容性问题

- **处理方式**: 检测浏览器支持，不支持时回退到矩形模式
- **用户提示**: "您的浏览器不支持圆形裁剪，已切换到矩形模式"

## 5. 开发计划

### 5.1 开发阶段

#### 阶段一：基础功能实现（1周）

- [ ] 扩展类型定义，添加形状相关接口
- [ ] 修改 cropper.vue 组件，集成 CircleStencil
- [ ] 实现形状切换功能
- [ ] 添加形状切换按钮和样式
- [ ] 基础测试和调试

#### 阶段二：功能完善（1周）

- [ ] 优化切换动画和交互体验
- [ ] 添加错误处理和兼容性检查
- [ ] 完善单元测试
- [ ] 更新文档和示例

#### 阶段三：测试和优化（1周）

- [ ] 多设备兼容性测试
- [ ] 性能优化和内存管理
- [ ] 用户接受度测试
- [ ] 修复发现的问题
- [ ] 准备发布

### 5.2 技术风险

#### 5.2.1 兼容性风险

- **风险描述**: 某些浏览器可能不支持圆形裁剪
- **应对措施**: 实现优雅降级，自动回退到矩形模式
- **优先级**: 中

#### 5.2.2 性能风险

- **风险描述**: 圆形裁剪可能影响性能
- **应对措施**: 优化渲染逻辑，使用硬件加速
- **优先级**: 低

#### 5.2.3 用户体验风险

- **风险描述**: 形状切换可能影响用户操作习惯
- **应对措施**: 提供清晰的操作提示和引导
- **优先级**: 中

### 5.3 测试计划

#### 5.3.1 单元测试

```typescript
// 形状切换测试
describe('Cropper Shape', () => {
  it('should switch between rectangle and circle', () => {
    const wrapper = mount(Cropper)
    await wrapper.find('.shape-selector').trigger('click')
    expect(wrapper.vm.currentShape).toBe('circle')
  })
  
  it('should maintain 1:1 ratio in circle mode', () => {
    const wrapper = mount(Cropper, {
      props: { shape: 'circle' }
    })
    expect(wrapper.vm.getStencilProps().aspectRatio).toBe(1)
  })
})
```

#### 5.3.2 集成测试

- 测试不同图片格式的圆形裁剪
- 测试形状切换的流畅性
- 测试裁剪结果的准确性
- 测试多设备兼容性

#### 5.3.3 用户测试

- 邀请目标用户进行实际使用测试
- 收集用户反馈和建议
- 优化交互体验

## 6. 发布计划

### 6.1 版本规划

- **v1.2.4-beta.1**: 第一个测试版本，包含基础功能
- **v1.2.4-beta.2**: 修复测试发现的问题
- **v1.2.4-rc.1**: 候选版本，功能完整
- **v1.2.4**: 正式版本

### 6.2 文档更新

- 更新 README.md，添加圆形裁剪功能说明
- 更新使用示例，展示圆形裁剪的用法
- 更新 API 文档，说明新增的配置选项
- 更新迁移指南，说明向后兼容性

### 6.3 兼容性说明

- **向后兼容**: 现有代码无需修改即可正常使用
- **默认行为**: 默认仍使用矩形裁剪框
- **渐进增强**: 新功能为可选配置

## 7. 成功标准

### 7.1 功能标准

- [ ] 圆形裁剪框功能正常工作
- [ ] 形状切换流畅无卡顿
- [ ] 裁剪结果准确无误
- [ ] 在主流浏览器中兼容性良好

### 7.2 性能标准

- [ ] 形状切换响应时间 < 100ms
- [ ] 裁剪操作性能无明显下降
- [ ] 内存使用合理，无泄漏
- [ ] 移动端流畅运行

### 7.3 用户体验标准

- [ ] 用户能够轻松理解和使用新功能
- [ ] 界面保持微信风格的一致性
- [ ] 操作流程符合用户习惯
- [ ] 错误处理友好明确

## 8. 后续规划

### 8.1 功能扩展

- 支持更多裁剪形状（椭圆形、星形等）
- 支持自定义形状模板
- 支持形状边框样式自定义
- 支持批量裁剪不同形状

### 8.2 性能优化

- 优化圆形裁剪的渲染性能
- 减少内存占用
- 提高大图片处理能力
- 优化移动端体验

### 8.3 生态建设

- 收集用户反馈和用例
- 建立社区讨论和交流
- 提供更多示例和教程
- 支持更多框架和平台

---

**文档版本**: v1.0
**最后更新**: 2024年当前日期
**负责人**: 产品经理
**审核人**: 技术负责人
