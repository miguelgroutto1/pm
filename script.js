const typingElement = document.querySelector('.typing');
const words = [
    'Desenvolvedor Full-Stack',
    'Criador de Interfaces',
    'Entusiasta de Tecnologia'
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingActive = true;
let typingTimeout = null;

function type() {
    if (!typingElement || !typingActive) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
    }

    typingTimeout = setTimeout(type, typeSpeed);
}

function initTypingControl() {
    const hero = document.getElementById('home');
    if (!hero || !typingElement) return;

    const observer = new IntersectionObserver(([entry]) => {
        typingActive = entry.isIntersecting;
        if (typingActive) {
            type();
        } else if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
    }, { threshold: 0.15 });

    observer.observe(hero);
}

function initParticles() {
  if (typeof particlesJS === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  particlesJS('particles-js', {
    particles: {
      number: { value: 28, density: { enable: true, value_area: 1000 } },
      color: { value: '#2563eb' },
      shape: { type: 'circle' },
      opacity: { value: 0.2, random: false },
      size: { value: 2, random: false },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: 'none',
        random: true,
        out_mode: 'out'
      }
    },
    interactivity: {
      detect_on: 'window',
      events: {
        onhover: { enable: false },
        onclick: { enable: false },
        resize: true
      }
    },
    retina_detect: false
  });
}

let scrollTicking = false;
let headerScrolled = false;

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  let activeId = '';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) {
      activeId = section.id;
    }
  });

  if (!activeId && window.scrollY < 100) {
    activeId = 'home';
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${activeId}`);
  });
}

function onScroll() {
  if (scrollTicking) return;

  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScrollProgress();
    handleHeader();
    initActiveNav();
    scrollTicking = false;
  });
}

const EMAILJS_PUBLIC_KEY = 'NvTIuiL9BdWP8DZHS';
const EMAILJS_SERVICE_ID = 'service_h360v5e';
const EMAILJS_TEMPLATE_ID = 'template_3yjo16l';

let progressBar = null;

function updateScrollProgress() {
  const scroll = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? scroll / height : 0;
  progressBar.style.transform = `scaleX(${progress})`;
}

function handleHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const shouldScroll = window.scrollY > 50;
  if (shouldScroll === headerScrolled) return;

  headerScrolled = shouldScroll;
  header.classList.toggle('scrolled', shouldScroll);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      closeMobileNav();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function closeMobileNav() {
  const navList = document.getElementById('primary-navigation');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  if (!navList || !mobileToggle) return;

  navList.classList.remove('active');
  mobileToggle.setAttribute('aria-expanded', 'false');

  const icon = mobileToggle.querySelector('i');
  if (icon) {
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
}

function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navList) return;

  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
    navList.classList.toggle('active');

    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', (e) => {
    if (
      navList.classList.contains('active') &&
      !navList.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  }

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';

    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  });

  prefersDarkScheme.addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const themeIcon = themeToggle.querySelector('i');
  if (themeIcon) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(message, type) {
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  requestAnimationFrame(() => messageDiv.classList.add('show'));

  setTimeout(() => {
    messageDiv.classList.remove('show');
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

function initFormHandling() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  const inputs = form.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      input.parentElement.classList.toggle('filled', Boolean(input.value.trim()));
    });
  });

  async function handleSubmit() {
    const originalText = submitBtn.innerHTML;
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !subject || !message) {
      showFormMessage('Por favor, preencha todos os campos.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage('Por favor, insira um email válido.', 'error');
      return;
    }

    const emailInput = form.querySelector('[name="email"]');
    if (emailInput) {
      emailInput.value = emailInput.value.trim().toLowerCase();
    }

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    try {
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS não carregou. Verifique sua conexão.');
      }

      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, {
        publicKey: EMAILJS_PUBLIC_KEY,
      });

      showFormMessage('Mensagem enviada com sucesso!', 'success');
      form.reset();
      inputs.forEach(input => input.parentElement.classList.remove('filled'));
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      let errorMessage = 'Erro ao enviar mensagem. Tente novamente.';

      if (error?.status === 412) {
        errorMessage = 'Serviço de e-mail desconectado. Reconecte o Gmail no painel do EmailJS.';
      } else if (error?.text) {
        errorMessage = error.text;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showFormMessage(errorMessage, 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  submitBtn.addEventListener('click', handleSubmit);

  form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      handleSubmit();
    }
  });
}

function initApp() {
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
  }

  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  initParticles();
  initMobileMenu();
  initFormHandling();
  initSmoothScroll();
  initThemeToggle();
  initTypingControl();
}

window.addEventListener('scroll', onScroll, { passive: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
    onScroll();
  });
} else {
  initApp();
  onScroll();
}
