# Project converted to Static Frontend

This project has been converted from an Express/PostgreSQL full-stack app to a static React application suitable for GitHub Pages.

## Changes made:
- Removed Express backend (`server/` directory)
- Removed Database/ORM (`drizzle`, `shared/schema.ts`, etc.)
- Moved all data to `client/public/data/` as JSON files
- Moved all assets to `client/public/assets/`
- Updated `queryClient.ts` to fetch from static JSON files instead of API routes
- Configured Vite for relative paths (`base: "./"`)
- Added `gh-pages` deployment support

## Commands:
- `npm run dev`: Start local development server
- `npm run build`: Build static files to `dist/`
- `npm run deploy`: Deploy to GitHub Pages
