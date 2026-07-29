# Vencer — Contact/Referral Form Setup (email-only via Resend)

**What changed and why:** The contact and referral forms were failing because the
submission action tried to write to a Supabase project that doesn't exist, and
the form showed a generic "Something went wrong" for every failure. Since your
Supabase free tier is capped at 2 projects (both spoken for — Tribe + one other),
we switched the forms to **email delivery via Resend** as the primary channel.
No database required. Every submission now emails straight to your inbox.

The Supabase code path is still there but **optional** — it only runs if real
Supabase env vars are present. The day you free up a project slot, add those vars
and the `/admin` inbox lights up again with zero code changes.

---

## What you need to do (~10 minutes, one-time)

### 1. Create a Resend account + API key
1. Go to [resend.com](https://resend.com) and sign up **using `alain@vencer.dev`**
   (this matters — see the note in step 4).
2. **API Keys → Create API Key.** Name it `vencer-prod`. Copy the key
   (starts with `re_...`). You'll only see it once.

### 2. Add the key to Vercel
1. Vercel → your Vencer project → **Settings → Environment Variables**.
2. Add:
   - **Key:** `RESEND_API_KEY`  **Value:** the `re_...` key  → mark **Sensitive**
   - **Key:** `NOTIFICATION_EMAIL`  **Value:** `alain@vencer.dev` (optional — it
     already defaults to this, but setting it explicitly is cleaner)
3. Apply to **Production** (and Preview/Development if you want the form working
   on preview deploys too).

### 3. Deploy the code change
The code change (in this commit) has to ship along with the env var. Commit and push:
```bash
git add -A
git commit -m "Switch contact/referral forms to Resend email delivery; DB now optional"
git push origin main
```
Vercel auto-deploys. Wait for the green check.

> If you'd rather not redeploy from a push, adding the env var and clicking
> **Redeploy** on the latest deployment also works — but only *after* the code
> change is on `main`, so the push is the reliable path.

### 4. Test it
1. Go to `https://vencer.dev/contact`, fill it out, hit **Send**.
2. You should see the teal "Message sent" confirmation, and an email titled
   **"New contact: <name>"** should arrive at `alain@vencer.dev` within seconds.

> **Why sign up to Resend with `alain@vencer.dev`?** Until you verify the
> `vencer.dev` domain in Resend, Resend only lets you send *to the email address
> your account is registered under.* Since notifications go to `alain@vencer.dev`,
> registering Resend with that same address means it works immediately with zero
> DNS setup. Emails send from Resend's shared `onboarding@resend.dev` sender.

---

## Optional polish (do later, not required for the form to work)

### Brand the "From" address (`inbox@vencer.dev`)
1. Resend → **Domains → Add Domain → `vencer.dev`.**
2. Resend gives you SPF/DKIM (and optionally MX) records. Add them in Namecheap
   → **Advanced DNS.** (Ask me and I'll format the exact records for you.)
3. After it verifies, add a Vercel env var:
   `EMAIL_FROM=Vencer Inbox <inbox@vencer.dev>` and redeploy.
4. Now notifications send from your own domain and can go to any address.

### Later: light up the `/admin` inbox
When you have a free Supabase slot (or upgrade), follow the existing
`SETUP-ADMIN.md`: create the project, run `supabase/migrations/0001_create_submissions.sql`,
and add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` to Vercel. Submissions will start persisting again and
the inbox at `/admin` will work — no code changes needed.

---

## How to diagnose the form fast if it ever breaks again

The forms now show the *real* reason on failure instead of a generic message,
and the server logs a precise line. In **Vercel → your project → Logs**, look for:

- `[submissions] RESEND_API_KEY is missing or still the placeholder` → the env
  var didn't get set (or the deploy predates it).
- `[submissions] Resend rejected the send: ...` → Resend refused it — usually
  sending to a non-account address before the domain is verified, or a bad key.
- `[submissions] DB insert failed ...` → only relevant once Supabase is wired up;
  the email still goes out regardless.
