# GitHub Pages Deployment

The public deployment is built from the repository root into `.pages-dist` and published by the GitHub Actions workflow at `.github/workflows/pages.yml`.

## Build

```powershell
npm.cmd run build:pages
```

The build rewrites root-relative asset paths to `/FOR-ME/...`, adds `.nojekyll`, and removes third-party analytics scripts that are not needed for the standalone static deployment.

## Public URL

```text
https://m1592361997-hash.github.io/FOR-ME/
```

## Source

GitHub Pages should be configured to deploy from:

```text
source: GitHub Actions
```
