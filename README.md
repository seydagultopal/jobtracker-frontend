# Pebble — Job Tracker Frontend

Pebble is a React web application for organizing job applications, daily tasks, and professional development in one place. This repository contains the frontend; the REST API is maintained separately.

## Related repositories

- **Backend API:** [jobtracker-backend](https://github.com/seydagultopal/jobtracker-backend)
- **Frontend (this repository):** [jobtracker-frontend](https://github.com/seydagultopal/jobtracker-frontend)

For backend architecture, data model, endpoint examples, security notes, tests, and Docker instructions, see the [backend README](https://github.com/seydagultopal/jobtracker-backend#readme).

## Features

- Dashboard and job application tracker
- Calendar and daily agenda with to-do items
- Professional development pages for courses, projects, and skills
- Profile and CV/resume builder
- Registration, login, and password-reset screens
- Light/dark theme and language context
- Responsive layouts and reusable forms/modals

## Technology stack

- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS 3
- Lucide React icons
- html2pdf.js for PDF export

## Application structure

```text
src/
├── components/   # Shared layout, navigation, and form modals
├── context/      # Language, theme, and event contexts
├── pages/        # Dashboard, tracker, calendar, agenda, profile, resume, auth
├── services/     # Axios API client
├── App.jsx
└── main.jsx
```

## Run locally

### Prerequisites

- Node.js (a current LTS release is recommended)
- npm
- The backend API and its required services for authenticated features

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

Vite prints the local development URL in the terminal (typically `http://localhost:5173`).

The API client in `src/services/api.js` currently uses `http://localhost:8080`. Start the backend separately; see its [local setup guide](https://github.com/seydagultopal/jobtracker-backend#run-locally).

### Production build and lint

```bash
npm run build
npm run lint
npm run preview
```

## API integration

The Axios client adds the JWT from browser `localStorage` as a Bearer token for non-authentication requests. The backend API route definitions and example payloads are documented in the [backend README](https://github.com/seydagultopal/jobtracker-backend#api-overview).

**Known integration issue:** the registration page currently posts to `/auth/register`, but the backend endpoint is `/api/auth/register`. Align the route before testing account creation.

## Known limitations

- The frontend requires a separately running backend for API-backed features.
- The API base URL is hard-coded in the Axios client and should be moved to a Vite environment variable (for example, `VITE_API_BASE_URL`) before deployment.
- The registration route currently does not match the backend mapping.
- JWT storage in `localStorage` requires an explicit XSS threat assessment and suitable mitigations.
- Build and lint commands are documented but have not been verified as passing in this README update.

## License

No license file is currently included. Unless a license is added, reuse and redistribution are not explicitly granted.
