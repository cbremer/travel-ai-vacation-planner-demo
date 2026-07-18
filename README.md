# AI Vacation Planner Demo

A mobile-first React PWA showing how a family vacation can be managed as a small, structured operating system: daily plans, maps, reservations, tickets, people, travel notes, a timeline, and a booking checklist.

All people, dates, bookings, contact details, costs, addresses, routes, and confirmation codes in this repository are synthetic. This is a clean-room showcase with fresh Git history; it is not a fork of the private production app.

## What it demonstrates

- A day-by-day mobile itinerary with kid-friendly missions and context
- Searchable lodging, flight, rental-car, activity, place, and contact information
- Copyable operational details and quick links
- A compact timeline, budget, and booking checklist
- Offline-friendly PWA behavior
- Structured JSON as the source of truth

## AI-assisted workflow

The original project explored a broader workflow using coding assistants for planning and implementation, conversational tools for live itinerary updates, private networking for family access, and generated imagery for kid-friendly trip materials. This repository shares the app pattern without private trip contents or operational infrastructure.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To verify a production build:

```bash
npm run lint
npm run build
npm run preview
```

## Customize it

Edit `data/trip.json` and `data/day-guide.json`. The TypeScript interfaces in `src/types/` document the expected shape.

## Privacy

See [PRIVACY.md](PRIVACY.md) before publishing a customized copy. Never commit real booking codes, private addresses, personal contact information, or a private repository's Git history.

## Status

This repository is intentionally private during its verification phase. Repository visibility can be changed only after the synthetic data, rendered UI, tracked files, and Git history have been reviewed.
