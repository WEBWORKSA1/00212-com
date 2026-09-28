/* 00212.com — core behaviours (no dependencies) */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var BASE = (function () { var sc = document.querySelector('script[src$="config.js"]'); return sc ? sc.getAttribute("src").replace("assets/js/config.js", "") : ""; })();
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Contact routing (never rendered to the page) ---------- */
  function route() {
    var k = (C._k || []).slice().reverse().join("");
    try { return atob(k.split("").reverse().join("")); } catch (e) { return ""; }
  }
  function endpoint() {
    if (C.formEndpoint) return C.formEndpoint;
    if (C.formAlias) return "https://formsubmit.co/ajax/" + C.formAlias;
    return "https://formsubmit.co/ajax/" + route();
  }
  window.__openMail = function (subject) {
    window.location.href = "mailto:" + route() + "?subject=" + encodeURIComponent(subject || "00212.com inquiry");
  };
  $$("[data-mail]").forEach(function (a) {
    a.setAttribute("href", "#contact");
    a.addEventListener("click", function (e) { e.preventDefault(); window.__openMail(a.getAttribute("data-mail")); });
  });

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var saved = store.get("theme");
  if (saved) root.setAttribute("data-theme", saved);
  var tBtn = $("#themeToggle");
  if (tBtn) tBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next); store.set("theme", next);
  });

  /* ---------- Mobile menu ---------- */
  var burger = $("#burger"), menu = $("#menu");
  if (burger && menu) burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", open);
  });

  /* ---------- i18n (EN / 中文 / FR) ---------- */
  var I18N = {
    zh: {
      nav_invest: "投资", nav_trade: "贸易采购", nav_travel: "旅游", nav_tools: "+212 工具", nav_guides: "指南",
      nav_directory: "服务商目录", nav_jobs: "招聘", nav_contests: "大赛", nav_support: "支持我们", nav_match: "免费对接",
      topbar: "如您对本网站 / 域名 / 赞助 / 广告 / 合作感兴趣，请联系",
      topbar_link: "联系我们",
      hero_eyebrow: "中国 ⇄ 摩洛哥 · 一站式门户",
      hero_title: "拨通 00 212，连接摩洛哥的机遇",
      hero_lead: "投资、贸易、旅游与人才——为中国企业与旅行者打造的摩洛哥门户，并提供免费的 +212 号码安全检测工具。",
      cta_match: "免费获取专家对接", cta_check: "检测 +212 号码", cta_donate: "支持我们",
      newsletter: "订阅中摩商机周报", subscribe: "订阅"
    },
    fr: {
      nav_invest: "Investir", nav_trade: "Commerce", nav_travel: "Voyage", nav_tools: "Outils +212", nav_guides: "Guides",
      nav_directory: "Annuaire", nav_jobs: "Emplois", nav_contests: "Concours", nav_support: "Soutenir", nav_match: "Mise en relation",
      topbar: "Intéressé par ce site / ce nom de domaine / sponsoring / publicité / partenariat ?",
      topbar_link: "Contactez-nous",
      hero_eyebrow: "Chine ⇄ Maroc · la passerelle",
      hero_title: "Composez 00 212 : les opportunités du Maroc",
      hero_lead: "Investissement, commerce, tourisme et talents — la passerelle vers le Maroc pour les entreprises et voyageurs chinois, avec un vérificateur gratuit de numéros +212.",
      cta_match: "Être mis en relation (gratuit)", cta_check: "Vérifier un numéro +212", cta_donate: "Nous soutenir",
      newsletter: "Recevez la lettre Chine–Maroc", subscribe: "S'abonner"
    }
  };
  var EN = {};
  $$("[data-i18n]").forEach(function (el) { EN[el.getAttribute("data-i18n")] = el.innerHTML; });
  function applyLang(l) {
    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.innerHTML = (l !== "en" && I18N[l] && I18N[l][key]) ? I18N[l][key] : EN[key];
    });
    root.setAttribute("lang", l === "zh" ? "zh-Hans" : l);
    store.set("lang", l);
  }
  var langSel = $("#lang");
  var lang = store.get("lang") || ((navigator.language || "").indexOf("zh") === 0 ? "zh" : "en");
  if (langSel) { langSel.value = lang; langSel.addEventListener("change", function () { applyLang(langSel.value); }); }
  if (lang !== "en") applyLang(lang);

  /* ---------- Interest link ---------- */
  $$("[data-interest]").forEach(function (a) { a.href = C.interestUrl || "https://web.works/contact"; });

  /* ---------- UTM / source capture ---------- */
  var qs = new URLSearchParams(location.search);
  ["utm_source", "utm_medium", "utm_campaign", "ref"].forEach(function (k) { if (qs.get(k)) store.set(k, qs.get(k)); });
  if (!store.get("landing")) store.set("landing", location.pathname);

  /* ---------- Cookie consent + AdSense + GA4 ---------- */
  var consent = store.get("consent");
  var cookie = $("#cookie");
  function loadThirdParty(personalized) {
    if (C.adsenseClient) {
      var s = document.createElement("script");
      s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsenseClient;
      document.head.appendChild(s);
      window.adsbygoogle = window.adsbygoogle || [];
      if (!personalized) window.adsbygoogle.requestNonPersonalizedAds = 1;
      $$(".ad-slot").forEach(function (slot) {
        var type = slot.getAttribute("data-ad") || "inArticle";
        var ins = document.createElement("ins");
        ins.className = "adsbygoogle"; ins.style.display = "block"; ins.style.width = "100%";
        ins.setAttribute("data-ad-client", C.adsenseClient);
        if (C.adSlots && C.adSlots[type]) ins.setAttribute("data-ad-slot", C.adSlots[type]);
        ins.setAttribute("data-ad-format", "auto"); ins.setAttribute("data-full-width-responsive", "true");
        slot.innerHTML = ""; slot.appendChild(ins);
        try { window.adsbygoogle.push({}); } catch (e) {}
      });
    }
    if (C.ga4 && personalized) {
      var g = document.createElement("script"); g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.ga4; document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", C.ga4, { anonymize_ip: true });
    }
  }
  /* House ads (shown until AdSense is live) */
  var HOUSE = [
    ["Reach China–Morocco decision makers", "Sponsor this space → Advertise with 00212", "advertise.html"],
    ["List your company in the corridor directory", "Featured & Verified listings → Get listed", "directory.html#get-listed"],
    ["Hiring bilingual talent?", "Post a job to the 00212 talent network →", "jobs.html#post"],
    ["Keep this free tool online", "Support 00212 operations →", "support.html"]
  ];
  $$(".ad-slot").forEach(function (slot, i) {
    var h = HOUSE[i % HOUSE.length], base = BASE;
    slot.innerHTML = '<a class="house-ad" href="' + base + h[2] + '"><b>' + h[0] + "</b>" + h[1] + "</a>";
  });
  if (consent === "all") loadThirdParty(true);
  else if (consent === "essential") loadThirdParty(false);
  else if (cookie) cookie.classList.add("show");
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-consent"); store.set("consent", v);
      cookie.classList.remove("show"); loadThirdParty(v === "all");
    });
  });

  /* ---------- YouTube facades ---------- */
  function renderVideos() {
    $$("[data-videos]").forEach(function (wrap) {
      var n = parseInt(wrap.getAttribute("data-videos"), 10) || 4;
      (C.videos || []).slice(0, n).forEach(function (v) {
        var d = document.createElement("div");
        if (v.id) {
          d.className = "video";
          d.style.backgroundImage = "url(https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg)";
          d.innerHTML = '<button class="play" aria-label="Play: ' + v.title + '">▶</button>';
          d.addEventListener("click", function () {
            d.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1" title="' + v.title + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
          });
        } else {
          d.className = "video placeholder";
          d.innerHTML = "<span>▶ " + v.title + '<br><small style="font-weight:500;opacity:.8">New episode coming soon · Subscribe</small></span>';
        }
        var box = document.createElement("div"); box.appendChild(d);
        var t = document.createElement("p"); t.className = "small muted"; t.style.marginTop = "8px"; t.textContent = v.title;
        box.appendChild(t); wrap.appendChild(box);
      });
    });
    $$("[data-yt-channel]").forEach(function (a) { a.href = (C.social && C.social.youtube) || C.youtubeChannel; });
  }
  renderVideos();

  /* ---------- Forms (AJAX, honeypot, UTM, consent) ---------- */
  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $(".form-msg", form);
      if (form.querySelector('[name="_gotcha"]') && form.querySelector('[name="_gotcha"]').value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) {
        if (k === "_gotcha") return;
        data[k] = data[k] ? data[k] + ", " + v : v;
      });
      data._subject = "[00212.com] " + form.getAttribute("data-form") + (data.name ? " — " + data.name : "");
      data._template = "table"; data._captcha = "false";
      data.form = form.getAttribute("data-form");
      data.page = location.href;
      ["utm_source", "utm_medium", "utm_campaign", "ref", "landing"].forEach(function (k) { var v = store.get(k); if (v) data["src_" + k] = v; });
      var btn = form.querySelector('[type="submit"]'); if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
      fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
        .then(function () {
          if (msg) { msg.className = "form-msg ok"; msg.textContent = form.getAttribute("data-ok") || "Thank you! We received your submission and will reply within 1–2 business days."; }
          form.reset(); if (window.gtag) window.gtag("event", "generate_lead", { form: data.form });
          var redirect = form.getAttribute("data-redirect"); if (redirect) setTimeout(function () { location.href = redirect; }, 1200);
        })
        .catch(function () {
          if (msg) { msg.className = "form-msg err"; msg.innerHTML = 'Could not send automatically. <a href="#" id="fallbackMail">Click here to send by e-mail instead</a>.'; }
          var fm = $("#fallbackMail", form);
          if (fm) fm.addEventListener("click", function (ev) {
            ev.preventDefault();
            var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
            location.href = "mailto:" + route() + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
          });
        })
        .finally(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; } });
    });
  });

  /* ---------- Multi-step lead form ---------- */
  $$("[data-multistep]").forEach(function (form) {
    var steps = $$(".step", form), bar = $(".steps-bar i", form), label = $("[data-step-label]", form), i = 0;
    function show(n) {
      steps.forEach(function (s, k) { s.classList.toggle("active", k === n); });
      if (bar) bar.style.width = ((n + 1) / steps.length * 100) + "%";
      if (label) label.textContent = "Step " + (n + 1) + " of " + steps.length;
      i = n;
    }
    $$("[data-next]", form).forEach(function (b) {
      b.addEventListener("click", function () {
        var ok = true;
        $$("input,select,textarea", steps[i]).forEach(function (f) { if (ok && !f.checkValidity()) { f.reportValidity(); ok = false; } });
        if (ok) show(Math.min(i + 1, steps.length - 1));
      });
    });
    $$("[data-prev]", form).forEach(function (b) { b.addEventListener("click", function () { show(Math.max(i - 1, 0)); }); });
    var pre = qs.get("need");
    if (pre) { var r = form.querySelector('input[name="need"][value="' + pre + '"]'); if (r) r.checked = true; }
    show(0);
  });

  /* ---------- Donation buttons ---------- */
  $$("[data-pay]").forEach(function (b) {
    var key = b.getAttribute("data-pay"), url = C.donate && C.donate[key];
    b.addEventListener("click", function (e) {
      if (url) { b.href = url; b.target = "_blank"; b.rel = "noopener"; return; }
      e.preventDefault();
      var f = $("#pledge"); if (f) { f.scrollIntoView({ behavior: "smooth" }); var a = $('[name="amount"]', f); if (a && b.dataset.amount) a.value = b.dataset.amount; }
    });
  });
  $$("[data-amount-pick]").forEach(function (b) {
    b.addEventListener("click", function () { var a = $('#pledge [name="amount"]'); if (a) a.value = b.getAttribute("data-amount-pick"); });
  });
  var prog = $("#goalBar");
  if (prog && C.donate) {
    var pct = Math.min(100, Math.round((C.donate.raised || 0) / (C.donate.goal || 1) * 100));
    prog.style.width = Math.max(pct, 2) + "%";
    var gt = $("#goalText"); if (gt) gt.textContent = "$" + (C.donate.raised || 0).toLocaleString() + " raised of $" + (C.donate.goal || 0).toLocaleString() + " goal (" + pct + "%)";
  }

  /* ---------- Filters (directory / jobs / guides) ---------- */
  $$("[data-filter-group]").forEach(function (bar) {
    var target = $(bar.getAttribute("data-filter-group"));
    $$("button", bar).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", bar).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on");
        var f = b.getAttribute("data-filter");
        $$("[data-cat]", target).forEach(function (card) {
          card.style.display = (f === "all" || card.getAttribute("data-cat").indexOf(f) > -1) ? "" : "none";
        });
      });
    });
  });

  /* ---------- Site search ---------- */
  var sInput = $("#siteSearch"), sOut = $("#searchResults");
  if (sInput && window.SEARCH_INDEX) {
    sInput.addEventListener("input", function () {
      var q = sInput.value.trim().toLowerCase();
      if (q.length < 2) { sOut.style.display = "none"; return; }
      var hits = window.SEARCH_INDEX.filter(function (p) { return (p.t + " " + p.k).toLowerCase().indexOf(q) > -1; }).slice(0, 8);
      var base = BASE;
      sOut.innerHTML = hits.length ? hits.map(function (h) { return '<a href="' + base + h.u + '">' + h.t + "</a>"; }).join("") : '<a href="' + base + 'get-matched.html">No match — ask our team →</a>';
      sOut.style.display = "block";
    });
    document.addEventListener("click", function (e) { if (!sInput.contains(e.target)) sOut.style.display = "none"; });
  }

  /* ---------- Share ---------- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var net = b.getAttribute("data-share"), u = encodeURIComponent(location.href), t = encodeURIComponent(document.title);
      var map = {
        x: "https://twitter.com/intent/tweet?url=" + u + "&text=" + t,
        linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + u,
        whatsapp: "https://wa.me/?text=" + t + "%20" + u,
        weibo: "https://service.weibo.com/share/share.php?url=" + u + "&title=" + t
      };
      if (net === "copy") {
        (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(function () { b.textContent = "Link copied ✓"; }).catch(function () { prompt("Copy this link:", location.href); });
      } else if (navigator.share && net === "native") { navigator.share({ title: document.title, url: location.href }); }
      else if (map[net]) window.open(map[net], "_blank", "noopener,width=640,height=560");
    });
  });

  /* ---------- Exit-intent newsletter ---------- */
  var modal = $("#newsModal");
  if (modal && !store.get("newsSeen")) {
    var fire = function () { if (store.get("newsSeen")) return; modal.classList.add("show"); store.set("newsSeen", "1"); };
    document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 8) fire(); });
    setTimeout(fire, 45000);
  }
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", function () { b.closest(".modal").classList.remove("show"); }); });

  /* ---------- Reveal + counters ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        var c = en.target.querySelector("[data-count]");
        if (c && !c.dataset.done) {
          c.dataset.done = 1; var end = parseFloat(c.getAttribute("data-count")), dec = (c.getAttribute("data-count").split(".")[1] || "").length, t0 = null;
          var pre = c.getAttribute("data-pre") || "", suf = c.getAttribute("data-suf") || "";
          var step = function (ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1200); c.textContent = pre + (end * p).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        }
        io.unobserve(en.target);
      });
    }, { threshold: .15 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
