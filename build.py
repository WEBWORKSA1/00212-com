#!/usr/bin/env python3
"""00212.com static site builder.
Pages live in src/pages/**.html with a META comment on line 1.
Run:  python3 build.py   -> writes finished HTML to the repo root (served by GitHub Pages).
No dependencies. Add a page = add a file in src/pages and run the build.
"""
import json, os, re, datetime, html

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src", "pages")
SITE = "https://00212.com"
TODAY = datetime.date.today().isoformat()

NAV = [
    ("invest", "invest.html", "Invest", "nav_invest"),
    ("trade", "trade.html", "Trade", "nav_trade"),
    ("travel", "travel.html", "Travel", "nav_travel"),
    ("tools", "tools.html", "+212 Tools", "nav_tools"),
    ("guides", "guides.html", "Guides", "nav_guides"),
    ("directory", "directory.html", "Directory", "nav_directory"),
    ("jobs", "jobs.html", "Jobs", "nav_jobs"),
    ("contests", "contests.html", "Contests", "nav_contests"),
    ("support", "support.html", "Support", "nav_support"),
]

HEAD = """<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0b1020">
<meta property="og:type" content="{ogtype}">
<meta property="og:site_name" content="00212.com">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{site}/assets/img/logo.svg">
<meta name="twitter:card" content="summary">
<link rel="icon" href="{b}assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{b}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{b}assets/css/style.css">
<script>try{{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
{schema}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar" role="note"><span data-i18n="topbar">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership</span> → <a data-interest href="https://web.works/contact" target="_blank" rel="noopener" data-i18n="topbar_link">Contact us</a></div>
<header class="site-header">
 <div class="container nav">
  <a class="brand" href="{b}index.html" aria-label="00212.com home"><img src="{b}assets/img/logo.svg" alt="" width="36" height="36"><span>00212<small>CHINA ⇄ MOROCCO GATEWAY</small></span></a>
  <ul class="menu" id="menu">{menu}<li><a class="btn btn-primary" style="padding:8px 14px;color:#fff" href="{b}get-matched.html" data-i18n="nav_match">Get Matched</a></li></ul>
  <div class="nav-tools">
   <label class="lang sr-only" for="lang">Language</label>
   <span class="lang"><select id="lang" aria-label="Language"><option value="en">EN</option><option value="zh">中文</option><option value="fr">FR</option></select></span>
   <button class="icon-btn" id="themeToggle" aria-label="Toggle light/dark theme">◐</button>
   <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">☰</button>
  </div>
 </div>
</header>
<main id="main">
"""

CRUMBS = """<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="{b}index.html">Home</a>{mid} › <span>{crumb}</span></nav>"""

