# We-Cropper 圆形裁剪框功能使用示例

## 文档信息

- **项目名称**: We-Cropper
- **功能名称**: 圆形裁剪框支持
- **版本**: v1.2.4
- **创建日期**: 2024年当前日期
- **负责人**: 开发团队
- **文档状态**: 开发中

## 基础用法

### 1. 基本圆形裁剪

```vue
<template>
  <div>
    <button @click="openCropper">选择头像</button>
    <div v-if="imageUrl" class="preview">
      <img :src="imageUrl" alt="头像预览" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCropper } from 'we-cropper'

const imageUrl = ref('')

// 初始化裁剪器
const { onCrop, showCropper } = useCropper({
  shape: 'circle',
  aspectRatio: 1, // 圆形必须为1:1
  locale: 'zh-CN'
})

// 监听裁剪完成事件
onCrop((base64String) => {
  console.log('圆形头像裁剪结果:', base64String)
  imageUrl.value = base64String
  // 这里可以上传到服务器或显示在页面上
  uploadAvatar(base64String)
})

// 打开裁剪器
function openCropper() {
  // 在实际使用中，这里应该先让用户选择图片文件
  const tempImageUrl = 'path/to/image.jpg' // 替换为实际的图片URL
  showCropper(tempImageUrl)
}

// 上传头像函数
async function uploadAvatar(base64) {
  try {
    const response = await fetch('/api/upload-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64,
        shape: 'circle'
      })
    })
    
    const result = await response.json()
    console.log('上传成功:', result)
  } catch (error) {
    console.error('上传失败:', error)
  }
}
</script>

<style>
.preview {
  margin-top: 20px;
  text-align: center;
}

.preview img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}
</style>
```

### 2. 矩形裁剪（默认行为）

```vue
<template>
  <div>
    <div class="controls">
      <select v-model="selectedRatio" @change="updateAspectRatio">
        <option value="1">1:1 (正方形)</option>
        <option value="16/9">16:9 (宽屏)</option>
        <option value="4/3">4:3 (标准)</option>
        <option value="3/2">3:2 (照片)</option>
      </select>
      <button @click="openCropper">裁剪图片</button>
    </div>
    
    <div v-if="imageUrl" class="preview">
      <img :src="imageUrl" alt="裁剪预览" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCropper } from 'we-cropper'

const imageUrl = ref('')
const selectedRatio = ref('16/9')
const cropperConfig = ref({
  shape: 'rectangle',
  aspectRatio: 16/9,
  locale: 'zh-CN'
})

// 初始化裁剪器
const { onCrop, showCropper } = useCropper(cropperConfig.value)

// 监听裁剪完成事件
onCrop((base64String) => {
  console.log('矩形图片裁剪结果:', base64String)
  imageUrl.value = base64String
  // 处理裁剪结果
  processCroppedImage(base64String)
})

// 更新宽高比
function updateAspectRatio() {
  cropperConfig.value.aspectRatio = eval(selectedRatio.value)
  console.log('宽高比已更新:', cropperConfig.value.aspectRatio)
}

// 打开裁剪器
function openCropper() {
  const tempImageUrl = 'path/to/image.jpg' // 替换为实际的图片URL
  showCropper(tempImageUrl)
}

// 处理裁剪后的图片
function processCroppedImage(base64) {
  // 这里可以添加图片处理逻辑，如压缩、格式转换等
  console.log('处理裁剪后的图片:', {
    shape: cropperConfig.value.shape,
    aspectRatio: cropperConfig.value.aspectRatio,
    size: Math.round(base64.length * 0.75) // 估算大小
  })
}
</script>

<style>
.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.controls select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.controls button {
  padding: 8px 16px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preview {
  margin-top: 20px;
  text-align: center;
}

.preview img {
  max-width: 400px;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
```

## 高级用法

### 3. 动态切换形状

