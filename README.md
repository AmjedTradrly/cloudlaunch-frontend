# CloudLaunch Frontend

Independent React + Vite frontend for CloudLaunch.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Configure the standalone backend URL in `.env`:

```env
VITE_API_URL=http://localhost:3001
```

For production, set `VITE_API_URL` in your hosting platform before running `npm run build`. It must be the public HTTPS URL of the backend without a trailing slash.

## Commands

- `npm run dev` — local development server
- `npm run build` — production output in `dist/`
- `npm run preview` — preview the production build

This folder can be moved into its own Git repository and deployed to AWS S3 + CloudFront, Amplify, Vercel, or Netlify.
