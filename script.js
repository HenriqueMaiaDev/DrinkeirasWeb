/* =========================================================
   DRINKEIRAS — script.js
   Tudo em JavaScript puro, sem bibliotecas.
========================================================= */

/* Usuário pediu menos animação nas configurações do sistema? */
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/* O aparelho tem mouse? (no celular não tem hover nem cursor) */
const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Aparelho mais fraco? (até 4 núcleos ou até 4 GB de memória)
   Se sim, o site liga o "modo leve": menos bolhas e sem desfoque. */
const aparelhoFraco = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
if (aparelhoFraco) document.documentElement.classList.add("modo-leve");

const WHATSAPP = "5516993892832";
const CORES_NEON = ["#00f3ff", "#ff007f", "#9d00ff", "#ffffff"];
const aleatorio = (min, max) => min + Math.random() * (max - min);

/* ---------------------------------------------------------
   CONFETE NEON (usado no brinde e no Modo Festa)
--------------------------------------------------------- */
function soltarConfete(quantidade = 80) {
  if (reduzirMovimento) return;

  for (let i = 0; i < quantidade; i++) {
    const c = document.createElement("span");
    c.className = "confete";
    c.style.left = `${aleatorio(0, 100)}vw`;
    c.style.background = CORES_NEON[i % CORES_NEON.length];
    c.style.width = `${aleatorio(6, 12)}px`;
    c.style.height = `${aleatorio(10, 18)}px`;
    document.body.appendChild(c);

    // Web Animations API: animação criada direto pelo JS
    const balanco = aleatorio(-120, 120);
    c.animate([
      { transform: "translate(0, -10vh) rotate(0deg)", opacity: 1 },
      { transform: `translate(${balanco}px, 110vh) rotate(${aleatorio(360, 1080)}deg)`, opacity: 0.8 }
    ], {
      duration: aleatorio(2200, 4200),
      delay: aleatorio(0, 400),
      easing: "cubic-bezier(.25,.6,.4,1)",
      fill: "forwards"
    }).onfinish = () => c.remove();
  }
}

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. REVEAL ON SCROLL (com efeito cascata)
  ========================================= */
  // Itens dentro de grades aparecem um depois do outro
  document.querySelectorAll(".galeria-grid, .stats-grid").forEach(grid => {
    grid.querySelectorAll(":scope > .reveal").forEach((item, i) => {
      item.style.setProperty("--delay", `${i * 0.1}s`);
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-visible");
      observer.unobserve(el);
      // Depois de aparecer, tira o atraso (senão o hover também fica atrasado)
      setTimeout(() => el.style.setProperty("--delay", "0s"), 1500);
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));

  /* =========================================
     2. TÍTULOS NEON "LIGANDO" LETRA POR LETRA
     Cada letra vira um <span> com um atraso diferente.
  ========================================= */
  if (!reduzirMovimento) {
    const titulos = document.querySelectorAll(".neon-title");

    titulos.forEach(titulo => {
      const texto = titulo.textContent.trim();
      const palavras = texto.split(/\s+/);
      let indice = 0;

      titulo.setAttribute("aria-label", texto); // leitor de tela lê a frase inteira
      titulo.textContent = "";

      palavras.forEach((palavra, p) => {
        // A palavra fica num span "inquebrável" para não quebrar linha no meio
        const spanPalavra = document.createElement("span");
        spanPalavra.className = "palavra";
        spanPalavra.setAttribute("aria-hidden", "true");

        for (const letra of palavra) {
          const spanLetra = document.createElement("span");
          spanLetra.className = "letra";
          spanLetra.textContent = letra;
          spanLetra.style.setProperty("--i", indice++);
          spanPalavra.appendChild(spanLetra);
        }

        titulo.appendChild(spanPalavra);
        if (p < palavras.length - 1) titulo.appendChild(document.createTextNode(" "));
      });
    });

    const observerTitulo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("acesa");
          observerTitulo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    titulos.forEach(t => observerTitulo.observe(t));
  }

  /* =========================================
     3. EFEITO 3D NOS CARDS (só com mouse)
  ========================================= */
  if (temMouse && !reduzirMovimento) {
    document.querySelectorAll(".tilt-effect").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* =========================================
     4. GALERIA: BOLHAS DENTRO DO "COPO" NO HOVER
     (o líquido subindo é feito só com CSS)
  ========================================= */
  if (!reduzirMovimento) {
    document.querySelectorAll(".galeria-item .drink-card").forEach(card => {
      for (let i = 0; i < 7; i++) {
        const b = document.createElement("span");
        b.className = "card-bolha";
        b.style.left = `${aleatorio(8, 92)}%`;
        b.style.width = b.style.height = `${aleatorio(4, 10)}px`;
        b.style.setProperty("--dur", `${aleatorio(1.4, 2.6)}s`);
        b.style.setProperty("--atraso", `${aleatorio(0, 1.5)}s`);
        card.appendChild(b);
      }
    });
  }

  /* =========================================
     5. HERO: BOLHAS + LUZ QUE SEGUE O MOUSE
  ========================================= */
  const bolhas = document.querySelector(".hero-bubbles");

  if (bolhas && !reduzirMovimento) {
    const quantidade = aparelhoFraco ? 6 : (window.innerWidth < 600 ? 10 : 20);
    const cores = ["var(--neon-cyan)", "var(--neon-pink)", "var(--neon-purple)"];

    for (let i = 0; i < quantidade; i++) {
      const b = document.createElement("span");
      const tamanho = aleatorio(4, 18);
      b.className = "bubble";
      b.style.width = b.style.height = `${tamanho}px`;
      b.style.left = `${aleatorio(0, 100)}%`;
      b.style.setProperty("--dur", `${aleatorio(8, 18)}s`);
      b.style.setProperty("--atraso", `${-aleatorio(0, 15)}s`); // negativo = já começa no meio
      b.style.setProperty("--balanco", `${aleatorio(-40, 40)}px`);
      b.style.setProperty("--cor", cores[i % cores.length]);
      bolhas.appendChild(b);
    }
  }

  const hero = document.querySelector(".hero");
  const spotlight = document.querySelector(".hero-spotlight");

  if (hero && spotlight && temMouse && !reduzirMovimento && !aparelhoFraco) {
    let luzX = 0, luzY = 0, luzAgendada = false;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      luzX = e.clientX - rect.left;
      luzY = e.clientY - rect.top;

      // O mouse dispara muitos eventos por quadro; só redesenha 1x por quadro
      if (luzAgendada) return;
      luzAgendada = true;
      requestAnimationFrame(() => {
        spotlight.style.setProperty("--mx", `${luzX}px`);
        spotlight.style.setProperty("--my", `${luzY}px`);
        luzAgendada = false;
      });
    });
  }

  /* Pausa as animações dos blocos que saíram da tela
     (bolhas e letreiro do topo, bordas girando, faixas de drinks, 404) */
  const blocosAnimados = document.querySelectorAll(".hero, .borda-giratoria, .faixas, .erro-card");

  const observerPausa = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle("fora-da-tela", !entry.isIntersecting);
    });
  }, { rootMargin: "100px" }); // 100px de folga: já volta a animar um pouco antes de aparecer

  blocosAnimados.forEach(b => observerPausa.observe(b));

  /* =========================================
     6. MÁQUINA DE ESCREVER NO SUBTÍTULO DO HERO
  ========================================= */
  const subtitulo = document.querySelector(".subtitulo-hero");

  if (subtitulo && !reduzirMovimento) {
    const frases = [
      "MIXOLOGIA & BARTENDERS DE ALTA PERFORMANCE",
      "DRINKS AUTORAIS PARA CASAMENTOS",
      "BAR COMPLETO PARA FORMATURAS",
      "ALTA COQUETELARIA PARA A SUA FESTA"
    ];
    let frase = 0;
    let letra = 0;
    let apagando = false;

    subtitulo.setAttribute("aria-label", frases[0]);
    subtitulo.classList.add("digitando");
    subtitulo.textContent = "";

    const digitar = () => {
      const atual = frases[frase];
      letra += apagando ? -1 : 1;
      subtitulo.textContent = atual.slice(0, letra);

      let espera = apagando ? 25 : 55;           // apagar é mais rápido que escrever

      if (!apagando && letra === atual.length) {
        apagando = true;
        espera = 2200;                           // pausa com a frase completa
      } else if (apagando && letra === 0) {
        apagando = false;
        frase = (frase + 1) % frases.length;     // próxima frase (volta pro começo no fim)
        espera = 400;
      }
      setTimeout(digitar, espera);
    };

    setTimeout(digitar, 700);
  }

  /* =========================================
     7. CONTADORES ANIMADOS (0 → valor final)
  ========================================= */
  const contadores = document.querySelectorAll(".stat-number");

  const animarContador = (el) => {
    const alvo = Number(el.dataset.target);
    const prefixo = el.dataset.prefix || "";
    const sufixo = el.dataset.suffix || "";
    const duracao = 2000;
    const inicio = performance.now();

    const escrever = (valor) => {
      el.textContent = prefixo + valor.toLocaleString("pt-BR") + sufixo;
    };

    if (reduzirMovimento) return escrever(alvo);

    const passo = (agora) => {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3); // começa rápido e desacelera
      escrever(Math.round(alvo * suavizado));

      if (progresso < 1) {
        requestAnimationFrame(passo);
      } else {
        el.classList.add("concluido");
      }
    };
    requestAnimationFrame(passo);
  };

  const observerContador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContador(entry.target);
        observerContador.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  contadores.forEach(c => observerContador.observe(c));

  /* =========================================
     8. FAQ: abrir uma pergunta fecha as outras
  ========================================= */
  const faqItens = document.querySelectorAll(".faq-item");

  faqItens.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItens.forEach(outro => {
        if (outro !== item) outro.open = false;
      });
    });
  });

  /* =========================================
     9. FORMULÁRIO -> WHATSAPP (com animação de brinde)
  ========================================= */
  const form = document.getElementById("contactForm");

  if (form) {
    const campo = (id) => document.getElementById(id);
    const inputData = campo("data");
    const detalhes = campo("detalhes");
    const contador = campo("contador");
    const preview = campo("previewMensagem");

    // Não deixa escolher datas que já passaram (mínimo: amanhã)
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const pad = (n) => String(n).padStart(2, "0");
    inputData.min = `${amanha.getFullYear()}-${pad(amanha.getMonth() + 1)}-${pad(amanha.getDate())}`;

    // Regras de validação de cada campo
    const regras = {
      nome:       (v) => v.length >= 3 || "Digite seu nome (mínimo 3 letras).",
      tipo:       (v) => v !== "" || "Escolha o tipo de evento.",
      data:       (v) => {
        if (!v) return "Escolha a data do evento.";
        return v >= inputData.min || "Escolha uma data a partir de amanhã.";
      },
      convidados: (v) => {
        const n = Number(v);
        if (!v) return "Informe uma estimativa de convidados.";
        return (n >= 10 && n <= 5000) || "Informe entre 10 e 5000 convidados.";
      },
      cidade:     (v) => v.length >= 2 || "Informe a cidade do evento."
    };

    const validar = (id) => {
      const input = campo(id);
      const wrapper = input.closest(".form-field");
      const erro = wrapper.querySelector(".field-error");
      const resultado = regras[id](input.value.trim());
      const ok = resultado === true;

      wrapper.classList.toggle("invalid", !ok);
      wrapper.classList.toggle("valid", ok);
      erro.textContent = ok ? "" : resultado;
      return ok;
    };

    // Monta a mensagem (usada na prévia E no envio)
    const montarMensagem = () => {
      const valor = (id) => campo(id).value.trim();
      const data = valor("data") ? valor("data").split("-").reverse().join("/") : "";

      const linhas = [
        "Olá, equipe Drinkeiras! Gostaria de solicitar um orçamento:",
        "",
        `🍸 *Nome:* ${valor("nome") || "..."}`,
        `🎉 *Evento:* ${valor("tipo") || "..."}`,
        `📅 *Data:* ${data || "..."}`,
        `👥 *Convidados:* ${valor("convidados") || "..."}`,
        `📍 *Cidade:* ${valor("cidade") || "..."}`
      ];

      if (valor("detalhes")) {
        linhas.push("", `📝 *Detalhes:* ${valor("detalhes")}`);
      }
      return linhas.join("\n");
    };

    // Escapa o texto (segurança) e transforma *negrito* em <strong>, igual ao WhatsApp
    const paraHTML = (texto) => texto
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>");

    let timerPulso;
    const atualizarPreview = () => {
      preview.innerHTML = paraHTML(montarMensagem());
      const agora = new Date();
      preview.dataset.hora = `${pad(agora.getHours())}:${pad(agora.getMinutes())}`;

      preview.classList.add("pulsar");
      clearTimeout(timerPulso);
      timerPulso = setTimeout(() => preview.classList.remove("pulsar"), 150);
    };

    const atualizarContador = () => {
      const total = detalhes.value.length;
      contador.textContent = `${total} / ${detalhes.maxLength}`;
      contador.classList.toggle("quase-cheio", total > detalhes.maxLength * 0.9);
    };

    // Eventos: valida ao sair do campo, limpa o erro ao digitar
    Object.keys(regras).forEach(id => {
      const input = campo(id);
      input.addEventListener("blur", () => { if (input.value) validar(id); });
      input.addEventListener("input", () => {
        if (input.closest(".form-field").classList.contains("invalid")) validar(id);
      });
    });

    form.addEventListener("input", atualizarPreview);
    form.addEventListener("change", atualizarPreview);
    detalhes.addEventListener("input", atualizarContador);
    atualizarPreview();

    // Animação de brinde: duas taças se encontram, faísca, confete
    const mostrarBrinde = () => {
      const brinde = document.createElement("div");
      brinde.className = "brinde";
      brinde.innerHTML = `
        <div class="brinde-tacas">
          <span class="brinde-taca esquerda">🍸</span>
          <span class="brinde-faisca"></span>
          <span class="brinde-taca direita">🍸</span>
        </div>
        <p class="brinde-texto">Saúde! Abrindo o WhatsApp...</p>`;
      document.body.appendChild(brinde);

      setTimeout(() => soltarConfete(70), 550);         // confete no momento do "tim"
      setTimeout(() => brinde.classList.add("saindo"), 1700);
      setTimeout(() => brinde.remove(), 2200);
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Valida tudo; se algo estiver errado, foca no primeiro campo com erro
      const invalidos = Object.keys(regras).filter(id => !validar(id));
      if (invalidos.length) {
        campo(invalidos[0]).focus();
        return;
      }

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(montarMensagem())}`;

      if (reduzirMovimento) {
        window.open(url, "_blank");
        return;
      }

      mostrarBrinde();

      // Abre o WhatsApp logo depois do brinde. Se o navegador bloquear
      // a nova aba, abre na mesma aba.
      setTimeout(() => {
        const aba = window.open(url, "_blank");
        if (!aba) window.location.href = url;
      }, 800);
    });
  }

  /* =========================================
     10. TAÇA QUE ENCHE CONFORME ROLA A PÁGINA
     (também é botão de "voltar ao topo")
  ========================================= */
  const taca = document.createElement("button");
  taca.className = "taca-progresso";
  taca.type = "button";
  taca.setAttribute("aria-label", "Voltar ao topo");
  taca.innerHTML = `
    <svg viewBox="0 0 48 56" aria-hidden="true">
      <defs>
        <clipPath id="taca-clip"><path d="M5 8 H43 L24 31 Z"/></clipPath>
        <linearGradient id="taca-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="#ff007f"/>
          <stop offset="1" stop-color="#00f3ff"/>
        </linearGradient>
      </defs>
      <rect class="taca-liquido" x="0" y="8" width="48" height="23" fill="url(#taca-grad)" clip-path="url(#taca-clip)"/>
      <path d="M5 8 H43 L24 31 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M24 31 V48 M15 49 H33" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <g class="taca-azeitona">
        <path d="M30 2 L22 20" stroke="#fff" stroke-width="1.5"/>
        <circle cx="28" cy="7" r="3.5" fill="#9dff00"/>
      </g>
    </svg>
    <span class="taca-bolhas" aria-hidden="true"><i></i><i></i><i></i></span>`;
  document.body.appendChild(taca);

  taca.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? "auto" : "smooth" });
  });

  const liquido = taca.querySelector(".taca-liquido");

  /* =========================================
     11. FAIXA DE DRINKS: ACELERA QUANDO ROLA
  ========================================= */
  const trilhos = [...document.querySelectorAll(".faixa-trilho")];
  const animacoesFaixa = trilhos.flatMap(t => t.getAnimations());
  let ultimoScroll = window.scrollY;
  let velocidadeFaixa = 1;
  let desacelerando = false;

  // A cada quadro, a velocidade volta devagar para o normal (1x).
  // O loop só roda enquanto a faixa está acelerada (economiza bateria).
  const desacelerar = () => {
    velocidadeFaixa += (1 - velocidadeFaixa) * 0.05;
    if (velocidadeFaixa < 1.01) velocidadeFaixa = 1;
    animacoesFaixa.forEach(a => (a.playbackRate = velocidadeFaixa));

    if (velocidadeFaixa > 1) {
      requestAnimationFrame(desacelerar);
    } else {
      desacelerando = false;
    }
  };

  const acelerarFaixa = (quanto) => {
    if (!animacoesFaixa.length || reduzirMovimento) return;
    velocidadeFaixa = Math.min(velocidadeFaixa + quanto, 6);
    if (!desacelerando) {
      desacelerando = true;
      requestAnimationFrame(desacelerar);
    }
  };

  /* =========================================
     12. EFEITOS DE SCROLL
     (raios neon, taça, menu compacto, seta do hero, faixa)
  ========================================= */
  const ray1 = document.querySelector(".ray-1");
  const ray2 = document.querySelector(".ray-2");
  const ray3 = document.querySelector(".ray-3");
  const nav = document.querySelector(".top-nav");
  const scrollCue = document.querySelector(".scroll-cue");

  let agendado = false;

  const aoRolar = () => {
    const scrolled = window.scrollY;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = alturaTotal > 0 ? Math.min(scrolled / alturaTotal, 1) : 0;

    // Taça: o líquido cresce de baixo pra cima
    liquido.style.transform = `scaleY(${progresso})`;
    taca.classList.toggle("cheia", progresso > 0.98);

    if (nav) nav.classList.toggle("scrolled", scrolled > 40);
    if (scrollCue) scrollCue.classList.toggle("sumir", scrolled > 80);

    // Faixa: quanto mais rápido rola, mais rápido ela anda
    const delta = Math.abs(scrolled - ultimoScroll);
    if (delta > 0) acelerarFaixa(delta * 0.04);
    ultimoScroll = scrolled;

    if (ray1 && ray2 && ray3 && !reduzirMovimento) {
      ray1.style.transform = `rotate(-35deg) translateX(${scrolled * 0.4}px)`;
      ray2.style.transform = `rotate(-35deg) translateX(${-scrolled * 0.5}px)`;
      ray3.style.transform = `rotate(-35deg) translateX(${scrolled * 0.3}px)`;
    }
    agendado = false;
  };

  window.addEventListener("scroll", () => {
    // requestAnimationFrame: atualiza no máximo 1x por quadro da tela
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(aoRolar);
  }, { passive: true });

  aoRolar();

  /* =========================================
     13. RESPINGO NEON AO CLICAR
  ========================================= */
  if (!reduzirMovimento) {
    document.addEventListener("click", (e) => {
      if (e.detail === 0) return; // clique feito pelo teclado (Enter): sem respingo

      for (let i = 0; i < 10; i++) {
        const gota = document.createElement("span");
        gota.className = "respingo";
        gota.style.left = `${e.clientX}px`;
        gota.style.top = `${e.clientY}px`;
        gota.style.background = CORES_NEON[i % 3];
        document.body.appendChild(gota);

        const angulo = aleatorio(0, Math.PI * 2);
        const distancia = aleatorio(25, 70);
        const dx = Math.cos(angulo) * distancia;
        const dy = Math.sin(angulo) * distancia;

        gota.animate([
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.8)`, opacity: 1, offset: 0.6 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 25}px)) scale(0)`, opacity: 0 } // "gravidade"
        ], {
          duration: aleatorio(500, 800),
          easing: "cubic-bezier(.2,.8,.3,1)"
        }).onfinish = () => gota.remove();
      }
    });
  }

  /* =========================================
     14. EASTER EGG: MODO FESTA 🎉
     Clique 5 vezes seguidas na logo do topo
     (ou no nome "Drinkeiras" do rodapé).
  ========================================= */
  const gatilhos = document.querySelectorAll(".logo-img-hero, .footer-brand h3");
  let cliques = 0;
  let timerCliques;
  let festaAtiva = false;

  const ativarModoFesta = () => {
    if (festaAtiva) return;
    festaAtiva = true;

    document.body.classList.add("modo-festa");

    const luzes = document.createElement("div");
    luzes.className = "festa-luzes";
    luzes.setAttribute("aria-hidden", "true");
    document.body.appendChild(luzes);

    const aviso = document.createElement("div");
    aviso.className = "festa-aviso";
    aviso.setAttribute("role", "status");
    aviso.textContent = "🎉 MODO FESTA ATIVADO 🎉";
    document.body.appendChild(aviso);

    soltarConfete(160);
    const confeteExtra = setInterval(() => soltarConfete(40), 1500);

    setTimeout(() => {
      clearInterval(confeteExtra);
      document.body.classList.remove("modo-festa");
      luzes.remove();
      aviso.classList.add("saindo");
      setTimeout(() => aviso.remove(), 500);
      festaAtiva = false;
    }, 7000);
  };

  gatilhos.forEach(g => {
    g.addEventListener("click", () => {
      cliques++;
      clearTimeout(timerCliques);
      timerCliques = setTimeout(() => (cliques = 0), 1500); // precisa ser rápido

      g.classList.remove("cutucada");
      void g.offsetWidth;            // truque para reiniciar a animação CSS
      g.classList.add("cutucada");

      if (cliques >= 5) {
        cliques = 0;
        ativarModoFesta();
      }
    });
  });

  /* =========================================
     15. TRANSIÇÃO ENTRE PÁGINAS (CORTINA NEON + FADE)
  ========================================= */
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.35s ease";

  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });

  const curtain = document.querySelector(".neon-curtain");
  const navLinks = document.querySelectorAll('a[href*=".html"]');

  // Ordem das páginas no menu (define o lado de onde a cortina vem)
  const pageOrder = {
    "index.html": 1,
    "contato.html": 2,
    "sobre.html": 3
  };

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetHref = link.getAttribute("href") || "";
      const targetPage = targetHref.split("#")[0].split("/").pop() || "index.html";
      const currentPath = window.location.pathname.split("/").pop() || "index.html";

      if (!pageOrder[targetPage] || targetPage === currentPath || reduzirMovimento) return;

      e.preventDefault();
      document.body.style.opacity = "0";

      if (curtain) {
        curtain.classList.remove("to-left", "to-right", "active");

        // Avançando no menu (ex: Início -> Contato) ou voltando (ex: Sobre -> Início).
        // Páginas fora do menu (ex: 404) contam como 0, então a cortina sempre "avança".
        const atual = pageOrder[currentPath] || 0;
        curtain.classList.add(pageOrder[targetPage] > atual ? "to-left" : "to-right");

        setTimeout(() => curtain.classList.add("active"), 10);
      }

      // link.href (e não o texto do atributo) já vem como endereço completo,
      // o que funciona inclusive na 404 com <base>
      setTimeout(() => {
        window.location.href = link.href;
      }, 360);
    });
  });
});

/* Quando o usuário aperta "Voltar", o navegador pode restaurar a página
   do cache do jeito que ela estava: invisível e com a cortina fechada.
   Aqui garantimos que ela volte visível. */
window.addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  document.body.style.opacity = "1";
  const curtain = document.querySelector(".neon-curtain");
  if (curtain) curtain.classList.remove("active", "to-left", "to-right");
});