```vue
<template>
  <div>
    <div class="shape-selector">
      <button 
        :class="{ active: currentShape === 'rectangle' }"
        @click="setShape('rectangle')"
      >
        矩形
      </button>
      <button 
        :class="{ active: currentShape === 'circle' }"
        @click="setShape('circle')"
      >
        圆形
      </button>
    </div>
    
    <button @click="openCropper">打开裁剪器</button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCropper } from 'we-cropper'

const currentShape = ref('rectangle')
const cropperConfig = reactive({
  shape: 'rectangle',
  aspectRatio: 16/9,
  locale: 'zh-CN'
})

// 初始化裁剪器
const { onCrop, showCropper } = useCropper(cropperConfig)

// 监听裁剪完成事件
onCrop((base64String) => {
  console.log('裁剪结果:', base64String, '形状:', currentShape.value)
})

// 设置形状
function setShape(shape) {
  currentShape.value = shape
  cropperConfig.shape = shape
  // 圆形时自动设置比例为1:1
  cropperConfig.aspectRatio = shape === 'circle' ? 1 : 16/9
  console.log('形状切换为:', shape)
}

// 打开裁剪器
function openCropper() {
  const tempImageUrl = 'path/to/image.jpg' // 替换为实际的图片URL
  showCropper(tempImageUrl)
}
</script>

<style>
.shape-selector {
  margin-bottom: 16px;
}

.shape-selector button {
  padding: 8px 16px;
  margin-right: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.shape-selector button.active {
  background: #007aff;
  color: white;
  border-color: #007aff;
}
</style>
```

### 4. 完整配置示例

```vue
<template>
  <div>
    <div class="controls">
      <div class="control-group">
        <label>裁剪形状:</label>
        <select v-model="cropperConfig.shape" @change="updateConfig">
          <option value="rectangle">矩形</option>
          <option value="circle">圆形</option>
        </select>
      </div>
      
      <div class="control-group" v-if="cropperConfig.shape === 'rectangle'">
        <label>宽高比:</label>
        <select v-model="cropperConfig.aspectRatio" @change="updateConfig">
          <option :value="undefined">自由</option>
          <option value="1">1:1</option>
          <option value="16/9">16:9</option>
          <option value="4/3">4:3</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>语言:</label>
        <select v-model="cropperConfig.locale" @change="updateConfig">
          <option value="zh-CN">中文</option>
          <option value="en">English</option>
        </select>
      </div>
      
      <button @click="openCropper" :disabled="isLoading">
        {{ isLoading ? '加载中...' : '打开裁剪器' }}
      </button>
    </div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div v-if="croppedImage" class="result-preview">
      <h3>裁剪结果</h3>
      <img 
        :src="croppedImage" 
        :style="{
          borderRadius: cropperConfig.shape === 'circle' ? '50%' : '4px'
        }"
        alt="裁剪结果"
      />
      <div class="result-info">
        <p>形状: {{ cropperConfig.shape === 'circle' ? '圆形' : '矩形' }}</p>
        <p>大小: {{ formatFileSize(croppedImage.length) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCropper } from 'we-cropper'

const isLoading = ref(false)
const errorMessage = ref('')
const croppedImage = ref('')

const cropperConfig = reactive({
  shape: 'circle', // 'rectangle' 或 'circle'
  aspectRatio: 1, // 圆形时强制为1
  locale: 'zh-CN'
})

// 初始化裁剪器
const { onCrop, showCropper, setLocale, currentLocale } = useCropper(cropperConfig)

// 监听裁剪完成事件
onCrop((base64String) => {
  console.log('裁剪完成:', {
    shape: cropperConfig.shape,
    aspectRatio: cropperConfig.aspectRatio,
    locale: cropperConfig.locale
  })
  
  croppedImage.value = base64String
  isLoading.value = false
  errorMessage.value = ''
})

// 更新配置
function updateConfig() {
  // 圆形时自动设置比例为1:1
  if (cropperConfig.shape === 'circle') {
    cropperConfig.aspectRatio = 1
  }
  
  // 更新语言设置
  setLocale(cropperConfig.locale)
  
  console.log('配置已更新:', cropperConfig)
}

// 打开裁剪器
async function openCropper() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // 模拟图片加载
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const tempImageUrl = 'path/to/image.jpg' // 替换为实际的图片URL
    showCropper(tempImageUrl)
    
  } catch (error) {
    console.error('打开裁剪器失败:', error)
    errorMessage.value = '打开裁剪器失败，请重试'
    isLoading.value = false
  }
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-weight: 500;
  color: #333;
}

.control-group select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.controls button {
  padding: 8px 16px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.controls button:hover:not(:disabled) {
  background: #0056b3;
}

.controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
}

.result-preview {
  margin-top: 20px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.result-preview h3 {
  margin-top: 0;
  color: #333;
}

.result-preview img {
  max-width: 300px;
  max-height: 300px;
  border: 1px solid #ddd;
  display: block;
  margin: 12px 0;
}

.result-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}
</style>
```

