# drivvo-cli

CLI for fetching Drivvo vehicle data and saving JSON exports.

## Config

Copy the CLI template environment file and fill in your Drivvo credentials:

```bash
cp cli/template.env cli/.env
```

The CLI hashes your password before sending it to the API.

## Run

From the repo root:

```bash
npm start
```

or:

```bash
npm run cli:start
```

During the interactive session you'll be asked to:
- Select a vehicle by number or by typing its plate.
- Choose which entry buckets to fetch: fuelling, servicing, expenses.
- Decide whether to generate translated English-keyed copies.

Exports are written to `cli/outputs/`.

The untouched Drivvo response is written to `cli/outputs/spanish/*`. When translation is enabled, a second file is written to `cli/outputs/english/*`.
