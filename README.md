# Maptorium UI

Maptorium UI is now a Quasar-powered interface that ships ready for Electron. This repository builds only the desktop UI package; it does not build or bundle the Node.js server. If you need the full server + UI distribution visit https://github.com/gunyakov/maptorium-server.

## Highlights

- Built with Quasar 2, Vue 3, and Pinia for a modern navigation UI.
- Electron-ready out of the box for offline desktop deployments.
- Local POI persistence, socket client for live vessel data, and configurable basemaps.

## Requirements

- Node.js 20 or newer (see `package.json` for the full list of supported LTS releases).
- npm 9+ (or another package manager of your choice).
- The Quasar CLI is installed automatically through `@quasar/app-vite` during `npm install`.

## Installation

```sh
git clone https://github.com/gunyakov/maptorium-ui.git
cd maptorium-ui
npm install
```

## Development

- `npm run dev` – starts the Quasar Vite dev server at http://localhost:9000 with hot module reload.
- `npm run dev:electron` – launches the UI inside Electron for desktop testing while retaining hot reload.

## Production Builds

- `npm run build` – produces a static SPA build under `dist/spa` that can be served by maptorium-server or any web server.
- `npm run build:electron` – packages an Electron desktop app under `dist/electron`, ready for distribution.
- `npm run lint` – runs ESLint on Vue, TypeScript, and JavaScript sources.

## Electron Distribution Scope

This repository controls only the UI and the Electron packaging artifacts (AppImage, dmg, exe, etc.). Back-end services, GPS ingestion, and bundled installers containing both the server and UI live in the main project repository: https://github.com/gunyakov/maptorium-server.

## Recommended Tooling

- VS Code + Volar (disable Vetur) for Vue single-file component DX.
- Vue TSC or the `npm run lint` script for type checking.

## Need the Server?

Head over to https://github.com/gunyakov/maptorium-server for deployment guides, API docs, and combined server+UI release artifacts.
