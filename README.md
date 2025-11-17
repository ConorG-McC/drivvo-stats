# drivvo-stats

This is a tool for managing Drivvo vehicle data, such as fetching vehicle information, fueling entries, and servicing records from the Drivvo API. It supports filtering by vehicle plate and saving data to JSON files.

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

### Config
1. Copy the template environment file and rename it:
```bash
cp template.env .env
```
2. Populate `.env` with your Drivvo credentials. The script hashes your password before sending it to the API.

   > `.env` is already gitignored but assure you never commit your credentials.

### Run the App
```bash
npm start
```
You'll be guided through prompts to pick a vehicle, choose which entry types to download, and whether to translate the responses. JSON files are saved automatically under `outputs/`.

During the interactive session you'll be asked to:
- Select a vehicle by number or by typing its plate (defaults to the newest vehicle).
- Choose which entry buckets to fetch (fuelling, servicing, expenses).
- Decide whether to generate translated (English-keyed) copies alongside the original Spanish JSON.

Every request always writes the untouched Drivvo response to `outputs/spanish/*`. When translation is enabled, a second file mirrors the same data under `outputs/english/*`.

