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
    pnpm run build
    ```

2. Start the server:
    ```sh
    pnpm run start
    ```

3. Access the static webpages mounted by the server at `http://localhost:3000/display` & `http://localhost:3000/control`. The display page is for the live stream, and the control page is suggested to be opened in a separate tab for managing the live stream.

## License

This project is licensed under the MIT License.