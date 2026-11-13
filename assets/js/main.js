(function () {
  "use strict";

  // Sons (respeitam o botão "Som" e a preferência salva)
  var sounds = {
    click: new Audio("assets/audio/click.mp3"),
    ok: new Audio("assets/audio/sucesso.mp3"),
    erro: new Audio("assets/audio/erro.mp3"),
    aviso: new Audio("assets/audio/notificacao.wav")
  };
  var soundOn = true;
  try { soundOn = localStorage.getItem("khyros-som") !== "off"; } catch (e) {}

  var soundBtn = document.getElementById("sound");
  function paintSound() {
    soundBtn.textContent = soundOn ? "Som ligado" : "Som desligado";
    soundBtn.setAttribute("aria-pressed", String(soundOn));
  }
  function play(name) {
    if (!soundOn || !sounds[name]) return;
    try { sounds[name].currentTime = 0; var p = sounds[name].play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  paintSound();
  soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    try { localStorage.setItem("khyros-som", soundOn ? "on" : "off"); } catch (e) {}
    paintSound();
    play("click");
  });

  document.querySelectorAll(".btn:not([data-go]), .social a").forEach(function (el) {
    el.addEventListener("click", function () { if (el.id !== "copy") play("click"); });
  });


  // Abas (sem rolagem de página). Usa só #nome no endereço.
  var names = ["home", "sobre", "video", "social", "regras"];
  var tabEls = names.map(function (n) { return document.getElementById("t-" + n); });
  function show(name, silent) {
    if (names.indexOf(name) < 0) name = "home";
    names.forEach(function (n, i) {
      var on = n === name;
      tabEls[i].setAttribute("aria-selected", String(on));
      tabEls[i].tabIndex = on ? 0 : -1;
      document.getElementById("p-" + n).hidden = !on;
    });
    document.getElementById("main").scrollTop = 0;
    if (name !== "video") document.querySelectorAll("video").forEach(function (v) { v.pause(); });
    if (!silent) play("click");
  }
  function go(name) { if (location.hash !== "#" + name) location.hash = name; else show(name); }
  tabEls.forEach(function (t, i) {
    t.addEventListener("click", function () { go(names[i]); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var j = (i + d + names.length) % names.length;
      tabEls[j].focus(); go(names[j]);
    });
  });
  document.querySelectorAll("[data-go]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); go(a.getAttribute("data-go")); });
  });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });
  show(location.hash.slice(1), true);

  // Copiar convite do Discord
  var copyBtn = document.getElementById("copy");
  var status = document.getElementById("status");
  copyBtn.addEventListener("click", function () {
    var link = copyBtn.getAttribute("data-link");
    function done() { status.textContent = "Convite copiado."; play("ok"); }
    function fail() { status.textContent = "Não deu para copiar. Use: " + link; play("erro"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(done, fail);
    } else { fail(); }
    setTimeout(function () { status.textContent = ""; }, 4000);
  });

  // Easter egg: clique 5 vezes na logo
  var clicks = 0, timer;
  document.getElementById("logo").addEventListener("click", function () {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(function () { clicks = 0; }, 1500);
    if (clicks >= 5) { clicks = 0; spawnFace(); }
  });
  function spawnFace() {
    play("aviso");
    var face = document.createElement("div");
    face.className = "hiding-face";
    face.textContent = "\uD83E\uDD78";
    face.setAttribute("aria-hidden", "true");
    face.style.left = "-15vw";
    face.style.top = (Math.random() * 60 + 10) + "vh";
    document.body.appendChild(face);
    setTimeout(function () {
      face.style.left = "110vw";
      face.style.top = (Math.random() * 60 + 10) + "vh";
    }, 50);
    setTimeout(function () { face.remove(); }, 4500);
  }
})();
