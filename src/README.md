# Page sources

Each `.html` file here is the **body** of one page. Line 1 is a `<!--META {...} -->` JSON comment (title, desc, nav, crumb, priority, keywords, optional `faq`, `tools`, `type: "article"`).

Placeholders: `{CRUMBS}` (breadcrumbs), `{B}` (relative base path), `{TODAY}` (build date).

Run `python3 build.py` from the repo root. It:
1. auto-creates a source file here for any published page that doesn't have one yet (extracted from the finished HTML at the repo root);
2. regenerates every page with the shared header, top interest banner, nav, footer, schema, sitemap and search index.

The finished HTML for every page is already committed at the repo root, so the site works without running the build.

To add a page: create `src/pages/my-page.html` with a META line, run the build, commit, and push to the branch GitHub Pages serves.
