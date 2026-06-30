# FOR-ME

Authorized static mirror of `https://www.laxspace.co/`.

The captured site files are kept at the repository root so original absolute paths such as `/_next/...`, `/portfolio/...`, `/font/...`, and `/project01.png` continue to resolve correctly when served locally.

## Run Locally

```powershell
npm.cmd run serve
```

Default URL:

```text
http://localhost:4173
```

No package install is required; the server uses Node.js built-ins only.

## Replace Images

Keep filenames and dimensions as close as possible to the originals. Replace files in place:

- Cover textures: `project01.png` through `project13.png`
- Full portfolio images: `portfolio/*.webp`
- Blur/tiny portfolio images: `portfolio/tiny/*.webp`
- Home/canvas textures: `texture.png`, `planeTex.png`
- Resume preview: `resume.png`
- Logo and UI SVGs: `laxspace-logo.svg`, `pin.svg`, `cutout.svg`, `smile.svg`, `websiteDay.svg`, `websiteMonth.svg`
- Favicon/PWA icons: `fav/*` and root `android-chrome-*.png`

The HTML, CSS, JavaScript chunks, fonts, video, PDF, and route snapshots should be left unchanged if the goal is to preserve the original behavior.

## Notes

- This is a public static/runtime capture, not the private source repository.
- `MIRROR_REPORT.md` and `_mirror-report.json` document what was downloaded and which source URLs returned 404.

