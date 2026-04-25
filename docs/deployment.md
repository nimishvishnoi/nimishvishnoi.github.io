# Deployment

This project is deployed to GitHub Pages through GitHub Actions.

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in the Firebase `VITE_FIREBASE_*` values
3. Run:

```bash
yarn dev
```

## Production setup

Add these repository secrets in GitHub Actions:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

The workflow at `.github/workflows/deploy.yml` injects these values during the production build.

## Deploy

Push to `main` to trigger the GitHub Pages deployment workflow.