// 初始化裁剪器
const { onCrop, showCropper, setLocale, currentLocale } = useCropper(cropperConfig)

// 监听裁剪完成事件
onCrop((base64String) => {
  const shape = cropperConfig.shape
  console.log('裁剪完成:', { base64String, shape })
  // 根据形状进行不同处理
  if (shape === 'circle') {
    // 圆形头像处理逻辑
    uploadAvatar(base64String)
  } else {
    // 矩形图片处理逻辑
    uploadImage(base64String)
  }
})

// 更新配置
function updateConfig() {
  // 圆形时自动设置比例为1:1
  if (cropperConfig.shape === 'circle') {
    cropperConfig.aspectRatio = 1
  }
  // 更新语言设置
  setLocale(cropperConfig.locale)
  console.log('配置已更新:', cropperConfig)
}

// 打开裁剪器
function openCropper() {
  const tempImageUrl = 'path/to/image.jpg' // 替换为实际的图片URL
  showCropper(tempImageUrl)
}

function uploadAvatar(base64) {
  // 上传头像逻辑
  console.log('上传圆形头像:', base64)
}

function uploadImage(base64) {
  // 上传普通图片逻辑
  console.log('上传矩形图片:', base64)
}
</script>

<style>
.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.controls select,
.controls button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.controls button {
  background: #007aff;
  color: white;
  border-color: #007aff;
  cursor: pointer;
}
</style>
```

## 实际应用场景

### 5. 用户头像上传

```vue
<template>
  <div class="avatar-upload">
    <div class="avatar-preview" @click="triggerFileSelect">
      <img v-if="avatarUrl" :src="avatarUrl" alt="用户头像" />
      <div v-else class="avatar-placeholder">
        <span>点击上传头像</span>
      </div>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="onFileSelect"
      style="display: none"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCropper } from 'we-cropper'

const avatarUrl = ref('')
const fileInput = ref(null)

// 初始化圆形裁剪器
const { onCrop, showCropper } = useCropper({
  shape: 'circle',
  locale: 'zh-CN'
})

// 监听裁剪完成事件
onCrop((base64String) => {
  avatarUrl.value = base64String
  // 这里可以添加上传到服务器的逻辑
  uploadAvatarToServer(base64String)
})

function triggerFileSelect() {
  fileInput.value.click()
}

function onFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target.result
      // 直接打开裁剪器
      showCropper(imageUrl)
    }
    reader.readAsDataURL(file)
  }
}

function uploadAvatarToServer(base64) {
  // 模拟上传逻辑
  console.log('上传头像到服务器:', base64)
  // 实际项目中应该调用API上传
}
</script>

