SecretaSanta Worker

This small Cloudflare Worker mirrors the site functions from the main project.

Routes
- `https://santa.jackhubbard.com/api/*` is configured in `worker.toml`.

Local dev
- Install dependencies in `worker/` and run `wrangler dev`.

Notes
- Environment variables (e.g., `CONNECTION_STRING`, `ADMIN_PASSWORD`) must be configured in Cloudflare.
