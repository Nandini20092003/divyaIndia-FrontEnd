# DivyaIndia Frontend Deployment

## Render Static Site

- Repository: `Nandini20092003/divyaIndia-FrontEnd`
- Build command: `npm ci && npm run build`
- Publish directory: `build`
- Environment variable: `REACT_APP_API_BASE_URL=https://divyaindiabackend.onrender.com/api/v1`

Add a Render rewrite rule so React Router routes work after refresh:

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

For local development, copy `.env.example` to `.env`, set the API URL, then run `npm ci` and `npm start`. Restart the development server after changing environment variables.

The frontend sends credentials for authenticated API requests. The backend must allow this exact frontend origin and set compatible cookie attributes.