<style>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px dashed #ddd;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.avatar-preview:hover {
  border-color: #007aff;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: #999;
  font-size: 14px;
  text-align: center;
}
</style>
```

### 6. 商品图片裁剪（支持多种形状）

```vue
<template>
  <div class="product-image-editor">
    <div class="editor-controls">
      <div class="shape-tabs">
        <button 
          v-for="shape in shapeOptions" 
          :key="shape.value"
          :class="{ active: cropperConfig.shape === shape.value }"
          @click="setShape(shape.value)"
        >
          {{ shape.label }}
        </button>
      </div>
      
      <div class="ratio-selector" v-if="cropperConfig.shape === 'rectangle'">
        <label>宽高比:</label>
        <select v-model="cropperConfig.aspectRatio" @change="updateConfig">
          <option :value="1">1:1</option>
          <option :value="16/9">16:9</option>
          <option :value="4/3">4:3</option>
          <option :value="3/2">3:2</option>
        </select>
      </div>
      
      <button @click="loadProductImage">加载商品图片</button>
    </div>
    
    <div class="image-preview">
      <h3>预览效果</h3>
      <div class="preview-container">
        <img 
          v-if="croppedImage"
          :src="croppedImage" 
          :style="{
            borderRadius: cropperConfig.shape === 'circle' ? '50%' : '0'
          }"
          alt="裁剪预览"
        />
        <div v-else class="no-preview">暂无裁剪结果</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCropper } from 'we-cropper'

const croppedImage = ref('')

const cropperConfig = reactive({
  shape: 'rectangle',
  aspectRatio: 16/9,
  locale: 'zh-CN'
})

const shapeOptions = [
  { label: '矩形', value: 'rectangle' },
  { label: '圆形', value: 'circle' }
]

// 初始化裁剪器
const { onCrop, showCropper } = useCropper(cropperConfig)

// 监听裁剪完成事件
onCrop((base64String) => {
  croppedImage.value = base64String
  console.log('商品图片裁剪完成:', { 
    shape: cropperConfig.shape, 
    ratio: cropperConfig.aspectRatio 
  })
  // 这里可以添加保存或上传逻辑
})

function setShape(shape) {
  cropperConfig.shape = shape
  // 圆形时自动设置比例为1:1
  if (shape === 'circle') {
    cropperConfig.aspectRatio = 1
  }
}

function updateConfig() {
  console.log('配置已更新:', cropperConfig)
}

// 模拟加载商品图片
function loadProductImage() {
  const demoImageUrl = 'path/to/product-image.jpg' // 替换为实际的图片URL
  showCropper(demoImageUrl)
}
</script>

<style>
.product-image-editor {
  max-width: 800px;
  margin: 0 auto;
}

.editor-controls {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.shape-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.shape-tabs button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.shape-tabs button.active {
  background: #007aff;
  color: white;
  border-color: #007aff;
}

.ratio-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ratio-selector select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-preview {
  margin-top: 20px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.preview-container {
  margin-top: 12px;
  text-align: center;
}

.preview-container img {
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #ddd;
}
</style>
```

### 7. 批量图片处理

```vue
<template>
  <div class="batch-processor">
    <div class="upload-area">
      <input
        type="file"
        multiple
        accept="image/*"
        @change="onFileSelect"
        ref="fileInput"
      />
      <button @click="triggerFileSelect">选择多张图片</button>
    </div>
    
    <div class="image-list">
      <div 
        v-for="(image, index) in imageList" 
        :key="index"
        class="image-item"
      >
        <div class="image-info">
          <span>图片 {{ index + 1 }}</span>
          <select v-model="image.shape" @change="updateImageConfig(index)">
            <option value="rectangle">矩形</option>
            <option value="circle">圆形</option>
          </select>
        </div>
        
        <img 
          :src="image.url" 
          :style="{
            borderRadius: image.shape === 'circle' ? '50%' : '0'
          }"
          alt="预览"
        />
        
        <div class="image-actions">
          <button @click="cropImage(index)">裁剪</button>
          <button @click="removeImage(index)">删除</button>
        </div>
      </div>
    </div>
    
    <div class="batch-actions" v-if="croppedImages.length > 0">
      <button @click="downloadAll">下载全部</button>
      <button @click="uploadAll">上传全部</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCropper } from 'we-cropper'

const fileInput = ref(null)
const imageList = ref([])
const croppedImages = ref([])
const currentCropIndex = ref(-1)

// 初始化裁剪器
const { onCrop, showCropper } = useCropper({
  shape: 'rectangle',
  locale: 'zh-CN'
})

