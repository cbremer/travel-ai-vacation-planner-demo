# Privacy model

This repository contains synthetic demonstration data only. It was created as a clean export with fresh Git history and does not include the private production repository's history.

Before making the repository public, verify that it contains no real:

- names, email addresses, phone numbers, or home addresses
- booking or confirmation numbers
- private travel dates, costs, notes, or routes
- private URLs, hostnames, account identifiers, or filesystem paths
- screenshots or generated media derived from the private trip
- deployment, automation, snapshot, changelog, or planning artifacts

Run `npm run build` and inspect the full tracked file list and built output before changing repository visibility.

## For people customizing this template

Keep your cloned trip repository private unless its contents are intentionally public. A trip app may reveal not only contact and booking data, but also when travelers are away from home.

Before giving an itinerary to a coding agent, understand the agent's data handling and retention. Use placeholders for details the agent does not need. After customization, inspect both the source files and `dist/`: production builds can contain trip data even when the original source file is ignored later.

Private Tailscale access protects the network boundary; it does not add authentication inside the app. Every device or person able to reach the URL should be assumed able to read all bundled trip information.
