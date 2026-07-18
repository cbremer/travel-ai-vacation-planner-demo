# Customize with a coding agent

The best use of this repository is collaborative: provide your trip material, let an agent inspect the existing app, and ask it to refactor the product around your journey.

## Before you begin

1. Clone the template.
2. Create a new private repository for your trip.
3. Install dependencies with `npm install`.
4. Confirm the sample app runs with `npm run dev`.
5. Decide whether the agent may receive sensitive details. Use placeholders if you are unsure.

## Copy/paste agent brief

Attach or paste your itinerary after this prompt:

```text
Adapt this travel PWA for my trip.

First inspect the repository, its data model, routes, components, PWA setup, and current synthetic sample trip. Treat the existing app as a useful starting point, not a fixed schema.

Replace the sample itinerary with the trip information I provide. Preserve features that remain useful, but refactor the data types, navigation, pages, labels, timeline categories, featured sections, and visual treatment wherever my trip requires something different.

Requirements:
- Use my itinerary as the source material, but flag contradictions or missing travel-critical details.
- Keep dates, local times, time zones, locations, transport legs, lodging, bookings, and daily plans internally consistent.
- Make addresses, maps, tickets, and important details easy to open or copy on a phone.
- Keep the interface mobile-first and PWA-friendly.
- Do not invent confirmation numbers, addresses, booking status, prices, or travel times. Use “TBD” and tell me what is missing.
- Do not expose secrets in source code unnecessarily.
- Preserve offline behavior where practical.
- Update the README if setup or data-entry instructions change.
- Run lint and the production build when finished.

Before editing, summarize the proposed app structure and identify any questions that materially affect the result. Make reasonable assumptions for minor presentation choices.

After implementation, give me:
- a summary of the customized experience;
- a list of details I still need to verify;
- the commands to run and serve it;
- a privacy review of the files that would be committed.

Here is my itinerary and trip context:
[PASTE OR ATTACH IT HERE]
```

## A useful second pass

After the first version runs, use the app on a phone and give the agent concrete feedback:

```text
Review this trip app as something my family will use while moving through the actual itinerary. Reduce friction for the details we will need in the moment. Prioritize today’s plan, directions, tickets, check-in information, copyable addresses, and clear changes between days. Keep private information appropriately scoped.
```

Screenshots are especially helpful when asking the agent to improve mobile layout.

## Information the agent may need

- Trip title, dates, route, and time zones
- Traveler roles and which details should be visible
- Day-by-day activities with fixed versus flexible times
- Lodging nights and transition days
- Transport segments and connection details
- Public venue links, ticket links, and map destinations
- Reservation status and optional costs
- Special event logistics
- Accessibility, dietary, medication, packing, or kid-related reminders
- The hosting path, such as `/` or `/travel/`

## Acceptance checklist

Before using the app on the trip:

- [ ] Every trip day opens and navigates correctly
- [ ] Dates and weekdays agree
- [ ] Time zones and local times are explicit where needed
- [ ] Lodging appears on the correct nights
- [ ] Travel legs connect the correct origins and destinations
- [ ] Map links open the intended location
- [ ] Ticket and booking links work
- [ ] Copy buttons copy the intended value
- [ ] Unknown information says `TBD` rather than being invented
- [ ] Search finds the important bookings and people
- [ ] The app works at a phone viewport
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] The production URL works over HTTPS
- [ ] The installed PWA opens after the device temporarily loses connectivity
- [ ] The repository and hosting access match the sensitivity of the data