// 监听裁剪完成事件
onCrop((base64String) => {
  const originalImage = imageList.value[currentCropIndex.value]
  const croppedImage = {
    url: base64String,
    shape: originalImage.shape,
    originalIndex: currentCropIndex.value,
    originalName: originalImage.name
  }
  
  croppedImages.value.push(croppedImage)
  console.log('批量裁剪完成:', croppedImage)
})

function triggerFileSelect() {
  fileInput.value.click()
}

function onFileSelect(event) {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageList.value.push({
        url: e.target.result,
        shape: 'rectangle',
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  })
}

function updateImageConfig(index) {
  console.log(`图片 ${index + 1} 形状更新为:`, imageList.value[index].shape)
}

function cropImage(index) {
  currentCropIndex.value = index
  const image = imageList.value[index]
  
  // 动态创建裁剪器配置
  const cropperConfig = {
    shape: image.shape,
    aspectRatio: image.shape === 'circle' ? 1 : undefined,
    locale: 'zh-CN'
  }
  
  // 使用新的配置打开裁剪器
  showCropper(image.url, cropperConfig)
}

function removeImage(index) {
  imageList.value.splice(index, 1)
}

function downloadAll() {
  croppedImages.forEach((image, index) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = `cropped_${image.originalName}_${index + 1}`
    link.click()
  })
}

function uploadAll() {
  console.log('上传所有裁剪图片:', croppedImages.value)
  // 实际项目中应该调用API上传
}
</script>

