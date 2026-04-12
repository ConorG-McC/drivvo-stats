# drivvo-stats

Tools for working with Drivvo vehicle data.

This repo uses npm workspaces:
- `cli/` contains the Drivvo data export CLI.
- `web/` contains the Next.js dashboard.

## Quick Start

### Prerequisites
- Node.js (v18+) – required for the built-in `fetch` API and `crypto.randomUUID`.
- npm

### Setup
```bash
git clone <repo-url>
cd <repo-dir>
npm install
```

### Run the CLI
```bash
npm start
```

### Run the Web
```bash
npm run web:dev
```

## Workspace Docs

- CLI: `cli/README.md`
- Web: `web/README.md`
