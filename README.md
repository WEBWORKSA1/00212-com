# 00212.com — China ⇄ Morocco Gateway

Static, dependency-free website (HTML/CSS/vanilla JS) hosted on **GitHub Pages (free plan)**.

**Positioning:** "Dial into Morocco." 00 212 is the sequence for dialling Morocco from China and most of the world. The +212 tools pull in search traffic; the investment, trade, travel, jobs and lead-generation sections earn the revenue.

## Structure
```
src/pages/**.html     page bodies (edit these), META JSON on line 1
build.py              wraps pages in shared header/footer, writes root HTML, sitemap, search index
assets/css/style.css  design system (dark/light)
assets/js/config.js   ALL settings: AdSense, GA4, YouTube IDs, donation links, form endpoint
assets/js/main.js     forms, i18n, consent, ads, video, filters, search, modals
assets/js/tools.js    +212 checker, clocks, currency, landed cost, trip budget
docs/                 research + phase-wise build prompt
```

## Edit & rebuild
```bash
python3 build.py      # regenerates *.html at the repo root
```

## Go-live checklist
1. **Forms:** the first form submission triggers a FormSubmit activation e-mail to the owner's inbox. Click *Activate*, then paste the alias string FormSubmit provides into `formAlias` in `config.js`.
2. **AdSense:** once approved, set `adsenseClient` and `adSlots` in `config.js`, and uncomment your line in `ads.txt`.
3. **YouTube:** add video IDs to `videos` in `config.js`.
4. **Donations:** paste PayPal, Stripe, Buy Me a Coffee and Ko-fi links into `donate` in `config.js`.
5. **Custom domain:** add a `CNAME` file containing `00212.com`. At your registrar, create A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `www` CNAME pointing to `webworksa1.github.io`. Then enable *Enforce HTTPS* under Settings → Pages.

## Legal
"00212" is used descriptively (international prefix 00 + Morocco country code 212). This project is not affiliated with any government, telecom operator or listed company. See `legal.html#trademark`.

Interested in this website, the domain, sponsorship, advertising or partnership? → https://web.works/contact