<style>
.batch-processor {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.upload-area {
  margin-bottom: 20px;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  text-align: center;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.image-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.image-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.image-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  margin-bottom: 8px;
}

.image-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.image-actions button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.batch-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.batch-actions button {
  padding: 12px 24px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

## API 参考

### useCropper 函数

`useCropper` 是 We-Cropper 的核心函数，用于创建裁剪器实例。

```javascript
import { useCropper } from 'we-cropper'

const { onCrop, showCropper } = useCropper(options)
```

#### 参数：WeCropperOptions

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `shape` | `'rectangle' \| 'circle'` | `'rectangle'` | 裁剪框形状 |
| `aspectRatio` | `number` | `undefined` | 宽高比，圆形时强制为1 |
| `locale` | `string` | `'zh-CN'` | 界面语言设置 |

#### 返回值

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `onCrop` | `(callback: (base64String: string) => void) => void` | 注册裁剪完成回调函数 |
| `showCropper` | `(imageUrl: string, options?: WeCropperOptions) => void` | 显示裁剪器，传入图片URL和可选配置 |

### 使用示例

```javascript
// 基本使用
const { onCrop, showCropper } = useCropper({
  shape: 'circle',
  locale: 'zh-CN'
})

// 监听裁剪事件
onCrop((base64String) => {
  console.log('裁剪完成:', base64String)
  // 处理裁剪结果
})

// 打开裁剪器
function openImageCropper(imageUrl) {
  showCropper(imageUrl)
}

// 动态配置使用
function openWithCustomConfig(imageUrl) {
  showCropper(imageUrl, {
    shape: 'rectangle',
    aspectRatio: 16/9
  })
}
```

## 阶段2：高级功能示例

### 1. 错误处理和兼容性检查

```vue
<template>
  <div>
    <button @click="openCropperWithChecks">安全打开裁剪器</button>
    
    <div v-if="warningMessage" class="warning-message">
      {{ warningMessage }}
    </div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCropper } from 'we-cropper'

const warningMessage = ref('')
const errorMessage = ref('')
const cropperConfig = ref({
  shape: 'circle',
  locale: 'zh-CN'
})

// 初始化裁剪器
const { onCrop, showCropper } = useCropper(cropperConfig.value)

// 监听裁剪完成事件
onCrop((base64String) => {
  console.log('裁剪完成:', base64String)
  clearMessages()
})

// 浏览器兼容性检查
function checkBrowserCompatibility() {
  const issues = []
  
  // 检查 Canvas 支持
  if (!document.createElement('canvas').getContext) {
    issues.push('您的浏览器不支持 Canvas，无法使用图片裁剪功能')
  }
  
  // 检查 FileReader 支持
  if (!window.FileReader) {
    issues.push('您的浏览器不支持文件读取，无法使用图片裁剪功能')
  }
  
  // 检查圆形裁剪支持（通过检测 CSS border-radius 支持）
  const testDiv = document.createElement('div')
  testDiv.style.borderRadius = '50%'
  if (cropperConfig.value.shape === 'circle' && !testDiv.style.borderRadius) {
    issues.push('您的浏览器不支持圆形裁剪，将自动切换到矩形模式')
    cropperConfig.value.shape = 'rectangle'
  }
  
  return issues
}

// 图片格式和大小检查
function validateImageFile(file) {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
  if (file.size > maxSize) {
    throw new Error('图片大小不能超过 10MB')
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('仅支持 JPEG、PNG、GIF 和 WebP 格式的图片')
  }
  
  return true
}

// 安全打开裁剪器
async function openCropperWithChecks() {
  try {
    clearMessages()
    
    // 浏览器兼容性检查
    const compatibilityIssues = checkBrowserCompatibility()
    if (compatibilityIssues.length > 0) {
      warningMessage.value = compatibilityIssues.join('; ')
    }
    
    // 模拟文件选择
    const mockFile = {
      size: 2 * 1024 * 1024, // 2MB
      type: 'image/jpeg'
    }
    
    // 图片验证
    validateImageFile(mockFile)
    
    // 模拟图片加载
    const imageUrl = await loadImage('path/to/image.jpg')
    
    // 打开裁剪器
    showCropper(imageUrl, cropperConfig.value)
    
  } catch (error) {
    console.error('裁剪器打开失败:', error)
    errorMessage.value = error.message
  }
}

// 模拟图片加载
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = url
  })
}

// 清除消息
function clearMessages() {
  warningMessage.value = ''
  errorMessage.value = ''
}
</script>

<style>
.warning-message {
  color: #856404;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  padding: 12px;
  margin: 12px 0;
}

.error-message {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 12px;
  margin: 12px 0;
}
</style>
```

### 2. 性能优化示例

```vue
<template>
  <div>
    <div class="performance-controls">
      <button @click="openOptimizedCropper" :disabled="isProcessing">
        {{ isProcessing ? '处理中...' : '打开优化裁剪器' }}
      </button>
      
      <div class="performance-stats">
        <div>加载时间: {{ loadTime }}ms</div>
        <div>处理时间: {{ processTime }}ms</div>
        <div>内存使用: {{ memoryUsage }}MB</div>
      </div>
    </div>
    
    <div v-if="performanceWarning" class="performance-warning">
      {{ performanceWarning }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash-es'
import { useCropper } from 'we-cropper'

const isProcessing = ref(false)
const loadTime = ref(0)
const processTime = ref(0)
const memoryUsage = ref(0)
const performanceWarning = ref('')

// 初始化裁剪器
const { onCrop, showCropper } = useCropper({
  shape: 'circle',
  locale: 'zh-CN'
})

// 防抖处理的裁剪器打开函数
const debouncedShowCropper = debounce((imageUrl, options) => {
  showCropper(imageUrl, options)
}, 300)

// 监听裁剪完成事件
onCrop((base64String) => {
  const endTime = performance.now()
  processTime.value = Math.round(endTime - startTime)
  
  console.log('性能统计:', {
    loadTime: loadTime.value,
    processTime: processTime.value,
    memoryUsage: memoryUsage.value,
    imageSize: Math.round(base64String.length * 0.75 / 1024) + 'KB'
  })
  
  isProcessing.value = false
})

let startTime = 0

// 打开优化裁剪器
async function openOptimizedCropper() {
  try {
    isProcessing.value = true
    const startLoadTime = performance.now()
    
    // 性能检查
    const performanceIssues = checkPerformance()
    if (performanceIssues.length > 0) {
      performanceWarning.value = performanceIssues.join('; ')
    }
    
    // 模拟大图片加载
    const imageUrl = await loadLargeImage('path/to/large-image.jpg')
    
    loadTime.value = Math.round(performance.now() - startLoadTime)
    startTime = performance.now()
    
    // 获取内存使用情况
    if (performance.memory) {
      memoryUsage.value = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
    }
    
    // 使用防抖处理打开裁剪器
    debouncedShowCropper(imageUrl, {
      shape: 'circle',
      aspectRatio: 1
    })
    
  } catch (error) {
    console.error('性能优化裁剪失败:', error)
    performanceWarning.value = '图片处理失败，请尝试使用较小的图片'
    isProcessing.value = false
  }
}

// 性能检查
function checkPerformance() {
  const issues = []
  
  // 检查内存使用
  if (performance.memory) {
    const usedMemory = performance.memory.usedJSHeapSize / 1024 / 1024
    if (usedMemory > 500) { // 超过500MB
      issues.push('内存使用较高，建议关闭其他标签页')
    }
  }
  
  // 检查网络连接
  if (navigator.connection) {
    const connection = navigator.connection
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      issues.push('网络连接较慢，图片加载可能需要较长时间')
    }
  }
  
  return issues
}

// 加载大图片（带压缩）
async function loadLargeImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      // 图片压缩逻辑
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // 限制最大尺寸
      const maxSize = 1920
      let { width, height } = img
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx.drawImage(img, 0, 0, width, height)
      
      // 转换为压缩后的图片URL
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    
    img.onerror = () => reject(new Error('大图片加载失败'))
    img.src = url
  })
}
</script>

<style>
.performance-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.performance-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.performance-warning {
  color: #856404;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
}
</style>
```

### 3. 国际化支持示例

```vue
<template>
  <div>
    <div class="locale-controls">
      <div class="locale-selector">
        <label>选择语言:</label>
        <select v-model="currentLocale" @change="changeLocale">
          <option value="zh-CN">中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
      </div>
      
      <button @click="openLocalizedCropper">
        {{ t('openCropper') }}
      </button>
    </div>
    
    <div class="current-settings">
      <h3>{{ t('currentSettings') }}</h3>
      <p>{{ t('shape') }}: {{ t(cropperConfig.shape === 'circle' ? 'circle' : 'rectangle') }}</p>
      <p>{{ t('language') }}: {{ t('languageName') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCropper } from 'we-cropper'

const currentLocale = ref('zh-CN')
const cropperConfig = reactive({
  shape: 'circle',
  locale: 'zh-CN'
})

// 多语言配置
const translations = {
  'zh-CN': {
    openCropper: '打开裁剪器',
    currentSettings: '当前设置',
    shape: '形状',
    circle: '圆形',
    rectangle: '矩形',
    language: '语言',
    languageName: '中文',
    reset: '重置',
    rotate: '旋转',
    cancel: '取消',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功'
  },
  'en': {
    openCropper: 'Open Cropper',
    currentSettings: 'Current Settings',
    shape: 'Shape',
    circle: 'Circle',
    rectangle: 'Rectangle',
    language: 'Language',
    languageName: 'English',
    reset: 'Reset',
    rotate: 'Rotate',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  },
  'ja': {
    openCropper: 'クロッパーを開く',
    currentSettings: '現在の設定',
    shape: '形状',
    circle: '円形',
    rectangle: '矩形',
    language: '言語',
    languageName: '日本語',
    reset: 'リセット',
    rotate: '回転',
    cancel: 'キャンセル',
    confirm: '確認',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功'
  },
  'ko': {
    openCropper: '크로퍼 열기',
    currentSettings: '현재 설정',
    shape: '모양',
    circle: '원형',
    rectangle: '사각형',
    language: '언어',
    languageName: '한국어',
    reset: '재설정',
    rotate: '회전',
    cancel: '취소',
    confirm: '확인',
    loading: '로딩 중...',
    error: '오류',
    success: '성공'
  }
}

// 翻译函数
function t(key) {
  return translations[currentLocale.value]?.[key] || key
}

// 初始化裁剪器
const { onCrop, showCropper, setLocale } = useCropper(cropperConfig)

// 监听裁剪完成事件
onCrop((base64String) => {
  console.log(`[${currentLocale.value}] ${t('success')}:`, base64String)
  // 显示成功消息
  showNotification(t('success'), 'success')
})

// 切换语言
function changeLocale() {
  cropperConfig.locale = currentLocale.value
  setLocale(currentLocale.value)
  
  console.log('语言已切换到:', currentLocale.value)
  
  // 更新页面标题
  document.title = t('openCropper')
}

// 打开本地化裁剪器
function openLocalizedCropper() {
  const imageUrl = 'path/to/image.jpg'
  
  // 根据语言设置不同的默认形状
  const localizedConfig = {
    ...cropperConfig,
    // 中文和日文用户更喜欢圆形头像
    shape: ['zh-CN', 'ja'].includes(currentLocale.value) ? 'circle' : 'rectangle',
    aspectRatio: 1,
    // 自定义本地化文本
    customLocale: {
      reset: t('reset'),
      rotate: t('rotate'),
      cancel: t('cancel'),
      confirm: t('confirm')
    }
  }
  
  showCropper(imageUrl, localizedConfig)
}

// 显示通知
function showNotification(message, type = 'info') {
  // 创建通知元素
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message
  
  // 添加样式
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `
  
  // 根据类型设置背景色
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#007aff'
  }
  notification.style.backgroundColor = colors[type] || colors.info
  
  // 添加到页面
  document.body.appendChild(notification)
  
  // 3秒后自动移除
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// 添加动画样式
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(style)
</script>

<style>
.locale-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.locale-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.locale-selector select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.locale-controls button {
  padding: 8px 16px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.current-settings {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.current-settings h3 {
  margin-top: 0;
  color: #333;
}

.current-settings p {
  margin: 8px 0;
  color: #666;
}
</style>
```

## 最佳实践

### 1. 性能优化

```javascript
// 使用防抖处理频繁的形状切换
import { debounce } from 'lodash-es'

const debouncedShowCropper = debounce((imageUrl, options) => {
  showCropper(imageUrl, options)
}, 100)

// 大图片处理时添加加载状态
const isLoading = ref(false)

function handleLargeImage(file) {
  isLoading.value = true
  const reader = new FileReader()
  reader.onload = (e) => {
    setTimeout(() => {
      const imageUrl = e.target.result
      showCropper(imageUrl)
      isLoading.value = false
    }, 500) // 模拟大图片加载延迟
  }
  reader.readAsDataURL(file)
}
```

### 2. 错误处理

```javascript
// 全面的错误处理
function handleError(error) {
  console.error('裁剪器错误:', error)
  
  // 根据错误类型进行不同处理
  switch (error.type) {
    case 'image_load_failed':
      showToast('图片加载失败，请重试')
      break
    case 'circle_not_supported':
      showToast('您的浏览器不支持圆形裁剪，已切换到矩形模式')
      // 降级到矩形模式
      showCropper(currentImageUrl, { shape: 'rectangle' })
      break
    default:
      showToast('裁剪过程中出现错误')
  }
}
```

### 3. 移动端适配

```css
/* 移动端优化样式 */
@media (max-width: 768px) {
  .cropper-container {
    height: 70vh;
  }
  
  .action-bar {
    bottom: 20px;
    padding: 12px;
  }
  
  .shape-selector {
    padding: 16px;
  }
}
```

## 常见问题

### Q: 圆形裁剪时为什么宽高比被强制设置为1？

A: 圆形需要保持 1:1 的宽高比才能确保不变形。这是圆形裁剪的数学特性，无法改变。

### Q: 如何在形状切换时保持裁剪位置？

A: We-Cropper 内部已经处理了形状切换时的位置保持逻辑，你只需要在调用 `showCropper` 时传入不同的配置即可。

### Q: 浏览器不支持圆形裁剪怎么办？

A: We-Cropper 会自动检测浏览器兼容性，如果不支持圆形裁剪，会自动降级到矩形模式，你可以通过错误处理来捕获这种情况。

### Q: 如何处理大图片的圆形裁剪性能问题？

A: 建议在上传前对大图片进行压缩，或者在裁剪时显示加载状态，提升用户体验。

---

**文档版本**: v1.0
**最后更新**: 2024年当前日期
**负责人**: 开发团队