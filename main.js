/* ==========================================================================
   ASHLIN R RINTHIKA — FUTURISTIC INTERACTIVE PORTFOLIO ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. PRELOADER DISMISSAL
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
    }, 800);
  });
  // Fallback timeout in case load event fires early
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 2000);

  // 2. AMBIENT CANVAS PARTICLES
  initCanvasBackground();

  // 3. CUSTOM GLOW CURSOR
  initCustomCursor();

  // 4. HEADER STICKY & NAV HIGHLIGHT
  initNavigation();

  // 5. TYPING TEXT ROTATOR
  initTypeWriter();

  // 6. MAGNETIC BUTTONS & RIPPLE
  initMicroInteractions();

  // 7. 3D TILT CARDS
  init3DTilt();

  // 8. SCROLL REVEAL & COUNTERS
  initScrollObservers();

  // 9. PROJECT DETAIL MODAL SYSTEM
  initProjectModals();

  // 10. RESUME MODAL & PRINT
  initResumeModal();

  // 11. CONTACT FORM VALIDATION & SUCCESS MODAL
  initContactForm();

});

/* --------------------------------------------------------------------------
   2. AMBIENT PARTICLES BACKGROUND CANVAS
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 45;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Connect nearby particles
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. CUSTOM GLOW CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states over clickable elements
  const interactables = document.querySelectorAll('a, button, .tilt-card, input, textarea');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   4. NAVIGATION & STICKY HEADER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   5. TYPEWRITER TEXT ROTATOR
   -------------------------------------------------------------------------- */
function initTypeWriter() {
  const elements = document.querySelectorAll('.txt-rotate');
  elements.forEach(el => {
    const toRotate = JSON.parse(el.getAttribute('data-rotate'));
    const period = parseInt(el.getAttribute('data-period'), 10) || 2000;
    if (toRotate) {
      new TxtRotate(el, toRotate, period);
    }
  });
}

class TxtRotate {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = period;
    this.txt = '';
    this.isDeleting = false;
    this.tick();
  }

  tick() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = `<span class="gradient-text">${this.txt}</span>`;

    let delta = 150 - Math.random() * 80;

    if (this.isDeleting) delta /= 2;

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => this.tick(), delta);
  }
}

/* --------------------------------------------------------------------------
   6. MAGNETIC BUTTONS & RIPPLE EFFECT
   -------------------------------------------------------------------------- */
function initMicroInteractions() {
  // Magnetic Buttons
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // Ripple Effect
  const rippleBtns = document.querySelectorAll('.ripple-btn');
  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');

      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      const existing = this.querySelector('.ripple-circle');
      if (existing) existing.remove();

      this.appendChild(circle);
    });
  });
}

/* --------------------------------------------------------------------------
   7. 3D PERSPECTIVE CARD TILT
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* --------------------------------------------------------------------------
   8. SCROLL OBSERVERS (REVEAL, NAV, COUNTERS, SKILLS)
   -------------------------------------------------------------------------- */
function initScrollObservers() {
  // Reveal items
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => revealObserver.observe(item));

  // Active Nav Link Observer
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Animated Counter Observer
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetEl = entry.target;
        const targetValue = parseFloat(targetEl.getAttribute('data-target'));
        const isDecimal = targetEl.getAttribute('data-decimal') === '2';

        let start = 0;
        const duration = 1800; // ms
        const steps = 60;
        const stepTime = duration / steps;
        const increment = targetValue / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= targetValue) {
            targetEl.textContent = isDecimal ? targetValue.toFixed(2) : targetValue;
            clearInterval(timer);
          } else {
            targetEl.textContent = isDecimal ? start.toFixed(2) : Math.floor(start);
          }
        }, stepTime);

        observer.unobserve(targetEl);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));

  // Skill Bar Fill Observer
  const skillFills = document.querySelectorAll('.progress-fill');
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        target.style.width = width;
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // SVG Circular Meters Observer
  const circleItems = document.querySelectorAll('.circle-progress');
  const circleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target;
        const percent = parseInt(circle.getAttribute('data-percent'), 10);
        const bar = circle.querySelector('.circle-bar');
        const circumference = 251.2; // 2 * PI * 40
        const offset = circumference - (percent / 100) * circumference;

        bar.style.strokeDashoffset = offset;
        observer.unobserve(circle);
      }
    });
  }, { threshold: 0.5 });

  circleItems.forEach(c => circleObserver.observe(c));
}

/* --------------------------------------------------------------------------
   9. INTERACTIVE PROJECT MODALS
   -------------------------------------------------------------------------- */
