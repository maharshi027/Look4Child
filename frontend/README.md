# Look4Child Frontend

This is the React + Vite frontend for the Look4Child Foundation portal.

## What It Includes

- Public home, work, and donation pages
- Admin login and protected admin dashboard
- Employee records table with search, filters, and edit/delete actions
- Collapsible admin sidebar that keeps menu icons visible in compact mode
- Offline cash entry form with certificate generation

## Development

```bash
npm install
npm run dev
```

The app runs with Vite and uses the backend API proxy configured in `vite.config.js`.

## Notes

- The admin dashboard now focuses on employee records instead of a duty roster view.
- When the sidebar is collapsed, only the first menu icons remain visible and the main content stays readable.
- The records table continues to use the existing backend donation endpoints until the API model is renamed.
