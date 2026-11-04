# AK Properties website — start here

Your site is ready to preview and publish. It uses plain HTML, CSS and JavaScript: no paid software, build step or domain is required.

## First: put in your real details

1. Open `index.html` in Chrome or Edge. (You can also double-click it in File Explorer.)
2. At the bottom-right, click **Manage site** → **Your details**. Add your phone or WhatsApp number, update your bio, and upload your logo and portrait.
3. Under **Properties**, edit or delete the sample listings and add your real ones. Add an accurate price, furnishing, amenities, description and up to four photos per property.
4. Close the manager and check the page on your phone and computer. The layout adapts to both.

To include the details you entered in the public version, click **Manage site → Download site data for publishing**. This downloads `site-data.json`. Upload that file alongside the website files to your GitHub repository. When you make more edits later, download the updated file and upload it to GitHub again.

The three initial property cards and property images are sample content. Replace them before sharing the site. Your photo and logo fields are optional until you have the files.

## Publish for free with GitHub Pages

This makes a public website at a free `github.io` address. You do not need to buy a domain.

1. Create a free account at [github.com](https://github.com/) if you do not already have one.
2. Create a **public** repository named `ak-properties`.
3. Upload **all files in this folder** into the top level of that repository. Keep `index.html`, both stylesheets, `app.js`, and both PNG image assets together in the same folder. The guide can be uploaded too.
4. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then click **Save**.
5. Wait a minute or two and open the address GitHub Pages shows, usually `https://YOUR-USERNAME.github.io/ak-properties/`.

You can upload changed site files to the repository later to update the published design. Updates to files in GitHub do **not** include changes saved in your browser's manager.

## Important: how the manager saves data

The manager saves listing and profile changes inside the browser on the device where you made them. Click **Download site data for publishing** to export a `site-data.json` file, then upload that file to GitHub for public visitors to see those edits. Repeat this whenever you change listings or profile details. Clearing browser site data can erase local edits. Anyone who visits the published site can open its manager, but their edits stay only in their browser until they download and upload the updated data file.

For secure admin access with listings and photo uploads that update for every visitor, the site needs a backend service with accounts and file storage. A practical free starting point is Supabase (free tier, subject to its current limits), paired with GitHub Pages. That setup requires creating the account, database, storage bucket, and admin sign-in; it is not connected in this starter. Do not enter passwords or private information into this browser-only manager and treat it as a preview tool until shared authentication is configured.

## Contact button

Add your WhatsApp number with country code in **Your details**, e.g. `919876543210`, or add your phone number. The contact buttons then open WhatsApp or start a phone call. With neither set, the fallback email is a placeholder; edit `hello@akproperties.in` in `app.js` to your real email before publishing.

## Files

- `index.html` — page content and editing panels
- `style.css` and `brand.css` — responsive layout, colors, motion, typography and the new branding banner
- `app.js` — sample listings, browser saved edits, photo handling and contact actions
- `ak-properties-banner.png` — your cityscape artwork displayed at the top of the site
- `ak-properties-logo.png` — the matching logo used in the header, footer and browser tab
- `site-data.json` — downloaded from the site manager after you enter your real listings and profile; upload it to GitHub to show those details publicly

The fonts and sample property photos load from Google Fonts and Unsplash, so those external services need to be reachable for those assets. Replace sample photos with your own when ready.
