# Sketchly — Vercel (Frontend) + Render (Backend + Worker) Deployment Guide

This is the recommended hybrid setup: Vercel hosts `apps/web` (best-in-class for Next.js, never sleeps), Render hosts `apps/server` and the worker (persistent servers, needed for WebSocket). Total cost: $0/month.

---

## Does Render's slowness affect the backend, not just page loads?

**Yes — this is important to understand clearly.**

Render's free tier puts a service to sleep after 15 minutes with no incoming traffic. This isn't just about the page being slow to *load* — it's the entire Node.js process (Express, Socket.IO) that goes to sleep. That means:

- The **first REST API call** after a sleep period (e.g., fetching boards, logging in) will take 30–50 seconds to respond, because Render has to boot the container from scratch before it can even process the request.
- The **WebSocket connection** will also fail to establish immediately — the socket handshake has to wait for the same cold start.
- Once awake, the server behaves completely normally and fast until it's inactive for another 15 minutes.

So yes — it affects everything the backend does, not just "page load." A user who opens your Vercel frontend after the backend has been asleep will see the dashboard hang on "Loading boards..." for up to a minute, even though the frontend itself (on Vercel) loaded instantly.

**The fix (Section 6 below) solves this completely** by never letting the backend go idle long enough to sleep.

---

## 0. Prerequisites Checklist

- [ ] Code pushed to GitHub
- [ ] Neon `DATABASE_URL` ready
- [ ] Upstash `REDIS_URL` (TCP, `rediss://...`) ready
- [ ] Cloudinary credentials ready
- [ ] `packages/db` schema already pushed to Neon
- [ ] `apps/server/package.json` has `start` and `worker` scripts

---

## Part 1: Deploy `apps/server` to Render

1. **render.com** → sign up with GitHub
2. **New → Web Service** → select your repo
3. Configure:

| Setting | Value |
|---|---|
| Name | `sketchly-server` |
| Root Directory | `apps/server` |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Start Command | `pnpm start` |
| Instance Type | Free |

4. Environment Variables:
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-random-secret
BETTER_AUTH_URL=https://sketchly-server.onrender.com
CLIENT_URL=https://sketchly.vercel.app
PORT=3001
REDIS_URL=rediss://default:...@...upstash.io:6379
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
(`CLIENT_URL` is a placeholder for now — you'll get the real Vercel URL in Part 3, then come back and update it.)

5. **Create Web Service** → wait for deploy → note the URL: `https://sketchly-server.onrender.com`

---

## Part 2: Deploy the BullMQ Worker to Render

1. **New → Web Service** → same repo
2. Configure:

| Setting | Value |
|---|---|
| Name | `sketchly-worker` |
| Root Directory | `apps/server` |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Start Command | `pnpm worker` |
| Instance Type | Free |

3. Environment Variables — copy the exact same ones from Part 1 (`DATABASE_URL`, `REDIS_URL`, `CLOUDINARY_*`)
4. **Create Web Service**

> If `worker.ts` doesn't listen on a port, Render may mark it "unhealthy." Add this near the top of `worker.ts`:
> ```typescript
> import express from "express";
> const healthApp = express();
> healthApp.get("/health", (_req, res) => res.json({ status: "worker alive" }));
> healthApp.listen(process.env.PORT || 3002);
> ```

---

## Part 3: Deploy `apps/web` to Vercel

1. **vercel.com** → sign up with GitHub
2. **Add New Project** → select your repo
3. **Root Directory:** `apps/web` (Vercel auto-detects Next.js)
4. Environment Variables:
```
NEXT_PUBLIC_SERVER_URL=https://sketchly-server.onrender.com
NEXT_PUBLIC_WS_URL=https://sketchly-server.onrender.com
```
5. **Deploy** → note your live URL: `https://sketchly.vercel.app` (or whatever Vercel assigns)

---

## Part 4: Close the URL Loop

Go back to Render → **sketchly-server → Environment**, update:
```
CLIENT_URL=https://sketchly.vercel.app
```
to match your actual Vercel domain. Save — Render redeploys automatically.

---

## Part 5: Test Everything

Visit your Vercel URL and check:

- [ ] Landing page loads
- [ ] Sign up → dashboard
- [ ] Create board → canvas opens
- [ ] Draw → auto-saves
- [ ] Collaborate → share link, socket connects
- [ ] Open link in incognito → login → lands in board directly
- [ ] Chat works, no duplicate messages
- [ ] Export PNG/PDF downloads
- [ ] History → Restore works

If the dashboard hangs on load the *first* time you test, that's the Render cold-start — expected until Part 6 is done.

---

## Part 6: Fix Render's Sleep Issue — cron-job.org

This is the step that solves the slowness described at the top of this guide.

1. **cron-job.org** → free signup
2. **Create cronjob** three times, one per Render service:

**Job 1 — Server**
- URL: `https://sketchly-server.onrender.com/health`
- Schedule: every 10 minutes

**Job 2 — Worker**
- URL: `https://sketchly-worker.onrender.com/health`
- Schedule: every 10 minutes

3. Save both. (Vercel doesn't need a keep-alive — it never sleeps on any tier.)

From now on, cron-job.org pings both Render services every 10 minutes — under Render's 15-minute sleep threshold — so neither service will ever go idle long enough to sleep. Both the page loads and every API/WebSocket call will now be consistently fast.

---

## Part 7: Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| `Failed to fetch` on dashboard | `NEXT_PUBLIC_SERVER_URL` wrong, or Vercel not redeployed after setting it | Recheck Part 3, redeploy on Vercel |
| CORS error in console | `CLIENT_URL` on Render doesn't match Vercel's real domain | Recheck Part 4 |
| WebSocket won't connect | `NEXT_PUBLIC_WS_URL` wrong | Same as server URL |
| Still slow occasionally, days later | A cron job got paused/deleted | Recheck both jobs are active in cron-job.org dashboard |
| `DATABASE_URL is not configured` | Missing on that specific service | Each Render service needs its own copy |
| Worker shows "unhealthy" | No port listener | Add the health route from Part 2 |

---

## Final Architecture

```
Vercel (apps/web)                    Render (apps/server)
https://sketchly.vercel.app  ──────► https://sketchly-server.onrender.com
        │                                      │
   (user shares/opens this URL)                ├── Neon Postgres
                                                ├── Upstash Redis
                                                └── Cloudinary

Render (worker)
https://sketchly-worker.onrender.com  (background jobs, no public traffic)

cron-job.org
   └── pings server + worker every 10 min → both stay permanently awake
```

**Total cost: $0/month.** Vercel never sleeps by design; Render is kept awake by the cron pings.