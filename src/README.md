# Page sources

Each `.html` file here is the **body** of one page. Line 1 is a `<!--META {...} -->` JSON comment (title, desc, nav, crumb, priority, keywords, optional `faq`, `tools`, `type: "article"`).

Placeholders: `{CRUMBS}` (breadcrumbs), `{B}` (relative base path), `{TODAY}` (build date).

Run `python3 build.py` from the repo root to regenerate every page at the root (shared header, top interest banner, nav, footer, schema, sitemap, search index), then commit.

The finished HTML for all pages is already committed at the repo root, so the site works without running the build. Sources for the remaining pages follow the same pattern: copy the `<main>` content of any root page into a new file here, add a META line, and build.
