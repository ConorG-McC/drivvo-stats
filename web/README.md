# drivvo-web

Next.js dashboard for Drivvo vehicle data.

## Run

From the repo root:

```bash
npm run dev:web
```

Build the app:

```bash
npm run build:web
```

Start a production build:

```bash
npm run start:web
```

## Docker

The compose file exposes the app on port `3000` inside the `drivvo-stats-network`
Docker network for a reverse proxy to route to it. Create the external network
once on the host:

```bash
docker network create drivvo-stats-network
```

From the repo root:

```bash
docker compose -f web/docker-compose.yml up -d --build
```

Or from the `web/` directory:

```bash
docker compose up -d --build
```
