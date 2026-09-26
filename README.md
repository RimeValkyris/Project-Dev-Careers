# Dev Pipeline 2026

The event website for **Dev Pipeline 2026: Beyond the Soaring Caps**, presented by the TWG Committee. It's a single-page site with the seminar details, the program of activities, the keynote speakers, an FAQ, and a download for the e-brochure.

Built with [Astro](https://astro.build). The output is a fully static site (plain HTML, CSS and images), so it can be hosted anywhere.

## Getting started

You need [Node.js](https://nodejs.org) **22.12 or newer**.

```sh
npm install
npm run dev
```

Then open <http://localhost:4321>. The page reloads as you edit files.

| Command           | What it does                                     |
| :---------------- | :----------------------------------------------- |
| `npm install`     | Install dependencies                             |
| `npm run dev`     | Start the local dev server at `localhost:4321`   |
| `npm run build`   | Build the production site into `dist/`           |
| `npm run preview` | Serve the built `dist/` folder to check it       |

> If the page looks half-styled after an edit, stop the dev server and start it again. File changes inside OneDrive folders are sometimes missed.

## Editing the content

Almost everything you'll want to change is plain data at the top of a file. You don't need to touch the HTML.

| What                              | Where                                                                  |
| :-------------------------------- | :--------------------------------------------------------------------- |
| Site name (nav, footer, tab title) | `SITE_TITLE` in [`src/consts.ts`](src/consts.ts)                       |
| Site description (search results, link previews) | `SITE_DESCRIPTION` in [`src/consts.ts`](src/consts.ts) |
| Program of activities             | the `program` list in [`src/pages/index.astro`](src/pages/index.astro) |
| "Why join", pathways, how it works, FAQ | the `features`, `pathways`, `steps` and `faqs` lists in [`src/pages/index.astro`](src/pages/index.astro) |
| Keynote speakers                  | the `speakers` list in [`src/components/KeynoteSpeakers.astro`](src/components/KeynoteSpeakers.astro) |
| Banner image                      | `src/assets/94IMGBG.jpg` (imported at the top of `index.astro`)         |
| Navigation links                  | the `links` list in [`src/components/Header.astro`](src/components/Header.astro) |
| Footer links                      | the `links` list in [`src/components/Footer.astro`](src/components/Footer.astro) |
| Colours, fonts, spacing           | the `:root` variables in [`src/styles/global.css`](src/styles/global.css) |

### Program of activities

Each item in `program` looks like this:

```js
{ start: '09:00', end: '10:00', title: 'Emerging Technologies', details: '…', by: 'Speaker name', kind: 'talk', note: 'Talk · Q&A · Awarding' }
```

- Write times in **24-hour** format (`'13:15'`). The page shows them as `1:15 PM` and works out each session's length.
- `kind: 'break'` makes a full-width band row (Registration, Lunch, Closing). `kind: 'talk'` highlights a main session.
- Leave out `by` and the row shows *To be announced*.
- The start and end times shown in the banner, the seminar card, and the agenda summary are all taken from this list, so you only need to edit it here.

### Keynote speakers

Each speaker has a `name`, `role`, `organization`, `talk`, `bio`, and optionally a `photo` and a `link`. To add a photo, put the image in `src/assets/`, import it at the top of `KeynoteSpeakers.astro`, and set `photo` to it. Images are resized and converted to WebP automatically when the site is built. Without a photo, the card shows the speaker's initials.

### E-brochure

Save the PDF as:

```
public/downloads/dev-pipeline-2026-e-brochure.pdf
```

The download buttons (in the banner and on the seminar card) pick it up at build time and show its size. Until the file exists, they show **"E-brochure coming soon"** and are disabled, so visitors never hit a broken link. To use a different file name, change `BROCHURE_FILE` in [`src/consts.ts`](src/consts.ts).

## Deploying to Cloudflare Pages

1. Push this repository to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick this repository.
3. Use these build settings:

   | Setting                | Value           |
   | :--------------------- | :-------------- |
   | Framework preset       | Astro           |
   | Build command          | `npm run build` |
   | Build output directory | `dist`          |

   The Node.js version (22) comes from the `.node-version` file, so no environment variable is needed.

4. The site goes live at `https://<project-name>.pages.dev`. The project name you choose in step 2 sets the address, and it can't be changed later.
5. `site` in [`astro.config.mjs`](astro.config.mjs) is set to `https://dev-pipeline-2026.pages.dev`. If Cloudflare gives you a different address, update it, then commit and push. The sitemap, `robots.txt`, canonical URL and link-preview image are built from it.
6. After the first deploy, check the security headers at <https://securityheaders.com>.

Leave Cloudflare's **Web Analytics**, **Rocket Loader** and **Email Address Obfuscation** turned off unless you also allow them in the CSP. They inject scripts that the Content Security Policy will block.

Every push to `main` redeploys the site, and other branches get their own preview link. If you add a custom domain later (under the project's **Custom domains** tab), update `site` to match.

The build downloads the Bricolage Grotesque font from Google Fonts and serves it from the site itself, so the build machine needs internet access but visitors never load anything from Google.

## Security

The site is static: no forms, logins, database or user input, so there is very little to attack. On top of that:

- **Content Security Policy.** `security.csp` in [`astro.config.mjs`](astro.config.mjs) adds a CSP `<meta>` tag at build time. Only the site's own files and Astro's own inline scripts and styles (allowed by their SHA-256 hash) can run. Injected scripts, inline event handlers like `onerror=`, and third-party scripts are blocked by the browser.
- **Security headers.** [`public/_headers`](public/_headers) sets `frame-ancestors 'none'` and `X-Frame-Options` (no clickjacking via iframes), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy` and HSTS. Cloudflare Pages and Netlify apply this file automatically.
- **Safe links.** Speaker `link` values are only rendered if they are `http(s)` URLs, and open with `rel="noopener noreferrer"`.

Keep it that way when editing:

- Don't add inline `style="…"` attributes, `onclick=`-style handlers, or `set:html`. Put styles in CSS and scripts in `<script>` blocks.
- Adding an outside service (analytics, embeds, a CDN) means allowing its domain in the CSP directives in `astro.config.mjs`, or it will be blocked.
- The CSP is only applied to the production build, not `npm run dev`. Check changes with `npm run build` and `npm run preview`.
- Run `npm audit` before deploying to check dependencies for known vulnerabilities.

## Project structure

```text
public/
  _headers              security and caching headers (Cloudflare Pages / Netlify)
  downloads/            e-brochure PDF goes here
src/
  assets/               banner and speaker images, local fonts
  components/
    BaseHead.astro      <head> tags, fonts, link-preview metadata
    BrochureButton.astro  e-brochure download button
    Footer.astro
    Header.astro        navigation bar
    KeynoteSpeakers.astro
    TornEdge.astro      torn-paper section edges
  consts.ts             site name, description, brochure file name
  pages/
    index.astro         the whole page and its content lists
    404.astro           shown for unknown URLs
    robots.txt.ts       generates robots.txt with the sitemap link
  styles/
    global.css          site-wide styles and colour variables
astro.config.mjs        site URL, fonts, CSP, integrations
.node-version           Node.js version used by Cloudflare Pages
```

## Credits

- Base styles adapted from [Bear Blog](https://github.com/HermanMartinus/bearblog/) (MIT).
- Fonts: [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) and [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque).
