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