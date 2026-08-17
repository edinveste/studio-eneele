// Header muda de estilo ao rolar a página
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// Animações de entrada ao rolar (respeita prefers-reduced-motion via CSS)
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// Carrossel de Serviços (Scroll Snap com bolinhas)
const servicePanels = document.querySelectorAll('.tab-panel');
servicePanels.forEach(panel => {
  const grid = panel.querySelector('.service-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.service-card');
  
  if (cards.length > 1) {
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    
    let isClickScrolling = false;
    let clickScrollTimeout;

    const updateDots = () => {
      if (isClickScrolling) return;
      
      const scrollLeft = grid.scrollLeft;
      const maxScroll = grid.scrollWidth - grid.clientWidth;
      const dots = dotsWrap.querySelectorAll('.dot');
      
      let closestIndex = 0;
      let minDiff = Infinity;
      cards.forEach((card, index) => {
        const cardLeft = card.offsetLeft - grid.offsetLeft;
        const diff = Math.abs(cardLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      if (maxScroll > 0 && scrollLeft >= maxScroll - 5) {
        closestIndex = dots.length - 1;
      }
      
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === closestIndex);
      });
    };

    cards.forEach((card, i) => {
      const dot = document.createElement('button');
      dot.className = i === 0 ? 'dot is-active' : 'dot';
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        isClickScrolling = true;
        
        const dots = dotsWrap.querySelectorAll('.dot');
        dots.forEach(d => d.classList.remove('is-active'));
        dot.classList.add('is-active');
        
        const scrollPos = card.offsetLeft - grid.offsetLeft;
        grid.scrollTo({ left: scrollPos, behavior: 'smooth' });
        
        clearTimeout(clickScrollTimeout);
        clickScrollTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, 600);
      });
      dotsWrap.appendChild(dot);
    });
    panel.appendChild(dotsWrap);

    grid.addEventListener('scroll', updateDots, { passive: true });
    setTimeout(updateDots, 100);
  }
});

// Abas de serviços: Sobrancelhas / Cílios / Unhas
const tabButtons = document.querySelectorAll('#servicos .tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabButtons.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');

    tabPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === target);
    });
  });
});

// Antes / Depois: abas de categoria + slider arrastável
const baTabs = document.querySelectorAll('.ba-tab');
const baFrames = document.querySelectorAll('.ba-frame');
const baRange = document.getElementById('baRange');

function updateActiveBaFrame(value) {
  const activeFrame = document.querySelector('.ba-frame:not([hidden])');
  if (!activeFrame) return;
  const before = activeFrame.querySelector('.ba-before');
  const handle = activeFrame.querySelector('.ba-handle');
  before.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  handle.style.left = value + '%';
}

baTabs.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.ba;

    baTabs.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');

    baFrames.forEach((frame) => {
      frame.hidden = frame.dataset.bapanel !== target;
    });

    if (baRange) {
      baRange.value = 50;
      updateActiveBaFrame(50);
    }
  });
});

if (baRange) {
  baRange.addEventListener('input', (e) => updateActiveBaFrame(e.target.value));
  updateActiveBaFrame(50);
}

// FAQ: acordeão
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-q');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    faqItems.forEach((i) => {
      i.classList.remove('is-open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});
