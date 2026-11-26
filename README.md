# Gravity Frontier v25 — Online Multiplayer Foundation

v25 changes multiplayer from same-Wi-Fi native hosting to **internet rooms using Supabase Realtime**. The game remains a static HTML/CSS/JavaScript app and can be installed on iPhone as a Home Screen web app (PWA). No App Store submission or Apple Developer Program membership is required to play it as a web app.

## What's new in v25

- Create online rooms with a random `GF-XXXXXXXX` room code.
- Friends join from any network (Wi-Fi or cellular) by entering the room code.
- Lobby state, team selection, ready state, match start, snapshots, deltas, fleet commands, command results, and heartbeat replies travel over Supabase Realtime Broadcast.
- Supabase Presence tracks players joining and leaving.
- The host browser remains authoritative for the simulation; clients send commands to the host and render the host's updates.
- Cloud settings screen stores the Supabase Project URL and public publishable/anon key in that browser's local storage.
- Host game updates are sent at up to 5 updates per second to reduce free-tier message usage.
- Existing single-player modes, campaign, editor, saved maps, and local progress remain available.

## One-time cloud setup

1. Create a free project at [Supabase](https://supabase.com/).
2. In the Supabase dashboard, open **Project Settings → API** (or the API Keys page).
3. Copy the **Project URL** and the **publishable key** (or legacy `anon` public key).
4. Open Gravity Frontier, choose **Multiplayer → Set up free cloud backend**, and paste those two values.
5. Tap **Save and test connection**. No database tables or service-role key are needed for this Realtime-only prototype.
6. Share the same published game link with friends. Each player enters the same Project URL and public key once on their device.
7. Host a lobby, share the room code, and have friends enter it under **Join a lobby**.

**Never paste a Supabase `service_role` or secret key into the game.** The browser must only use the public publishable/anon key.

## Hosting the game website

Upload the contents of this ZIP to a static website host that supports HTTPS. GitHub Pages can host static project sites on its free plan for hobby use; review its current usage limits and terms before publishing. The Supabase backend is separate from the website host.

For iPhone installation, open the HTTPS game link in Safari → Share → Add to Home Screen. It is an installable web app, not an App Store binary.

## Free-tier notes

Supabase's current Free tier lists 200 peak concurrent Realtime connections and 2 million Realtime messages per month. Broadcast usage is counted for the send and each subscribed recipient, so longer matches and larger rooms consume more messages. This build limits game updates to approximately 5 per second to reduce usage. Check your Supabase dashboard's usage page periodically.

Supabase Free projects may pause after one week of inactivity. A paused project must be resumed in the Supabase dashboard. Free tier limits and terms can change.

## Important limitations / security

- **Host must remain online:** the host's browser runs the simulation and must stay open and connected. If the host closes the page or loses internet, the match stops for everyone. Host migration is not implemented.
- **Room codes are access tokens:** rooms use public Realtime channels protected by a random 8-character code. Share codes only with people you want in the room. This is a friend-group prototype, not a hardened public competitive-game backend.
- **No account system:** player names are lobby display names, not verified identities.
- **No room browser:** players join using the host's room code.
- **Reconnect:** Supabase can reconnect a live browser session, but refreshing/reopening a page does not guarantee restoration of a previous match. A fresh snapshot is requested after reconnect.
- **Testing:** no physical multi-device test has been performed in this environment. Test hosting, joining, presence, team changes, ready state, fleet commands, reconnect, and host disconnect on actual devices.
- **No iOS native binary:** this is a PWA/static website package. The old Swift local-network starter is not used by online rooms and is not needed to play this version in Safari.

## Files

- `index.html` — game and multiplayer UI
- `multiplayer-bridge.js` — Supabase Realtime transport adapter
- `manifest.webmanifest`, `sw.js`, icons — PWA installation and caching

## Local testing

Serve the folder from an HTTPS static host (or localhost for development), open `index.html`, configure Supabase, then use two browser/device sessions. For real iPhone testing, publish over HTTPS first.