const projectsData = {
  'qr-attendance': {
    category: 'Web & Security System',
    title: 'QR-Based Attendance Management System',
    description: 'A comprehensive faculty and student attendance tracking system featuring dynamic QR code generation, real-time camera scanner authentication, session expiration control, and automated attendance log export.',
    features: [
      'Encrypted time-bound QR code generation for every lecture session',
      'Instant faculty identity verification and time-stamping',
      'Integrated web camera scanner with sound & visual feedback',
      'Automated attendance analytics summary table'
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript ES6+', 'QRcode.js', 'Local API Mock'],
    interactiveType: 'qr'
  },
  'captcha-system': {
    category: 'Security & Voice AI',
    title: 'CAPTCHA Generation & Voice Assistance System',
    description: 'An accessible, robust CAPTCHA generation engine designed to combat bot submissions while providing text-to-speech voice assistance for visually impaired users.',
    features: [
      'Randomized alphanumeric string generation with visual canvas distortion',
      'Speech Synthesis API voice assistance with pitch & rate modulation',
      'Real-time input validation with visual success/error states',
      'Custom refresh animations and security audit logging'
    ],
    techStack: ['HTML5 Canvas', 'CSS3 Glassmorphism', 'Web Speech API', 'JavaScript'],
    interactiveType: 'captcha'
  },
  'genai-suite': {
    category: 'Generative AI',
    title: 'Generative AI Workshop & Prompt Orchestrator',
    description: 'Custom AI integration tools built during the NIT Tiruchirappalli Generative AI Workshop. Demonstrates automated text summarization, prompt refinement pipelines, and visual diagram synthesis using OpenAI models and Digri.ai.',
    features: [
      'Multi-prompt orchestrator for LLM response comparison',
      'Automated document summarization & key points extractor',
      'Integration with visual diagram generators (Gamma & Napkin AI)',
      'Token consumption estimator and prompt template manager'
    ],
    techStack: ['Python', 'OpenAI API', 'Generative AI Tools', 'Streamlit UI', 'HTML/CSS'],
    interactiveType: 'genai'
  },
  'data-analytics': {
    category: 'Data Science & ML',
    title: 'Data Science & Statistical Analytics Suite',
    description: 'Exploratory data analysis dashboard featuring automated Matplotlib chart rendering, statistical distribution metrics, and SQL query generator for dataset inspection.',
    features: [
      'Interactive chart visualizer (Bar, Line, Scatter, Histogram)',
      'Automated dataset statistical summary calculation',
      'Custom SQL query builder for data filtering',
      'Exportable high-resolution data plots and CSV summaries'
    ],
    techStack: ['Python 3.11', 'Matplotlib', 'Pandas & NumPy', 'SQL Database', 'Chart.js'],
    interactiveType: 'analytics'
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeProjectModal');
  const openBtns = document.querySelectorAll('.open-project-modal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = btn.getAttribute('data-project');
      const data = projectsData[projId];
      if (data) {
        populateProjectModal(data);
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

function populateProjectModal(data) {
  document.getElementById('modalCategory').textContent = data.category;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDescription').textContent = data.description;

  const featuresList = document.getElementById('modalFeatures');
  featuresList.innerHTML = data.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('');

  const techStack = document.getElementById('modalTechStack');
  techStack.innerHTML = data.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

  const previewBox = document.getElementById('modalPreviewBox');

  if (data.interactiveType === 'qr') {
    previewBox.innerHTML = `
      <div style="text-align:center; padding:1.5rem;">
        <h4 style="color:#00f2fe; margin-bottom:1rem;"><i class="fa-solid fa-qrcode"></i> Live QR Attendance Simulator</h4>
        <input type="text" id="facultyIdInput" value="FAC-2026-ASHLIN" style="padding:0.6rem 1rem; border-radius:8px; border:1px solid #64748b; background:#111; color:#fff; margin-bottom:1rem; width:220px; text-align:center;">
        <br>
        <button id="genQrBtn" class="btn btn-primary btn-sm" style="margin-bottom:1rem;">Generate Attendance QR</button>
        <div id="qrOutput" style="background:#fff; padding:15px; display:inline-block; border-radius:12px; margin-top:10px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FAC-2026-ASHLIN-ATTENDANCE" alt="QR Code" style="width:130px; height:130px;">
        </div>
        <p style="font-size:0.8rem; color:#94a3b8; margin-top:10px;" id="qrStatus">Status: <span style="color:#10b981;">Scan Verified • Timestamp 15:10:00</span></p>
      </div>
    `;

    setTimeout(() => {
      const genBtn = document.getElementById('genQrBtn');
      const input = document.getElementById('facultyIdInput');
      const qrOutput = document.getElementById('qrOutput');
      const qrStatus = document.getElementById('qrStatus');

      if (genBtn && input && qrOutput) {
        genBtn.addEventListener('click', () => {
          const val = encodeURIComponent(input.value || 'FAC-2026-ASHLIN');
          qrOutput.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${val}" alt="QR Code" style="width:130px; height:130px;">`;
          qrStatus.innerHTML = `Status: <span style="color:#10b981;">Generated for ${input.value}</span>`;
        });
      }
    }, 100);

  } else if (data.interactiveType === 'captcha') {
    previewBox.innerHTML = `
      <div style="text-align:center; padding:1.5rem;">
        <h4 style="color:#00f2fe; margin-bottom:1rem;"><i class="fa-solid fa-shield-halved"></i> Interactive CAPTCHA Simulator</h4>
        <div style="background:#1a2035; border:2px dashed #00f2fe; padding:1rem 2rem; display:inline-block; border-radius:8px; font-family:monospace; font-size:1.8rem; font-weight:bold; letter-spacing:8px; color:#ff0080; text-shadow:0 0 10px #ff0080; margin-bottom:1rem;" id="captchaBox">
          8K9P2X
        </div>
        <br>
        <div style="display:flex; justify-center; gap:10px; margin-bottom:1rem; justify-content:center;">
          <button id="speakCaptchaBtn" class="btn btn-secondary btn-sm"><i class="fa-solid fa-volume-high"></i> Listen Audio</button>
          <button id="refreshCaptchaBtn" class="btn btn-outline btn-sm"><i class="fa-solid fa-arrows-rotate"></i> Refresh</button>
        </div>
        <input type="text" id="captchaInput" placeholder="Enter CAPTCHA code" style="padding:0.6rem 1rem; border-radius:8px; border:1px solid #64748b; background:#111; color:#fff; text-align:center; width:200px;">
        <button id="verifyCaptchaBtn" class="btn btn-primary btn-sm" style="margin-left:8px;">Verify</button>
        <p style="font-size:0.85rem; margin-top:10px;" id="captchaFeedback"></p>
      </div>
    `;

    setTimeout(() => {
      const box = document.getElementById('captchaBox');
      const speakBtn = document.getElementById('speakCaptchaBtn');
      const refreshBtn = document.getElementById('refreshCaptchaBtn');
      const verifyBtn = document.getElementById('verifyCaptchaBtn');
      const input = document.getElementById('captchaInput');
      const feedback = document.getElementById('captchaFeedback');

      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let currentCode = '8K9P2X';

      function newCaptcha() {
        let res = '';
        for (let i = 0; i < 6; i++) {
          res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        currentCode = res;
        box.textContent = currentCode;
        feedback.textContent = '';
        input.value = '';
      }

      if (refreshBtn) refreshBtn.addEventListener('click', newCaptcha);

      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(currentCode.split('').join(' '));
            msg.rate = 0.8;
            window.speechSynthesis.speak(msg);
          } else {
            alert('Speech synthesis not supported in browser');
          }
        });
      }

      if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
          if (input.value.trim().toUpperCase() === currentCode) {
            feedback.innerHTML = '<span style="color:#10b981;"><i class="fa-solid fa-circle-check"></i> CAPTCHA Verified Successfully!</span>';
          } else {
            feedback.innerHTML = '<span style="color:#ff0080;"><i class="fa-solid fa-circle-xmark"></i> Invalid Code. Try again.</span>';
          }
        });
      }
    }, 100);

  } else {
    previewBox.innerHTML = `
      <div style="padding:1.5rem; color:#94a3b8; font-family:monospace; font-size:0.9rem; line-height:1.6;">
        <p><span style="color:#00f2fe;">[SYSTEM READY]</span> Initializing ${data.title} Engine...</p>
        <p><span style="color:#10b981;">[MODULE LOADED]</span> Machine Learning Pipeline: ACTIVE</p>
        <p><span style="color:#7928ca;">[DATA STREAM]</span> Status 200 OK • Latency: 12ms</p>
        <div style="background:#0a0d18; padding:1rem; border-radius:8px; border:1px solid #1e293b; margin-top:10px;">
          <code>// Architecture Output Sample<br>
          model = GenAIOrchestrator(weights='nit-trichy-workshop')<br>
          response = model.generate(prompt="Synthesize research dataset")<br>
          print(response.status) // Output: "Success"</code>
        </div>
      </div>
    `;
  }
}

/* --------------------------------------------------------------------------
   10. RESUME MODAL & PRINT
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const quickCVBtn = document.getElementById('quickCVBtn');
  const closeResumeModal = document.getElementById('closeResumeModal');
  const printResumeBtn = document.getElementById('printResumeBtn');

  if (!resumeModal) return;

  const open = () => resumeModal.classList.add('active');
  const close = () => resumeModal.classList.remove('active');

  if (openResumeBtn) openResumeBtn.addEventListener('click', open);
  if (quickCVBtn) quickCVBtn.addEventListener('click', open);
  if (closeResumeModal) closeResumeModal.addEventListener('click', close);

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) close();
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   11. CONTACT FORM VALIDATION & SUCCESS MODAL
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successModal = document.getElementById('successModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('submitBtnText');
    const btnIcon = document.getElementById('submitBtnIcon');

    // Button loading state
    btnText.textContent = 'Transmitting...';
    btnIcon.className = 'fa-solid fa-spinner fa-spin';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fa-solid fa-paper-plane';
      submitBtn.disabled = false;
      form.reset();

      if (successModal) {
        successModal.classList.add('active');
      }
    }, 1200);
  });

  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) successModal.classList.remove('active');
    });
  }
}
