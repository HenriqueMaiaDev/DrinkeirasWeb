document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. REVEAL ON SCROLL
  ========================================= */
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));

  /* =========================================
     2. FILTROS DA GALERIA
  ========================================= */
  const filtroBtns = document.querySelectorAll(".filtro-btn");
  const galeriaItems = document.querySelectorAll(".galeria-item");

  filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filtroBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      galeriaItems.forEach(item => {
        if (filterValue === "todos" || item.classList.contains(filterValue)) {
          item.classList.remove("hide");
        } else {
          item.classList.add("hide");
        }
      });
    });
  });

  /* =========================================
     3. EFEITO 3D INTERATIVO NOS CARDS (TILT ON MOUSE MOVE)
  ========================================= */
  const tiltCards = document.querySelectorAll(".tilt-effect");

  tiltCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    });
  });

  /* =========================================
     4. FORMULÁRIO -> WHATSAPP
  ========================================= */
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const data = document.getElementById("data").value.trim();
      const detalhes = document.getElementById("detalhes").value.trim();

      const mensagem = 
        `Olá, equipe Drinkeiras! Gostaria de solicitar um orçamento:%0A%0A` +
        `🍸 *Nome:* ${nome}%0A` +
        `📅 *Data do Evento:* ${data}%0A` +
        `🎉 *Detalhes do Evento:* ${encodeURIComponent(detalhes)}`;

      const numero = "5516999999999";
      window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
    });
  }
});

/* Movimento dinâmico dos raios neon conforme o scroll */
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  
  const ray1 = document.querySelector(".ray-1");
  const ray2 = document.querySelector(".ray-2");
  const ray3 = document.querySelector(".ray-3");

  if (ray1 && ray2 && ray3) {
    ray1.style.transform = `rotate(-35deg) translateX(${scrolled * 0.4}px)`;
    ray2.style.transform = `rotate(-35deg) translateX(${-scrolled * 0.5}px)`;
    ray3.style.transform = `rotate(-35deg) translateX(${scrolled * 0.3}px)`;
  }
});

/* Transição Direcional com Cortina Neon + Fade In/Out entre Início, Sobre e Contato */
/* Transição Direcional com Cortina Neon + Fade In/Out */
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.35s ease";
  
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });

  const curtain = document.querySelector(".neon-curtain");
  const navLinks = document.querySelectorAll('a[href*=".html"], .nav-btn, .nav-logo');

  // Mapeamento atualizado da ordem das páginas
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

      if (targetPage && pageOrder[targetPage] && targetPage !== currentPath) {
        e.preventDefault();

        document.body.style.opacity = "0";

        if (curtain) {
          curtain.classList.remove("to-left", "to-right", "active");

          // Avançando no menu (ex: Início -> Contato ou Contato -> Sobre)
          if (pageOrder[targetPage] > pageOrder[currentPath]) {
            curtain.classList.add("to-left");
          } 
          // Voltando no menu (ex: Sobre -> Contato ou Contato -> Início)
          else {
            curtain.classList.add("to-right");
          }

          setTimeout(() => {
            curtain.classList.add("active");
          }, 10);
        }

        setTimeout(() => {
          window.location.href = targetHref;
        }, 360);
      }
    });
  });
});