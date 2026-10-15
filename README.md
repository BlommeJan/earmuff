# Quiet Hours

Lo-fi, rain and real ambient sounds for studying. A static site: upload this folder to any web host and it works. No build step, no server code, no database.

## 1. Set your domain (once)

Search engines and share cards need full URLs, so every page uses the placeholder `https://quiet-hours.example`. Swap it for your real address:

```sh
./set-domain.sh https://your-domain.com
```

This updates the pages, `sitemap.xml`, `robots.txt` and both `llms` files. Run it from inside this folder.

## 2. Upload

Upload the contents of this folder to the root of your site. It also works from a subfolder, except that the 404 page expects to live at the root.

- **Apache:** `.htaccess` is included (caching, compression, file types, 404 page).
- **Netlify / Cloudflare Pages:** `_headers` is included. Drag the folder in.
- **Nginx:** see the snippet below.

```nginx
server {
  server_name your-domain.com;
  root /var/www/quiet-hours;
  index index.html;
  error_page 404 /404.html;
  types { application/manifest+json webmanifest; }
  gzip on; gzip_types text/css application/javascript text/plain image/svg+xml application/manifest+json application/xml;
  location ~* \.(mp3|woff2)$ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location ~* \.(css|js|jpg|png|ico|svg)$ { add_header Cache-Control "public, max-age=2592000"; }
  location = /sw.js { add_header Cache-Control "no-cache"; }
  location / { try_files $uri $uri/ =404; }
}
```

Serve it over HTTPS. Offline mode and "add to home screen" only work on HTTPS (or localhost).

## 3. After it is live

- Submit `https://your-domain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Test a share card with any link preview tool. Every scene page has its own card.

## What is in here

| Path | What it is |
| --- | --- |
| `index.html` | The app and the home page |
| `<scene>/index.html` | 37 scene pages. Each opens straight into its scene with its own sounds, title, description and share card |
| `404.html` | Not-found page (not indexed) |
| `css/`, `js/`, `fonts/` | Styles, the app (minified), and the two typefaces |
| `audio/` | 33 recordings as MP3. Each downloads the first time it is switched on |
| `og/` | Share cards, 1200 x 630 |
| `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icons/` | Browser and app icons |
| `manifest.webmanifest`, `sw.js` | Installable app and offline support |
| `robots.txt`, `sitemap.xml` | For search engines (sitemap includes the share images) |
| `llms.txt`, `llms-full.txt` | For AI assistants, following the llms.txt convention |
| `humans.txt` | Credits |

## Notes

- Links like `/?scene=campfire` also open a specific scene.
- Settings, mixes and tasks are saved in the visitor's browser only.
- To keep AI crawlers out, add `User-agent: GPTBot` and `Disallow: /` blocks to `robots.txt` (repeat per crawler).
- Credits: field recordings from Moodist (Pixabay Content License and CC0) and Blanket (CC0), icons by Font Awesome (CC BY 4.0), fonts Fraunces and Instrument Sans (SIL OFL). Keep the credits in Settings.