FOOT = """</main>
<footer class="site-footer">
 <div class="container">
  <div class="foot-grid">
   <div>
    <a class="brand" href="{b}index.html"><img src="{b}assets/img/logo.svg" alt="" width="36" height="36"><span>00212<small>CHINA ⇄ MOROCCO GATEWAY</small></span></a>
    <p class="muted small" style="margin-top:12px">Independent, reader-supported guides, tools and introductions for business, trade, travel and talent between China and Morocco (+212).</p>
    <form data-form="Newsletter (footer)" class="field" style="display:flex;gap:8px" data-ok="Subscribed! Check your inbox for a welcome note.">
     <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
     <label class="sr-only" for="fnews">E-mail</label>
     <input id="fnews" type="email" name="email" required placeholder="Your e-mail">
     <button class="btn btn-gold" type="submit" data-i18n="subscribe">Subscribe</button>
     <div class="form-msg" role="status"></div>
    </form>
   </div>
   <div><h4>Explore</h4><ul>
    <li><a href="{b}invest.html">Invest in Morocco</a></li><li><a href="{b}trade.html">Trade & sourcing</a></li>
    <li><a href="{b}travel.html">Travel (visa-free)</a></li><li><a href="{b}guides.html">Guides & news</a></li></ul></div>
   <div><h4>Tools</h4><ul>
    <li><a href="{b}tools.html#checker">+212 number checker</a></li><li><a href="{b}tools.html#clocks-tool">China–Morocco clocks</a></li>
    <li><a href="{b}tools.html#fx">CNY ⇄ MAD converter</a></li><li><a href="{b}tools.html#landed">Landed-cost calculator</a></li></ul></div>
   <div><h4>Grow with us</h4><ul>
    <li><a href="{b}get-matched.html">Get matched (free)</a></li><li><a href="{b}directory.html#get-listed">Get listed</a></li>
    <li><a href="{b}advertise.html">Advertise / Sponsor</a></li><li><a href="{b}jobs.html">Jobs & talent</a></li>
    <li><a href="{b}contests.html">Contests & prizes</a></li><li><a href="{b}support.html">Donate / Support</a></li></ul></div>
   <div><h4>Company</h4><ul>
    <li><a href="{b}about.html">About</a></li><li><a href="{b}legal.html#privacy">Privacy</a></li>
    <li><a href="{b}legal.html#terms">Terms</a></li><li><a href="{b}legal.html#trademark">Trademark & copyright</a></li>
    <li><a href="{b}legal.html#disclosure">Ad & affiliate disclosure</a></li>
    <li><a data-interest href="https://web.works/contact" target="_blank" rel="noopener">Buy / partner / sponsor</a></li></ul></div>
  </div>
  <div class="legal-line">
   <p>© <span id="year">2026</span> 00212.com. All rights reserved. “00212” is used here only as a descriptive reference to the international dialing sequence for Morocco (00 + country code 212). 00212.com is an independent publication and is <b>not affiliated with, endorsed by, or acting for</b> any government, telecom operator, stock-exchange-listed company, port authority or investment agency. All third-party names and marks belong to their owners and are used for identification only. Content is general information, not legal, tax, immigration or investment advice. <a href="{b}legal.html#trademark">Full trademark & copyright disclosure</a>.</p>
  </div>
 </div>
</footer>
<div class="float-cta"><a class="btn btn-primary" href="{b}get-matched.html">💬 Free expert match</a></div>
<div class="cookie" id="cookie" role="dialog" aria-label="Cookie consent">
 <p class="small" style="margin-bottom:10px">We use cookies for essential functions, analytics and (once enabled) Google AdSense advertising. Choose “Accept all” for personalised ads, or “Essential only” for non-personalised ads. <a href="{b}legal.html#cookies">Cookie policy</a></p>
 <div class="btn-row"><button class="btn btn-green" data-consent="all">Accept all</button><button class="btn btn-ghost" data-consent="essential">Essential only</button></div>
</div>
<div class="modal" id="newsModal" role="dialog" aria-modal="true" aria-labelledby="nmTitle">
 <div class="card"><button class="close" data-close aria-label="Close">×</button>
  <span class="tag green">Free weekly brief</span>
  <h3 id="nmTitle" data-i18n="newsletter">Get the China–Morocco Opportunity Brief</h3>
  <p class="muted small">New investments, trade leads, travel deals and scam alerts — every Monday. 1-click unsubscribe.</p>
  <form data-form="Newsletter (popup)" data-ok="You're in! Welcome to the brief.">
   <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
   <div class="field"><label for="nmEmail">E-mail</label><input id="nmEmail" type="email" name="email" required></div>
   <div class="field"><label for="nmInt">I'm most interested in</label><select id="nmInt" name="interest"><option>Investment & company setup</option><option>Trade & sourcing</option><option>Travel</option><option>Jobs & talent</option><option>Scam alerts</option></select></div>
   <button class="btn btn-primary btn-block" type="submit">Subscribe free</button>
   <div class="form-msg" role="status"></div>
  </form>
 </div>
</div>
<script src="{b}assets/js/config.js"></script>
<script src="{b}assets/js/search-index.js"></script>
<script src="{b}assets/js/main.js"></script>
{extra}
</body>
</html>
"""

ORG_SCHEMA = {
    "@context": "https://schema.org",
    "@graph": [
        {"@type": "Organization", "@id": SITE + "/#org", "name": "00212.com", "url": SITE,
         "logo": SITE + "/assets/img/logo.svg",
         "description": "Independent China–Morocco gateway: investment, trade, travel, talent and +212 number tools."},
        {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE, "name": "00212.com", "publisher": {"@id": SITE + "/#org"}},
    ],
}


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False) + "</script>"


