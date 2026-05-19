# Vencer Admin — Setup Guide

This walks through wiring the admin (Phase 1) from a clean state to deployed-and-live. ~30 minutes end-to-end if all the third-party signups go smoothly.

---

## 1. Install new dependencies

From the project root:

```bash
npm install
```

This adds `@supabase/supabase-js`, `@supabase/ssr`, and `posthog-js` (already in `package.json`).

---

## 2. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up using **alain@vencer.dev** (a fresh account, separate from any Tribe/other Supabase accounts).
2. Verify the email in your Zoho inbox.
3. Click **New Project** in the dashboard.
4. Settings:
   - **Name**: `vencer` (or `vencer-admin` — your call)
   - **Database password**: generate a strong one and save in 1Password / your password manager
   - **Region**: **East US (North Virginia)** — same region as Vercel's default, lowest latency
   - **Plan**: Free
5. Wait ~2 minutes for the project to provision.

### Run the database migration

1. In your Supabase project, go to **SQL Editor** → **New Query**.
2. Open `supabase/migrations/0001_create_submissions.sql` from this repo, copy the entire contents, paste into the SQL editor, and click **Run**.
3. You should see "Success. No rows returned." That created the `submissions` table, an updated_at trigger, indexes, and RLS policies.
4. Verify by clicking **Table Editor** in the left sidebar — you should see `submissions` in the public schema.

### Configure email auth redirect URL

For magic-link login to work, Supabase needs to know which redirect URLs are allowed:

1. **Authentication** → **URL Configuration**.
2. Set **Site URL** to `https://vencer.dev`.
3. Under **Redirect URLs**, add both:
   - `https://vencer.dev/admin/auth/callback`
   - `http://localhost:3000/admin/auth/callback` (for local dev)

### Grab the keys

1. **Settings** → **API**.
2. Copy three values into your `.env.local` (create from `.env.example`):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this one secret)

---

## 3. Set up Resend for notifications

1. Go to [resend.com](https://resend.com), sign up using **alain@vencer.dev**.
2. **API Keys** → **Create API Key**, name it `vencer-prod`, copy it into `.env.local` as `RESEND_API_KEY`.
3. Verify the `vencer.dev` domain so emails can be sent from `inbox@vencer.dev`:
   - **Domains** → **Add Domain** → `vencer.dev`
   - Resend gives you DNS records (SPF, DKIM, MX) to add to Namecheap.
   - Add them in Namecheap **Advanced DNS**, wait 5–15 minutes, click **Verify** in Resend.
   - Once verified, the inbox notifications will send from `inbox@vencer.dev`. (Until verified, they fall back to Resend's `onboarding@resend.dev` sender, which still works but looks less branded.)

---

## 4. Set up PostHog for analytics

1. Go to [posthog.com](https://posthog.com), sign up using **alain@vencer.dev**.
2. Create a new project named `vencer`.
3. **Project Settings** → **General** → copy the **Project API Key** (starts with `phc_`) into `.env.local` as `NEXT_PUBLIC_POSTHOG_KEY`.
4. The host should be `https://us.i.posthog.com` (default, already set in `.env.example`). If your project is on the EU cloud, change to `https://eu.i.posthog.com`.
5. **Project Settings** → **Session Replay** → enable it (free tier includes session recordings).

---

## 5. Fill in the rest of `.env.local`

```bash
ADMIN_EMAIL=alain@vencer.dev
NOTIFICATION_EMAIL=alain@vencer.dev
NEXT_PUBLIC_SITE_URL=https://vencer.dev
```

Final `.env.local` should have all 8 vars filled in. Cross-reference against `.env.example`.

---

## 6. Test locally

```bash
npm run dev
```

Then in your browser:

- **http://localhost:3000** — the public site should load normally with PostHog tracking active (check the PostHog dashboard's "Live Events" view; you should see `$pageview` events arriving).
- **http://localhost:3000/admin** — should redirect to `/admin/login`.
- **http://localhost:3000/admin/login** — enter `alain@vencer.dev`, click "Send magic link." Check your Zoho inbox for the link, click it, you should land at `/admin` with a dashboard.
- **Submit a test form** at `/contact`. The dashboard should now show `1 unread`. Click into it.
- **PostHog session replay** — go to your PostHog dashboard, **Session replays**, you should see your own session being recorded.

If anything fails: check the browser console + the terminal running `npm run dev` for stack traces. Most issues are env-var typos (especially the service-role key being too short or missing).

---

## 7. Deploy

Add the same env vars to Vercel:

1. Vercel → `vencer` project → **Settings** → **Environment Variables**.
2. Add each of the 8 variables from `.env.local` (mark `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` as Sensitive).
3. Set them for **Production** + **Preview** + **Development** (or just Production if you only want them in prod).

Then push:

```bash
git add -A
git commit -m "Phase 1: admin scaffolding (Supabase + auth + PostHog)"
git push origin main
```

Vercel auto-deploys. After the green check:

- Visit `https://vencer.dev/admin` — should redirect to login.
- Log in with magic link → land at the dashboard.
- Submit a real test form on the live site → it should land in the inbox.
- Check PostHog dashboard for live `$pageview` events.

---

## What's in Phase 1

✅ Forms write to your own Supabase DB (no more Formspree)
✅ Resend notification emails on every submission
✅ Magic-link auth at `/admin` (single-user, locked to `ADMIN_EMAIL`)
✅ Inbox list with filter tabs (Open / Replied / Archived / All)
✅ Submission detail view with mark-read / mark-replied / archive actions
✅ Reply-by-email button (pre-fills mailto: with their address and a draft greeting)
✅ Dashboard with unread count + this-week + per-type stats
✅ PostHog tracking on every public page (page views, clicks, scroll, session replay)
✅ PWA manifest for `/admin` — installs to your iPhone home screen as "Vencer"

## Coming in Phase 2

- Edit case study content from the admin (replace [Replace with: …] placeholders, swap quotes/timelines, toggle DRAFT banners)
- Edit pricing tiers, service descriptions, hero copy
- Toggle site flags ("currently booking Q3" banner, vacation mode)
- Image uploads via Supabase Storage

## Coming in Phase 3

- Inline replies from the inbox (sends via Resend, threaded conversations)
- Notes/tags on submissions ("hot lead", "follow up Tuesday")
- Custom analytics views built on the PostHog API (if app.posthog.com starts feeling cramped)
