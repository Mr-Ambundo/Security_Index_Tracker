# Frontend Setup

This is the React frontend for the Security Incident Tracker.

## Installation

```bash
npm install
```

## Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Features

- **Login/Register** - Secure authentication with JWT tokens
- **Dashboard** - Overview of all incidents with statistics
- **Incident Management** - Create, view, edit, and delete incidents
- **Incident Details** - Full incident information with timeline
- **Professional UI** - Enterprise-grade SOC dashboard design

## Default Admin Account (for testing)

After setting up the backend, you can register a new account or use test credentials.

## Deployment

Frontend can be deployed to Vercel, Netlify, or any static hosting service.

Build the app first:
```bash
npm run build
```

Then deploy the `build/` folder.