def build():
    pages, index = [], []
    for dirpath, _, files in os.walk(SRC):
        for f in sorted(files):
            if not f.endswith(".html"):
                continue
            p = os.path.join(dirpath, f)
            raw = open(p, encoding="utf-8").read()
            m = re.match(r"<!--META\s*(\{.*?\})\s*-->\s*", raw, re.S)
            meta = json.loads(m.group(1))
            body = raw[m.end():]
            rel = os.path.relpath(p, SRC).replace(os.sep, "/")
            pages.append((rel, meta, body))
            if meta.get("search", True):
                index.append({"u": rel, "t": meta["title"].split(" | ")[0], "k": meta.get("keywords", "") + " " + meta["desc"]})

    # search index
    with open(os.path.join(ROOT, "assets", "js", "search-index.js"), "w", encoding="utf-8") as fh:
        fh.write("window.SEARCH_INDEX=" + json.dumps(index, ensure_ascii=False) + ";\n")

    urls = []
    for rel, meta, body in pages:
        depth = rel.count("/")
        b = "../" * depth
        url = SITE + "/" + ("" if rel == "index.html" else rel)
        menu = "".join(
            '<li><a href="{b}{h}"{cur} data-i18n="{k}">{t}</a></li>'.format(
                b=b, h=h, t=t, k=k, cur=' aria-current="page"' if meta.get("nav") == key else "")
            for key, h, t, k in NAV)
        schema = []
        if rel == "index.html":
            schema.append(ORG_SCHEMA)
        if meta.get("type") == "article":
            schema.append({"@context": "https://schema.org", "@type": "Article", "headline": meta["title"].split(" | ")[0],
                           "description": meta["desc"], "datePublished": meta.get("date", TODAY), "dateModified": TODAY,
                           "author": {"@type": "Organization", "name": "00212 Editorial Desk"},
                           "publisher": {"@type": "Organization", "name": "00212.com", "logo": {"@type": "ImageObject", "url": SITE + "/assets/img/logo.svg"}},
                           "mainEntityOfPage": url})
        if meta.get("faq"):
            schema.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in meta["faq"]]})
        if rel != "index.html":
            items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"}]
            if depth:
                items.append({"@type": "ListItem", "position": 2, "name": "Guides", "item": SITE + "/guides.html"})
            items.append({"@type": "ListItem", "position": len(items) + 1, "name": meta.get("crumb", meta["title"]), "item": url})
            schema.append({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items})

        mid = ' › <a href="{b}guides.html">Guides</a>'.format(b=b) if depth else ""
        crumbs = CRUMBS.format(b=b, mid=mid, crumb=html.escape(meta.get("crumb", ""))) if rel not in ("index.html", "404.html") else ""
        faq_html = ""
        if meta.get("faq"):
            faq_html = '<section><div class="container"><div class="section-head"><span class="tag">FAQ</span><h2>Frequently asked questions</h2></div>' + "".join(
                "<details><summary>{}</summary><p>{}</p></details>".format(html.escape(q), a) for q, a in meta["faq"]) + "</div></section>"
        extra = '<script src="{b}assets/js/tools.js"></script>'.format(b=b) if meta.get("tools") else ""

        out = HEAD.format(title=html.escape(meta["title"]), desc=html.escape(meta["desc"]), url=url, site=SITE, b=b,
                          ogtype="article" if meta.get("type") == "article" else "website",
                          menu=menu, schema="\n".join(ld(s) for s in schema))
        out += body.replace("{B}", b).replace("{CRUMBS}", crumbs).replace("{TODAY}", TODAY)
        out += faq_html
        out += FOOT.format(b=b, extra=extra)
        dest = os.path.join(ROOT, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as fh:
            fh.write(out)
        if rel != "404.html":
            urls.append((url, meta.get("priority", "0.7")))

    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, pr in urls:
        sm.append("<url><loc>{}</loc><lastmod>{}</lastmod><priority>{}</priority></url>".format(u, TODAY, pr))
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
    print("Built", len(pages), "pages")


if __name__ == "__main__":
    build()
