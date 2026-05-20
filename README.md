# intelliAdmin Vue 3 TS

An intelligent park administration dashboard built with Vue 3, TypeScript, Vite, Pinia, Vue Router, Element Plus, Axios, and ECharts.

The application provides role-based access to smart park management workflows, including park resources, enterprise records, parking cards, billing rules, property fees, pole devices, alarms, employees, and system roles.

## Features

- Authentication with token persistence.
- Permission-based dynamic routes and sidebar menus.
- Workbench dashboard entry page.
- Park management for buildings, enterprises, enterprise details, and rental records.
- Parking management for areas, monthly cards, parking payments, and billing rules.
- Property fee management.
- Smart pole device and alarm record management.
- System management for employees, roles, permissions, and role users.
- Shared Axios request layer with authorization headers and 401 handling.
- Element Plus UI components and ECharts-based data visualization support.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Axios
- ECharts
- Sass
- ESLint, Oxlint, and Prettier

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- pnpm

## Getting Started

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Build for production:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

Run lint checks and auto-fixes:

```sh
pnpm lint
```

Format source files:

```sh
pnpm format
```

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vite development server. |
| `pnpm build` | Run type checking and create a production build. |
| `pnpm build-only` | Create a production build without type checking. |
| `pnpm type-check` | Run `vue-tsc` project type checking. |
| `pnpm preview` | Preview the built application with Vite. |
| `pnpm lint` | Run Oxlint and ESLint with auto-fix enabled. |
| `pnpm format` | Format files in `src/` with Prettier. |

## Project Structure

```text
.
├── src
│   ├── apis              # API functions grouped by business module
│   ├── assets            # Images, SVGs, and menu icons
│   ├── components        # Shared Vue components
│   ├── constants         # Shared constants
│   ├── directive         # Custom directives
│   ├── layouts           # Main layout, navbar, and sidebar components
│   ├── router            # Static routes and permission-based async routes
│   ├── stores            # Pinia stores for user and menu state
│   ├── styles            # Global styles and Element Plus overrides
│   ├── types             # TypeScript declaration files
│   ├── utils             # Auth, validation, and request helpers
│   └── views             # Page-level Vue components
├── vite.config.ts        # Vite configuration and path aliases
└── package.json          # Scripts, dependencies, and Node engine constraints
```

## Routing And Permissions

The router is split into two route groups:

- Static routes in `src/router/index.ts`, such as login, workbench, form/detail pages, and the fallback page.
- Dynamic routes in `src/router/asyncRoutes.ts`, which are filtered by the current user's permission codes.

On authenticated navigation, `src/permission.ts` loads the user profile, extracts permission codes, filters the dynamic route table, registers allowed routes with `router.addRoute`, and stores the resulting menu list in Pinia.

## API Layer

API functions live in `src/apis/` and use the shared request helper in `src/utils/reuqest.ts`.

The Axios instance currently uses this base URL:

```ts
https://api-hmzs.itheima.net/tj
```

The request interceptor attaches the bearer token from local storage. The response interceptor unwraps `response.data`, handles `401` responses by clearing local authentication state, redirects to `/login`, and displays Element Plus messages for request errors.

## Development Notes

- The `@` alias points to `src`.
- Page titles are set from route metadata.
- Sidebar menus are generated from the Pinia menu store.
- Permission metadata follows module-style codes such as `park:building`, `parking:card`, and `sys:role`.
- The request utility filename is currently `src/utils/reuqest.ts`.

## Recommended IDE Setup

Use [VS Code](https://code.visualstudio.com/) with the [Vue Official extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Disable Vetur if it is installed.
