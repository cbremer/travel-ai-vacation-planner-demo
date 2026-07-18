# Serving the app and installing the PWA

This is a static Vite app. A production build writes the application shell and bundled sample data to `dist/`.

## Public demo with GitHub Pages

GitHub Pages is the intended host for this repository's synthetic public demo. A deployment workflow is included at `.github/workflows/deploy-pages.yml` and can be run manually after the repository is ready to be public.

Before the first deployment:

1. Confirm the repository contains synthetic, public-safe information only.
2. Change the repository visibility to public.
3. In **Settings → Pages**, select **GitHub Actions** as the source.
4. Open **Actions → Deploy public demo to GitHub Pages** and choose **Run workflow**.
5. Confirm the deployed URL resembles `https://YOUR-USER.github.io/REPOSITORY/`.
6. Test the home page, a day page, Trip Info, Timeline, refresh behavior, and PWA installation.

The project uses relative asset paths and hash routing so it works beneath GitHub Pages' repository subpath. The workflow builds `dist/` and deploys that directory using GitHub's official Pages actions.

Do not use the public Pages deployment for a customized app containing real names, confirmations, contact information, private travel dates, or private lodging details. Use private hosting for that copy.

## Build and test locally

```bash
npm install
npm run lint
npm run build
npm run preview
```

Vite Preview is useful for verification, but it is not intended to be a permanent production server.

## Private serving with Tailscale

Tailscale Serve can expose a local web server to devices on the same tailnet over HTTPS. Install Tailscale, sign the serving computer and family devices into the appropriate tailnet, and confirm `tailscale status` works first.

One straightforward setup is:

```bash
npm run build
npx vite preview --host 127.0.0.1 --port 4173
```

Keep that process running. In another terminal, configure Tailscale Serve:

```bash
tailscale serve --bg http://127.0.0.1:4173
tailscale serve status
```

Open the HTTPS URL reported by Tailscale on another device in the tailnet.

Tailscale’s CLI evolves, so check the installed version’s syntax before relying on these commands:

```bash
tailscale serve --help
```

To remove the Serve configuration:

```bash
tailscale serve reset
```

### A more durable server

For an always-on trip app, use a process manager or operating-system service to keep a static server running after logout and restart it after a reboot. Point that server at `dist/`, bind it only to localhost, and let Tailscale Serve provide private HTTPS access.

Examples of static servers include Caddy, nginx, `serve`, or a small Node static-file server. Whichever you choose must support single-page-app fallback to `index.html` for direct navigation. This app uses hash routing, which reduces that requirement for normal in-app routes.

## Serving under a path

The Vite configuration currently uses a relative base (`./`), allowing the built app to work at `/` or under a path such as `/travel/`. Verify the final URL after changing hosting configuration because PWA scope, cached assets, and start URLs are sensitive to paths.

If serving at `/travel/`, configure the proxy or static server so that:

- `/travel/` returns the built `index.html`
- `/travel/assets/...` returns the built assets
- `/travel/data/...` returns the trip JSON
- the server does not cache old trip JSON longer than intended

## Updating the running app

After changing code or trip data:

```bash
npm run lint
npm run build
```

Restart or reload the static server if it does not notice the new `dist/` files. The PWA is configured to update its service worker automatically, but an installed device may briefly retain cached assets. Fully close and reopen the PWA, or refresh it in the browser, when checking a new release.

Always confirm the served app reflects the new itinerary before leaving for the day.

## Install on iPhone or iPad

1. Connect the device to the tailnet if the site is private.
2. Open the HTTPS app URL in Safari.
3. Tap Share.
4. Choose **Add to Home Screen**.
5. Open the new icon and visit the important pages once while online.

Safari controls PWA installation on iOS even if another browser is your default.

## Install on Android

1. Connect the device to the tailnet if the site is private.
2. Open the HTTPS app URL in Chrome.
3. Open the browser menu.
4. Choose **Install app** or **Add to Home screen**.
5. Open the installed app and visit important pages while online.

## Offline expectations

The generated service worker caches the built application and JSON assets. After a successful online visit, the installed app should remain useful during temporary connectivity loss.

Offline support is a convenience, not a guarantee:

- External map, airline, hotel, and ticket links still require connectivity.
- Newly changed itinerary data is unavailable until the device receives the update.
- Browsers may evict cached data.
- Never make the app the only copy of a ticket, boarding pass, address, or emergency contact.

Test airplane mode before the trip and keep critical documents in the official provider apps or another offline location.

## Privacy and access

Tailscale limits network access, but the application itself has no user login or field-level authorization. Anyone who can access the served URL can read every detail bundled into the app.

- Keep the customized GitHub repository private.
- Limit tailnet membership and sharing.
- Avoid embedding secrets that do not need to be in the interface.
- Remove expired confirmations and unnecessary personal information after the trip.
- Do not expose the same build through a public web server unless its contents are safe for anyone to read.
