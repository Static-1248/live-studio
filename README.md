[English](./README.md) | [简体中文](./README.zh-CN.md)

# Live Studio

Live Studio is a web application that provides a live streaming interface with real-time updates using WebSockets.

## Project Structure

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

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/live-studio.git
    cd live-studio
    ```

2. Install dependencies:
    ```sh
    pnpm install
    ```

### Running the Application

To start both the server and client, run:
```sh
pnpm run dev
```

This will start the server on `http://localhost:3000` and the client on `http://localhost:5173/display` & `http://localhost:5173/control`.

(If you see the server warning "path xxx/client/dist must exist", you can ignore it. This is not necessary in development mode.)

### Recommended Usage

1. The display page (`/display`) is used to showcase the live stream UI framework. So for example, you can create a webview component in your live stream software and point it to `http://localhost:3000/display`.

2. Open the control page (`/control`, `http://localhost:5173/control`) in a separate browser tab, and use it to manage and control the stream. It is also recommended to register the control page as a desktop app via your browser.

### Project Details

- The server is implemented using Fastify and Socket.IO.
- The client is built with Vue.js and Pinia for state management.
- Real-time updates are handled via WebSockets.

### File Descriptions

- websocket.js: Defines the WebSocket store using Pinia.
- DisplayView.vue: Vue component for displaying the live stream and intro text.
- index.js: Server-side code handling WebSocket connections and events.

## Deployment

To deploy the application for production, follow these steps:

1. Build the client project:
    ```sh
    pnpm build
    ```

2. Start the server:
    ```sh
    pnpm start
    ```

3. The static webpages is now mounted by the server and can be accessed at `http://localhost:3000/display` & `http://localhost:3000/control`.

## License

This project is licensed under the MIT License.