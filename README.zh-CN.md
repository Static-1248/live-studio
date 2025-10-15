[English](./README.md) | [简体中文](./README.zh-CN.md)

# Live Studio

Live Studio 是一个Web应用程序，提供一个使用 WebSockets 进行实时更新的直播界面。

## 项目结构

```
.gitignore
client/
	index.html
	public/
	src/
		App.vue
		components/
			BackgroundEffect.vue
		main.js
		router/
			index.js
		stores/
			websocket.js
		styles.css
		views/
			ControlView.vue
			DisplayView.vue
package.json
pnpm-lock.yaml
project info.md
README.md
server/
	index.js
vite.config.js
```

## 开始使用

### 先决条件

- Node.js
- pnpm

### 安装

1. 克隆仓库：
    ```sh
    git clone https://github.com/yourusername/live-studio.git
    cd live-studio
    ```

2. 安装依赖：
    ```sh
    pnpm install
    ```

### 运行应用

要同时启动服务器和客户端，请运行：
```sh
pnpm run dev
```

这将在 `http://localhost:3000` 上启动服务器，并在 `http://localhost:5173/display` 和 `http://localhost:5173/control` 上启动客户端。

（如果您看到服务器警告“path xxx/client/dist must exist”，可以忽略它。这在开发模式下不是必需的。）

### 推荐用法

1. 显示页面 (`/display`) 用于展示直播 UI 框架。例如，您可以在您的直播软件中创建一个 webview 组件，并将其指向 `http://localhost:3000/display`。
2. 在单独的浏览器标签页中打开控制页面 (`/control`, `http://localhost:5173/control`)，并使用它来管理和控制直播流。还建议通过浏览器将控制页面注册为桌面应用程序。

### 项目详情

- 服务器是使用 Fastify 和 Socket.IO 实现的。
- 客户端是使用 Vue.js 和 Pinia 构建的，用于状态管理。
- 实时更新通过 WebSockets 处理。

### 文件说明

- `websocket.js`: 使用 Pinia 定义 WebSocket 存储。
- `DisplayView.vue`: 用于显示直播流和介绍文本的 Vue 组件。
- `index.js`: 处理 WebSocket 连接和事件的服务器端代码。

## 部署

要为生产环境部署应用程序，请按照以下步骤操作：

1. 构建客户端项目：
    ```sh
    pnpm build
    ```

2. 启动服务器：
    ```sh
    pnpm start
    ```

3. 现在，静态网页由服务器挂载，可以通过 `http://localhost:3000/display` 和 `http://localhost:3000/control` 访问。

## 许可证

本项目根据 MIT 许可证授权。
