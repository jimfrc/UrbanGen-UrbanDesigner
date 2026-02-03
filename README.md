# UrbanGen Designer 技术文档
## 1. 项目概述
UrbanGen Designer 是一个基于 AI 的城市规划和建筑设计辅助工具，使用 Nano Banana Pro 模型生成高质量的城市设计概念图。

### 核心功能
- AI 驱动的城市设计概念生成
- 多种设计模块支持（AI-rendering、Node Scene Representation、Analysis Diagram 等）
- 用户认证与积分系统
- 作品画廊与个人工作区
- 实时生成进度显示
### 技术亮点
- 基于 React 19 和 TypeScript 的现代化前端架构
- 集成 Grsai Nano Banana Pro API 进行图像生成
- 响应式设计，支持多设备访问
- 本地存储与 Firebase 双重数据管理方案
## 2. 技术栈
![urbangen-技术栈](https://github.com/user-attachments/assets/36ef244b-020c-454c-8b25-9705127e1039)

## 3. 项目结构
```
├── components/          # 前端组件
│   ├── Home.tsx         # 首页组件
│   ├── Login.tsx        # 登录组件
│   ├── SignUp.tsx       # 注册组件
│   ├── Navbar.tsx       # 导航栏组件
│   ├── GeneratorHub.tsx # 生成器中心
│   ├── GeneratorWorkspace.tsx # 生成工作区
│   ├── Gallery.tsx      # 作品画廊
│   ├── Profile.tsx      # 个人资料
│   └── Recharge.tsx     # 积分充值
├── services/            # 服务层
│   ├── geminiService.ts # Grsai API 集成
│   ├── firebase.ts      # Firebase 服务
│   └── localStorageService.ts # 本地存储服务
├── modules/             # 设计模块配置
│   └── index.ts         # 模块定义
├── types.ts             # TypeScript 类型定义
├── App.tsx              # 应用主组件
├── vite.config.ts       # Vite 配置
└── package.json         # 项目依赖
```
## 4. 核心功能模块
### 4.1 图像生成系统
功能说明 ：使用 Grsai Nano Banana Pro API 生成城市设计概念图，支持多种模型和参数配置。

实现细节 ：

- 在 services/geminiService.ts 中实现 API 调用
- 支持的模型：nano-banana-fast、nano-banana-pro、nano-banana-pro-vt
- 支持参数：prompt（提示词）、aspectRatio（宽高比）、imageSize（分辨率）、referenceImages（参考图像）
关键代码 ：

```
// 构建API请求体
const requestBody: any = {
  prompt: prompt,
  model: MODEL_NAME,
  aspectRatio: aspectRatio,
  shutProgress: false
};

// 添加imageSize参数（仅pro模型支持）
if (MODEL_NAME.includes('pro') && !MODEL_NAME.includes('fast')) {
  requestBody.imageSize = imageSize;
}
```
### 4.2 用户认证系统
功能说明 ：管理用户注册、登录和会话状态，支持本地存储和 Firebase 双重认证方案。

实现细节 ：

- 在 services/localStorageService.ts 中实现本地认证
- 在 services/firebase.ts 中集成 Firebase 认证
- 用户数据存储：用户名、邮箱、密码（加密）、积分、头像等
关键流程 ：

1. 用户注册：验证邮箱唯一性 → 创建用户 → 存储到本地存储
2. 用户登录：验证邮箱和密码 → 加载用户信息 → 设置登录状态
3. 用户登出：清除登录状态 → 从本地存储移除用户信息
### 4.3 设计模块系统
功能说明 ：提供不同类型的设计模板，每种模板包含特定的固定提示词和默认用户提示词。

实现细节 ：

- 在 modules/index.ts 中定义设计模块
- 每个模块包含：id、title、description、imageUrl、fixedPrompt、defaultUserPrompt
- 支持的模块：AI-rendering、Node Scene Representation、Analysis Diagram、Renovation Design
模块配置示例 ：

```
{
  id: 'AI-rendering',
  title: 'AI-rendering',
  description: 'Generate commercial renderings of urban environments or 
  architectural designs.',
  imageUrl: 'https://files.imagetourl.net/uploads/
  1768800983497-3377bd1c-8786-4069-b8cc-791b120ea453.png',
  fixedPrompt: '保持参考图视角和图面结构不变，参考图二风格将图一生成为商业效果图',
  defaultUserPrompt: '广角鸟瞰视角，晴朗白天的自然光线，建筑表面为白色和玻璃材质，植被和
  水面细节丰富'
}
```
### 4.4 积分系统
功能说明 ：管理用户积分，用于图像生成消耗，支持积分充值。

实现细节 ：

- 初始注册用户获得 100 积分
- 不同模型消耗不同积分：
  - nano-banana-fast: 10 pts
  - nano-banana-pro: 30 pts
  - nano-banana-pro-vt: 40 pts
- 积分不足时无法生成图像
## 5. API 集成
### 5.1 Grsai Nano Banana API
API 端点 ： https://grsai.dakka.com.cn/v1/draw/nano-banana

请求参数 ：

- prompt ：生成提示词
- model ：模型名称（nano-banana-fast/pro/pro-vt）
- aspectRatio ：宽高比（auto/1:1/16:9等）
- imageSize ：分辨率（仅pro模型支持，1K/2K/4K）
- urls ：参考图像URL数组（可选）
- shutProgress ：是否关闭进度更新（false）
响应格式 ：

- SSE（Server-Sent Events）格式，包含实时进度
- 完成后返回图像URL
错误处理 ：

- 内容审核失败：output_moderation 错误
- API 密钥错误：认证失败
- 参数错误：请求参数无效
### 5.2 Firebase API
功能 ：提供用户认证和数据存储服务（可选集成）

配置 ：

- 在 services/firebase.ts 中配置 Firebase 项目信息
- 支持匿名登录和邮箱密码登录
- 实时数据库同步用户数据
## 6. 数据流
### 6.1 图像生成流程
1. 用户选择设计模块和模型
2. 输入提示词和参考图像（可选）
3. 点击"Generate Concept"按钮
4. 前端构建API请求参数
5. 调用 Grsai API 生成图像
6. 接收实时进度更新
7. 生成完成后显示结果图像
8. 扣除用户积分
9. 保存生成结果到本地存储
### 6.2 用户认证流程
1. 用户访问登录/注册页面
2. 输入凭据或注册信息
3. 前端验证输入有效性
4. 调用认证服务验证用户
5. 登录成功后保存用户信息到本地存储
6. 设置全局用户状态
7. 跳转到主页或个人工作区
## 7. 部署说明
### 7.1 开发环境
安装依赖 ：

```
npm install
```
启动开发服务器 ：

```
npm run dev
```
环境变量 ：
在 .env.local 文件中配置：

- GRS_API_KEY ：Grsai API 密钥
- GEMINI_API_KEY ：Google Gemini API 密钥（可选）
### 7.2 生产构建
构建项目 ：

```
npm run build
```
预览生产版本 ：

```
npm run preview
```
部署建议 ：

- 使用 Vercel、Netlify 等静态网站托管服务
- 配置自定义域名
- 启用 HTTPS
## 8. 性能优化
### 8.1 前端优化
- 代码分割 ：使用 React.lazy() 和 Suspense 实现组件懒加载
- 图像优化 ：使用适当分辨率的图像，支持渐进式加载
- 状态管理 ：优化组件渲染，避免不必要的重渲染
- 缓存策略 ：缓存 API 响应和静态资源
### 8.2 API 调用优化
- 参数验证 ：前端验证用户输入，减少无效 API 调用
- 错误处理 ：优雅处理 API 错误，提供用户友好的错误信息
- 请求限流 ：避免短时间内发送过多 API 请求
- 进度显示 ：使用 SSE 实时显示生成进度，提升用户体验
## 9. 常见问题与解决方案
### 9.1 图像生成失败
错误信息 ： Image generation failed: output_moderation 原因 ：API 内容审核系统拒绝了请求 解决方案 ：

- 调整提示词，避免使用可能被视为不适当的内容
- 检查参考图像，确保内容符合使用准则
- 使用更专业、正面的语言描述设计需求
### 9.2 跨局域网访问登录失败
错误信息 ： 用户不存在 原因 ：localStorage 数据与域名绑定，不同域名无法共享数据 解决方案 ：

- 使用基于服务器的认证（如 Firebase）
- 配置本地 DNS 或 hosts 文件，使用统一域名访问
- 在同一设备上注册和登录
### 9.3 生成速度慢
原因 ：

- 网络连接问题
- 模型复杂度高（pro 模型比 fast 模型慢）
- 服务器负载高
解决方案 ：

- 检查网络连接
- 对于快速预览，使用 nano-banana-fast 模型
- 避开高峰期使用
## 10. 未来发展规划
### 10.1 功能扩展
- 支持更多设计模块和模型
- 添加图像编辑和后处理功能
- 集成 3D 预览功能
- 支持团队协作和项目共享
### 10.2 技术升级
- 迁移到完全基于服务器的认证系统
- 实现离线工作模式
- 优化移动端体验
- 集成更多 AI 模型和服务
### 10.3 性能优化
- 实现图像生成队列管理
- 优化前端渲染性能
- 改进错误处理和用户反馈机制
- 增强系统稳定性和可靠性
## 11. 总结
UrbanGen Designer 是一个功能完备的 AI 辅助城市设计工具，结合了现代化的前端技术和强大的 AI 图像生成能力。通过本技术文档，开发者可以快速了解项目架构和实现细节，为后续的开发和扩展提供参考。

项目采用模块化设计，具有良好的可扩展性和可维护性，为城市规划师和建筑师提供了一个高效、直观的设计辅助工具。随着 AI 技术的不断发展，UrbanGen Designer 也将持续演进，为用户提供更加强大和智能的设计体验。
