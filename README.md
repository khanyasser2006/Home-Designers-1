# 🏡 Home Designers-1

A cinematic site for a bespoke luxury residential architecture studio — a 600-frame scroll-scrubbed hero, a curated project and materials showcase, a dedicated client-side security layer, and an admin CMS covering nearly every section of the site, backed by a 30-plus-script Playwright QA suite.

![React](https://img.shields.io/badge/-React%2018-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/-GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)
![Lenis](https://img.shields.io/badge/-Lenis-000000?style=flat-square)
![Playwright](https://img.shields.io/badge/-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

---

## 🧰 Technologies

- React 18
- Vite 6
- JavaScript
- Tailwind CSS
- GSAP (ScrollTrigger) + Lenis
- Web Crypto API (SHA-256 password hashing)
- Playwright (QA script suite)

---

## ✨ Features

- **600-Frame Scroll Hero**: A full image sequence scrubbed against scroll position, with individual frames reused as static imagery for projects and materials elsewhere on the site instead of separate photography.
- **Hash-Based Routing**: A lightweight `#/page` router with browser back/forward support, synced to Lenis and GSAP ScrollTrigger on every page change.
- **Session-Expiring Accounts**: Registered client accounts and the admin account both expire after 24 hours, requiring a fresh sign-in rather than staying logged in indefinitely.
- **Dedicated Security Module**: A `security.js` utility handling password hashing, HTML/script sanitization, URL scheme validation, and a quota-safe `localStorage` wrapper.
- **Content-Security-Policy Meta Tag**: A real CSP restricting script, style, and connection sources, applied via `<meta>` since the site has no server to send it as a header.
- **Extensive Admin CMS**: Editable hero settings, philosophy copy, materials, testimonials, press articles, projects, living spaces, process steps, studios, and inquiries — each persisted to its own storage key.
- **Project & Space Detail Modals**: Full-screen modals for individual projects and living spaces, reachable from multiple sections without a page navigation.
- **Custom Cursor & Scroll-Reveal Hook**: A bespoke cursor treatment and a shared `useScrollReveal` hook reused across every section.
- **Inquiry Rate Limiting**: A 30-second cooldown between contact-form submissions to deter spam.
- **A 30-Plus-Script QA Suite**: Dedicated Playwright scripts covering admin CRUD flows, auth, mobile responsiveness, security headers, SEO, and animation behavior — well beyond a single smoke test.
- **SEO Basics Included**: `sitemap.xml`, `robots.txt`, a web manifest, and a dedicated `SEOHead` component.

---

## 🪜 The Process

I built the hero the same way as the other studio sites in this series — a 600-frame sequence scrubbed against scroll — but this time reused individual frames as the imagery for the Projects and Materials sections too, instead of sourcing separate photography for every piece of content.

Rather than a full routing library, I kept navigation to a small hash-based router synced to the URL, so back/forward and direct links to a specific page both work without adding a dependency the site didn't really need.

Security got its own dedicated module this time: SHA-256 password hashing, HTML and script-injection sanitization on every text input, strict validation on any URL before it's used, and a Content-Security-Policy applied through a meta tag since the site ships with no server to send real headers from.

The part I spent the most time on wasn't a feature at all — it was writing more than thirty small Playwright scripts to verify the site as I built it: that registration actually hashes passwords, that an XSS payload in a name field gets stripped before it's stored, that the admin CRUD flows actually persist, that the site holds up on a mobile viewport. It's slower than clicking through the site by hand, but it catches the kind of regression manual testing quietly misses.

The gap I'm aware of: the security module is genuinely thorough for what it protects against, but the admin password check still happens by hashing the typed input and comparing it in the browser against a hash computed from a hardcoded plaintext string in the same file — so, like the other client-side-only sites in this series, it's a matter of when someone reads the bundle and finds it, not whether the hash itself can be cracked.

---

## 📚 What I Learned

- **Hash-Based Routing Without a Library**: Synced `window.location.hash` to component state with a `hashchange` listener, giving real back/forward and deep-linking support without adding React Router.
- **Session Expiry, Not Just Session Existence**: Stored an explicit `sessionExpiresAt` timestamp alongside the logged-in user, rather than treating "a user object exists in storage" as permanently valid.
- **CSP Without a Server**: Learned that a Content-Security-Policy can be applied via a `<meta>` tag when there's no backend to send it as an HTTP header, though headers like `X-Frame-Options` can't be replicated the same way.
- **Testing the Security Claims, Not Just the Features**: Wrote scripts that specifically check for the absence of plaintext passwords and the presence of sanitized input, rather than only testing that buttons click and pages load.
- **Reusing One Asset Across Many Contexts**: Pulled individual hero frames into the Projects and Materials data instead of treating the hero sequence and the site's other imagery as separate concerns.
- **A Single Shared Salt Is a Real Trade-off**: Used one application-wide salt constant for password hashing rather than a per-user random salt — simpler to implement, but weaker than per-user salting if the design ever needs to resist a serious offline attack.
- **Granular Storage Keys Over One Big Blob**: Persisted each editable content type — hero, materials, press, projects — under its own `localStorage` key instead of one large combined object, so a single admin edit doesn't rewrite unrelated content.

---

## 🔧 How Can It Be Improved?

- The admin login still checks a password typed into the browser against a hash of a hardcoded plaintext string in the same file — genuinely securing this means moving the check to a server, since anyone who reads the bundle can find what it's comparing against.
- Move from a single static application-wide salt to a random salt generated per user, since a shared salt lets an attacker who obtains the hash list attack every account with one precomputed table instead of cracking each separately.
- Fix the `process-video` script in `package.json` — it points to an absolute path on one specific machine (`C:\Users\...`) that won't run for anyone else, or even the same person on a different computer; the video-processing logic should live inside the repo itself.
- Move CMS-edited content from `localStorage` into a real backend, so an admin's edits are visible to actual site visitors, not just the browser that made them.
- Consolidate the 30-plus ad-hoc scripts in `scripts/` into an organized test suite — a proper test runner, grouped by what each one covers — now that there are enough of them to benefit from real structure.
- Consider `frame-ancestors` or `X-Frame-Options` at the hosting layer, since a `<meta>` tag alone can't fully replicate what a real HTTP header provides.

---

## 🚀 Running the Project

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/home-designers.git
cd home-designers
```

---

### Step 2 — Install Dependencies

**Prerequisites:** Node.js 18+

```bash
npm install
```

---

### Step 3 — Run the Development Server

```bash
npm run dev
```

---

### Step 4 — Open the Application

Open the address shown in your terminal (usually):

```
http://localhost:5173
```

---

## 🎥 Video

*Add a screen recording of the hero scroll here — `scripts/seo_and_animations_verified.png` is already sitting in the repo and worth including too.*

---
