# UrbanGen Designer

一个基于React和Node.js的城市设计图像生成应用。

## 快速启动

### 方式一：使用批处理脚本（推荐）

**启动所有服务器：**
双击运行 `start.bat` 文件，或在命令行中执行：
```bash
start.bat
```

**停止所有服务器：**
双击运行 `stop.bat` 文件，或在命令行中执行：
```bash
stop.bat
```

### 方式二：使用PowerShell脚本

```bash
powershell -ExecutionPolicy Bypass -File start.ps1
```

按 Ctrl+C 停止所有服务器。

### 方式三：使用npm命令

```bash
npm run start:all
```

### 方式四：手动启动

**启动后端服务器：**
```bash
npm run server
```

**启动前端开发服务器（新终端）：**
```bash
npm run dev
```

## 服务地址

- 前端开发服务器：http://localhost:3001
- 后端API服务器：http://localhost:3002

## 项目结构

```
aistudio/
├── components/          # React组件
├── services/           # 服务层
├── database/           # 数据库文件
├── generated-images/   # 生成的图像
├── public/             # 静态资源
├── server.js           # 后端服务器
├── start.bat           # 启动脚本
├── stop.bat            # 停止脚本
└── start.ps1           # PowerShell启动脚本
```

## 开发

```bash
npm run dev     # 启动前端开发服务器
npm run build   # 构建生产版本
npm run preview # 预览生产版本
```

## 功能特性

- 用户注册和登录
- 图像生成（支持多种模型）
- 图像画廊展示
- 个人工作区
- 积分充值系统
- 图像生成记录追踪
