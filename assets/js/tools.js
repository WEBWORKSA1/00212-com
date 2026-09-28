/* 00212.com — interactive tools: +212 number analyzer, world clocks, currency, landed cost, trip budget */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ================= +212 NUMBER ANALYZER ================= */
  var REGIONS = {
    "522": "Casablanca", "523": "Mohammedia / El Jadida / Settat / Béni Mellal area",
    "524": "Marrakech / Safi / Essaouira area",
    "528": "Agadir / Souss-Massa / southern provinces", "535": "Fès / Meknès / Taza area",
    "536": "Oujda / Nador / Oriental region", "537": "Rabat / Salé / Kénitra area", "539": "Tangier / Tétouan / Al Hoceïma area"
  };
  function analyze(raw) {
    var s = String(raw || "").replace(/[^\d+]/g, "");
    var foreign = false;
    if (s.indexOf("+212") === 0) s = s.slice(4);
    else if (s.indexOf("00212") === 0) s = s.slice(5);
    else if (s.indexOf("011212") === 0) s = s.slice(6);
    else if (s.indexOf("212") === 0 && s.length >= 12) s = s.slice(3);
    else if (s.indexOf("0") === 0 && s.length === 10) s = s.slice(1);
    else if (s.indexOf("+") === 0 || s.indexOf("00") === 0) foreign = true;
    s = s.replace(/^0/, "");
    return { nsn: s, foreign: foreign };
  }
  function fmt(n) { return n.slice(0, 1) + " " + n.slice(1, 3) + " " + n.slice(3, 5) + " " + n.slice(5, 7) + " " + n.slice(7, 9); }

  var form = $("#numForm");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var out = $("#numResult"), val = $("#numInput").value, ctx = $("#numCtx").value;
    var a = analyze(val), n = a.nsn;
    if (a.foreign) { out.innerHTML = '<p><span class="risk mid">Not a Moroccan number</span> This number does not start with +212 / 00212. Morocco numbers begin with <b class="mono">+212</b>.</p>'; return; }
    if (!/^\d{9}$/.test(n)) { out.innerHTML = '<p><span class="risk mid">Check the format</span> A Moroccan number has 9 digits after +212 (e.g. <span class="mono">+212 6 12 34 56 78</span>). You entered ' + n.length + " digit(s) after the country code.</p>"; return; }
    var first = n.charAt(0), type, region = "—", risk = "low", riskTxt = "Low", advice = [];
    if (first === "6" || first === "7") { type = "Mobile (GSM)"; region = "Mobile numbers are not tied to a city"; }
    else if (first === "5") { type = "Fixed line (landline) or fixed VoIP"; region = REGIONS[n.slice(0, 3)] || "Moroccan fixed network (region not mapped)"; }
    else if (first === "8") { type = "Non-geographic / special service (e.g. freephone, shared-cost, value-added)"; region = "Service number"; }
    else { type = "Unassigned or unusual range"; risk = "high"; riskTxt = "High"; advice.push("This range is not a standard Moroccan subscriber range — treat as suspicious."); }

    if (ctx === "missed") {
      risk = risk === "high" ? "high" : "high"; riskTxt = "High (pattern)";
      advice.push("A one-ring missed call from an unknown international number is the classic <b>wangiri</b> pattern: the goal is to make you call back and pay international or premium charges.");
      advice.push("Do <b>not</b> call back. If it matters, the caller will leave a message or write to you.");
    } else if (ctx === "sms" || ctx === "whatsapp") {
      if (risk !== "high") { risk = "mid"; riskTxt = "Medium"; }
      advice.push("Never click links, share codes (OTP/验证码), or send money to an unknown sender. Job-offer, parcel and investment messages are common lures.");
    } else if (ctx === "answered") {
      if (risk !== "high") { risk = "mid"; riskTxt = "Medium"; }
      advice.push("Do not confirm personal data, bank details or verification codes on an unsolicited call.");
    } else if (ctx === "business") {
      advice.push("Verify a business contact via its official website or registry before paying invoices or changing bank details.");
    }
    if (first === "8") advice.push("Special-service numbers can be charged at non-standard rates — check the tariff before calling.");
    advice.push("Block & report via your phone's call log. In mainland China, spam calls/SMS can be reported to 12321 and fraud to the anti-fraud hotline 96110.");

    out.innerHTML =
      '<div class="kv">' +
      "<b>Risk signal</b><span><span class='risk " + risk + "'>" + riskTxt + "</span> <span class='small muted'>(heuristic, not a verdict)</span></span>" +
      "<b>International format</b><span class='mono'>+212 " + fmt(n) + "</span>" +
      "<b>Dial from China / Europe</b><span class='mono'>00 212 " + fmt(n) + "</span>" +
      "<b>Dial from US / Canada</b><span class='mono'>011 212 " + fmt(n) + "</span>" +
      "<b>Dial inside Morocco</b><span class='mono'>0" + fmt(n) + "</span>" +
      "<b>Line type</b><span>" + esc(type) + "</span>" +
      "<b>Area (indicative)</b><span>" + esc(region) + "</span>" +
      "</div><ul class='checklist mt2'>" + advice.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
      "<p class='small muted'>Number portability means a prefix does not prove the operator. This tool never stores numbers you type.</p>" +
      "<p><a class='btn btn-ghost' href='#report'>Report this number</a></p>";
    var rn = document.querySelector('#report [name="number"]'); if (rn) rn.value = "+212 " + fmt(n);
    if (window.gtag) window.gtag("event", "number_check", { ctx: ctx });
  });

  /* prefill from ?n=&ctx= (hero form) */
  (function () {
    var q = new URLSearchParams(location.search), n = q.get("n");
    if (form && n) {
      $("#numInput").value = n; if (q.get("ctx")) $("#numCtx").value = q.get("ctx");
      setTimeout(function () { form.dispatchEvent(new Event("submit", { cancelable: true })); document.getElementById("checker").scrollIntoView(); }, 50);
    }
  })();

  /* ================= WORLD CLOCKS ================= */
  var ZONES = [
    ["Casablanca", "Africa/Casablanca"], ["Beijing / Shanghai", "Asia/Shanghai"],
    ["Hong Kong", "Asia/Hong_Kong"], ["Paris", "Europe/Paris"], ["New York", "America/New_York"], ["Montréal", "America/Toronto"]
  ];
  var clocks = $("#clocks");
  function tick() {
    if (!clocks) return;
    var now = new Date();
    clocks.innerHTML = ZONES.map(function (z) {
      var t = now.toLocaleTimeString("en-GB", { timeZone: z[1], hour: "2-digit", minute: "2-digit" });
      var d = now.toLocaleDateString("en-GB", { timeZone: z[1], weekday: "short", day: "numeric", month: "short" });
      var h = parseInt(now.toLocaleString("en-GB", { timeZone: z[1], hour: "2-digit", hour12: false }), 10);
      var open = h >= 9 && h < 18;
      return '<div class="stat"><span>' + z[0] + '</span><b class="clock">' + t + "</b><small>" + d + " · " + (open ? "🟢 business hours" : "⚪ outside 9–18h") + "</small></div>";
    }).join("");
    var diff = $("#tzDiff");
    if (diff) {
      var ma = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Casablanca" }));
      var cn = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
      var hrs = Math.round((cn - ma) / 36e5);
      diff.textContent = "China is currently " + hrs + " hour(s) ahead of Morocco. Best overlap for calls: 09:00–11:00 in Morocco = " + (9 + hrs) + ":00–" + (11 + hrs) + ":00 in China.";
    }
  }
  if (clocks) { tick(); setInterval(tick, 30000); }

  /* ================= CURRENCY ================= */
  var FALLBACK = { USD: 1, CNY: 7.12, MAD: 9.2, EUR: 0.86, HKD: 7.8, CAD: 1.38 };
  var rates = FALLBACK, live = false;
  var cf = $("#fxForm");
  function convert() {
    if (!cf) return;
    var amt = parseFloat($("#fxAmt").value) || 0, from = $("#fxFrom").value, to = $("#fxTo").value;
    var r = rates[to] / rates[from], res = amt * r;
    $("#fxResult").innerHTML = "<p class='price mb0'>" + res.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " " + to + "</p>" +
      "<p class='small muted mb0'>1 " + from + " = " + r.toFixed(4) + " " + to + " · " + (live ? "live mid-market rate (open.er-api.com)" : "indicative offline rate — refresh later for live data") + "</p>";
    var tbl = $("#fxTable");
    if (tbl) tbl.innerHTML = "<tr><th>" + from + "</th><th>" + to + "</th></tr>" + [100, 500, 1000, 5000, 10000, 50000].map(function (v) { return "<tr><td>" + v.toLocaleString() + "</td><td>" + (v * r).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "</td></tr>"; }).join("");
  }
  if (cf) {
    cf.addEventListener("input", convert);
    cf.addEventListener("submit", function (e) { e.preventDefault(); convert(); });
    var sw = $("#fxSwap"); if (sw) sw.addEventListener("click", function () { var a = $("#fxFrom").value; $("#fxFrom").value = $("#fxTo").value; $("#fxTo").value = a; convert(); });
    convert();
    fetch("https://open.er-api.com/v6/latest/USD").then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.rates) { rates = {}; Object.keys(FALLBACK).forEach(function (k) { rates[k] = j.rates[k] || FALLBACK[k]; }); live = true; convert(); }
    }).catch(function () {});
  }

  /* ================= LANDED COST (China → Morocco) ================= */
  var lc = $("#landedForm");
  if (lc) lc.addEventListener("input", calcLanded);
  if (lc) lc.addEventListener("submit", function (e) { e.preventDefault(); calcLanded(); });
  function num(id) { return parseFloat(($(id) || {}).value) || 0; }
  function calcLanded() {
    var fob = num("#lcFob"), fr = num("#lcFreight"), insP = num("#lcIns"), duty = num("#lcDuty"), vat = num("#lcVat"), fees = num("#lcFees");
    var ins = (fob + fr) * insP / 100, cif = fob + fr + ins, d = cif * duty / 100, parafiscal = cif * 0.0025, v = (cif + d + parafiscal) * vat / 100;
    var total = cif + d + parafiscal + v + fees;
    $("#lcResult").innerHTML = '<div class="kv">' +
      "<b>CIF value</b><span>" + cif.toFixed(2) + "</span>" +
      "<b>Import duty (" + duty + "%)</b><span>" + d.toFixed(2) + "</span>" +
      "<b>Parafiscal tax (0.25%)</b><span>" + parafiscal.toFixed(2) + "</span>" +
      "<b>Import VAT (" + vat + "%)</b><span>" + v.toFixed(2) + "</span>" +
      "<b>Clearance & local fees</b><span>" + fees.toFixed(2) + "</span>" +
      "<b>Estimated landed cost</b><span class='price'>" + total.toFixed(2) + "</span>" +
      "<b>Landed / FOB multiple</b><span>" + (fob ? (total / fob).toFixed(2) + "×" : "—") + "</span></div>" +
      "<p class='small muted mt2'>Estimate only, in the currency you entered. Duty depends on the HS code and origin rules; confirm with a licensed customs broker. <a href='get-matched.html?need=trade'>Get a broker quote →</a></p>";
  }
  if (lc) calcLanded();

  /* ================= TRIP BUDGET ================= */
  var tb = $("#tripForm");
  var DAILY = { budget: 550, mid: 1300, luxury: 3500 }; // MAD per person per day, indicative
  function calcTrip() {
    var days = num("#tripDays"), pax = num("#tripPax"), style = $("#tripStyle").value, flight = num("#tripFlight");
    var mad = DAILY[style] * days * pax, cny = mad / (rates.MAD / rates.CNY);
    $("#tripResult").innerHTML = '<div class="kv"><b>On-the-ground budget</b><span>' + Math.round(mad).toLocaleString() + " MAD ≈ ¥" + Math.round(cny).toLocaleString() + "</span>" +
      "<b>Flights (your input)</b><span>¥" + Math.round(flight * pax).toLocaleString() + "</span>" +
      "<b>Total estimate</b><span class='price'>¥" + Math.round(cny + flight * pax).toLocaleString() + "</span></div>" +
      "<p class='small muted mt2'>Indicative daily spend per person: budget ≈550 MAD, mid-range ≈1,300 MAD, luxury ≈3,500 MAD (lodging, food, local transport, entry fees). <a href='get-matched.html?need=travel'>Get a tailored itinerary →</a></p>";
  }
  if (tb) { tb.addEventListener("input", calcTrip); tb.addEventListener("submit", function (e) { e.preventDefault(); calcTrip(); }); calcTrip(); }
})();
