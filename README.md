# TOM-S-Oil-Russia

Russian-language TOM’S product website. The publishing root contains `index.html`, `style.css`, `app.js`, `products.json`, and every required image in `assets/`. The existing design, Russian content, original logo, 16 products, and 44 packaging variations are preserved.

## Local preview and checks

Requires Node.js 22 or newer.

```sh
npm ci
npm run check
npm start
```

Open `http://127.0.0.1:4173/TOM-S-Oil-Russia/`. The preview intentionally serves the repository subpath to check GitHub Pages asset resolution. Runtime has no package dependencies or build step; the npm packages are development tools for verification only.

Checks cover asset decoding, all 16 product records, category filters, search/reset, dialogs, 44 variant image changes, HYBRID 1 L default, viscosity filtering, dealer switching, and menu state. Browser visual verification remains pending because no browser surface was available in the execution environment. DOM checks do not establish desktop/mobile appearance or browser console behavior.

## GitHub Pages

Publish from the actual default branch, `main`, using the repository root (`/`). `.nojekyll` keeps this plain static site out of Jekyll processing. All runtime assets use relative URLs and work beneath `/TOM-S-Oil-Russia/`. Use the URL returned by GitHub Pages settings; no custom domain is declared in this export.

## Product image provenance

See `verification/original-image-audit.md`, `verification/product-image-manifest.json` and `verification/supplied-assets-manifest.json` for original product URLs, source images, user-supplied files, packaging mapping, and verification limits. Product imagery and logo were supplied or authorized by the project owner. No ownership or reuse license for third parties is granted by this repository.

The visible certificate is explicitly archived (expiry 12 April 2026). The viscosity selector filters the catalogue and does not claim vehicle compatibility. Current pricing and availability are linked to the exact original product pages.
